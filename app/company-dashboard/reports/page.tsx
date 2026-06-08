"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  BarChart3,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  TrendingUp,
  Building2,
  User,
  Mail,
  Briefcase,
} from "lucide-react";

export default function ReportsPage() {

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

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-900">

              Reportes Técnicos

            </h1>

            <p className="mt-1 text-sm text-gray-500">

              Métricas y rendimiento operativo del técnico

            </p>

          </div>

          <Link
            href="/company-dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >

            <ArrowLeft size={16} />

            Regresar Dashboard

          </Link>

        </div>

        {/* TECHNICIAN INFO */}
        <div className="mb-8 rounded-[24px] bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">

              <BarChart3 size={24} />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-900">

                Resumen General Técnico

              </h2>

              <p className="mt-1 text-sm text-gray-500">

                Información operativa y desempeño general

              </p>

            </div>

          </div>

          {/* INFO GRID */}
          <div className="grid gap-4 md:grid-cols-3">

            <InfoCard
              title="Técnico"
              value={
                technician
                  ?.full_name ||
                technician?.name ||
                "-"
              }
              icon={
                <User size={18} />
              }
            />

            <InfoCard
              title="Correo"
              value={
                technician?.email ||
                "-"
              }
              icon={
                <Mail size={18} />
              }
            />

            <InfoCard
              title="Empresas asignadas"
              value={
                companies.length
              }
              icon={
                <Briefcase
                  size={18}
                />
              }
            />

          </div>

        </div>

        {/* METRICS */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

          <MetricCard
            title="Órdenes pendientes"
            value={
              pendingOrders.length
            }
            icon={
              <ClipboardList
                size={22}
              />
            }
          />

          <MetricCard
            title="Órdenes respondidas"
            value={
              completedOrders.length
            }
            icon={
              <CheckCircle2
                size={22}
              />
            }
          />

          <MetricCard
            title="Empresas"
            value={
              companies.length
            }
            icon={
              <Building2
                size={22}
              />
            }
          />

          <MetricCard
            title="Total órdenes"
            value={totalOrders}
            icon={
              <BarChart3
                size={22}
              />
            }
          />

          <MetricCard
            title="Efectividad"
            value={`${effectiveness}%`}
            icon={
              <TrendingUp
                size={22}
              />
            }
          />

        </div>

        {/* RESUMEN POR EMPRESA */}

<div className="mb-8 overflow-hidden rounded-[24px] bg-white shadow-sm">

<div className="border-b p-5">

  <h2 className="text-lg font-bold">

    Resumen por Empresa

  </h2>

</div>

<div className="overflow-x-auto">

  <table className="w-full">

    <thead className="bg-gray-50">

      <tr>

        <th className="px-4 py-3 text-left">

          Empresa

        </th>

        <th className="px-4 py-3 text-left">

          Servicios Respondidos

        </th>

      </tr>

    </thead>

    <tbody>

      {companies.map(
        (company) => {

          const total =
            completedOrders.filter(
              (o) =>
                o.companies
                  ?.company_name ===
                company
            ).length;

          return (

            <tr
              key={company}
              className="border-t"
            >

              <td className="px-4 py-3">

                {company}

              </td>

              <td className="px-4 py-3">

                {total}

              </td>

            </tr>

          );

        }
      )}

    </tbody>

  </table>

</div>

</div>

{/* RESUMEN POR SERVICIO */}

<div className="mb-8 overflow-hidden rounded-[24px] bg-white shadow-sm">

<div className="border-b p-5">

  <h2 className="text-lg font-bold">

    Resumen por Servicio

  </h2>

</div>

<div className="overflow-x-auto">

  <table className="w-full">

    <thead className="bg-gray-50">

      <tr>

        <th className="px-4 py-3 text-left">

          Servicio

        </th>

        <th className="px-4 py-3 text-left">

          Cantidad

        </th>

      </tr>

    </thead>

    <tbody>

      {Object.entries(
        serviceSummary
      ).map(
        ([name, total]) => (

          <tr
            key={name}
            className="border-t"
          >

            <td className="px-4 py-3">

              {name}

            </td>

            <td className="px-4 py-3">

              {String(total)}

            </td>

          </tr>

        )
      )}

    </tbody>

  </table>

</div>

</div>

{/* HISTORIAL COMPLETO */}

<div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

<div className="border-b p-5">

  <h2 className="text-lg font-bold">

    Historial Completo

  </h2>

</div>

<div className="overflow-x-auto">

  <table className="w-full">

    <thead className="bg-gray-50">

      <tr>

        <th className="px-4 py-3 text-left">

          Empresa

        </th>

        <th className="px-4 py-3 text-left">

          Servicio

        </th>

        <th className="px-4 py-3 text-left">

          Fecha

        </th>

        <th className="px-4 py-3 text-left">

          Estado

        </th>

      </tr>

    </thead>

    <tbody>

      {completedOrders.map(
        (
          order: any
        ) => (

          <tr
            key={order.id}
            className="border-t"
          >

            <td className="px-4 py-3">

              {
                order
                  .companies
                  ?.company_name
              }

            </td>

            <td className="px-4 py-3">

              {
                order
                  .service_types
                  ?.name
              }

            </td>

            <td className="px-4 py-3">

              {
                order
                  .scheduled_date
              }

            </td>

            <td className="px-4 py-3">

              <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

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

function MetricCard({
  title,
  value,
  icon,
}: any) {

  const serviceSummary =
  completedOrders.reduce(
    (
      acc: any,
      order: any
    ) => {

      const service =
        order
          .service_types
          ?.name ||
        "Sin servicio";

      acc[service] =
        (acc[service] || 0) + 1;

      return acc;

    },
    {}
  );

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">

          {icon}

        </div>

      </div>

      <h2 className="mt-6 text-3xl font-bold text-gray-900">

        {value}

      </h2>

      <p className="mt-2 text-sm text-gray-500">

        {title}

      </p>

    </div>
  );
}

function InfoCard({
  title,
  value,
  icon,
}: any) {

  return (
    <div className="rounded-[24px] bg-gray-50 p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">

          {icon}

        </div>

        <div>

          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">

            {title}

          </p>

          <h2 className="mt-1 text-sm font-bold text-gray-900">

            {value}

          </h2>

        </div>

      </div>

    </div>
  );
}