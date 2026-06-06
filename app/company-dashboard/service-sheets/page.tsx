"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { supabase }
from "@/lib/supabase";

import {
  ClipboardList,
  ArrowRight,
} from "lucide-react";

export default function TechnicianSheetsPage() {

  const [sheets,
    setSheets] =
    useState<any[]>([]);

  useEffect(() => {

    loadSheets();

  }, []);

  async function loadSheets() {

    const technician =
      JSON.parse(
        localStorage.getItem(
          "technician"
        ) || "{}"
      );
  
    console.log(
      "TECHNICIAN:",
      technician
    );
  
    if (!technician?.id) {
  
      console.log(
        "NO TECHNICIAN ID"
      );
  
      return;
    }
  
    const { data, error } =
      await supabase
        .from(
          "service_sheets"
        )
        .select(`
          *,
          companies (
            company_name
          )
        `)
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
  
    console.log(
      "DATA:",
      data
    );
  
    console.log(
      "ERROR:",
      error
    );
  
    if (error) {
  
      console.log(error);
  
      return;
    }
  
    if (data) {
  
      setSheets(data);
  
    }
  }

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
                        className="border-t border-gray-100 text-sm hover:bg-gray-50"
                      >

                        {/* EMPRESA */}
                        <td className="px-4 py-4 font-semibold text-gray-900">

                          {
                            sheet.companies
                              ?.company_name
                          }

                        </td>

                        {/* FECHA */}
                        <td className="px-4 py-4 text-gray-700">

                          {
                            sheet.service_date
                          }

                        </td>

                        {/* ITEMS */}
                        <td className="px-4 py-4 text-gray-700">

                          {
                            sheet.items?.length || 0
                          }

                        </td>

                        {/* ESTADO */}
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

                        {/* ACTION */}
                        <td className="px-4 py-4">

                          <Link
                            href={`/company-dashboard/service-sheets/${sheet.id}`}
                            className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                          >

                            Responder hoja

                            <ArrowRight
                              size={14}
                            />

                          </Link>

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