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
  
    const [search,
      setSearch] =
      useState("");
    
    const [statusFilter,
      setStatusFilter] =
      useState("all");

    const [page, 
    setPage] = useState(1);

const pageSize = 10;

const [totalOrders, setTotalOrders] = useState(0);

useEffect(() => {

  loadOrders();

}, [page]);

useEffect(() => {

  loadCompanies();

  loadTechnicians();

  loadServices();

}, []);

useEffect(() => {

  const interval =
    setInterval(() => {

      loadOrders();

    }, 5000);

  return () =>
    clearInterval(interval);

}, [page]);

async function loadOrders() {

  const from =
    (page - 1) * pageSize;

  const to =
    from + pageSize - 1;

  const {
    data,
    error,
    count,
  } = await supabase
    .from("work_orders")
    .select(
      `
      *,
      companies (
        company_name
      ),
      technicians (
        full_name
      ),
      service_types (
        name
      )
      `,
      {
        count: "exact",
      }
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .range(from, to);

  if (error) {

    console.error(error);

    return;

  }

  setOrders(data || []);

  setTotalOrders(count || 0);

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

    const {
      data,
      error,
    } = await supabase
      .from("work_orders")
      .insert([
        {
          company_id: companyId,
    
          technician_id: technicianId,
    
          service_type_id: serviceId,
    
          scheduled_date: scheduledDate,
    
          status: "pending",
        },
      ])
      .select()
      .single();
    
      if (error) {

        alert(error.message);
      
        return;
      
      }
      
      // Notificar al servidor
      try {
      
        await fetch(
          "/api/work-orders/notify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              workOrderId: data.id,
            }),
          }
        );
      
      } catch (err) {
      
        console.error(
          "Error notificando:",
          err
        );
      
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

          {/* BUTTON */}
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

        {/* BUSCADOR */}

<div className="mb-6 grid gap-4 lg:grid-cols-2">

<input
  type="text"
  placeholder="Buscar empresa, técnico o servicio..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
/>

<select
  value={statusFilter}
  onChange={(e) =>
    setStatusFilter(
      e.target.value
    )
  }
  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
>

  <option value="all">
    Todos los estados
  </option>

  <option value="pending">
    Pendientes
  </option>

  <option value="completed">
    Completadas
  </option>

</select>

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

                </tr>

              </thead>

              <tbody>

              {orders
  .filter((order) => {

    const texto =
      search.toLowerCase();

    const coincideBusqueda =

      order.companies
        ?.company_name
        ?.toLowerCase()
        .includes(texto)

      ||

      order.technicians
        ?.full_name
        ?.toLowerCase()
        .includes(texto)

      ||

      order.service_types
        ?.name
        ?.toLowerCase()
        .includes(texto);

    const coincideEstado =

      statusFilter ===
      "all"

      ||

      order.status ===
      statusFilter;

    return (

      coincideBusqueda

      &&

      coincideEstado

    );

  })

  .map((order) => (

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
                        order.technicians?.full_name
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

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      <div className="mt-6 flex items-center justify-between">

  <button
    disabled={page === 1}
    onClick={() =>
      setPage(page - 1)
    }
    className="rounded-xl bg-gray-200 px-4 py-2 text-sm disabled:opacity-40"
  >

    ← Anterior

  </button>

  <span className="text-sm font-semibold">

    Página {page} de {Math.ceil(totalOrders / pageSize)}

  </span>

  <button
    disabled={
      page >=
      Math.ceil(totalOrders / pageSize)
    }
    onClick={() =>
      setPage(page + 1)
    }
    className="rounded-xl bg-black px-4 py-2 text-sm text-white disabled:opacity-40"
  >

    Siguiente →

  </button>

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

                  {technicians
  .filter(
    (tech) =>
      tech.full_name &&
      tech.full_name.trim() !== ""
  )
  .map((tech) => (

    <option
      key={tech.id}
      value={tech.id}
    >

      {tech.full_name}

    </option>
  ))
}

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

                  {services
                    .filter(
                      (service) =>
                        service.name !==
                        "Reporte de Servicio Técnico"
                    )
                    .map(
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