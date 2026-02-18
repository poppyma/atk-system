"use client";

import { useState, useRef } from "react";
import { AtkItem } from "@/app/data/atkData";

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (items: Omit<AtkItem, "id" | "quotations">[]) => void;
}

export default function CsvImportModal({ isOpen, onClose, onSubmit }: CsvImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const UoMOptions = ["PCS", "BOX", "SET", "PAK", "RIM", "ROLL", "PACK"];

  // Proper CSV parsing that handles quoted fields with commas inside
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n").filter(line => line.trim());
    if (lines.length < 2) return []; // Need at least header + 1 row

    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
    const items = [];
    const newErrors: string[] = [];

    const ipdIndex = headers.indexOf("ipd");
    const descIndex = headers.indexOf("description");
    const specIndex = headers.indexOf("specification");
    const qtyIndex = headers.indexOf("qty");
    const uomIndex = headers.indexOf("uom");
    const lastOrderIndex = headers.indexOf("lastorder");
    const remarkIndex = headers.indexOf("remark");
    const fotoIndex = headers.indexOf("foto");

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.every(v => !v)) continue; 

      const ipd = values[ipdIndex] || "";
      const description = values[descIndex] || "";
      const uom = values[uomIndex] || "";

      if (!ipd) {
        newErrors.push(`Baris ${i + 1}: IPD tidak boleh kosong`);
        continue;
      }
      if (!description) {
        newErrors.push(`Baris ${i + 1}: Description tidak boleh kosong`);
        continue;
      }
      if (!uom) {
        newErrors.push(`Baris ${i + 1}: UoM tidak boleh kosong`);
        continue;
      }

      if (!UoMOptions.includes(uom.toUpperCase())) {
        newErrors.push(`Baris ${i + 1}: UoM "${uom}" tidak valid. Pilihan: ${UoMOptions.join(", ")}`);
        continue;
      }

      items.push({
        ipd,
        description,
        specification: values[specIndex] || "",
        qty: values[qtyIndex] ? parseInt(values[qtyIndex]) || 0 : 0,
        uom: uom.toUpperCase(),
        lastOrder: values[lastOrderIndex] || "0 pcs",
        remark: values[remarkIndex] || "",
        foto: values[fotoIndex] || "",
      });
    }

    setErrors(newErrors);
    return items;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const items = parseCSV(text);
      setParsedItems(items);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const template = "IPD,Description,Specification,Qty,UoM,LastOrder,Remark,Foto\n" +
      "IPD001,Bearing,Angular Contact,10,BOX,100 pcs,CobaCoba,https://drive.google.com/file/d/1qItOJNonhLoFHt5QZI7uZxgri0JNNkve/view?usp=sharing";
    
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(template));
    element.setAttribute("download", "template-atk.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmit = async () => {
    if (parsedItems.length === 0) {
      setErrors(["Tidak ada data yang valid untuk diimport"]);
      return;
    }

    setIsProcessing(true);
    try {
      onSubmit(parsedItems);
      // Reset on success
      setParsedItems([]);
      setErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    } catch (error) {
      setErrors(["Gagal mengimport data"]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[2px] bg-black/20">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-lg bg-white shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">📥 Import Data dari CSV</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Upload file CSV untuk menambahkan data ATK secara massal
          </p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {/* File Upload Section */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              1. Pilih File CSV
            </label>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                onClick={handleDownloadTemplate}
                className="rounded-lg bg-gray-100 hover:bg-gray-200 px-4 py-2 font-semibold text-sm text-gray-700 transition-colors"
                title="Download template CSV"
              >
                📋 Template
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Format: IPD, Description, Specification, Qty, UoM, LastOrder, Remark, Foto
              <br />
              <strong>Foto:</strong> Opsional - bisa dikosongkan, atau input URL gambar (contoh: https://example.com/image.jpg)
            </p>
          </div>

          {/* Help Section */}
          <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm font-semibold text-blue-900">ℹ️ Panduan Kolom CSV</p>
            <ul className="mt-2 text-xs text-blue-800 space-y-1">
              <li><strong>IPD</strong> (wajib): Kode item unik</li>
              <li><strong>Description</strong> : Nama/deskripsi barang</li>
              <li><strong>Specification</strong>: Spesifikasi teknis</li>
              <li><strong>Qty</strong>: Jumlah</li>
              <li><strong>UoM</strong>: Satuan (PCS, BOX, SET, PAK, RIM, ROLL, PACK)</li>
              <li><strong>LastOrder</strong>: Riwayat pesanan</li>
              <li><strong>Remark</strong>: Catatan (opsional)</li>
              <li><strong>Foto</strong>: URL gambar atau kosongkan (contoh: https://...)</li>
            </ul>
          </div>

          {/* Errors Section */}
          {errors.length > 0 && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="mb-2 font-semibold text-red-900">⚠️ Terdapat {errors.length} kesalahan:</p>
              <ul className="space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx} className="text-sm text-red-700">• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Section */}
          {parsedItems.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 font-semibold text-gray-900">
                2. Preview Data ({parsedItems.length} items)
              </p>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">IPD</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Description</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Specification</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Qty</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">UoM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedItems.slice(0, 5).map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-900">{item.ipd}</td>
                        <td className="px-4 py-2 text-gray-900">{item.description}</td>
                        <td className="px-4 py-2 text-gray-600">{item.specification}</td>
                        <td className="px-4 py-2 text-gray-600">{item.qty || "-"}</td>
                        <td className="px-4 py-2 text-gray-900 font-medium">{item.uom}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedItems.length > 5 && (
                <p className="mt-2 text-xs text-gray-500">
                  ... dan {parsedItems.length - 5} item lainnya
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {parsedItems.length > 0 ? `Siap mengimport ${parsedItems.length} item` : "Belum ada file yang dipilih"}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={parsedItems.length === 0 || isProcessing}
              className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 font-semibold text-white hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {isProcessing ? "Mengimport..." : "✓ Import Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
