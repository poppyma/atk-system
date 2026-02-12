"use client";

import { useState } from "react";
import { AtkItem } from "@/app/data/atkData";

interface CreateAtkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<AtkItem, "id" | "quotations"> & { quotations?: AtkItem["quotations"] }) => void;
}

export default function CreateAtkModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateAtkModalProps) {
  const [formData, setFormData] = useState({
    ipd: "",
    description: "",
    specification: "",
    qty: 0,
    uom: "",
    lastOrder: "0 pcs",
    remark: "",
    foto: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fotoPreview, setFotoPreview] = useState<string>("");

  const UoMOptions = ["PCS", "BOX", "SET", "PAK", "RIM", "ROLL", "PACK"];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ipd.trim()) newErrors.ipd = "IPD tidak boleh kosong";
    if (!formData.description.trim()) newErrors.description = "Deskripsi tidak boleh kosong";
    if (!formData.specification.trim()) newErrors.specification = "Spesifikasi tidak boleh kosong";
    if (formData.qty <= 0) newErrors.qty = "Qty harus lebih dari 0";
    if (!formData.uom) newErrors.uom = "UoM harus dipilih";
    if (!formData.lastOrder.trim()) newErrors.lastOrder = "Last order tidak boleh kosong";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      ipd: formData.ipd,
      description: formData.description,
      specification: formData.specification,
      qty: formData.qty,
      uom: formData.uom,
      lastOrder: formData.lastOrder,
      remark: formData.remark,
      foto: formData.foto || "https://via.placeholder.com/100?text=ATK",
      quotations: [],
    });

    setFormData({
      ipd: "",
      description: "",
      specification: "",
      qty: 0,
      uom: "",
      lastOrder: "0 pcs",
      remark: "",
      foto: "",
    });
    setFotoPreview("");
    setErrors({});
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;
    
    // Handle file input
    if (name === "foto" && (e.target as HTMLInputElement).type === "file") {
      const file = ((e.target as HTMLInputElement).files || [])[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          setFormData((prev) => ({
            ...prev,
            foto: base64String,
          }));
          setFotoPreview(base64String);
        };
        reader.readAsDataURL(file);
      }
    } else {
      // Handle regular input
      const value = (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "qty" ? parseInt(value) || 0 : value,
      }));
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[2px] bg-black/20">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            📝 Buat Input Data Master ATK
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* IPD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              IPD <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ipd"
              value={formData.ipd}
              onChange={handleChange}
              placeholder="Contoh: 5010010010001"
              className={`w-full rounded-lg border-2 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                errors.ipd
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white focus:border-blue-500"
              }`}
            />
            {errors.ipd && (
              <p className="mt-1 text-sm text-red-600">{errors.ipd}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Contoh: Pulpen Ballpoint Biru"
              className={`w-full rounded-lg border-2 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                errors.description
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white focus:border-blue-500"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Specification */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Spesifikasi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="specification"
              value={formData.specification}
              onChange={handleChange}
              placeholder="Contoh: Tinta biru, diameter 0.7mm, kemasan per 12 pcs"
              rows={3}
              className={`w-full rounded-lg border-2 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors resize-none ${
                errors.specification
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white focus:border-blue-500"
              }`}
            />
            {errors.specification && (
              <p className="mt-1 text-sm text-red-600">{errors.specification}</p>
            )}
          </div>

          {/* Qty and UoM */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Qty <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={`w-full rounded-lg border-2 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                  errors.qty
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white focus:border-blue-500"
                }`}
              />
              {errors.qty && (
                <p className="mt-1 text-sm text-red-600">{errors.qty}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                UoM <span className="text-red-500">*</span>
              </label>
              <select
                name="uom"
                value={formData.uom}
                onChange={handleChange}
                className={`w-full rounded-lg border-2 px-3 py-2 text-gray-900 focus:outline-none transition-colors ${
                  errors.uom
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white focus:border-blue-500"
                }`}
              >
                <option value="">-- Pilih UoM --</option>
                {UoMOptions.map((uom) => (
                  <option key={uom} value={uom}>
                    {uom}
                  </option>
                ))}
              </select>
              {errors.uom && (
                <p className="mt-1 text-sm text-red-600">{errors.uom}</p>
              )}
            </div>
          </div>

          {/* Last Order */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Order <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastOrder"
              value={formData.lastOrder}
              onChange={handleChange}
              placeholder="Contoh: 2 pcs, 3 pcs, 1 rim"
              className={`w-full rounded-lg border-2 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                errors.lastOrder
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white focus:border-blue-500"
              }`}
            />
            {errors.lastOrder && (
              <p className="mt-1 text-sm text-red-600">{errors.lastOrder}</p>
            )}
          </div>

          {/* Remark */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remark
            </label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              placeholder="Catatan tambahan (opsional)"
              rows={2}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Upload Foto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Foto
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  name="foto"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <p className="mt-1 text-xs text-gray-500">Format: JPG, PNG, GIF (Max 5MB)</p>
              </div>
              {fotoPreview && (
                <div className="flex items-end">
                  <img
                    src={fotoPreview}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-lg border-2 border-blue-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Catatan:</strong> Data quotation (penawaran harga dari supplier) dapat ditambahkan setelah membuat master ATK ini.
            </p>
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
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Simpan Data
          </button>
        </div>
      </div>
    </div>
  );
}
