import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let url = request.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter diperlukan" },
        { status: 400 }
      );
    }

    // Validate url is a valid http/https URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "URL tidak valid" },
        { status: 400 }
      );
    }

    // Convert Google Drive view URL to export/download URL
    if (url.includes("drive.google.com")) {
      // Match file ID from URLs like:
      // https://drive.google.com/file/d/{fileId}/view
      // https://drive.google.com/file/d/{fileId}/view?usp=sharing
      // https://drive.google.com/open?id={fileId}
      let fileId = null;
      
      const fileMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileMatch) {
        fileId = fileMatch[1];
      } else {
        const openMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
        if (openMatch) {
          fileId = openMatch[1];
        }
      }
      
      if (fileId) {
        // Use export format to get viewable content with cache buster
        url = `https://drive.google.com/uc?export=view&id=${fileId}&t=${Date.now()}`;
      }
    }

    // Fetch image from external URL with extended timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://drive.google.com/",
        "Accept": "image/*,*/*",
      },
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Proxy error: ${response.status} ${response.statusText} for URL: ${url}`);
      return NextResponse.json(
        { error: `Gagal mengambil gambar: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Check if response is actually an image
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("image")) {
      console.warn(`Non-image content type: ${contentType} for URL: ${url}`);
      // Some image CDNs might not set proper content-type, so we'll allow it
    }

    const buffer = await response.arrayBuffer();
    
    // Validate that we got actual image data (not HTML error page)
    if (buffer.byteLength < 100) {
      console.error(`Response too small (${buffer.byteLength} bytes), likely not an image`);
      return NextResponse.json(
        { error: "Respons tidak valid atau bukan gambar" },
        { status: 400 }
      );
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType || "image/jpeg",
        "Cache-Control": "public, max-age=3600", // Shorter cache for Google Drive
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Proxy Image Error:", error);
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timeout - gambar terlalu lama diakses" },
        { status: 408 }
      );
    }
    return NextResponse.json(
      { error: "Failed to proxy image" },
      { status: 500 }
    );
  }
}
