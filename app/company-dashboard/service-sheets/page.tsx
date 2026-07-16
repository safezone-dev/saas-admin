"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ClipboardList,
  ArrowRight,
} from "lucide-react";

export default function TechnicianSheetsPage() {

  const [loading, setLoading] =
    useState(true);

  const [sheets, setSheets] =
    useState<any[]>([]);
  
  const [filter, setFilter] = useState("all");

  const [showViewModal,
    setShowViewModal] =
    useState(false);
  
  const [selectedSheet,
    setSelectedSheet] =
    useState<any>(null);

  const [searchCompany,
    setSearchCompany] =
    useState("");
  
  const [dateFilter,
    setDateFilter] =
    useState("");

  useEffect(() => {

    loadSheets();

  }, []);

  async function loadSheets() {

    try {

      setLoading(true);

      const technician =
        JSON.parse(
          localStorage.getItem(
            "technician"
          ) || "{}"
        );

      if (!technician?.id) {

        console.log(
          "No technician found"
        );

        return;
      }

      const {
        data: sheetsData,
        error,
      } = await supabase
        .from(
          "service_sheets"
        )
        .select("*")
        .eq(
          "technician_id",
          technician.id
        )
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

      if (
        !sheetsData ||
        sheetsData.length === 0
      ) {

        setSheets([]);

        return;
      }

      const companyIds =
        sheetsData.map(
          (sheet) =>
            sheet.company_id
        );

      const {
        data: companies,
      } = await supabase
        .from("companies")
        .select(
          "id, company_name"
        )
        .in(
          "id",
          companyIds
        );

      const sheetsWithCompanies =
        sheetsData.map(
          (sheet) => ({

            ...sheet,

            company_name:
              companies?.find(
                (company) =>
                  company.id ===
                  sheet.company_id
              )?.company_name ||

              "Sin empresa",

          })
        );

      setSheets(
        sheetsWithCompanies
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  if (loading) {

    return (
  
      <div className="min-h-screen bg-gray-100 p-6">
  
        <div className="mx-auto max-w-7xl">
  
          Cargando hojas de servicio...
  
        </div>
  
      </div>
  
    );
  
  }

  const pendientes =
  sheets.filter(
    (sheet) =>
      sheet.status === "pending"
  ).length;

const completadas =
  sheets.filter(
    (sheet) =>
      sheet.status === "completed"
  ).length;

return (


    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        

        <div className="mb-8 flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">

            <ClipboardList size={22} />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">

              Mis Hojas de Servicio

            </h1>

            <p className="mt-1 text-sm text-gray-500">

              Ejecución operativa técnica

            </p>

          </div>

        </div>
        <div className="mb-6 grid gap-4 md:grid-cols-3">

  <div className="rounded-[24px] bg-white p-6 shadow-sm">

    <p className="text-sm text-gray-500">

      Total

    </p>

    <h2 className="mt-2 text-4xl font-bold">

      {sheets.length}

    </h2>

  </div>

  <div className="rounded-[24px] border border-yellow-200 bg-yellow-50 p-6 shadow-sm">

    <p className="text-sm text-yellow-700">

      Pendientes

    </p>

    <h2 className="mt-2 text-4xl font-bold text-yellow-700">

      {pendientes}

    </h2>

  </div>

  <div className="rounded-[24px] border border-green-200 bg-green-50 p-6 shadow-sm">

    <p className="text-sm text-green-700">

      Completadas

    </p>

    <h2 className="mt-2 text-4xl font-bold text-green-700">

      {completadas}

    </h2>

  </div>

</div>

<div className="mb-6 grid gap-4 lg:grid-cols-4">

  {/* BUSCADOR EMPRESA */}

  <input
    type="text"
    placeholder="Buscar empresa..."
    value={searchCompany}
    onChange={(e) =>
      setSearchCompany(
        e.target.value
      )
    }
    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
  />

  {/* FECHA */}

  <input
    type="date"
    value={dateFilter}
    onChange={(e) =>
      setDateFilter(
        e.target.value
      )
    }
    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
  />

  {/* ESTADO */}

  <select
    value={filter}
    onChange={(e) =>
      setFilter(
        e.target.value
      )
    }
    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
  >

    <option value="all">

      Todos los estados

    </option>

    <option value="pending">

      Pendientes

    </option>

    <option value="completed">

      Completadas

    </option>

  </select>

  {/* LIMPIAR */}

  <button
    onClick={() => {

      setSearchCompany("");

      setDateFilter("");

      setFilter("all");

    }}
    className="rounded-xl bg-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-300"
  >

    Limpiar filtros

  </button>

</div>

        {/* EMPTY */}

        {sheets.length === 0 && (

          <div className="rounded-[24px] bg-white p-10 text-center shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">

              No tienes hojas asignadas

            </h2>

            <p className="mt-2 text-sm text-gray-500">

              Cuando un administrador te asigne hojas de servicio aparecerán aquí.

            </p>

          </div>

        )}

        {/* TABLE */}

        {sheets.length > 0 && (

          <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full table-auto">

                <thead className="bg-gray-50">

                  <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                    <th className="px-4 py-3">

                      Empresa

                    </th>

                    <th className="px-4 py-3">

                      Fecha

                    </th>

                    <th className="px-4 py-3">

                      Items

                    </th>

                    <th className="px-4 py-3">

                      Estado

                    </th>

                    <th className="px-4 py-3">

                      Acción

                    </th>

                  </tr>

                </thead>

                <tbody>

                {sheets
    .filter((sheet) => {

      const coincideEmpresa =
    
        sheet.company_name
          ?.toLowerCase()
          .includes(
            searchCompany.toLowerCase()
          );
    
      const coincideFecha =
    
        dateFilter === ""
    
        ||
    
        sheet.service_date ===
        dateFilter;
    
      const coincideEstado =
    
        filter === "all"
    
        ||
    
        sheet.status ===
        filter;
    
      return (
    
        coincideEmpresa
    
        &&
    
        coincideFecha
    
        &&
    
        coincideEstado
    
      );
    
    })
    .map(
      (sheet) => (

                      <tr
  key={sheet.id}
  className={`border-t text-sm ${
    sheet.status ===
    "completed"
      ? "bg-green-50"
      : "hover:bg-gray-50"
  }`}
>

                        <td className="px-4 py-4 font-semibold text-gray-900">

                          {
                            sheet.company_name
                          }

                        </td>

                        <td className="px-4 py-4 text-gray-700">

                          {
                            sheet.service_date
                          }

                        </td>

                        <td className="px-4 py-4 text-gray-700">

                          {
                            sheet.items?.length || 0
                          }

                        </td>

                        <td className="px-4 py-4">

                          {sheet.status ===
                          "completed" ? (

                            <span className="rounded-xl bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                              Completada

                            </span>

                          ) : (

                            <span className="rounded-xl bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">

                              Pendiente

                            </span>

                          )}

                        </td>

                        <td className="px-4 py-4">

                        {sheet.status === "completed" ? (

<button
  onClick={() => {

    setSelectedSheet(sheet);

    setShowViewModal(true);

  }}
  className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
>

  Ver hoja

  <ArrowRight size={14} />

</button>

) : (

  <Link
    href={`/company-dashboard/service-sheets/${sheet.id}`}
    className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
  >

    Responder hoja

    <ArrowRight size={14} />

  </Link>

)}

</td>
                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

)}

</div>

{/* ===========================
    MODAL VER HOJA
============================ */}

{showViewModal && selectedSheet && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

<div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">

      {/* HEADER */}

      <div className="flex items-center justify-between border-b p-6">

        <div>

          <h2 className="text-2xl font-bold">

            Hoja de Servicio

          </h2>

          <p className="text-sm text-gray-500">

            Información registrada

          </p>

        </div>

        <button
          onClick={() => {

            setShowViewModal(false);

            setSelectedSheet(null);

          }}
          className="rounded-xl bg-gray-100 px-4 py-2 hover:bg-gray-200"
        >

          Cerrar

        </button>

      </div>
      <div className="flex-1 overflow-y-auto">

      {/* INFORMACIÓN */}

      <div className="grid gap-6 p-6 md:grid-cols-2">

        <div>

          <p className="text-sm text-gray-500">

            Empresa

          </p>

          <p className="font-semibold">

            {selectedSheet.company_name}

          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">

            Fecha

          </p>

          <p className="font-semibold">

            {selectedSheet.service_date}

          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">

            Estado

          </p>

          <span
            className={`inline-flex rounded-xl px-3 py-1 text-xs font-semibold ${
              selectedSheet.status === "completed"

                ? "bg-green-100 text-green-700"

                : "bg-yellow-100 text-yellow-700"

            }`}
          >

            {selectedSheet.status}

          </span>

        </div>

        <div>

          <p className="text-sm text-gray-500">

            Total de Items

          </p>

          <p className="font-semibold">

            {selectedSheet.items?.length || 0}

          </p>

        </div>

      </div>

      <div className="border-t p-6">

<h3 className="mb-5 text-xl font-bold">

  Items del Servicio

</h3>

<div className="space-y-4">

{selectedSheet.items?.map((item: any, index: number) => (

<div
  key={index}
  className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
>

  <h4 className="mb-4 text-lg font-bold">

    Área #{index + 1}

  </h4>

  <div className="grid gap-4 md:grid-cols-2">

    <div>

      <p className="text-sm text-gray-500">

        Área

      </p>

      <p className="font-semibold">

        {item.area || "-"}

      </p>

    </div>

    <div>

      <p className="text-sm text-gray-500">

        Plaga observada

      </p>

      <p className="font-semibold">

        {item.observed_pest || "-"}

      </p>

    </div>

    <div>

      <p className="text-sm text-gray-500">

        Producto utilizado

      </p>

      <p className="font-semibold">

        {item.product_used || "-"}

      </p>

    </div>

    <div>

      <p className="text-sm text-gray-500">

        Dosificación

      </p>

      <p className="font-semibold">

        {item.dosage || "-"}

      </p>

    </div>

    <div>

      <p className="text-sm text-gray-500">

        Área tratada

      </p>

      <p className="font-semibold">

        {item.treated_area || "-"}

      </p>

    </div>

    <div>

      <p className="text-sm text-gray-500">

        Métodos de aplicación

      </p>

      <div className="mt-2 flex flex-wrap gap-2">

        {item.application_methods?.map((method: string) => (

          <span
            key={method}
            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
          >

            {method}

          </span>

        ))}

      </div>

    </div>

  </div>

</div>

))}

</div>

<div className="mt-8 grid gap-5 md:grid-cols-2">

  <div className="rounded-2xl bg-gray-50 p-5">

    <p className="text-sm text-gray-500">

      Observaciones Administrador

    </p>

    <p className="mt-2">

      {selectedSheet.admin_observations || "-"}

    </p>

  </div>

  <div className="rounded-2xl bg-gray-50 p-5">

    <p className="text-sm text-gray-500">

      Observaciones Técnico

    </p>

    <p className="mt-2">

    {selectedSheet.technician_execution_observations || "-"}

    </p>

  </div>

</div>

</div>

    </div>

  </div>
  </div>

)}

</div>

);
}