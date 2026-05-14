"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  Plus,
  X,
  Pencil,
  Trash2,
  ArrowLeft,
  Building2,
} from "lucide-react";

export default function CompaniesPage() {

  const [companies,
    setCompanies] =
    useState<any[]>([]);

  const [openModal,
    setOpenModal] =
    useState(false);

  const [editingCompany,
    setEditingCompany] =
    useState<any>(null);

  const [loading,
    setLoading] =
    useState(false);

  const [formData,
    setFormData] =
    useState({

      company_name: "",

      manager_name: "",

      company_email: "",

      company_phone: "",

      company_whatsapp: "",

      client_phone: "",

      client_whatsapp: "",

      responsible_name: "",

      responsible_phone: "",

      juridical_id: "",

      canton: "",

      address: "",

      username: "",

      password: "",
    });

  // GET
  async function getCompanies() {

    const { data } =
      await supabase
        .from("companies")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setCompanies(
      data || []
    );
  }

  useEffect(() => {
    getCompanies();
  }, []);

  // CREATE
  async function createCompany() {

    if (
      !formData.company_name ||
      !formData.username ||
      !formData.password
    ) {

      alert(
        "Completa los campos obligatorios"
      );

      return;
    }

    setLoading(true);

    const companyCode =
      "EMP-" +
      Math.floor(
        Math.random() *
          100000
      );

    const { error } =
      await supabase
        .from("companies")
        .insert([
          {
            ...formData,

            company_code:
              companyCode,
          },
        ]);

    setLoading(false);

    if (error) {

      alert(
        error.message
      );

      return;
    }

    alert(
      "Empresa creada"
    );

    closeModal();

    getCompanies();
  }

  // UPDATE
  async function updateCompany() {

    if (!editingCompany)
      return;

    setLoading(true);

    const { error } =
      await supabase
        .from("companies")
        .update({
          ...formData,
        })
        .eq(
          "id",
          editingCompany.id
        );

    setLoading(false);

    if (error) {

      alert(
        error.message
      );

      return;
    }

    alert(
      "Empresa actualizada"
    );

    closeModal();

    getCompanies();
  }

  // DELETE
  async function deleteCompany(
    company: any
  ) {
  
    const confirmDelete =
      confirm(
        "¿Eliminar empresa?"
      );
  
    if (!confirmDelete)
      return;
  
    const { error } =
      await supabase
        .from("companies")
        .delete()
        .eq(
          "id",
          company.id
        );
  
    if (error) {
  
      alert(error.message);
  
      return;
    }
  
    setCompanies(
      companies.filter(
        (item) =>
          item.id !==
          company.id
      )
    );
  
    alert(
      "Empresa eliminada"
    );
  }

  // EDIT
  function handleEdit(
    company: any
  ) {

    setEditingCompany(
      company
    );

    setFormData({

      company_name:
        company.company_name ||
        "",

      manager_name:
        company.manager_name ||
        "",

      company_email:
        company.company_email ||
        "",

      company_phone:
        company.company_phone ||
        "",

      company_whatsapp:
        company.company_whatsapp ||
        "",

      client_phone:
        company.client_phone ||
        "",

      client_whatsapp:
        company.client_whatsapp ||
        "",

      responsible_name:
        company.responsible_name ||
        "",

      responsible_phone:
        company.responsible_phone ||
        "",

      juridical_id:
        company.juridical_id ||
        "",

      canton:
        company.canton || "",

      address:
        company.address || "",

      username:
        company.username ||
        "",

      password:
        company.password ||
        "",
    });

    setOpenModal(true);
  }

  // CLOSE
  function closeModal() {

    setOpenModal(false);

    setEditingCompany(null);

    setFormData({

      company_name: "",

      manager_name: "",

      company_email: "",

      company_phone: "",

      company_whatsapp: "",

      client_phone: "",

      client_whatsapp: "",

      responsible_name: "",

      responsible_phone: "",

      juridical_id: "",

      canton: "",

      address: "",

      username: "",

      password: "",
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 lg:p-6">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <Link
            href="/dashboard"
            className="mb-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs shadow-sm"
          >

            <ArrowLeft size={15} />

            Dashboard

          </Link>

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-blue-100 p-3">

              <Building2
                size={20}
                className="text-blue-700"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                Empresas
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                Gestión empresarial
              </p>

            </div>

          </div>

        </div>

        <button
          onClick={() =>
            setOpenModal(true)
          }
          className="flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-xs font-semibold text-white"
        >

          <Plus size={16} />

          Nueva Empresa

        </button>

      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-gray-50">

              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">

                <th className="p-3">
                  Empresa
                </th>

                <th className="p-3">
                  Responsable
                </th>

                <th className="p-3">
                  Teléfono
                </th>

                <th className="p-3">
                  WhatsApp
                </th>

                <th className="p-3">
                  Cantón
                </th>

                <th className="p-3">
                  Email
                </th>

                <th className="p-3">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {companies.map(
                (company) => (

                  <tr
                    key={company.id}
                    className="border-t text-xs"
                  >

                    <td className="p-3 font-medium">
                      {
                        company.company_name
                      }
                    </td>

                    <td className="p-3">
                      {
                        company.responsible_name
                      }
                    </td>

                    <td className="p-3">
                      {
                        company.company_phone
                      }
                    </td>

                    <td className="p-3">
                      {
                        company.company_whatsapp
                      }
                    </td>

                    <td className="p-3">
                      {
                        company.canton
                      }
                    </td>

                    <td className="p-3">
                      {
                        company.company_email
                      }
                    </td>

                    <td className="p-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleEdit(
                              company
                            )
                          }
                          className="rounded-xl bg-blue-100 p-2 text-blue-700"
                        >

                          <Pencil size={15} />

                        </button>

                        <button
                          onClick={() =>
                            deleteCompany(
                              company
                            )
                          }
                          className="rounded-xl bg-red-100 p-2 text-red-700"
                        >

                          <Trash2 size={15} />

                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}
      {openModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">

          <div className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-[28px] bg-white p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold">

                  {editingCompany
                    ? "Editar Empresa"
                    : "Nueva Empresa"}

                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Información empresarial
                </p>

              </div>

              <button
                onClick={closeModal}
                className="rounded-xl bg-gray-100 p-2"
              >

                <X size={18} />

              </button>

            </div>

            {/* FORM */}
            <div className="grid gap-5">

              {/* EMPRESA */}
              <Section title="Información Empresa">

                <Input
                  placeholder="Nombre empresa"
                  value={formData.company_name}
                  field="company_name"
                  formData={formData}
                  setFormData={setFormData}
                />

                <Input
                  placeholder="Correo empresa"
                  value={formData.company_email}
                  field="company_email"
                  formData={formData}
                  setFormData={setFormData}
                />

                <Input
                  placeholder="Teléfono empresa"
                  value={formData.company_phone}
                  field="company_phone"
                  formData={formData}
                  setFormData={setFormData}
                />

                <Input
                  placeholder="WhatsApp empresa"
                  value={formData.company_whatsapp}
                  field="company_whatsapp"
                  formData={formData}
                  setFormData={setFormData}
                />

                <Input
                  placeholder="Cédula jurídica"
                  value={formData.juridical_id}
                  field="juridical_id"
                  formData={formData}
                  setFormData={setFormData}
                />

                <Input
                  placeholder="Cantón"
                  value={formData.canton}
                  field="canton"
                  formData={formData}
                  setFormData={setFormData}
                />

                <div className="md:col-span-2 xl:col-span-3">

                  <Input
                    placeholder="Dirección"
                    value={formData.address}
                    field="address"
                    formData={formData}
                    setFormData={setFormData}
                  />

                </div>

              </Section>

              {/* RESPONSABLE */}
              <Section title="Responsable">

                <Input
                  placeholder="Nombre responsable"
                  value={formData.responsible_name}
                  field="responsible_name"
                  formData={formData}
                  setFormData={setFormData}
                />

                <Input
                  placeholder="Teléfono responsable"
                  value={formData.responsible_phone}
                  field="responsible_phone"
                  formData={formData}
                  setFormData={setFormData}
                />

                <Input
                  placeholder="Encargado"
                  value={formData.manager_name}
                  field="manager_name"
                  formData={formData}
                  setFormData={setFormData}
                />

              </Section>

              {/* CLIENTE */}
              <Section title="Datos Cliente">

                <Input
                  placeholder="Teléfono cliente"
                  value={formData.client_phone}
                  field="client_phone"
                  formData={formData}
                  setFormData={setFormData}
                />

                <Input
                  placeholder="WhatsApp cliente"
                  value={formData.client_whatsapp}
                  field="client_whatsapp"
                  formData={formData}
                  setFormData={setFormData}
                />

              </Section>

              {/* ACCESO */}
              <Section title="Acceso Plataforma">

                <Input
                  placeholder="Usuario login"
                  value={formData.username}
                  field="username"
                  formData={formData}
                  setFormData={setFormData}
                />

                <Input
                  placeholder="Password"
                  value={formData.password}
                  field="password"
                  type="password"
                  formData={formData}
                  setFormData={setFormData}
                />

              </Section>

            </div>

            {/* FOOTER */}
            <div className="mt-6 flex justify-end">

              <button
                onClick={
                  editingCompany
                    ? updateCompany
                    : createCompany
                }
                disabled={loading}
                className="rounded-2xl bg-black px-6 py-3 text-xs font-semibold text-white"
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

function Section({
  title,
  children,
}: any) {

  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:p-5">

      <h3 className="mb-4 text-sm font-bold text-gray-900">
        {title}
      </h3>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

        {children}

      </div>

    </div>
  );
}

function Input({
  placeholder,
  value,
  field,
  formData,
  setFormData,
  type = "text",
}: any) {

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) =>
        setFormData({
          ...formData,
          [field]:
            e.target.value,
        })
      }
      className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-black"
    />
  );
}