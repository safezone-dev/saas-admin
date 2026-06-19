"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

import FliesReport from "./components/FliesReport";

import TechnicalReport from "./components/TechnicalReport";

import RodentReport from "./components/RodentReport";


export default function ClientReportPage() {

  const params = useParams();

  const id = params.id;

  const [order, setOrder] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadOrder();

  }, []);

  async function loadOrder() {

    const { data, error } =
      await supabase
        .from("work_orders")
        .select(`
          *,
          service_types (
            name
          ),
          technicians (
            name
          )
        `)
        .eq("id", id)
        .single();

    setLoading(false);

    if (error) {

      console.log(error);

      return;
    }

    setOrder(data);
  }

  if (loading) {

    return (
      <div className="p-10">
        Cargando reporte...
      </div>
    );
  }

  if (!order) {

    return (
      <div className="p-10">
        Reporte no encontrado.
      </div>
    );
  }

  const serviceName =
    order.service_types?.name;
    

  return (

    <div className="space-y-6">

      {serviceName ===
        "Monitoreo de Moscas" && (

        <FliesReport
          workOrder={order}
        />

      )}

      {serviceName ===
        "Reporte de Servicio Técnico" && (

        <TechnicalReport
          workOrder={order}
        />

      )}

      {serviceName ===
        "Monitoreo de Roedores" && (

        <RodentReport
          workOrder={order}
  />

)}

      {![
        "Monitoreo de Moscas",
        "Reporte de Servicio Técnico",
        "Monitoreo de Roedores",
      ].includes(serviceName) && (

        <div className="rounded-[24px] bg-white p-10 shadow-sm">

          <h1 className="text-2xl font-bold">

            Reporte no disponible

          </h1>

          <p className="mt-3 text-gray-500">

            Este tipo de servicio aún no
            está habilitado en el portal.

          </p>

        </div>

      )}

    </div>

  );
}