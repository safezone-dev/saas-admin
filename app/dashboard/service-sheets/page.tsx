"use client";

import { useEffect, useState } from "react";

import { supabase }
from "@/lib/supabase";

import ServiceSheetAdminForm
from "@/components/forms/ServiceSheetAdminForm";

import {
  ClipboardList,
  Plus,
  X,
} from "lucide-react";

export default function ServiceSheetsPage() {

  const [sheets,
    setSheets] =
    useState<any[]>([]);

  const [companies,
    setCompanies] =
    useState<any[]>([]);

  const [technicians,
    setTechnicians] =
    useState<any[]>([]);

  const [showModal,
    setShowModal] =
    useState(false);

    const [search,
      setSearch] =
      useState("");
    
    const [statusFilter,
      setStatusFilter] =
      useState("all");
    
    const [companyFilter,
      setCompanyFilter] =
      useState("all");
    
    const [technicianFilter,
      setTechnicianFilter] =
      useState("all");
    
    const [dateFilter,
      setDateFilter] =
      useState("");

  useEffect(() => {

    loadSheets();

    loadCompanies();

    loadTechnicians();

  }, []);

  async function loadSheets() {

    const { data } =
      await supabase
        .from(
          "service_sheets"
        )
        .select(`
          *,
          companies (
            company_name
          ),
          technicians (
            full_name
          )
        `)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (data) {

      setSheets(data);

    }
  }

  async function loadCompanies() {

    const { data } =
      await supabase
        .from("companies")
        .select("*");

    if (data) {

      setCompanies(data);

    }
  }

  async function loadTechnicians() {

    const { data } =
      await supabase
        .from("technicians")
        .select("*");

    if (data) {

      setTechnicians(data);

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-sm">

              <ClipboardList size={22} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">

                Hojas de Servicio

              </h1>

              <p className="text-sm text-gray-500">

                Gestión operativa técnica

              </p>

            </div>

          </div>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >

            <Plus size={16} />

            Nueva Hoja

          </button>

        </div>

        {/* FILTROS */}

<div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">

{/* BUSCADOR */}
<input
  type="text"
  placeholder="Buscar empresa o técnico..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="rounded-xl border border-gray-200 bg-white p-3 text-sm"
/>

{/* FECHA */}
<input
  type="date"
  value={dateFilter}
  onChange={(e) =>
    setDateFilter(e.target.value)
  }
  className="rounded-xl border border-gray-200 bg-white p-3 text-sm"
/>

{/* ESTADO */}
<select
  value={statusFilter}
  onChange={(e) =>
    setStatusFilter(
      e.target.value
    )
  }
  className="rounded-xl border border-gray-200 bg-white p-3 text-sm"
>

  <option value="all">

    Todos los estados

  </option>

  <option value="pending">

    Pendiente

  </option>

  <option value="completed">

    Completada

  </option>

</select>

{/* EMPRESA */}
<select
  value={companyFilter}
  onChange={(e) =>
    setCompanyFilter(
      e.target.value
    )
  }
  className="rounded-xl border border-gray-200 bg-white p-3 text-sm"
>

  <option value="all">

    Todas las empresas

  </option>

  {companies.map(
    (company) => (

      <option
        key={company.id}
        value={company.id}
      >

        {company.company_name}

      </option>

    )
  )}

</select>

{/* TECNICO */}
<select
  value={technicianFilter}
  onChange={(e) =>
    setTechnicianFilter(
      e.target.value
    )
  }
  className="rounded-xl border border-gray-200 bg-white p-3 text-sm"
>

  <option value="all">

    Todos los técnicos

  </option>

  {technicians.map(
    (tech) => (

      <option
        key={tech.id}
        value={tech.id}
      >

        {tech.full_name}

      </option>

    )
  )}

</select>

</div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full table-auto">

              <thead className="bg-gray-50">

                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                  <th className="px-4 py-3">

                    Empresa

                  </th>

                  <th className="px-4 py-3">

                    Técnico

                  </th>

                  <th className="px-4 py-3">

                    Fecha

                  </th>

                  <th className="px-4 py-3">

                    Estado

                  </th>

                </tr>

              </thead>

              <tbody>

              {sheets

.filter((sheet) => {

  const texto =
    search.toLowerCase();

  const coincideBusqueda =

    sheet.companies
      ?.company_name
      ?.toLowerCase()
      .includes(texto)

    ||

    sheet.technicians
      ?.full_name
      ?.toLowerCase()
      .includes(texto);

  const coincideEstado =

    statusFilter ===
    "all"

    ||

    sheet.status ===
    statusFilter;

  const coincideEmpresa =

    companyFilter ===
    "all"

    ||

    sheet.company_id ===
    companyFilter;

  const coincideTecnico =

    technicianFilter ===
    "all"

    ||

    sheet.technician_id ===
    technicianFilter;

  const coincideFecha =

    dateFilter === ""

    ||

    sheet.service_date ===
    dateFilter;

  return (

    coincideBusqueda

    &&

    coincideEstado

    &&

    coincideEmpresa

    &&

    coincideTecnico

    &&

    coincideFecha

  );

})

.map(
                  (sheet) => (

                    <tr
                      key={sheet.id}
                      className="border-t border-gray-100 text-sm hover:bg-gray-50"
                    >

                      <td className="px-4 py-4 font-semibold text-gray-900">

                        {
                          sheet.companies
                            ?.company_name
                        }

                      </td>

                      <td className="px-4 py-4 text-gray-700">

                        {
                          sheet.technicians
                          ?.full_name
                        }

                      </td>

                      <td className="px-4 py-4 text-gray-700">

                        {
                          sheet.service_date
                        }

                      </td>

                      <td className="px-4 py-4">

                        {sheet.status ===
                        "completed" ? (

                          <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                            Completada

                          </span>

                        ) : (

                          <span className="rounded-lg bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">

                            Pendiente

                          </span>

                        )}

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
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-6xl rounded-[24px] bg-white p-6 shadow-2xl overflow-y-auto max-h-[95vh]">

            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-900">

                  Nueva Hoja de Servicio

                </h2>

                <p className="text-sm text-gray-500">

                  Registro operativo técnico

                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-xl bg-gray-100 p-3 hover:bg-gray-200"
              >

                <X size={18} />

              </button>

            </div>

            {/* FORMULARIO */}
            <ServiceSheetAdminForm
              companies={companies}
              technicians={technicians}
              onSuccess={() => {

                setShowModal(false);

                loadSheets();

              }}
            />

          </div>

        </div>
      )}

    </div>
  );
}