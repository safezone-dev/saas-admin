"use client";

import {
    useEffect,
    useState,
    useRef,
  } from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { useReactToPrint } from "react-to-print";

import {
  ShieldAlert,
} from "lucide-react";

export default function RodentReportPage() {

  const params =
    useParams();

  const id =
    params.id;

  const [report,
    setReport] =
    useState<any>(null);

  const [stations,
    setStations] =
    useState<any[]>([]);

    const [workOrder,
    setWorkOrder] =
    useState<any>(null);

  const [loading,
    setLoading] =
    useState(true);

    const printRef =
    useRef<HTMLDivElement>(null);
    const handlePrint =
  useReactToPrint({
    contentRef: printRef,
    documentTitle:
      `Reporte_Roedores_${report?.register_date || ""}`,
  });

  useEffect(() => {

    loadReport();

  }, []);

  async function loadReport() {

    const {
      data: reportData,
      error: reportError,
    } =
      await supabase
        .from(
          "rodent_monitoring_forms"
        )
        .select("*")
        .eq(
          "work_order_id",
          id
        )
        .single();
  
    if (reportError) {
  
      console.log(reportError);
  
      setLoading(false);
  
      return;
    }
  
    const {
      data: workOrderData,
      error: workOrderError,
    } =
      await supabase
        .from("work_orders")
        .select(`
          *,
          companies (
            company_name
          ),
          technicians (
            full_name,
            email,
            phone
          )
        `)
        .eq("id", id)
        .single();
  
    if (workOrderError) {
  
      console.log(workOrderError);
  
    }
  
    setReport(reportData);
  
    setWorkOrder(
      workOrderData
    );
  
    setStations(
      reportData?.stations || []
    );
  
    setLoading(false);
  }

  if (loading) {

    return (
      <div className="p-10">
        Cargando...
      </div>
    );
  }

  if (!report) {

    return (
      <div className="p-10">
        Reporte no encontrado
      </div>
    );
  }

  const stationsWithPresence =
    stations.filter(
      (s) =>
        s.rodent_present
    ).length;

  const stationsWithoutPresence =
    stations.filter(
      (s) =>
        s.rodent_not_present
    ).length;

  return (

    <div
    ref={printRef}
    className="mx-auto w-full max-w-7xl space-y-6 overflow-x-hidden px-3 py-4 md:px-6"
  >

<div className="flex justify-end">

<button
  onClick={handlePrint}
  className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
>
  Descargar PDF
</button>

</div>
{/* ENCABEZADO EMPRESA */}
<div className="rounded-[24px] bg-white p-6 shadow-sm">

  <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

    <div className="flex items-center gap-4">

      <img
        src="https://mjr-fumigaciones.com/wp-content/uploads/2026/02/logo_colorm.png"
        alt="Logo"
        className="h-16"
      />

      <div>

        <h1 className="text-2xl font-bold">

          Monitoreo de Roedores

        </h1>

        <p className="text-sm text-gray-500">

          Reporte Técnico de Servicio

        </p>

      </div>

    </div>

    <div className="text-right">

      <p className="text-sm text-gray-500">

        Fecha del Reporte

      </p>

      <p className="font-semibold">

        {report.register_date}
      </p>

    </div>

  </div>

</div>

      {/* EMPRESA Y TÉCNICO */}
<div className="rounded-[24px] bg-white p-6 shadow-sm">

<h2 className="mb-5 text-lg font-bold">

  Información del Servicio

</h2>

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

  <InfoField
    label="Empresa"
    value={
      workOrder?.companies
        ?.company_name
    }
  />

  <InfoField
    label="Técnico"
    value={
      workOrder?.technicians
        ?.full_name
    }
  />

  <InfoField
    label="Correo"
    value={
      workOrder?.technicians
        ?.email
    }
  />

  <InfoField
    label="Teléfono"
    value={
      workOrder?.technicians
        ?.phone
    }
  />

</div>

</div>

      {/* RESUMEN */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">

        <Card
          title="Estaciones"
          value={stations.length}
        />

        <Card
          title="Con presencia"
          value={stationsWithPresence}
        />

        <Card
          title="Sin presencia"
          value={stationsWithoutPresence}
        />

      </div>

      {/* INFORMACIÓN */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-lg font-bold">

          Información General

        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

          <InfoField
            label="Fecha"
            value={
              report.register_date
            }
          />

          <InfoField
            label="Hora inicio"
            value={
              report.start_time
            }
          />

          <InfoField
            label="Hora final"
            value={
              report.end_time
            }
          />

<InfoField
  label="Actividad Detectada"
  value={
    report.activity_detected
      ? "Sí"
      : "No"
  }
/>

<InfoField
  label="Sin Actividad"
  value={
    report.no_activity
      ? "Sí"
      : "No"
  }
/>

        </div>

      </div>

      <div
  className={`rounded-[24px] p-5 shadow-sm ${
    report.activity_detected
      ? "border border-red-200 bg-red-50"
      : "border border-green-200 bg-green-50"
  }`}
>

  <h3 className="text-lg font-bold">

    {report.activity_detected
      ? "⚠️ Actividad de Roedores Detectada"
      : "✅ Sin Actividad Detectada"}

  </h3>

  <p className="mt-2 text-sm text-gray-600">

    {report.activity_detected
      ? "Durante la inspección se detectó actividad en una o más estaciones."
      : "No se detectó actividad durante la inspección."}

  </p>

</div>

{/* ESTACIONES REVISADAS */}

<div className="rounded-[24px] bg-white p-6 shadow-sm">

  <h2 className="mb-5 text-lg font-bold">
    Estaciones Revisadas
  </h2>

  <div className="space-y-4">

    {stations.map((station, index) => (

      <div
        key={index}
        className="rounded-2xl border bg-gray-50 p-5"
      >

        <div className="mb-4 flex items-center justify-between border-b pb-3">

          <h3 className="font-bold text-lg">
            Estación {station.station_number}
          </h3>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              station.rodent_present
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >

            {station.rodent_present
              ? "Presencia Detectada"
              : "Sin Presencia"}

          </span>

        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <InfoField
            label="Presencia"
            value={
              station.rodent_present
                ? "Sí"
                : "No"
            }
          />

          <InfoField
            label="Cebo"
            value={
              station.bait_applied
                ? "Aplicado"
                : "No Aplicado"
            }
          />

          <InfoField
            label="Adhesivo"
            value={
              station.adhesive_functional
                ? "Funcional"
                : station.adhesive_replaced
                ? "Reemplazado"
                : "-"
            }
          />

          <InfoField
            label="Limpieza"
            value={
              station.cleaning
                ? "Sí"
                : "No"
            }
          />

        </div>

        <div className="mt-4 rounded-xl bg-white p-4">

          <p className="mb-2 text-xs font-semibold text-gray-500">
            Consumo Detectado
          </p>

          <p className="text-sm">

            {station.total_consumption
              ? "Consumo Total"
              : station.partial_consumption
              ? "Consumo Parcial"
              : station.deterioration
              ? "Deterioro"
              : station.no_findings
              ? "Sin Hallazgos"
              : "-"}

          </p>

        </div>

        {station.observations && (

          <div className="mt-4 rounded-xl bg-white p-4">

            <p className="mb-1 text-xs font-semibold text-gray-500">
              Observaciones
            </p>

            <p className="text-sm text-gray-700">
              {station.observations}
            </p>

          </div>

        )}

      </div>

    ))}

  </div>

</div>
      {/* OBSERVACIONES */}
<div className="rounded-[24px] bg-white p-6 shadow-sm">

<h2 className="mb-5 text-lg font-bold">

  Observaciones

</h2>

<div className="space-y-3">

  {stations.map(
    (
      station,
      index
    ) => (

      <div
        key={index}
        className="rounded-xl bg-gray-50 p-4"
      >

        <p className="font-semibold">

          Estación {
            station.station_number
          }

        </p>

        <p className="mt-1 text-sm text-gray-600">

          {
            station.observations ||
            "Sin observaciones"
          }

        </p>

      </div>

    )
  )}

</div>

</div>

    </div>



  );
}

function Card({
  title,
  value,
}: any) {

  return (

    <div className="rounded-[24px] bg-white p-5 shadow-sm">

      <p className="text-sm text-gray-500">

        {title}

      </p>

      <h3 className="mt-2 text-3xl font-bold">

        {value}

      </h3>

    </div>

  );
}

function InfoField({
  label,
  value,
}: any) {

  return (

    <div>

      <p className="text-sm text-gray-500">

        {label}

      </p>

      <p className="font-semibold">

        {value || "-"}

      </p>

    </div>

  );
}