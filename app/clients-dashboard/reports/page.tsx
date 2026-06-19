"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { supabase }
from "@/lib/supabase";

import {
  FileText,
  Download,
} from "lucide-react";

export default function ClientReportsPage() {

  const [reports,
    setReports] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    loadReports();

  }, []);

  async function loadReports() {

    const client =
      JSON.parse(
        localStorage.getItem(
          "client"
        ) || "{}"
      );

    if (!client?.id) {

      setLoading(false);


      return;
    }

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "work_orders"
        )
        .select(`
          *,
          service_types (
            name
          )
        `)
        .eq(
          "company_id",
          client.id
        )
        .eq(
          "status",
          "completed"
        )
        .order(
          "scheduled_date",
          {
            ascending: false,
          }
        );

    setLoading(false);

    if (error) {

      console.log(error);

      return;
    }

    setReports(
      data || []
    );
  }

  /* PEGAR AQUÍ */
function getReportUrl(report: any) {

  const service =
    report.service_types?.name;

  switch (service) {

    case "Monitoreo de Roedores":
      return `/clients-dashboard/reports/rodents/${report.id}`;

    case "Monitoreo de Moscas":
      return `/clients-dashboard/reports/flies/${report.id}`;

    case "Administración de Plaguicidas":
      return `/clients-dashboard/reports/pesticides/${report.id}`;

    case "Monitoreo de Polilleros":
      return `/clients-dashboard/reports/moths/${report.id}`;

    case "Monitoreo de Insectos Rastreros":
      return `/clients-dashboard/reports/crawlers/${report.id}`;

    case "Monitoreo de Insectos Voladores":
      return `/clients-dashboard/reports/flying-insects/${report.id}`;

    case "Reporte de Servicio Técnico":
      return `/clients-dashboard/reports/technical/${report.id}`;

    default:
      return "#";
  }
}

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <FileText
            size={28}
          />

          <div>

            <h1 className="text-2xl font-bold text-gray-900">

              Reportes Técnicos

            </h1>

            <p className="text-sm text-gray-500">

              Historial de servicios completados

            </p>

          </div>

        </div>

      </div>

      {/* EMPTY */}
      {!loading &&
        reports.length === 0 && (

        <div className="rounded-[24px] bg-white p-10 text-center shadow-sm">

          <h2 className="text-xl font-bold">

            No existen reportes disponibles

          </h2>

        </div>

      )}

      {/* TABLE */}
      {reports.length > 0 && (

        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                  <th className="px-4 py-3">

                    Fecha

                  </th>

                  <th className="px-4 py-3">

                    Servicio

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

                {reports.map(
                  (report) => (

                    <tr
                      key={report.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-4 py-4">

                        {
                          report.scheduled_date
                        }

                      </td>

                      <td className="px-4 py-4">

                        {
                          report
                            .service_types
                            ?.name
                        }

                      </td>

                      <td className="px-4 py-4">

                        <span className="rounded-xl bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                          Completado

                        </span>

                      </td>

                      <td className="px-4 py-4">

                      <Link
  href={getReportUrl(report)}
  className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white"
>

                          <Download
                            size={14}
                          />

                          Ver reporte

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

  );
}