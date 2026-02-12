"use client";

import { useState, useEffect } from "react";
import { AtkItem } from "@/app/data/atkData";
import QuotationModal from "./QuotationModal";

interface AtkTableProps {
  items: AtkItem[];
  onEdit?: (item: AtkItem) => void;
  onDelete?: (id: number) => void;
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

// Fungsi untuk mendapatkan harga dan supplier termurah
const getCheapestOption = (item: AtkItem) => {
  if (item.quotations.length === 0) {
    return { supplier: "N/A", price: 0 };
  }

  // Filter quotations dengan harga > 0
  const validQuotations = item.quotations.filter((q) => q.price > 0);

  if (validQuotations.length === 0) {
    return { supplier: "N/A", price: 0 };
  }

  const cheapest = validQuotations.reduce((prev, current) =>
    prev.price < current.price ? prev : current
  );

  return {
    supplier: cheapest.supplier,
    price: cheapest.price,
  };
};

// Format harga ke format rupiah
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function AtkTable({ items, onEdit, onDelete, onAddQuotation, onEditQuotation, onDeleteQuotation }: AtkTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<AtkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Update selectedItem ketika items berubah (untuk refresh quotations di modal)
  useEffect(() => {
    if (selectedItem && isModalOpen) {
      const updatedItem = items.find((item) => item.id === selectedItem.id);
      if (updatedItem) {
        setSelectedItem(updatedItem);
      }
    }
  }, [items, isModalOpen, selectedItem?.id]);

  // Filter berdasarkan search
  const filteredItems = items.filter((item) => {
    const keyword = searchTerm.toLowerCase();

    return (
      (item.description ?? "").toLowerCase().includes(keyword) ||
      (item.ipd ?? "").toLowerCase().includes(keyword) ||
      (item.specification ?? "").toLowerCase().includes(keyword)
    );
  });

  // Sort
  const sortedItems = sortColumn === "" 
    ? [...filteredItems] // Keep original order from database (DESC)
    : [...filteredItems].sort((a, b) => {
        let aValue: any = a[sortColumn as keyof AtkItem];
        let bValue: any = b[sortColumn as keyof AtkItem];

        if (sortColumn === "price") {
          aValue = getCheapestOption(a).price;
          bValue = getCheapestOption(b).price;
        } else if (sortColumn === "supplier") {
          aValue = getCheapestOption(a).supplier;
          bValue = getCheapestOption(b).supplier;
        } else if (sortColumn === "id") {
          // Sort ID as numeric if possible, otherwise as string
          const aNum = parseInt(aValue);
          const bNum = parseInt(bValue);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            aValue = aNum;
            bValue = bNum;
          }
        }

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = (bValue as string).toLowerCase();
        }

        if (aValue < bValue) {
          return sortOrder === "asc" ? -1 : 1;
        } else if (aValue > bValue) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return <span className="text-gray-400">⇅</span>;
    return sortOrder === "asc" ? <span>▲</span> : <span>▼</span>;
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Cari berdasarkan IPD, Deskripsi, atau Spesifikasi..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="rounded-lg bg-gray-300 hover:bg-gray-400 px-4 py-2 font-medium text-gray-700 transition-colors"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <div className="text-sm text-gray-600">
          Ditemukan: <span className="font-semibold">{sortedItems.length}</span> item
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <th
                onClick={() => handleSort("ipd")}
                className="cursor-pointer border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-blue-200"
              >
                <div className="flex items-center justify-between gap-2">
                  IPD
                  <SortIcon column="ipd" />
                </div>
              </th>
              <th
                onClick={() => handleSort("description")}
                className="cursor-pointer border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-blue-200 min-w-[150px]"
              >
                <div className="flex items-center justify-between gap-2">
                  Description
                  <SortIcon column="description" />
                </div>
              </th>
              <th
                onClick={() => handleSort("specification")}
                className="cursor-pointer border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-blue-200 min-w-[150px]"
              >
                <div className="flex items-center justify-between gap-2">
                  Specification
                  <SortIcon column="specification" />
                </div>
              </th>
              <th
                onClick={() => handleSort("qty")}
                className="cursor-pointer border-r border-gray-200 px-4 py-3 text-center font-semibold text-gray-700 hover:bg-blue-200"
              >
                <div className="flex items-center justify-center gap-2">
                  Qty (Satuan)
                  <SortIcon column="qty" />
                </div>
              </th>
              <th
                onClick={() => handleSort("uom")}
                className="cursor-pointer border-r border-gray-200 px-4 py-3 text-center font-semibold text-gray-700 hover:bg-blue-200"
              >
                <div className="flex items-center justify-center gap-2">
                  UoM
                  <SortIcon column="uom" />
                </div>
              </th>
              <th
                onClick={() => handleSort("lastOrder")}
                className="cursor-pointer border-r border-gray-200 px-4 py-3 text-center font-semibold text-gray-700 hover:bg-blue-200"
              >
                <div className="flex items-center justify-center gap-2">
                  Last Order
                  <SortIcon column="lastOrder" />
                </div>
              </th>
              <th
                onClick={() => handleSort("price")}
                className="cursor-pointer border-r border-gray-200 px-4 py-3 text-right font-semibold text-gray-700 hover:bg-blue-200 min-w-[120px]"
              >
                <div className="flex items-center justify-end gap-2">
                  Price
                  <SortIcon column="price" />
                </div>
              </th>
              <th
                onClick={() => handleSort("supplier")}
                className="cursor-pointer border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-blue-200 min-w-[130px]"
              >
                <div className="flex items-center justify-between gap-2">
                  Supplier
                  <SortIcon column="supplier" />
                </div>
              </th>
              <th
                onClick={() => handleSort("remark")}
                className="cursor-pointer border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-blue-200 min-w-[120px]"
              >
                <div className="flex items-center justify-between gap-2">
                  Remark
                  <SortIcon column="remark" />
                </div>
              </th>
              <th className="border-r border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                Foto
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, index) => {
                const cheapest = getCheapestOption(item);
                const isEvenRow = index % 2 === 0;

                return (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-200 transition-colors hover:bg-blue-50 ${
                      isEvenRow ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="border-r border-gray-200 px-4 py-3 font-mono text-xs font-semibold text-gray-900">
                      {item.ipd}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 font-medium text-gray-900">
                      {item.description}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 text-gray-700">
                      {item.specification}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 text-center font-semibold text-gray-900">
                      {item.qty}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 text-center text-gray-700">
                      {item.uom}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 text-center text-gray-700">
                      {item.lastOrder}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 text-right font-semibold text-green-700">
                      {formatPrice(cheapest.price)}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3">
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        {cheapest.supplier}
                      </span>
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 text-sm text-gray-600">
                      {item.remark}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 text-center">
                      {item.foto ? (
                        <a
                          href={`/photo/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm font-medium hover:font-semibold transition-all"
                        >
                          Lihat
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsModalOpen(true);
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                          Detail
                        </button>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="rounded-lg bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700 transition-colors"
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              if (confirm(`Hapus "${item.description}"?`)) {
                                onDelete(parseInt(item.id));
                              }
                            }}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada data yang sesuai dengan pencarian
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-sm text-gray-600">
          Halaman <span className="font-semibold">{currentPage}</span> dari{" "}
          <span className="font-semibold">{totalPages}</span> ({sortedItems.length} item)
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Halaman Pertama"
          >
            ⏮ Awal
          </button>

          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Sebelumnya
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Selanjutnya →
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Halaman Terakhir"
          >
            Akhir ⏭
          </button>
        </div>
      </div>

      {/* Quotation Modal */}
      <QuotationModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddQuotation={onAddQuotation}
        onEditQuotation={onEditQuotation}
        onDeleteQuotation={onDeleteQuotation}
      />
    </div>
  );
}
