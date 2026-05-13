"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { supabase } from "../../lib/supabase";

import {
  Plus,
  X,
  Pencil,
  Trash2,
  ArrowLeft,
  Building2,
} from "lucide-react";

export default function CompaniesPage() {
  const [companies, setCompanies] =
    useState<any[]>([]);

  const [openModal, setOpenModal] =
    useState(false);

  const [editingCompany, setEditingCompany] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    manager_name: "",
    company_email: "",
    company_phone: "",
    company_whatsapp: "",
    address: "",

    username: "",
    password: "",
  });

  // Obtener empresas
  async function getCompanies() {
    const { data } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setCompanies(data || []);
  }

  useEffect(() => {
    getCompanies();
  }, []);

  // Crear empresa
  async function createCompany() {
    if (
      !formData.company_name ||
      !formData.username ||
      !formData.password
    ) {
      alert("Completa los campos");

      return;
    }

    setLoading(true);

    const companyCode =
      "EMP-" +
      Math.floor(Math.random() * 100000);

    const { error } = await supabase
      .from("companies")
      .insert([
        {
          ...formData,

          company_code: companyCode,
        },
      ]);

    setLoading(false);

    if (error) {
      alert(error.message);

      return;
    }

    alert("Empresa creada");

    closeModal();

    getCompanies();
  }

  // Actualizar
  async function updateCompany() {
    if (!editingCompany) return;

    setLoading(true);

    const { error } = await supabase
      .from("companies")
      .update({
        ...formData,
      })
      .eq("id", editingCompany.id);

    setLoading(false);

    if (error) {
      alert(error.message);

      return;
    }

    alert("Empresa actualizada");

    closeModal();

    getCompanies();
  }

  // Eliminar
  async function deleteCompany(id: string) {
    const confirmDelete = confirm(
      "¿Eliminar empresa?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("companies")
      .delete()
      .eq("id", id);

    getCompanies();
  }

  // Editar
  function handleEdit(company: any) {
    setEditingCompany(company);

    setFormData({
      company_name:
        company.company_name || "",

      manager_name:
        company.manager_name || "",

      company_email:
        company.company_email || "",

      company_phone:
        company.company_phone || "",

      company_whatsapp:
        company.company_whatsapp || "",

      address: company.address || "",

      username: company.username || "",

      password: company.password || "",
    });

    setOpenModal(true);
  }

  // Cerrar modal
  function closeModal() {
    setOpenModal(false);

    setEditingCompany(null);

    setFormData({
      company_name: "",
      manager_name: "",
      company_email: "",
      company_phone: "",
      company_whatsapp: "",
      address: "",

      username: "",
      password: "",
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm"
          >
            <ArrowLeft size={18} />

            Dashboard
          </Link>

          <h1 className="text-4xl font-bold">
            Empresas
          </h1>

          <p className="mt-2 text-gray-600">
            Gestión empresarial
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-black px-6 py-4 text-white"
        >
          <Plus size={20} />

          Nueva Empresa
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-5 text-left">
                Empresa
              </th>

              <th className="p-5 text-left">
                Usuario
              </th>

              <th className="p-5 text-left">
                Email
              </th>

              <th className="p-5 text-left">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => (
              <tr
                key={company.id}
                className="border-t"
              >
                <td className="p-5">
                  {company.company_name}
                </td>

                <td className="p-5">
                  {company.username}
                </td>

                <td className="p-5">
                  {company.company_email}
                </td>

                <td className="p-5">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleEdit(company)
                      }
                      className="rounded-xl bg-blue-100 p-3 text-blue-700"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        deleteCompany(
                          company.id
                        )
                      }
                      className="rounded-xl bg-red-100 p-3 text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  {editingCompany
                    ? "Editar Empresa"
                    : "Nueva Empresa"}
                </h2>

                <p className="mt-1 text-gray-500">
                  Configuración empresa
                </p>
              </div>

              <button
                onClick={closeModal}
              >
                <X />
              </button>
            </div>

            {/* Form */}
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Nombre empresa"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company_name:
                      e.target.value,
                  })
                }
                className="rounded-xl border p-4"
              />

              <input
                type="text"
                placeholder="Encargado"
                value={formData.manager_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    manager_name:
                      e.target.value,
                  })
                }
                className="rounded-xl border p-4"
              />

              <input
                type="email"
                placeholder="Correo empresa"
                value={formData.company_email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company_email:
                      e.target.value,
                  })
                }
                className="rounded-xl border p-4"
              />

              <input
                type="text"
                placeholder="Teléfono"
                value={formData.company_phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company_phone:
                      e.target.value,
                  })
                }
                className="rounded-xl border p-4"
              />

              <input
                type="text"
                placeholder="Usuario login"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username:
                      e.target.value,
                  })
                }
                className="rounded-xl border p-4"
              />

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password:
                      e.target.value,
                  })
                }
                className="rounded-xl border p-4"
              />

              <input
                type="text"
                placeholder="WhatsApp"
                value={
                  formData.company_whatsapp
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company_whatsapp:
                      e.target.value,
                  })
                }
                className="rounded-xl border p-4"
              />

              <input
                type="text"
                placeholder="Dirección"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                className="rounded-xl border p-4"
              />
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={
                  editingCompany
                    ? updateCompany
                    : createCompany
                }
                disabled={loading}
                className="rounded-2xl bg-black px-8 py-4 text-white"
              >
                {loading
                  ? "Guardando..."
                  : editingCompany
                  ? "Actualizar"
                  : "Crear Empresa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}