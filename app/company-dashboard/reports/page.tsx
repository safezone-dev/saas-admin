"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  BarChart3,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  TrendingUp,
  Building2,
  Printer,
  Download,
} from "lucide-react";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

export default function ReportsPage() {

  const reportRef =
    useRef<HTMLDivElement>(
      null
    );

  const [technician,
    setTechnician] =
    useState<any>(null);

  const [pendingOrders,
    setPendingOrders] =
    useState<any[]>([]);

  const [completedOrders,
    setCompletedOrders] =
    useState<any[]>([]);

  const [companies,
    setCompanies] =
    useState<string[]>([]);

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {

    const technicianData =
      localStorage.getItem(
        "technician"
      );

    if (!technicianData)
      return;

    const technicianParsed =
      JSON.parse(
        technicianData
      );

    setTechnician(
      technicianParsed
    );

    const { data } =
      await supabase
        .from("work_orders")
        .select(`
          *,
          companies (
            company_name
          ),
          service_types (
            name
          )
        `)
        .eq(
          "technician_id",
          technicianParsed.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (!data) return;

    const pending =
      data.filter(
        (o) =>
          o.status !==
          "completed"
      );

    const completed =
      data.filter(
        (o) =>
          o.status ===
          "completed"
      );

    setPendingOrders(
      pending
    );

    setCompletedOrders(
      completed
    );

    const uniqueCompanies =
      [...new Set(
        data.map(
          (o: any) =>
            o.companies
              ?.company_name
        )
      )];

    setCompanies(
      uniqueCompanies as string[]
    );
  }

  const totalOrders =
    pendingOrders.length +
    completedOrders.length;

  const effectiveness =
    totalOrders > 0
      ? Math.round(
          (
            completedOrders.length /
            totalOrders
          ) * 100
        )
      : 0;

  async function downloadPDF() {

    if (!reportRef.current)
      return;

    const canvas =
      await html2canvas(
        reportRef.current,
        {
          scale: 2,
        }
      );

    const imgData =
      canvas.toDataURL(
        "image/png"
      );

    const pdf =
      new jsPDF(
        "p",
        "mm",
        "a4"
      );

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height *
        pdfWidth) /
      canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save(
      "reporte-tecnico.pdf"
    );
  }

  function printReport() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">

      {/* ACTIONS */}
      <div className="mb-6 flex flex-wrap gap-3">

        <button
          onClick={downloadPDF}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white"
        >

          <Download size={16} />

          Descargar PDF

        </button>

        <button
          onClick={printReport}
          className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-xs font-semibold text-white"
        >

          <Printer size={16} />

          Imprimir

        </button>

        <a
          href="/company-dashboard"
          className="inline-flex items-center gap-2 rounded-2xl bg-gray-200 px-5 py-3 text-xs font-semibold text-gray-700"
        >

          <ArrowLeft size={16} />

          Regresar

        </a>

      </div>

      {/* REPORT */}
      <div ref={reportRef}>

        {/* HEADER */}
        <div className="mb-6 rounded-[24px] bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-blue-100 p-4">

              <BarChart3
                size={22}
                className="text-blue-700"
              />

            </div>

            <div>

              <h1 className="text-xl font-bold text-gray-900">
                Reporte General Técnico
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                Resumen operativo general
              </p>

            </div>

          </div>

        </div>

        {/* INFO */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">

          <InfoCard
            title="Técnico"
            value={
              technician?.name ||
              "-"
            }
          />

          <InfoCard
            title="Correo"
            value={
              technician?.email ||
              "-"
            }
          />

          <InfoCard
            title="Empresas"
            value={
              companies.length
            }
          />

        </div>

        {/* METRICS */}
        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">

          <MetricCard
            title="Pendientes"
            value={
              pendingOrders.length
            }
            icon={
              <ClipboardList
                size={18}
              />
            }
            color="yellow"
          />

          <MetricCard
            title="Respondidas"
            value={
              completedOrders.length
            }
            icon={
              <CheckCircle2
                size={18}
              />
            }
            color="green"
          />

          <MetricCard
            title="Empresas"
            value={
              companies.length
            }
            icon={
              <Building2
                size={18}
              />
            }
            color="blue"
          />

          <MetricCard
            title="Efectividad"
            value={`${effectiveness}%`}
            icon={
              <TrendingUp
                size={18}
              />
            }
            color="purple"
          />

        </div>

        {/* TABLE */}
        <div className="rounded-[24px] bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-2">

            <CheckCircle2
              size={18}
              className="text-green-600"
            />

            <h2 className="text-sm font-bold text-gray-900">
              Últimas Actividades Respondidas
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead className="bg-gray-50">

                <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

                  <th className="px-4 py-3">
                    Empresa
                  </th>

                  <th className="px-4 py-3">
                    Servicio
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

                {completedOrders
                  .slice(0, 10)
                  .map(
                    (
                      order: any
                    ) => (
                      <tr
                        key={
                          order.id
                        }
                        className="border-b border-gray-100 text-sm"
                      >

                        <td className="px-4 py-4 font-medium text-gray-900">

                          {
                            order
                              .companies
                              ?.company_name
                          }

                        </td>

                        <td className="px-4 py-4 text-gray-600">

                          {
                            order
                              .service_types
                              ?.name
                          }

                        </td>

                        <td className="px-4 py-4 text-gray-600">

                          {
                            order.scheduled_date
                          }

                        </td>

                        <td className="px-4 py-4">

                          <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                            Respondido
                          </span>

                        </td>

                      </tr>
                    )
                  )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
}: any) {

  const styles =
    color === "green"
      ? "bg-green-50 text-green-900"
      : color === "yellow"
      ? "bg-yellow-50 text-yellow-900"
      : color === "purple"
      ? "bg-purple-50 text-purple-900"
      : "bg-blue-50 text-blue-900";

  return (
    <div className={`rounded-[24px] p-5 ${styles}`}>

      <div className="flex items-center justify-between">

        <p className="text-[11px] font-semibold uppercase tracking-wide">
          {title}
        </p>

        {icon}

      </div>

      <h2 className="mt-4 text-3xl font-bold">
        {value}
      </h2>

    </div>
  );
}

function InfoCard({
  title,
  value,
}: any) {

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">

      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-sm font-bold text-gray-900">
        {value}
      </h2>

    </div>
  );
}