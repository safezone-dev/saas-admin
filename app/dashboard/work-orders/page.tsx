"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  ClipboardList,
  Plus,
  X,
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

    // AUTO REFRESH
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

    alert("Orden creada");

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
    <div className="min-h-screen">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-900 lg:text-4xl">

            Órdenes de Trabajo

          </h1>

          <p className="mt-2 text-sm text-gray-500">

            Gestión operativa

          </p>

        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
        >

          <Plus size={18} />

          Nueva Orden

        </button>

      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[30px] bg-white shadow-sm">

        {/* HEADER TABLE */}
        <div className="hidden grid-cols-5 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 lg:grid">

          <div>Empresa</div>

          <div>Técnico</div>

          <div>Servicio</div>

          <div>Fecha</div>

          <div>Estado</div>

        </div>

        {/* ROWS */}
        {orders.map((order) => (

          <div
            key={order.id}
            className="border-b border-gray-100 px-4 py-5 hover:bg-gray-50 lg:grid lg:grid-cols-5 lg:items-center lg:px-6"
          >

            {/* MOBILE */}
            <div className="space-y-2 lg:hidden">

              <div>

                <span className="text-xs font-semibold text-gray-500">

                  Empresa

                </span>

                <p className="font-medium text-gray-900">

                  {
                    order.companies
                      ?.company_name
                  }

                </p>

              </div>

              <div>

                <span className="text-xs font-semibold text-gray-500">

                  Técnico

                </span>

                <p className="text-sm text-gray-700">

                  {
                    order.technicians
                      ?.name
                  }

                </p>

              </div>

              <div>

                <span className="text-xs font-semibold text-gray-500">

                  Servicio

                </span>

                <p className="text-sm text-gray-700">

                  {
                    order.service_types
                      ?.name
                  }

                </p>

              </div>

              <div>

                <span className="text-xs font-semibold text-gray-500">

                  Fecha

                </span>

                <p className="text-sm text-gray-700">

                  {
                    order.scheduled_date
                  }

                </p>

              </div>

              <div>

                <span className="text-xs font-semibold text-gray-500">

                  Estado

                </span>

                <div className="mt-1">

                  {order.status ===
                  "completed" ? (

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                      Completada

                    </span>

                  ) : (

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">

                      Pendiente

                    </span>

                  )}

                </div>

              </div>

            </div>

            {/* DESKTOP */}
            <>

              <div className="hidden font-medium text-gray-900 lg:block">

                {
                  order.companies
                    ?.company_name
                }

              </div>

              <div className="hidden text-sm text-gray-600 lg:block">

                {
                  order.technicians
                    ?.name
                }

              </div>

              <div className="hidden text-sm text-gray-600 lg:block">

                {
                  order.service_types
                    ?.name
                }

              </div>

              <div className="hidden text-sm text-gray-600 lg:block">

                {
                  order.scheduled_date
                }

              </div>

              <div className="hidden lg:block">

                {order.status ===
                "completed" ? (

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                    Completada

                  </span>

                ) : (

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">

                    Pendiente

                  </span>

                )}

              </div>

            </>

          </div>
        ))}

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-5 backdrop-blur-sm">

          <div className="mx-auto my-10 w-full max-w-2xl rounded-[30px] bg-white p-6 lg:p-8">

            {/* TOP */}
            <div className="mb-8 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">

                  Nueva Orden

                </h2>

                <p className="mt-2 text-sm text-gray-500">

                  Crear orden operativa

                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-xl bg-gray-100 p-3 hover:bg-gray-200"
              >

                <X size={20} />

              </button>

            </div>

            {/* FORM */}
            <div className="space-y-5">

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
                  className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none"
                >

                  <option value="">
                    Seleccione empresa
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
                  className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none"
                >

                  <option value="">
                    Seleccione técnico
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
                  className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none"
                >

                  <option value="">
                    Seleccione servicio
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

                  Fecha Programada

                </label>

                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) =>
                    setScheduledDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none"
                />

              </div>

            </div>

            {/* BUTTON */}
            <button
              onClick={createOrder}
              className="mt-8 w-full rounded-2xl bg-blue-600 py-4 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
            >

              Crear Orden

            </button>

          </div>

        </div>
      )}

    </div>
  );
}