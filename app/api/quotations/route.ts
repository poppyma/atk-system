import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const atkItemId = searchParams.get("atkItemId");

    let query = `
      SELECT 
        id,
        atk_item_id,
        supplier,
        price,
        unit,
        remark
      FROM quotations
    `;

    const params: any[] = [];

    if (atkItemId) {
      query += ` WHERE atk_item_id = $1`;
      params.push(parseInt(atkItemId));
    }

    query += ` ORDER BY price ASC`;

    const quotations = await executeQuery(query, params);

    const formattedQuotations = quotations.map((q: any) => ({
      id: q.id.toString(),
      atkItemId: q.atk_item_id,
      supplier: q.supplier,
      price: parseFloat(q.price),
      unit: q.unit,
      remark: q.remark,
    }));

    return NextResponse.json(formattedQuotations, { status: 200 });
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { atkItemId, supplier, price, unit, remark } = body;

    if (!atkItemId || !supplier || !price || !unit) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO quotations (atk_item_id, supplier, price, unit, remark)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, atk_item_id, supplier, price, unit, remark
    `;

    const [newQuotation] = await executeQuery(insertQuery, [
      parseInt(atkItemId),
      supplier,
      parseFloat(price),
      unit,
      remark || null,
    ]);

    return NextResponse.json(
      {
        id: newQuotation.id.toString(),
        atkItemId: newQuotation.atk_item_id,
        supplier: newQuotation.supplier,
        price: parseFloat(newQuotation.price),
        unit: newQuotation.unit,
        remark: newQuotation.remark,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create quotation" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, supplier, price, unit, remark } = body;

    if (!id || !supplier || !price === undefined || !unit) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE quotations
      SET supplier = $1, price = $2, unit = $3, remark = $4
      WHERE id = $5
      RETURNING id, atk_item_id, supplier, price, unit, remark
    `;

    const [updatedQuotation] = await executeQuery(updateQuery, [
      supplier,
      parseFloat(price),
      unit,
      remark || null,
      parseInt(id),
    ]);

    if (!updatedQuotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: updatedQuotation.id.toString(),
        atkItemId: updatedQuotation.atk_item_id,
        supplier: updatedQuotation.supplier,
        price: parseFloat(updatedQuotation.price),
        unit: updatedQuotation.unit,
        remark: updatedQuotation.remark,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update quotation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Quotation ID is required" },
        { status: 400 }
      );
    }

    const deleteQuery = `
      DELETE FROM quotations
      WHERE id = $1
      RETURNING id
    `;

    const result = await executeQuery(deleteQuery, [parseInt(id)]);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Quotation deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete quotation" },
      { status: 500 }
    );
  }
}
