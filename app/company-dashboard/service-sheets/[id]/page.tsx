"use client";

import {
  useEffect,
  useState,
} from "react";

import { useParams }
from "next/navigation";

import { supabase }
from "@/lib/supabase";

import {
  ClipboardCheck,
} from "lucide-react";

export default function TechnicianSheetExecutionPage() {

  const params =
    useParams();

  const id =
    params.id;

  const [sheet,
    setSheet] =
    useState<any>(null);

  const [registerDate,
    setRegisterDate] =
    useState("");

  const [startTime,
    setStartTime] =
    useState("");

  const [endTime,
    setEndTime] =
    useState("");

  const [frequency,
    setFrequency] =
    useState("");

  const [technicianObservations,
    setTechnicianObservations] =
    useState("");

  const [completed,
    setCompleted] =
    useState(false);

  useEffect(() => {

    loadSheet();

  }, []);

  async function loadSheet() {

    const { data } =
      await supabase
        .from(
          "service_sheets"
        )
        .select(`
          *,
          companies (
            company_name
          )
        `)
        .eq("id", id)
        .single();

    if (data) {

      setSheet(data);

      setRegisterDate(
        data.service_date || ""
      );

      setStartTime(

        data.execution_start_time ||
      
        new Date()
          .toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )
      
      );

      setEndTime(
        data.execution_end_time || ""
      );

      setFrequency(
        data.frequency || ""
      );

      setTechnicianObservations(
        data.technician_execution_observations || ""
      );

      setCompleted(
        data.service_completed || false
      );

    }
  }

  async function saveExecution() {

    const automaticEndTime =
  new Date()
    .toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const { error } =
      await supabase
        .from(
          "service_sheets"
        )
        .update({

          register_date:
            registerDate,

          execution_start_time:
            startTime,

            execution_end_time:
            automaticEndTime,

          frequency,

          technician_execution_observations:
            technicianObservations,

          service_completed:
            completed,

          status:
            completed
              ? "completed"
              : "pending",

          completed_at:
            completed
              ? new Date()
                  .toISOString()
              : null,

        })
        .eq("id", id);

    if (error) {

      alert(error.message);

      return;
    }

    alert(
      "Hoja actualizada correctamente"
    );
  }

  if (!sheet) {

    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="rounded-[24px] bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">

              <ClipboardCheck size={22} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">

                Ejecución Hoja de Servicio

              </h1>

              <p className="text-sm text-gray-500">

                {
                  sheet.companies
                    ?.company_name
                }

              </p>

            </div>

          </div>

        </div>

        {/* ITEMS */}
        <div className="space-y-5">

          {sheet.items?.map(
            (
              item: any,
              index: number
            ) => (

              <div
                key={index}
                className="rounded-[24px] bg-white p-6 shadow-sm"
              >

                <h2 className="mb-5 text-lg font-bold text-gray-900">

                  Item #{index + 1}

                </h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                  <ReadField
                    label="Producto"
                    value={
                      item.product_used
                    }
                  />

                  <ReadField
                    label="Área"
                    value={
                      item.area
                    }
                  />

                  <ReadField
                    label="Área tratada"
                    value={
                      item.treated_area
                    }
                  />

                  <ReadField
                    label="Dosis"
                    value={
                      item.dosage
                    }
                  />

                  <ReadField
                    label="Plaga"
                    value={
                      item.observed_pest
                    }
                  />

                  <ReadField
                    label="Métodos"
                    value={
                      item.application_methods?.join(
                        ", "
                      )
                    }
                  />

                </div>

              </div>
            )
          )}

        </div>

        {/* OBSERVACIONES ADMIN */}
        <div className="rounded-[24px] bg-white p-6 shadow-sm">

          <h2 className="mb-3 text-lg font-bold text-gray-900">

            Observaciones generales

          </h2>

          <p className="text-sm text-gray-600">

            {
              sheet.admin_observations
            }

          </p>

        </div>

        {/* EJECUCION */}
        <div className="rounded-[24px] bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-bold text-gray-900">

            Respuesta Técnico

          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* FECHA */}
            <div>

              <label className="mb-2 block text-sm font-semibold">

                Fecha registro

              </label>

              <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
  {registerDate}
</div>

            </div>

            {/* HORA INICIO */}
            <div>

              <label className="mb-2 block text-sm font-semibold">

                Hora inicio

              </label>

              <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
  {registerDate}
</div>

            </div>

            {/* HORA FINAL */}
            <div>

              <label className="mb-2 block text-sm font-semibold">

                Hora final

              </label>

              <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
  Se registrará automáticamente al guardar
</div>

            </div>

            {/* FRECUENCIA */}
            <div>

              <label className="mb-2 block text-sm font-semibold">

                Frecuencia

              </label>

              <select
                value={frequency}
                onChange={(e) =>
                  setFrequency(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 p-3 text-sm"
              >

                <option value="">
                  Seleccionar
                </option>

                <option>
                  Semanal
                </option>

                <option>
                  Quincenal
                </option>

                <option>
                  Mensual
                </option>

                <option>
                  Bimensual
                </option>

                <option>
                  Trimestral
                </option>

                <option>
                  Semestral
                </option>

              </select>

            </div>

          </div>

          {/* OBSERVACIONES */}
          <div className="mt-5">

            <label className="mb-2 block text-sm font-semibold">

              Observaciones técnico

            </label>

            <textarea
              rows={5}
              value={
                technicianObservations
              }
              onChange={(e) =>
                setTechnicianObservations(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 p-3 text-sm"
            />

          </div>

          {/* COMPLETADO */}
          <div className="mt-5">

            <label className="flex items-center gap-3 text-sm font-semibold">

              <input
                type="checkbox"
                checked={completed}
                onChange={(e) =>
                  setCompleted(
                    e.target.checked
                  )
                }
              />

              Marcar servicio como realizado

            </label>

          </div>

          {/* BUTTON */}
          <button
            onClick={saveExecution}
            className="mt-6 w-full rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white"
          >

            Guardar Respuesta

          </button>

        </div>

      </div>

    </div>
  );
}

function ReadField({
  label,
  value,
}: any) {

  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">

        {label}

      </label>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">

        {value || "-"}

      </div>

    </div>
  );
}