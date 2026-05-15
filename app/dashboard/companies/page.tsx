"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Building2,
  Plus,
  Trash2,
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

  // FORM
  const [companyName,
    setCompanyName] =
    useState("");

  const [managerName,
    setManagerName] =
    useState("");

  const [email,
    setEmail] =
    useState("");

  const [companyEmail,
    setCompanyEmail] =
    useState("");

  const [phone,
    setPhone] =
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

  // CREATE
  async function handleCreateCompany() {

    try {

      setLoading(true);

      if (
        !companyName ||
        !managerName ||
        !email ||
        !companyEmail ||
        !phone ||
        !address ||
        !password
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

      const { error } =
        await supabase
          .from("companies")
          .insert([

            {

              company_name:
                companyName,

              manager_name:
                managerName,

              email: email,

              company_email:
                companyEmail,

              phone: phone,

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

      // RESET
      setCompanyName("");

      setManagerName("");

      setEmail("");

      setCompanyEmail("");

      setPhone("");

      setAddress("");

      setPassword("");

      setOpenModal(false);

      loadCompanies();

    } catch (error) {

      console.log(error);

      alert(
        "Error creando empresa"
      );

    } finally {

      setLoading(false);

    }
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
          "Error eliminando empresa"
        );

        return;
      }

      loadCompanies();

    } catch (error) {

      console.log(error);

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
            onClick={() =>
              setOpenModal(true)
            }
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

                  <th className="min-w-[150px] px-4 py-3">
                    Teléfono
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

                          {company.company_name}

                        </div>

                        <div className="mt-1 text-xs text-gray-500">

                          {company.address}

                        </div>

                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-4 align-top">

                        <div className="break-words text-gray-700">

                          {company.company_email}

                        </div>

                      </td>

                      {/* PHONE */}
                      <td className="px-4 py-4 align-top text-gray-700">

                        {company.phone}

                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4 align-top">

                        <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                          Activa

                        </span>

                      </td>

                      {/* ACTIONS */}
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

                  Nueva empresa

                </h2>

                <p className="text-sm text-gray-500">

                  Registro de empresa

                </p>

              </div>

            </div>

            {/* FORM */}
            <div className="grid gap-4 md:grid-cols-2">

              {/* EMPRESA */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Nombre empresa

                </label>

                <input
                  type="text"
                  value={companyName}
                  onChange={(e) =>
                    setCompanyName(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                />

              </div>

              {/* ENCARGADO */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Encargado

                </label>

                <input
                  type="text"
                  value={managerName}
                  onChange={(e) =>
                    setManagerName(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                />

              </div>

              {/* EMAIL */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Email encargado

                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                />

              </div>

              {/* EMAIL EMPRESA */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Email empresa

                </label>

                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) =>
                    setCompanyEmail(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                />

              </div>

              {/* PHONE */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Teléfono

                </label>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                />

              </div>

              {/* ADDRESS */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Dirección

                </label>

                <input
                  type="text"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                />

              </div>

              {/* PASSWORD */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Contraseña

                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                />

              </div>

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
                  handleCreateCompany
                }
                disabled={loading}
                className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >

                {loading
                  ? "Guardando..."
                  : "Guardar empresa"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}