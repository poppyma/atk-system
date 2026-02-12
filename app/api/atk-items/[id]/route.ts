import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { ipd, description, specification, qty, uom, lastOrder, remark, foto } = body;

    // Validasi
    if (!ipd || !description || !specification || !qty || !uom) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE atk_items
      SET ipd = $1, description = $2, specification = $3, qty = $4, 
          uom = $5, last_order = $6, remark = $7, foto = $8
      WHERE id = $9
      RETURNING id, ipd, description, specification, qty, uom, last_order, remark, foto
    `;

    const [updatedItem] = await executeQuery(updateQuery, [
      ipd,
      description,
      specification,
      qty,
      uom,
      lastOrder,
      remark || null,
      foto || null,
      parsedId,
    ]);

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // Fetch quotations untuk item yang diupdate
    const quotationsQuery = `
      SELECT 
        id,
        supplier,
        price,
        unit,
        remark
      FROM quotations
      WHERE atk_item_id = $1
      ORDER BY price ASC
    `;

    const quotations = await executeQuery(quotationsQuery, [parsedId]);

    return NextResponse.json(
      {
        id: updatedItem.id.toString(),
        ipd: updatedItem.ipd,
        description: updatedItem.description,
        specification: updatedItem.specification,
        qty: updatedItem.qty,
        uom: updatedItem.uom,
        lastOrder: updatedItem.last_order,
        remark: updatedItem.remark,
        foto: updatedItem.foto,
        quotations: quotations.map((q: any) => ({
          id: q.id.toString(),
          supplier: q.supplier,
          price: parseFloat(q.price),
          unit: q.unit,
          remark: q.remark,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    // Delete quotations terlebih dahulu (foreign key constraint)
    const deleteQuotationsQuery = `
      DELETE FROM quotations
      WHERE atk_item_id = $1
    `;
    await executeQuery(deleteQuotationsQuery, [parsedId]);

    // Delete item
    const deleteItemQuery = `
      DELETE FROM atk_items
      WHERE id = $1
      RETURNING id
    `;

    const result = await executeQuery(deleteItemQuery, [parsedId]);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Item deleted successfully", id: result[0].id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
