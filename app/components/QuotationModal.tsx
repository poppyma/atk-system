"use client";

import { AtkItem, Quotation } from "@/app/data/atkData";
import { useState } from "react";
import AddQuotationModal from "./AddQuotationModal";
import EditQuotationModal from "./EditQuotationModal";

interface QuotationModalProps {
  item: AtkItem | null;
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onAddQuotation?: (
    itemId: string,
    quotation: {
      supplier: string;
      price: number;
      unit: string;
      remark: string;
    }
  ) => Promise<void>;
  onEditQuotation?: (quotation: {
    id: string;
    supplier: string;
    price: number;
    unit: string;
    remark: string;
  }) => Promise<void>;
  onDeleteQuotation?: (id: string) => Promise<void>;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function QuotationModal({
  item,
  isOpen,
  isAdmin,
  onClose,
  onAddQuotation,
  onEditQuotation,
  onDeleteQuotation,
}: QuotationModalProps) {
  const [isAddQuotationOpen, setIsAddQuotationOpen] = useState(false);
  const [isEditQuotationOpen, setIsEditQuotationOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  const handleEditClick = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setIsEditQuotationOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus penawaran ini?")) {
      try {
        await onDeleteQuotation?.(id);
      } catch (error) {
        console.error("Error deleting quotation:", error);
      }
    }
  };

  if (!isOpen || !item) return null;

  // Sort quotations by price (ascending), tampilkan semua tapi hitung cheapest hanya dari harga > 0
  const sortedQuotations = item.quotations && item.quotations.length > 0 
    ? [...item.quotations].sort((a, b) => a.price - b.price)
    : [];
  
  // Cari cheapest dari yang punya harga > 0
  const validQuotations = sortedQuotations.filter((q) => q.price > 0);
  const cheapest = validQuotations.length > 0 ? validQuotations[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{item.description}</h2>
            <p className="mt-1 text-sm text-gray-600">IPD: {item.ipd}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Item Details */}
          <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
            <div>
              <p className="text-sm text-gray-600">Spesifikasi</p>
              <p className="font-medium text-gray-900">{item.specification}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Qty / UoM</p>
              <p className="font-medium text-gray-900">
                {item.qty} {item.uom}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Order</p>
              <p className="font-medium text-gray-900">
                {item.lastOrder}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Remark</p>
              <p className="font-medium text-gray-900">{item.remark}</p>
            </div>
          </div>

          {/* Quotations Table */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Penawaran Harga dari Supplier
            </h3>
            {isAdmin && onAddQuotation && (
              <button
                onClick={() => setIsAddQuotationOpen(true)}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <span>➕</span> Tambah Penawaran
              </button>
            )}
          </div>

          {sortedQuotations.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Supplier
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Harga
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Satuan
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Remark / Merk
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedQuotations.map((quot) => {
                  const isCheapest = cheapest && cheapest.id === quot.id;
                  return (
                  <tr
                    key={quot.id}
                    className={
                      isCheapest
                        ? "bg-green-50 border-b border-gray-200"
                        : quot.price % 2 === 0
                          ? "bg-white border-b border-gray-200"
                          : "bg-gray-50 border-b border-gray-200"
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isCheapest && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                            ✓
                          </span>
                        )}
                        <span className="font-medium text-gray-900">
                          {quot.supplier}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(quot.price)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {quot.unit}
                    </td>
                    <td className="px-4 py-3 text-left text-gray-700">
                      {quot.remark || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {quot.price <= 0 ? (
                        <span className="text-gray-400 text-sm">-</span>
                      ) : cheapest && cheapest.price > 0 && quot.price === cheapest.price ? (
                        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                          Termurah
                        </span>
                      ) : cheapest && cheapest.price > 0 ? (
                        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                          +{quot.price - cheapest.price} vs termurah
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEditClick(quot)}
                              className="rounded border border-blue-300 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition-colors"
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(quot.id)}
                              className="rounded border border-red-300 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 hover:border-red-400 transition-colors"
                              title="Hapus"
                            >
                              Hapus
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          ) : (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
              <p className="text-yellow-800 font-medium">
                Belum ada penawaran harga dari supplier
              </p>
            </div>
          )}

          {/* Summary */}
          {cheapest && (
          <div className="mt-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold text-green-900">
                  Rekomendasi Pembelian
                </h4>
                <p className="mt-2 text-sm text-green-800">
                  <strong>Supplier:</strong> {cheapest.supplier}
                </p>
                <p className="mt-1 text-sm text-green-800">
                  <strong>Harga:</strong> {formatPrice(cheapest.price)}/unit
                </p>
                <p className="mt-1 text-sm text-green-800">
                  <strong>Total untuk {item.qty} {item.uom}:</strong>{" "}
                  <span className="font-bold">
                    {formatPrice(cheapest.price * item.qty)}
                  </span>
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200">
                <span className="text-2xl">💡</span>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>

        {/* Add Quotation Modal */}
        {onAddQuotation && item && (
          <AddQuotationModal
            itemId={item.id}
            itemDescription={item.description}
            isOpen={isAddQuotationOpen}
            onClose={() => setIsAddQuotationOpen(false)}
            onSubmit={async (quotation) => {
              await onAddQuotation(item.id, quotation);
              setIsAddQuotationOpen(false);
            }}
          />
        )}

        {/* Edit Quotation Modal */}
        {onEditQuotation && item && selectedQuotation && (
          <EditQuotationModal
            quotation={selectedQuotation}
            itemDescription={item.description}
            isOpen={isEditQuotationOpen}
            onClose={() => {
              setIsEditQuotationOpen(false);
              setSelectedQuotation(null);
            }}
            onSubmit={async (quotation) => {
              await onEditQuotation(quotation);
              setIsEditQuotationOpen(false);
              setSelectedQuotation(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
