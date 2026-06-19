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
          "monitoreo_moscas"
        )
        .select("*")
        .eq(
          "orden_trabajo_id",
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
  
    const {
      data: stationsData,
      error: stationsError,
    } =
      await supabase
        .from(
          "monitoreo_moscas_estaciones"
        )
        .select("*")
        .eq(
          "monitoreo_id",
          reportData.id
        )
        .order(
          "numero_estacion",
          {
            ascending: true,
          }
        );
  
    if (stationsError) {
  
      console.log(stationsError);
  
    }
  
    setReport(reportData);
  
    setWorkOrder(
      workOrderData
    );
  
    setStations(
      stationsData || []
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

  const totalMoscas =
  stations.reduce(
    (
      total,
      station
    ) =>
      total +
      (station.conteo_moscas || 0),
    0
  );

const estacionesConCaptura =
  stations.filter(
    (station) =>
      station.conteo_moscas > 0
  ).length;

const estacionesSinCaptura =
  stations.filter(
    (station) =>
      station.conteo_moscas === 0
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

        Monitoreo de Moscas

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
      <div className="grid gap-4 md:grid-cols-3">

      <Card
  title="Estaciones"
  value={stations.length}
/>

<Card
  title="Moscas Capturadas"
  value={totalMoscas}
/>

<Card
  title="Estaciones con Captura"
  value={estacionesConCaptura}
/>

<Card
  title="Sin Captura"
  value={estacionesSinCaptura}
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
    report.fecha_registro
  }
/>

<InfoField
  label="Hora inicio"
  value={
    report.hora_inicio
  }
/>

<InfoField
  label="Hora final"
  value={
    report.hora_final
  }
/>

<InfoField
  label="Frecuencia"
  value={
    report.frecuencia
  }
/>

<InfoField
  label="Con Actividad"
  value={
    report.con_actividad
      ? "Sí"
      : "No"
  }
/>

<InfoField
  label="Sin Actividad"
  value={
    report.sin_actividad
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
      ? "⚠️ Actividad de Moscas Detectada"
      : "✅ Sin Actividad Detectada"}

  </h3>

  <p className="mt-2 text-sm text-gray-600">

    {report.activity_detected
      ? "Durante la inspección se detectó captura de moscas en una o más estaciones."
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
            Estación {station.numero_estacion}
          </h3>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              station.conteo_moscas > 0
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >

            {station.conteo_moscas > 0
              ? "Captura Detectada"
              : "Sin Captura"}

          </span>

        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <InfoField
            label="Moscas Capturadas"
            value={station.conteo_moscas}
          />

          <InfoField
            label="Feromona"
            value={
              station.feromona_aplicado
                ? "Aplicada"
                : "No Aplicada"
            }
          />

          <InfoField
            label="Dispositivo"
            value={
              station.dispositivo_funcional
                ? "Funcional"
                : station.dispositivo_danado
                ? "Dañado"
                : "-"
            }
          />

          <InfoField
            label="Mantenimiento"
            value={
              station.mantenimiento_si
                ? "Sí"
                : "No"
            }
          />

        </div>

        {station.observaciones && (

          <div className="mt-4 rounded-xl bg-white p-4">

            <p className="mb-1 text-xs font-semibold text-gray-500">
              Observaciones
            </p>

            <p className="text-sm text-gray-700">
              {station.observaciones}
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
            station.numero_estacion
          }

        </p>

        <p className="mt-1 text-sm text-gray-600">

          {
            station.observaciones ||
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