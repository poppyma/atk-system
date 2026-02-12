"use client";

import { useState, useEffect } from "react";
import AtkTable from "@/app/components/AtkTable";
import CreateAtkModal from "@/app/components/CreateAtkModal";
import EditAtkModal from "@/app/components/EditAtkModal";
import Toast from "@/app/components/Toast";
import LoginPage from "@/app/components/LoginPage";
import { AtkItem } from "@/app/data/atkData";
import { useAuth } from "@/app/context/AuthContext";

export default function Home() {
  const { isLoggedIn, role, logout } = useAuth();
  const [items, setItems] = useState<AtkItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<AtkItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data dari API saat component mount - MUST be before conditional return
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/atk-items");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        setToastMessage("Gagal mengambil data dari database");
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchItems();
    }
  }, [isLoggedIn]);

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const handleCreateItem = async (
    newItem: Omit<AtkItem, "id" | "quotations"> & { quotations?: AtkItem["quotations"] }
  ) => {
    try {
      const response = await fetch("/api/atk-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ipd: newItem.ipd,
          description: newItem.description,
          specification: newItem.specification,
          qty: newItem.qty,
          uom: newItem.uom,
          lastOrder: newItem.lastOrder,
          remark: newItem.remark,
          foto: newItem.foto,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create item");
      }

      const createdItem = await response.json();
      setItems([createdItem, ...items]);
      setToastMessage(`Data "${newItem.description}" berhasil ditambahkan!`);
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(`✗ Gagal: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleEditItem = (item: AtkItem) => {
    setSelectedItemForEdit(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = async (updatedItem: AtkItem) => {
    try {
      const response = await fetch(`/api/atk-items/${updatedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ipd: updatedItem.ipd,
          description: updatedItem.description,
          specification: updatedItem.specification,
          qty: updatedItem.qty,
          uom: updatedItem.uom,
          lastOrder: updatedItem.lastOrder,
          remark: updatedItem.remark,
          foto: updatedItem.foto,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update item");
      }

      setItems(
        items.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      setToastMessage(`Data "${updatedItem.description}" berhasil diupdate!`);
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(`✗ Gagal: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch(`/api/atk-items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete item");
      }

      setItems(items.filter((item) => item.id !== id.toString()));
      setToastMessage("Data berhasil dihapus!");
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(`✗ Gagal: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleAddQuotation = async (
    itemId: string,
    quotation: {
      supplier: string;
      price: number;
      unit: string;
      remark: string;
    }
  ) => {
    try {
      const response = await fetch(`/api/quotations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          atkItemId: itemId,
          supplier: quotation.supplier,
          price: quotation.price,
          unit: quotation.unit,
          remark: quotation.remark || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add quotation");
      }

      // Refresh data
      const itemsResponse = await fetch("/api/atk-items");
      if (itemsResponse.ok) { 
        const updatedItems = await itemsResponse.json();
        setItems(updatedItems);
      }

      setToastMessage(`Penawaran dari ${quotation.supplier} berhasil ditambahkan!`);
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(`✗ Gagal menambah penawaran: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleEditQuotation = async (quotation: {
    id: string;
    supplier: string;
    price: number;
    unit: string;
    remark: string;
  }) => {
    try {
      const response = await fetch(`/api/quotations`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quotation),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit quotation");
      }

      // Refresh data
      const itemsResponse = await fetch("/api/atk-items");
      if (itemsResponse.ok) {
        const updatedItems = await itemsResponse.json();
        setItems(updatedItems);
      }

      setToastMessage(`Penawaran berhasil diperbarui!`);
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(`✗ Gagal memperbarui penawaran: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleDeleteQuotation = async (id: string) => {
    try {
      const response = await fetch(`/api/quotations?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete quotation");
      }

      // Refresh data
      const itemsResponse = await fetch("/api/atk-items");
      if (itemsResponse.ok) {
        const updatedItems = await itemsResponse.json();
        setItems(updatedItems);
      }

      setToastMessage(`Penawaran berhasil dihapus!`);
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(`✗ Gagal menghapus penawaran: ${error.message}`);
      setShowToast(true);
    }
  };

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📋 MANIS (MAster Non-stock Item System)
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Sistem Manajemen Item Non-Stock dan Supplier
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end sm:flex-row">
              <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1.5 text-white font-semibold text-sm">
                {role === "admin" ? "🔐 Admin" : role === "guest" ? "👥 Tamu" : "👤 User"} | Total Items: {items.length}
              </div>
              {role === "admin" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-1.5 font-semibold text-sm text-white hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  + Buat Input Data Master
                </button>
              )}
              <button
                onClick={logout}
                className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-1.5 font-semibold text-sm text-white hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Info Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-lg">📦</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Merk/Supplier</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-green-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <span className="text-lg">💰</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Harga Termurah</p>
                <p className="text-2xl font-bold text-gray-900">Otomatis</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Update Terakhir</p>
                <p className="text-2xl font-bold text-gray-900">Real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 inline-block">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                </div>
                <p className="text-gray-600">Mengambil data dari database...</p>
              </div>
            </div>
          ) : items.length > 0 ? (
            <AtkTable items={items} isAdmin={role === "admin"} onEdit={handleEditItem} onDelete={handleDeleteItem} onAddQuotation={handleAddQuotation} onEditQuotation={handleEditQuotation} onDeleteQuotation={handleDeleteQuotation} />
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-gray-500">Tidak ada data ATK. Silakan tambahkan data baru.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-600">
        <p>© 2026 Master ATK System - Data Management</p>
      </footer>

      {/* Create Modal */}
      {role === "admin" && (
        <CreateAtkModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateItem}
        />
      )}

      {/* Edit Modal */}
      {role === "admin" && (
        <EditAtkModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItemForEdit(null);
          }}
          item={selectedItemForEdit}
          onSubmit={handleUpdateItem}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
    </main>
  );
}
