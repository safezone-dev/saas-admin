"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Building2,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";

export default function CompaniesPage() {

  const [companies,
    setCompanies] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(false);

  const [openModal,
    setOpenModal] =
    useState(false);

  const [editingId,
    setEditingId] =
    useState<string | null>(
      null
    );

  // FORM
  const [companyName,
    setCompanyName] =
    useState("");

  const [managerName,
    setManagerName] =
    useState("");

  const [companyEmail,
    setCompanyEmail] =
    useState("");

  const [companyPhone,
    setCompanyPhone] =
    useState("");

  const [address,
    setAddress] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  // LOAD
  useEffect(() => {

    loadCompanies();

  }, []);

  // GET
  async function loadCompanies() {

    try {

      const { data, error } =
        await supabase
          .from("companies")
          .select("*")
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) {

        console.log(error);

        return;
      }

      setCompanies(
        data || []
      );

    } catch (error) {

      console.log(error);

    }
  }

  // SAVE COMPANY
  async function handleSaveCompany() {

    try {

      setLoading(true);

      if (
        !companyName ||
        !managerName ||
        !companyEmail ||
        !companyPhone ||
        !address
      ) {

        alert(
          "Complete todos los campos"
        );

        setLoading(false);

        return;
      }

      const companyCode =
        companyName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(
            /[^a-z0-9]/g,
            ""
          );

      // EDITAR
      if (editingId) {

        const { error } =
          await supabase
            .from("companies")
            .update({

              company_name:
                companyName,

              manager_name:
                managerName,

              company_email:
                companyEmail,

              company_phone:
                companyPhone,

              address: address,

              company_code:
                companyCode,

              ...(password && {
                password:
                  password,
              }),

            })
            .eq(
              "id",
              editingId
            );

        if (error) {

          console.log(error);

          alert(
            error.message
          );

          return;
        }

        alert(
          "Empresa actualizada"
        );

      } else {

        // CREAR
        const { error } =
          await supabase
            .from("companies")
            .insert([

              {

                company_name:
                  companyName,

                manager_name:
                  managerName,

                company_email:
                  companyEmail,

                company_phone:
                  companyPhone,

                address: address,

                password:
                  password,

                company_code:
                  companyCode,

              },

            ]);

        if (error) {

          console.log(error);

          alert(
            error.message
          );

          return;
        }

        alert(
          "Empresa creada correctamente"
        );
      }

      resetForm();

      setOpenModal(false);

      loadCompanies();

    } catch (error) {

      console.log(error);

      alert(
        "Error guardando empresa"
      );

    } finally {

      setLoading(false);

    }
  }

  // EDIT
  function handleEdit(
    company: any
  ) {

    setEditingId(
      company.id
    );

    setCompanyName(
      company.company_name || ""
    );

    setManagerName(
      company.manager_name || ""
    );

    setCompanyEmail(
      company.company_email || ""
    );

    setCompanyPhone(
      company.company_phone || ""
    );

    setAddress(
      company.address || ""
    );

    setPassword("");

    setOpenModal(true);
  }

  // RESET
  function resetForm() {

    setEditingId(null);

    setCompanyName("");

    setManagerName("");

    setCompanyEmail("");

    setCompanyPhone("");

    setAddress("");

    setPassword("");
  }

  // DELETE
  async function deleteCompany(
    id: string
  ) {

    const confirmDelete =
      confirm(
        "¿Eliminar empresa?"
      );

    if (!confirmDelete)
      return;

    try {

      const { error } =
        await supabase
          .from("companies")
          .delete()
          .eq("id", id);

      if (error) {

        console.log(error);

        alert(
          error.message
        );

        return;
      }

      alert(
        "Empresa eliminada"
      );

      loadCompanies();

    } catch (error) {

      console.log(error);

      alert(
        "Error eliminando empresa"
      );

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-sm">

              <Building2 size={22} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">

                Empresas

              </h1>

              <p className="text-sm text-gray-500">

                Administración y gestión de empresas

              </p>

            </div>

          </div>

          <button
            onClick={() => {

              resetForm();

              setOpenModal(true);

            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >

            <Plus size={16} />

            Nueva empresa

          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full table-auto">

              <thead className="bg-gray-50">

                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                  <th className="min-w-[220px] px-4 py-3">

                    Empresa

                  </th>

                  <th className="min-w-[240px] px-4 py-3">

                    Email

                  </th>

                  <th className="min-w-[160px] px-4 py-3">

                    Teléfono

                  </th>

                  <th className="min-w-[140px] px-4 py-3 text-center">

                    Editar

                  </th>

                  <th className="min-w-[100px] px-4 py-3">

                    Estado

                  </th>

                  <th className="min-w-[140px] px-4 py-3 text-center">

                    Acciones

                  </th>

                </tr>

              </thead>

              <tbody>

                {companies.map(
                  (company) => (

                    <tr
                      key={company.id}
                      className="border-t border-gray-100 text-sm transition hover:bg-gray-50"
                    >

                      {/* EMPRESA */}
                      <td className="px-4 py-4 align-top">

                        <div className="font-semibold text-gray-900">

                          {
                            company.company_name
                          }

                        </div>

                        <div className="mt-1 text-xs text-gray-500">

                          {company.address}

                        </div>

                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-4 align-top">

                        <div className="break-words text-gray-700">

                          {
                            company.company_email
                          }

                        </div>

                      </td>

                      {/* PHONE */}
                      <td className="px-4 py-4 align-top text-gray-700">

                        {
                          company.company_phone
                        }

                      </td>

                      {/* EDIT */}
                      <td className="px-4 py-4 align-top text-center">

                        <button
                          onClick={() =>
                            handleEdit(
                              company
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-200"
                        >

                          <Pencil size={12} />

                          Editar

                        </button>

                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4 align-top">

                        <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                          Activa

                        </span>

                      </td>

                      {/* DELETE */}
                      <td className="px-4 py-4 align-top text-center">

                        <button
                          onClick={() =>
                            deleteCompany(
                              company.id
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                        >

                          <Trash2 size={12} />

                          Eliminar

                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {openModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-xl rounded-[24px] bg-white p-6 shadow-2xl">

            {/* HEADER */}
            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">

                <Building2 size={19} />

              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-900">

                  {editingId
                    ? "Editar empresa"
                    : "Nueva empresa"}

                </h2>

                <p className="text-sm text-gray-500">

                  Gestión de empresas

                </p>

              </div>

            </div>

            {/* FORM */}
            <div className="grid gap-4 md:grid-cols-2">

              <InputField
                label="Nombre empresa"
                value={companyName}
                onChange={setCompanyName}
              />

              <InputField
                label="Encargado"
                value={managerName}
                onChange={setManagerName}
              />

              <InputField
                label="Email empresa"
                value={companyEmail}
                onChange={setCompanyEmail}
                type="email"
              />

              <InputField
                label="Teléfono empresa"
                value={companyPhone}
                onChange={setCompanyPhone}
              />

              <InputField
                label="Dirección"
                value={address}
                onChange={setAddress}
              />

              <InputField
                label="Contraseña"
                value={password}
                onChange={setPassword}
                type="password"
              />

            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() =>
                  setOpenModal(false)
                }
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold transition hover:bg-gray-100"
              >

                Cancelar

              </button>

              <button
                onClick={
                  handleSaveCompany
                }
                disabled={loading}
                className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >

                {loading
                  ? "Guardando..."
                  : editingId
                  ? "Actualizar"
                  : "Guardar empresa"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: any) {

  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">

        {label}

      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
      />

    </div>
  );
}