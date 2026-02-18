import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { atkItemId, quotations } = body;

    if (!atkItemId || !Array.isArray(quotations) || quotations.length === 0) {
      return NextResponse.json(
        { error: "atkItemId and quotations array are required" },
        { status: 400 }
      );
    }

    const results = [];
    const errorMessages = [];
    const itemIdInt = parseInt(atkItemId);

    for (let i = 0; i < quotations.length; i++) {
      const quotation = quotations[i];
      const { supplier, price, unit, remark } = quotation;

      // Validate required fields
      if (!supplier || !price || !unit) {
        errorMessages.push(
          `Quotation ${i + 1}: Missing required fields (Supplier, Price, Unit)`
        );
        continue;
      }

      // Validate price is a positive number
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        errorMessages.push(
          `Quotation ${i + 1} (${supplier}): Price must be a positive number`
        );
        continue;
      }

      try {
        // Check if quotation with same supplier already exists
        const existingQuery = `
          SELECT id FROM quotations 
          WHERE atk_item_id = $1 AND LOWER(supplier) = LOWER($2)
          LIMIT 1
        `;
        const existing = await executeQuery(existingQuery, [itemIdInt, supplier]);

        let result;
        if (existing.length > 0) {
          // Update existing quotation
          const updateQuery = `
            UPDATE quotations 
            SET price = $1, unit = $2, remark = $3
            WHERE id = $4
            RETURNING id, atk_item_id, supplier, price, unit, remark
          `;
          const [updatedQuotation] = await executeQuery(updateQuery, [
            priceNum,
            unit,
            remark || null,
            existing[0].id,
          ]);
          result = updatedQuotation;
        } else {
          // Insert new quotation
          const insertQuery = `
            INSERT INTO quotations (atk_item_id, supplier, price, unit, remark)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, atk_item_id, supplier, price, unit, remark
          `;
          const [newQuotation] = await executeQuery(insertQuery, [
            itemIdInt,
            supplier,
            priceNum,
            unit,
            remark || null,
          ]);
          result = newQuotation;
        }

        results.push({
          id: result.id.toString(),
          atkItemId: result.atk_item_id,
          supplier: result.supplier,
          price: parseFloat(result.price),
          unit: result.unit,
          remark: result.remark,
        });
      } catch (itemError: any) {
        errorMessages.push(
          `Quotation ${i + 1} (${supplier}): ${itemError.message}`
        );
      }
    }

    return NextResponse.json(
      {
        success: results.length,
        total: quotations.length,
        failed: errorMessages.length,
        quotations: results,
        errors: errorMessages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed to import quotations" },
      { status: 500 }
    );
  }
}
