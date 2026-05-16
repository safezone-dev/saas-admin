"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import { supabase }
from "@/lib/supabase";

import TechnicalServiceReportAdminForm
from "@/components/forms/TechnicalServiceReportAdminForm";

export default function CreateTechnicalReportPage() {

  const params =
    useParams();

  const [loading,
    setLoading] =
    useState(true);

  const [order,
    setOrder] =
    useState<any>(null);

  useEffect(() => {

    if (params?.id) {

      loadOrder();

    }

  }, [params]);

  async function loadOrder() {

    try {

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
            params.id
          )
          .single();

      if (error) {

        console.log(error);

        return;
      }

      setOrder(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-100">

        Cargando...

      </div>
    );
  }

  if (!order) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-100">

        Orden no encontrada

      </div>
    );
  }

  return (

    <TechnicalServiceReportAdminForm
      order={order}
    />

  );
}