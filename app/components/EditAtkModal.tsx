"use client";

import { useState, useEffect } from "react";
import { AtkItem } from "@/app/data/atkData";

interface EditAtkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedItem: AtkItem) => void;
  item: AtkItem | null;
}

export default function EditAtkModal({
  isOpen,
  onClose,
  onSubmit,
  item,
}: EditAtkModalProps) {
  const [formData, setFormData] = useState({
    ipd: "",
    description: "",
    specification: "",
    qty: 0,
    uom: "",
    lastOrder: "",
    remark: "",
    foto: "",
    quotationRemark: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fotoPreview, setFotoPreview] = useState<string>("");

  const UoMOptions = ["PCS", "BOX", "SET", "PAK", "RIM", "ROLL", "PACK"];

  // Set form data when item loads
  useEffect(() => {
    if (item) {
      setFormData({
        ipd: item.ipd || "",
        description: item.description || "",
        specification: item.specification || "",
        qty: item.qty || 0,
        uom: item.uom || "",
        lastOrder: item.lastOrder || "",
        remark: item.remark || "",
        foto: item.foto || "",
        quotationRemark: "",
      });
      // Set preview dari existing foto
      if (item.foto) {
        setFotoPreview(item.foto);
      }
      setErrors({});
    }
  }, [item, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ipd.trim()) newErrors.ipd = "IPD tidak boleh kosong";
    if (!formData.description.trim())
      newErrors.description = "Deskripsi tidak boleh kosong";
    if (!formData.specification.trim())
      newErrors.specification = "Spesifikasi tidak boleh kosong";
    if (formData.qty <= 0) newErrors.qty = "Qty harus lebih dari 0";
    if (!formData.uom) newErrors.uom = "UoM harus dipilih";
    if (!formData.lastOrder.trim())
      newErrors.lastOrder = "Last order tidak boleh kosong";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!item) return;

    onSubmit({
      id: item.id,
      ipd: formData.ipd,
      description: formData.description,
      specification: formData.specification,
      qty: formData.qty,
      uom: formData.uom,
      lastOrder: formData.lastOrder,
      remark: formData.remark,
      foto: formData.foto || "https://via.placeholder.com/100?text=ATK",
      quotations: item.quotations,
    });

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

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[2px] bg-black/20">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">✏️ Edit Data Master ATK</h2>
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
              placeholder="Keterangan tambahan (opsional)"
              rows={2}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors focus:border-blue-500 resize-none"
            />
          </div>

          {/* Quotation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quotation
            </label>
            <input
              type="text"
              name="quotationRemark"
              value={formData.quotationRemark}
              onChange={handleChange}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
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


          <div className="flex gap-3 justify-end border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border-2 border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-2.5 font-semibold text-white hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
