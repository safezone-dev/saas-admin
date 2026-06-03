"use client";

import { useEffect, useState } from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { supabase }
from "@/lib/supabase";

// FORMULARIOS
import RodentMonitoringForm
from "@/components/forms/RodentMonitoringForm";

import MothMonitoringForm
from "@/components/forms/MothMonitoringForm";

import FlyingInsectsMonitoringForm
from "@/components/forms/FlyingInsectsMonitoringForm";

import FlyMonitoringForm
from "@/components/forms/FlyMonitoringForm";

import CrawlingInsectsMonitoringForm
from "@/components/forms/CrawlingInsectsMonitoringForm";

import TechnicalServiceReportExecutionForm
from "@/components/forms/TechnicalServiceReportExecutionForm";

import PesticideAdministrationForm
from "@/components/forms/PesticideAdministrationForm";

export default function DynamicFormPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const orderId =
    params.id as string;

  const [loading,
    setLoading] =
    useState(true);

  const [order,
    setOrder] =
    useState<any>(null);

  const [serviceType,
    setServiceType] =
    useState("");

  useEffect(() => {

    if (orderId) {

      loadOrder();

    }

  }, [orderId]);

  async function loadOrder() {

    try {

      setLoading(true);

      const { data, error }
        = await supabase
          .from(
            "work_orders"
          )
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
            "id",
            orderId
          )
          .single();

      if (error) {

        console.log(error);

        alert(
          "Error cargando orden"
        );

        return;
      }

      if (!data) {

        alert(
          "Orden no encontrada"
        );

        return;
      }

      setOrder(data);

      const serviceName =
        (
          data.service_types
            ?.name || ""
        )
          .trim()
          .toLowerCase();

      console.log(
        "SERVICIO:",
        serviceName
      );

      // =========================
      // POLILLEROS
      // =========================
      if (
        serviceName ===
        "monitoreo de polilleros"
      ) {

        setServiceType(
          "polilleros"
        );
      }

      // =========================
      // ROEDORES
      // =========================
      else if (
        serviceName ===
        "monitoreo de roedores"
      ) {

        setServiceType(
          "roedores"
        );
      }

      // =========================
      // INSECTOS VOLADORES
      // =========================
      else if (
        serviceName ===
        "monitoreo de insectos voladores"
      ) {

        setServiceType(
          "insectos_voladores"
        );
      }

      // =========================
      // MOSCAS
      // =========================
      else if (
        serviceName ===
        "monitoreo de moscas"
      ) {

        setServiceType(
          "moscas"
        );
      }

      // =========================
      // RASTREROS
      // =========================
      else if (
        serviceName ===
        "monitoreo de insectos rastreros"
      ) {

        setServiceType(
          "rastreros"
        );
      }

      // =========================
      // ADMINISTRACION DE PLAGUICIDAS
      // =========================
      else if (
        serviceName ===
        "administración de plaguicidas"
      ||
  serviceName ===
  "administracion de plaguicidas"
) {

  setServiceType(
    "plaguicidas"
  );
}

      // =========================
      // REPORTE TECNICO
      // =========================
      else if (
        serviceName ===
        "reporte de servicio técnico"
      ) {

        setServiceType(
          "reporte_tecnico"
        );
      }

      // =========================
      // DEFAULT
      // =========================
      else {

        setServiceType(
          "default"
        );
      }

    } catch (error) {

      console.log(error);

      alert(
        "Error cargando formulario"
      );

    } finally {

      setLoading(false);

    }
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-100">

        <div className="rounded-2xl bg-white px-8 py-6 text-sm font-semibold shadow-sm">

          Cargando formulario...

        </div>

      </div>
    );
  }

  // =========================
  // SIN ORDEN
  // =========================
  if (!order) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-100">

        <div className="rounded-2xl bg-white px-8 py-6 text-sm font-semibold shadow-sm">

          Orden no encontrada

        </div>

      </div>
    );
  }

  // =========================
  // FORM POLILLEROS
  // =========================
  if (
    serviceType ===
    "polilleros"
  ) {

    return (

      <MothMonitoringForm
        order={order}
      />

    );
  }

  // =========================
  // FORM ROEDORES
  // =========================
  if (
    serviceType ===
    "roedores"
  ) {

    return (

      <RodentMonitoringForm
        order={order}
      />

    );
  }

  // =========================
  // FORM INSECTOS VOLADORES
  // =========================
  if (
    serviceType ===
    "insectos_voladores"
  ) {

    return (

      <FlyingInsectsMonitoringForm
        order={order}
      />

    );
  }

  // =========================
  // FORM MOSCAS
  // =========================
  if (
    serviceType ===
    "moscas"
  ) {

    return (

      <FlyMonitoringForm
        order={order}
      />

    );
  }

  // =========================
  // FORM RASTREROS
  // =========================
  if (
    serviceType ===
    "rastreros"
  ) {

    return (

      <CrawlingInsectsMonitoringForm
        order={order}
      />

    );
  }

  // =========================
  // FORM REPORTE TECNICO
  // =========================
  if (
    serviceType ===
    "reporte_tecnico"
  ) {

    return (

      <TechnicalServiceReportExecutionForm
        order={order}
      />

    );
  }

  // =========================
// FORM PLAGUICIDAS
// =========================
if (
  serviceType ===
  "plaguicidas"
) {

  return (

    <PesticideAdministrationForm
      order={order}
    />

  );
}

  // =========================
  // DEFAULT
  // =========================
  return (

    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">

      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 text-center shadow-sm">

        <h1 className="text-2xl font-bold text-gray-900">

          Servicio no configurado

        </h1>

        <p className="mt-3 text-sm text-gray-500">

          Este servicio aún no tiene un formulario asociado.

        </p>

        <button
          onClick={() =>
            router.push(
              "/company-dashboard/pending-orders"
            )
          }
          className="mt-6 rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white"
        >

          Regresar

        </button>

      </div>

    </div>
  );
}