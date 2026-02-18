"use client";

import { useState, useRef } from "react";

interface CsvImportQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quotations: Array<{
    supplier: string;
    price: number;
    unit: string;
    remark: string;
  }>) => void;
}

export default function CsvImportQuotationModal({
  isOpen,
  onClose,
  onSubmit,
}: CsvImportQuotationModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedQuotations, setParsedQuotations] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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
    const quotations = [];
    const newErrors: string[] = [];

    // Find column indices
    const supplierIndex = headers.indexOf("supplier");
    const priceIndex = headers.indexOf("price");
    const unitIndex = headers.indexOf("unit");
    const remarkIndex = headers.indexOf("remark");

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.every(v => !v)) continue; // Skip empty rows

      const supplier = values[supplierIndex] || "";
      const priceStr = values[priceIndex] || "";
      const unit = values[unitIndex] || "";

      // Validate required fields
      if (!supplier) {
        newErrors.push(`Baris ${i + 1}: Supplier tidak boleh kosong`);
        continue;
      }
      if (!priceStr) {
        newErrors.push(`Baris ${i + 1}: Price tidak boleh kosong`);
        continue;
      }
      if (!unit) {
        newErrors.push(`Baris ${i + 1}: Unit tidak boleh kosong`);
        continue;
      }

      // Validate and convert price
      const price = parseFloat(priceStr);
      if (isNaN(price) || price <= 0) {
        newErrors.push(`Baris ${i + 1}: Price harus berupa angka positif`);
        continue;
      }

      quotations.push({
        supplier,
        price,
        unit,
        remark: values[remarkIndex] || "",
      });
    }

    setErrors(newErrors);
    return quotations;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const quotations = parseCSV(text);
      setParsedQuotations(quotations);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const template = "Supplier,Price,Unit,Remark\n" +
      "PT Maju Jaya,50000,PCS,Harga terbaik\n" +
      "PT Berkah Abadi,55000,PCS,Garansi 1 tahun\n";
    
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(template));
    element.setAttribute("download", "template-quotation.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmit = async () => {
    if (parsedQuotations.length === 0) {
      setErrors(["Tidak ada data yang valid untuk diimport"]);
      return;
    }

    setIsProcessing(true);
    try {
      onSubmit(parsedQuotations);
      // Reset on success
      setParsedQuotations([]);
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
            <h2 className="text-xl font-bold text-gray-900">📥 Import Data Penawaran dari CSV</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Upload file CSV untuk menambahkan penawaran secara massal
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
            Format: Supplier, Price, Unit, Remark
            <br />
            <strong>Catatan:</strong> Jika supplier dengan nama yang sama sudah ada, harga/unit/remark akan di-update, bukan ditambah baru
          </p>
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
          {parsedQuotations.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 font-semibold text-gray-900">
                2. Preview Data ({parsedQuotations.length} penawaran)
              </p>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Supplier</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Price</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Unit</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedQuotations.slice(0, 5).map((quotation, idx) => (
                      <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-900">{quotation.supplier}</td>
                        <td className="px-4 py-2 text-right text-gray-900 font-medium">Rp {quotation.price.toLocaleString()}</td>
                        <td className="px-4 py-2 text-gray-600">{quotation.unit}</td>
                        <td className="px-4 py-2 text-gray-600">{quotation.remark || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedQuotations.length > 5 && (
                <p className="mt-2 text-xs text-gray-500">
                  ... dan {parsedQuotations.length - 5} penawaran lainnya
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {parsedQuotations.length > 0 ? `Siap mengimport ${parsedQuotations.length} penawaran` : "Belum ada file yang dipilih"}
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
              disabled={parsedQuotations.length === 0 || isProcessing}
              className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 font-semibold text-white hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {isProcessing ? "Mengimport..." : "✓ Import Penawaran"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
