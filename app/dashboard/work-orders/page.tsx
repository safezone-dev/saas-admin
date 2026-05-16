"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  ClipboardList,
  Plus,
  X,
  FileText,
} from "lucide-react";

export default function WorkOrdersPage() {

  const [orders, setOrders] =
    useState<any[]>([]);

  const [companies, setCompanies] =
    useState<any[]>([]);

  const [technicians,
    setTechnicians] =
    useState<any[]>([]);

  const [services, setServices] =
    useState<any[]>([]);

  const [showModal,
    setShowModal] =
    useState(false);

  const [companyId,
    setCompanyId] =
    useState("");

  const [technicianId,
    setTechnicianId] =
    useState("");

  const [serviceId,
    setServiceId] =
    useState("");

  const [scheduledDate,
    setScheduledDate] =
    useState("");

  useEffect(() => {

    loadOrders();

    loadCompanies();

    loadTechnicians();

    loadServices();

    const interval =
      setInterval(() => {

        loadOrders();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  async function loadOrders() {

    const { data } =
      await supabase
        .from("work_orders")
        .select(`
          *,
          companies (
            company_name
          ),
          technicians (
            name
          ),
          service_types (
            name
          ),
          technical_service_reports (
            id
          )
        `)
        .order("created_at", {
          ascending: false,
        });

    if (data) {

      setOrders(data);

    }
  }

  async function loadCompanies() {

    const { data } =
      await supabase
        .from("companies")
        .select("*");

    if (data) {

      setCompanies(data);

    }
  }

  async function loadTechnicians() {

    const { data } =
      await supabase
        .from("technicians")
        .select("*");

    if (data) {

      setTechnicians(data);

    }
  }

  async function loadServices() {

    const { data } =
      await supabase
        .from("service_types")
        .select("*");

    if (data) {

      setServices(data);

    }
  }

  async function createOrder() {

    const { error } =
      await supabase
        .from("work_orders")
        .insert([

          {

            company_id:
              companyId,

            technician_id:
              technicianId,

            service_type_id:
              serviceId,

            scheduled_date:
              scheduledDate,

            status:
              "pending",

          },

        ]);

    if (error) {

      alert(error.message);

      return;

    }

    alert(
      "Orden creada correctamente"
    );

    setShowModal(false);

    resetForm();

    loadOrders();
  }

  function resetForm() {

    setCompanyId("");

    setTechnicianId("");

    setServiceId("");

    setScheduledDate("");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-sm">

              <ClipboardList size={22} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">

                Órdenes de Trabajo

              </h1>

              <p className="text-sm text-gray-500">

                Gestión operativa de servicios

              </p>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              href="/dashboard/work-orders/create-report"
              className="flex items-center justify-center gap-2 rounded-2xl border border-black bg-white px-4 py-3 text-sm font-semibold text-black shadow-sm transition hover:bg-black hover:text-white"
            >

              <FileText size={16} />

              Crear reporte de servicio

            </Link>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >

              <Plus size={16} />

              Nueva Orden

            </button>

          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full table-auto">

              <thead className="bg-gray-50">

                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                  <th className="min-w-[220px] px-4 py-3">

                    Empresa

                  </th>

                  <th className="min-w-[180px] px-4 py-3">

                    Técnico

                  </th>

                  <th className="min-w-[220px] px-4 py-3">

                    Servicio

                  </th>

                  <th className="min-w-[140px] px-4 py-3">

                    Fecha

                  </th>

                  <th className="min-w-[120px] px-4 py-3">

                    Estado

                  </th>

                  <th className="min-w-[240px] px-4 py-3">

                    Acciones

                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-t border-gray-100 text-sm transition hover:bg-gray-50"
                  >

                    {/* EMPRESA */}
                    <td className="px-4 py-4 align-top">

                      <div className="font-semibold text-gray-900">

                        {
                          order.companies
                            ?.company_name
                        }

                      </div>

                    </td>

                    {/* TECNICO */}
                    <td className="px-4 py-4 align-top text-gray-700">

                      {
                        order.technicians
                          ?.name
                      }

                    </td>

                    {/* SERVICIO */}
                    <td className="px-4 py-4 align-top text-gray-700">

                      {
                        order.service_types
                          ?.name
                      }

                    </td>

                    {/* FECHA */}
                    <td className="px-4 py-4 align-top text-gray-700">

                      {
                        order.scheduled_date
                      }

                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4 align-top">

                      {order.status ===
                      "completed" ? (

                        <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                          Completada

                        </span>

                      ) : (

                        <span className="rounded-lg bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">

                          Pendiente

                        </span>

                      )}

                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4 align-top">

                      <div className="flex flex-wrap gap-2">

                        {order.technical_service_reports
                          ?.length > 0 ? (

                          <span className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">

                            Reporte creado

                          </span>

                        ) : (

                          <Link
                            href={`/dashboard/work-orders/create-report/${order.id}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                          >

                            <FileText size={14} />

                            Crear reporte de servicio

                          </Link>

                        )}

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-xl rounded-[24px] bg-white p-6 shadow-2xl">

            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">

                  <ClipboardList size={19} />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-900">

                    Nueva Orden

                  </h2>

                  <p className="text-sm text-gray-500">

                    Registro de nueva orden

                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-xl bg-gray-100 p-3 transition hover:bg-gray-200"
              >

                <X size={18} />

              </button>

            </div>

            {/* FORM */}
            <div className="grid gap-4 md:grid-cols-2">

              {/* EMPRESA */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Empresa

                </label>

                <select
                  value={companyId}
                  onChange={(e) =>
                    setCompanyId(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                >

                  <option value="">
                    Seleccionar empresa
                  </option>

                  {companies.map(
                    (company) => (

                      <option
                        key={company.id}
                        value={company.id}
                      >

                        {
                          company.company_name
                        }

                      </option>
                    )
                  )}

                </select>

              </div>

              {/* TECNICO */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Técnico

                </label>

                <select
                  value={technicianId}
                  onChange={(e) =>
                    setTechnicianId(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                >

                  <option value="">
                    Seleccionar técnico
                  </option>

                  {technicians.map(
                    (tech) => (

                      <option
                        key={tech.id}
                        value={tech.id}
                      >

                        {tech.name}

                      </option>
                    )
                  )}

                </select>

              </div>

              {/* SERVICIO */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Servicio

                </label>

                <select
                  value={serviceId}
                  onChange={(e) =>
                    setServiceId(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                >

                  <option value="">
                    Seleccionar servicio
                  </option>

                  {services.map(
                    (service) => (

                      <option
                        key={service.id}
                        value={service.id}
                      >

                        {service.name}

                      </option>
                    )
                  )}

                </select>

              </div>

              {/* FECHA */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Fecha programada

                </label>

                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) =>
                    setScheduledDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                />

              </div>

            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold transition hover:bg-gray-100"
              >

                Cancelar

              </button>

              <button
                onClick={createOrder}
                className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >

                Crear Orden

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}