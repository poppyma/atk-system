import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items array is required and must not be empty" },
        { status: 400 }
      );
    }

    const results = [];
    const errorMessages = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const { ipd, description, specification, qty, uom, lastOrder, remark, foto } = item;

      if (!ipd || !description || !uom) {
        errorMessages.push(
          `Item ${i + 1}: Missing required fields (IPD, Description, UoM)`
        );
        continue;
      }

      try {
        const insertQuery = `
          INSERT INTO atk_items (ipd, description, specification, qty, uom, last_order, remark, foto)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, ipd, description, specification, qty, uom, last_order, remark, foto
        `;

        const [newItem] = await executeQuery(insertQuery, [
          ipd,
          description,
          specification || null,
          qty || 0,
          uom,
          lastOrder || "0 pcs",
          remark || null,
          foto || null,
        ]);

        results.push({
          id: newItem.id.toString(),
          ipd: newItem.ipd,
          description: newItem.description,
          specification: newItem.specification,
          qty: newItem.qty,
          uom: newItem.uom,
          lastOrder: newItem.last_order,
          remark: newItem.remark,
          foto: newItem.foto,
          quotations: [],
        });
      } catch (itemError: any) {
        errorMessages.push(
          `Item ${i + 1} (${description}): ${itemError.message}`
        );
      }
    }

    return NextResponse.json(
      {
        success: results.length,
        total: items.length,
        failed: errorMessages.length,
        items: results,
        errors: errorMessages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed to import items" },
      { status: 500 }
    );
  }
}
