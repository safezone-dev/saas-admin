"use client";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { useReactToPrint } from "react-to-print";

export default function PesticidesReportPage() {

  const params = useParams();

  const id = params.id as string;

  const [report, setReport] =
    useState<any>(null);

  const [products, setProducts] =
    useState<any[]>([]);

  const [workOrder, setWorkOrder] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const printRef =
    useRef<HTMLDivElement>(null);

  const handlePrint =
    useReactToPrint({
      contentRef: printRef,
      documentTitle:
        `Administracion_Plaguicidas_${report?.fecha_inicio || ""}`,
    });

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {

    try {

      const {
        data: reportData,
        error: reportError,
      } =
        await supabase
          .from(
            "administracion_plaguicidas"
          )
          .select("*")
          .eq(
            "orden_trabajo_id",
            id
          )
          .single();

      console.log(
        "REPORT",
        reportData
      );

      console.log(
        "REPORT ERROR",
        reportError
      );

      if (
        reportError ||
        !reportData
      ) {

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
          .eq(
            "id",
            id
          )
          .single();

      console.log(
        "WORK ORDER",
        workOrderData
      );

      console.log(
        "WORK ORDER ERROR",
        workOrderError
      );

      const {
        data: productsData,
        error: productsError,
      } =
        await supabase
          .from(
            "administracion_plaguicidas_detalle"
          )
          .select("*")
          .eq(
            "aplicacion_id",
            reportData.id
          );

      console.log(
        "PRODUCTS",
        productsData
      );

      console.log(
        "PRODUCTS ERROR",
        productsError
      );

      setReport(
        reportData
      );

      setWorkOrder(
        workOrderData
      );

      setProducts(
        productsData || []
      );

      setLoading(false);

    } catch (error) {

      console.error(error);

      setLoading(false);

    }

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

  const totalProductos =
    products.length;

  const totalAspersion =
    products.filter(
      p => p.aspersion
    ).length;

  const totalCebos =
    products.filter(
      p => p.cebos
    ).length;

  const totalAreas =
    new Set(
      products.map(
        p => p.area_tratada
      )
    ).size;

  return (

    <div
      ref={printRef}
      className="mx-auto w-full max-w-7xl space-y-6 overflow-x-hidden px-3 py-4 md:px-6"
    >

      <div className="flex justify-end">

        <button
          onClick={handlePrint}
          className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
        >
          Descargar PDF
        </button>

      </div>

      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <h1 className="text-3xl font-bold">

          Administración de Plaguicidas

        </h1>

        <p className="mt-2 text-gray-500">

          Fecha:
          {" "}
          {report.fecha_inicio}

        </p>

      </div>

      <div className="rounded-[24px] bg-white p-6 shadow-sm">

  <h2 className="mb-5 text-lg font-bold">
    Información del Servicio
  </h2>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

    <InfoField
      label="Empresa"
      value={
        workOrder?.companies?.company_name
      }
    />

    <InfoField
      label="Técnico"
      value={
        workOrder?.technicians?.full_name
      }
    />

    <InfoField
      label="Correo"
      value={
        workOrder?.technicians?.email
      }
    />

    <InfoField
      label="Teléfono"
      value={
        workOrder?.technicians?.phone
      }
    />

  </div>

</div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        <Card
          title="Productos"
          value={totalProductos}
        />

        <Card
          title="Aspersión"
          value={totalAspersion}
        />

        <Card
          title="Cebos"
          value={totalCebos}
        />

        <Card
          title="Áreas"
          value={totalAreas}
        />

      </div>

      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-lg font-bold">

          Información General

        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <InfoField
            label="Fecha"
            value={report.fecha_inicio}
          />

          <InfoField
            label="Hora Inicio"
            value={report.hora_inicio}
          />

          <InfoField
            label="Hora Final"
            value={report.hora_final}
          />

          <InfoField
            label="Frecuencia"
            value={report.frecuencia}
          />

        </div>

      </div>

      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-bold">

          Productos Aplicados

        </h2>

        <div className="space-y-4">

        {products.map((product) => (

<div
  key={product.id}
  className="rounded-2xl border bg-gray-50 p-5"
>

  <div className="mb-4 border-b pb-3">

    <h3 className="text-lg font-bold">

      {product.nombre_producto}

    </h3>

    <p className="text-sm text-gray-500">

      Registro:
      {" "}
      {product.numero_registro}

    </p>

  </div>

  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

    <InfoField
      label="Organismo Meta"
      value={product.organismo_meta}
    />

    <InfoField
      label="Cantidad"
      value={product.cantidad_usada}
    />

    <InfoField
      label="Dosis"
      value={product.dosis}
    />

    <InfoField
      label="Área Tratada"
      value={product.area_tratada}
    />

  </div>

  <div className="mt-4 flex flex-wrap gap-2">

    {product.aspersion && (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs">
        Aspersión
      </span>
    )}

    {product.laqueo && (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs">
        Laqueo
      </span>
    )}

    {product.cebos && (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs">
        Cebos
      </span>
    )}

    {product.planchas_goma && (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs">
        Planchas Goma
      </span>
    )}

    {product.espolvoreo && (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs">
        Espolvoreo
      </span>
    )}

    {product.nebulizacion && (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs">
        Nebulización
      </span>
    )}

    {product.termonebulizacion && (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs">
        Termonebulización
      </span>
    )}

  </div>

  {product.observaciones && (

    <div className="mt-4 rounded-xl bg-white p-4">

      <p className="mb-1 text-xs font-semibold text-gray-500">
        Observaciones
      </p>

      <p className="text-sm text-gray-700">
        {product.observaciones}
      </p>

    </div>

  )}

</div>


))}

</div>

</div>

{/* OBSERVACIONES GENERALES */}

<div className="rounded-[24px] bg-white p-6 shadow-sm">

  <h2 className="mb-5 text-lg font-bold">

    Observaciones Generales

  </h2>

  <p className="text-gray-700">

    {report.observaciones_generales ||
      "Sin observaciones"}

  </p>

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