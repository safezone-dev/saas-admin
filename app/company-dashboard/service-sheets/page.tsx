"use client";


const [filter, setFilter] = useState("all");
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

const [filter,
  setFilter] =
  useState("all");

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

<div className="mb-6 flex gap-3">

  <button
    onClick={() =>
      setFilter("all")
    }
    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
      filter === "all"
        ? "bg-black text-white"
        : "bg-white"
    }`}
  >

    Todas

  </button>

  <button
    onClick={() =>
      setFilter("pending")
    }
    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
      filter === "pending"
        ? "bg-yellow-500 text-white"
        : "bg-white"
    }`}
  >

    Pendientes

  </button>

  <button
    onClick={() =>
      setFilter("completed")
    }
    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
      filter === "completed"
        ? "bg-green-600 text-white"
        : "bg-white"
    }`}
  >

    Completadas

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

                  {sheets.map(
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

                        {sheet.status ===
"completed" ? (

  <Link
    href={`/company-dashboard/service-sheets/${sheet.id}`}
    className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
  >

    Ver hoja

    <ArrowRight size={14} />

  </Link>

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

    </div>

  );
}