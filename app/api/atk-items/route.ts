import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Ambil semua ATK items
    const itemsQuery = `
      SELECT 
        id,
        ipd,
        description,
        specification,
        qty,
        uom,
        last_order,
        remark,
        foto
      FROM atk_items
      ORDER BY id DESC
    `;

    const items = await executeQuery(itemsQuery);

    // Untuk setiap item, ambil quotations-nya
    const itemsWithQuotations = await Promise.all(
      items.map(async (item: any) => {
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

        const quotations = await executeQuery(quotationsQuery, [item.id]);

        return {
          id: item.id.toString(),
          ipd: item.ipd,
          description: item.description,
          specification: item.specification,
          qty: item.qty,
          uom: item.uom,
          lastOrder: item.last_order,
          remark: item.remark,
          foto: item.foto,
          quotations: quotations.map((q: any) => ({
            id: q.id.toString(),
            supplier: q.supplier,
            price: parseFloat(q.price),
            unit: q.unit,
            remark: q.remark,
          })),
        };
      })
    );

    return NextResponse.json(itemsWithQuotations, { status: 200 });
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch ATK items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { ipd, description, specification, qty, uom, lastOrder, remark, foto } = body;

    // Validasi - hanya IPD, Description, dan UoM yang wajib
    if (!ipd || !description || !uom) {
      return NextResponse.json(
        { error: "Missing required fields: IPD, Description, UoM" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO atk_items (ipd, description, specification, qty, uom, last_order, remark, foto)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, ipd, description, specification, qty, uom, last_order, remark, foto
    `;

    const [newItem] = await executeQuery(insertQuery, [
      ipd,
      description,
      specification,
      qty,
      uom,
      lastOrder,
      remark || null,
      foto || null,
    ]);

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create ATK item" },
      { status: 500 }
    );
  }
}
