"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Clock3,
  CheckCircle2,
  Building2,
  TrendingUp,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function CompanyDashboardPage() {

  const [pendingCount,
    setPendingCount] =
    useState(0);

  const [completedCount,
    setCompletedCount] =
    useState(0);

  const [companiesCount,
    setCompaniesCount] =
    useState(0);

  const [effectiveness,
    setEffectiveness] =
    useState(0);

  const [serviceSheetsCount,
    setServiceSheetsCount] =
    useState(0);

  useEffect(() => {

    loadDashboard();

  }, []);

  async function loadDashboard() {

    try {

      const technicianData =
        localStorage.getItem(
          "technician"
        );

      if (!technicianData)
        return;

      const technician =
        JSON.parse(
          technicianData
        );

      // PENDIENTES
      const {
        count:
          pendingOrders,
      } = await supabase
        .from("work_orders")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "technician_id",
          technician.id
        )
        .neq(
          "status",
          "completed"
        );

      // COMPLETADAS
      const {
        count:
          completedOrders,
      } = await supabase
        .from("work_orders")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "technician_id",
          technician.id
        )
        .eq(
          "status",
          "completed"
        );

      // EMPRESAS
      const { data: companies }
        = await supabase
          .from(
            "work_orders"
          )
          .select(
            "company_id"
          )
          .eq(
            "technician_id",
            technician.id
          );

      const uniqueCompanies =
        [
          ...new Set(
            companies?.map(
              (c: any) =>
                c.company_id
            )
          ),
        ];

      // HOJAS DE SERVICIO
      const {
        count:
          sheetsCount,
      } = await supabase
        .from(
          "service_sheets"
        )
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "technician_id",
          technician.id
        );

      const totalPending =
        pendingOrders || 0;

      const totalCompleted =
        completedOrders || 0;

      const totalOrders =
        totalPending +
        totalCompleted;

      // EFECTIVIDAD
      const efficiency =
        totalOrders > 0
          ? Math.round(
              (totalCompleted /
                totalOrders) *
                100
            )
          : 0;

      setPendingCount(
        totalPending
      );

      setCompletedCount(
        totalCompleted
      );

      setCompaniesCount(
        uniqueCompanies.length
      );

      setEffectiveness(
        efficiency
      );

      setServiceSheetsCount(
        sheetsCount || 0
      );

    } catch (error) {

      console.log(error);

    }
  }

  const cards = [

    {
      title:
        "Órdenes pendientes",

      description:
        "Servicios pendientes por responder",

      value:
        pendingCount,

      icon: Clock3,

      href:
        "/company-dashboard/pending-orders",
    },

    {
      title:
        "Órdenes completadas",

      description:
        "Historial de órdenes respondidas",

      value:
        completedCount,

      icon: CheckCircle2,

      href:
        "/company-dashboard/completed-orders",
    },

    {
      title:
        "Mis Hojas de Servicio",

      description:
        "Hojas asignadas para ejecución",

      value:
        serviceSheetsCount,

      icon: FileText,

      href:
        "/company-dashboard/service-sheets",
    },

    {
      title:
        "Empresas asignadas",

      description:
        "Cantidad de empresas asignadas",

      value:
        companiesCount,

      icon: Building2,

      href:
        "#",
    },

    {
      title:
        "Efectividad",

      description:
        "Porcentaje de efectividad técnica",

      value:
        `${effectiveness}%`,

      icon: TrendingUp,

      href:
        "#",
    },

  ];

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-7xl">

        {/* WELCOME */}
        <div className="mb-8 rounded-[24px] bg-white p-6 shadow-sm">

          <h1 className="text-3xl font-bold text-gray-900">

            Dashboard Técnico

          </h1>

          <p className="mt-2 text-sm text-gray-500">

            Bienvenido al sistema técnico.
            Desde este panel puedes responder órdenes,
            visualizar estadísticas y consultar
            el historial operativo de servicios.

          </p>

        </div>

        {/* GRID */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

          {cards.map((card, index) => {

            const Icon = card.icon;

            return (
              <Link
                key={index}
                href={card.href}
                className="group overflow-hidden rounded-[24px] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* TOP */}
                <div className="mb-5 flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">

                    <Icon size={22} />

                  </div>

                  <div className="text-3xl font-bold text-gray-900">

                    {card.value}

                  </div>

                </div>

                {/* TEXT */}
                <h2 className="text-lg font-bold text-gray-900">

                  {card.title}

                </h2>

                <p className="mt-2 text-sm text-gray-500">

                  {card.description}

                </p>

                {/* LINK */}
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-black">

                  Ver módulo

                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />

                </div>

              </Link>
            );
          })}

        </div>

      </div>

    </div>
  );
}