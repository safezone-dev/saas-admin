"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  User,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";

export default function CompanyDashboard() {

  const [pendingOrders,
    setPendingOrders] =
    useState<any[]>([]);

  const [completedOrders,
    setCompletedOrders] =
    useState<any[]>([]);

  const [technician,
    setTechnician] =
    useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    const technicianData =
      localStorage.getItem(
        "technician"
      );

    if (!technicianData) return;

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

    setPendingOrders(
      data.filter(
        (o) =>
          o.status !==
          "completed"
      )
    );

    setCompletedOrders(
      data.filter(
        (o) =>
          o.status ===
          "completed"
      )
    );
  }

  const totalOrders =
    pendingOrders.length +
    completedOrders.length;

  const completedPercent =
    totalOrders > 0
      ? Math.round(
          (
            completedOrders.length /
            totalOrders
          ) * 100
        )
      : 0;

  const pendingPercent =
    totalOrders > 0
      ? Math.round(
          (
            pendingOrders.length /
            totalOrders
          ) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">

      {/* HEADER */}
      <div className="mb-5 rounded-[24px] bg-white p-4 shadow-sm sm:p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* USER */}
          <div className="flex items-center gap-3 sm:gap-4">

            <div className="rounded-2xl bg-blue-100 p-3 sm:p-4">

              <User
                size={20}
                className="text-blue-600"
              />

            </div>

            <div className="min-w-0">

              <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                {
                  technician?.name
                }
              </h1>

              <p className="truncate text-[11px] text-gray-500 sm:text-xs">
                {
                  technician?.email
                }
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="mb-5 grid grid-cols-4 gap-3">

        <StatCard
          title="Pendientes"
          value={
            pendingOrders.length
          }
          subtitle={`${pendingPercent}%`}
          color="yellow"
        />

        <StatCard
          title="Respondidas"
          value={
            completedOrders.length
          }
          subtitle={`${completedPercent}%`}
          color="green"
        />

        <StatCard
          title="Actividades"
          value={totalOrders}
          subtitle="Total"
          color="blue"
        />

        <StatCard
          title="Efectividad"
          value={`${completedPercent}%`}
          subtitle="Cumplimiento"
          color="purple"
        />

      </div>

      {/* RESUMEN */}
      <div className="grid gap-4 xl:grid-cols-2">

        {/* PENDIENTES */}
        <ActivityCard
          title="Últimas Pendientes"
          icon={
            <ClipboardList
              size={16}
            />
          }
          data={pendingOrders.slice(
            0,
            5
          )}
          completed={false}
        />

        {/* RESPONDIDAS */}
        <ActivityCard
          title="Últimas Respondidas"
          icon={
            <CheckCircle2
              size={16}
            />
          }
          data={completedOrders.slice(
            0,
            5
          )}
          completed={true}
        />

      </div>

    </div>
  );
}

function ActivityCard({
  title,
  icon,
  data,
  completed,
}: any) {

  return (
    <div className="rounded-[24px] bg-white p-4 shadow-sm sm:p-5">

      {/* TITLE */}
      <div className="mb-4 flex items-center gap-2">

        <div className="text-blue-600">
          {icon}
        </div>

        <h2 className="text-sm font-bold text-gray-900">
          {title}
        </h2>

      </div>

      {/* CONTENT */}
      <div className="space-y-3">

        {data.length === 0 && (
          <div className="text-xs text-gray-500">
            Sin registros
          </div>
        )}

        {data.map(
          (item: any) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-gray-900">
                  {
                    item.companies
                      ?.company_name
                  }
                </p>

                <p className="truncate text-[11px] text-gray-500 sm:text-xs">
                  {
                    item.service_types
                      ?.name
                  }
                </p>

              </div>

              <span
                className={`w-fit rounded-full px-2 py-1 text-[10px] font-semibold ${
                  completed
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >

                {completed
                  ? "Respondido"
                  : "Pendiente"}

              </span>

            </div>
          )
        )}

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
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
    <div className={`rounded-[22px] p-4 sm:p-5 ${styles}`}>

      <p className="text-[10px] font-semibold uppercase tracking-wide sm:text-[11px]">
        {title}
      </p>

      <div className="mt-3 flex items-end justify-between gap-2">

        <h2 className="text-2xl font-bold sm:text-3xl">
          {value}
        </h2>

        <p className="text-[10px] font-semibold opacity-70 sm:text-xs">
          {subtitle}
        </p>

      </div>

    </div>
  );
}