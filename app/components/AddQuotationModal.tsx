"use client";

import { useState } from "react";

interface AddQuotationModalProps {
  itemId: string;
  itemDescription: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quotation: {
    supplier: string;
    price: number;
    unit: string;
    remark: string;
  }) => Promise<void>;
}

export default function AddQuotationModal({
  itemId,
  itemDescription,
  isOpen,
  onClose,
  onSubmit,
}: AddQuotationModalProps) {
  const [formData, setFormData] = useState({
    supplier: "",
    price: 0,
    unit: "",
    remark: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "supplier" || name === "unit" ? value : Math.max(0, parseInt(value) || 0),
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplier.trim()) {
      newErrors.supplier = "Nama supplier tidak boleh kosong";
    }
    if (formData.price <= 0) {
      newErrors.price = "Harga harus lebih dari 0";
    }
    if (!formData.unit.trim()) {
      newErrors.unit = "Satuan tidak boleh kosong";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      // Reset form hanya ketika submission berhasil
      setFormData({
        supplier: "",
        price: 0,
        unit: "",
        remark: "",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting quotation:", error);
      // Jangan close modal jika ada error, biarkan user bisa retry
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            ➕ Tambah Penawaran
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div>
            <p className="text-sm text-gray-600 mb-2">Item</p>
            <p className="font-semibold text-gray-900">{itemDescription}</p>
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Supplier <span className="text-red-500">*</span>
            </label>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={(e) => {
                handleChange({
                  target: {
                    name: "supplier",
                    value: e.target.value,
                  },
                } as any);
              }}
              className={`w-full rounded-lg border-2 px-3 py-2 text-gray-900 focus:outline-none transition-colors ${
                errors.supplier
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white focus:border-green-500"
              }`}
            >
              <option value="">-- Pilih Supplier --</option>
              <option value="Laju Karya">Laju Karya</option>
              <option value="Datascript">Datascript</option>
              <option value="Nasional">Nasional</option>
              <option value="Berkat Karya Nusantara">Berkat Karya Nusantara</option>
            </select>
            {errors.supplier && (
              <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={`w-full rounded-lg border-2 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                errors.price
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white focus:border-green-500"
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Unit/Satuan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Satuan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="Contoh: Unit, Box, Carton"
              className={`w-full rounded-lg border-2 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                errors.unit
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white focus:border-green-500"
              }`}
            />
            {errors.unit && (
              <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
            )}
          </div>

          {/* Quantity & MOQ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remark / Merk
            </label>
            <input
              type="text"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              placeholder="Contoh: Epson, Canon, dsb (opsional)"
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan Penawaran"}
          </button>
        </div>
      </div>
    </div>
  );
}
