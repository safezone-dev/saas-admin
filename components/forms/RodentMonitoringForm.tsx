"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function RodentMonitoringForm({
  order,
}: any) {

  const router = useRouter();

  const [loading,
    setLoading] =
    useState(false);

  const [form,
    setForm] = useState({

      station_number: "",

      rodent_present: false,

      rodent_not_present: false,

      rodenticide_applied: false,

      rodenticide_not_applied: false,

      consumption_total: false,

      consumption_partial: false,

      damage: false,

      without_findings: false,

      device_functional: false,

      device_damaged: false,

      adhesive_functional: false,

      replacement: false,

      cleaning: false,

      observations: "",

    });

  async function saveForm() {

    try {

      setLoading(true);

      const { error } =
        await supabase
          .from("rodent_forms")
          .insert({

            work_order_id:
              order.id,

            ...form,

          });

      if (error) {

        console.log(error);

        alert(
          "Error guardando formulario"
        );

        return;
      }

      // COMPLETAR ORDEN
      await supabase
        .from("work_orders")
        .update({
          status:
            "completed",
        })
        .eq(
          "id",
          order.id
        );

      alert(
        "Formulario guardado correctamente"
      );

      router.push(
        "/company-dashboard/pending-orders"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Error general"
      );

    } finally {

      setLoading(false);

    }
  }

  function toggleField(
    field: string,
    value: boolean
  ) {

    setForm({
      ...form,
      [field]: value,
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">

      <div className="mx-auto max-w-6xl rounded-[28px] bg-white p-6 shadow-sm">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-2xl font-bold text-gray-900">

            Monitoreo de Roedores

          </h1>

          <p className="mt-2 text-sm text-gray-500">

            Registro técnico del servicio

          </p>

        </div>

        {/* ESTACION */}
        <div className="mb-6">

          <label className="mb-2 block text-sm font-semibold text-gray-700">

            Número estación

          </label>

          <input
            type="text"
            value={
              form.station_number
            }
            onChange={(e) =>
              setForm({
                ...form,
                station_number:
                  e.target.value,
              })
            }
            className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
          />

        </div>

        {/* GRID */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <CheckCard
            title="Captura"
            fields={[
              {
                label:
                  "Presente",
                value:
                  form.rodent_present,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "rodent_present",
                      value
                    ),
              },
              {
                label:
                  "No presente",
                value:
                  form.rodent_not_present,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "rodent_not_present",
                      value
                    ),
              },
            ]}
          />

          <CheckCard
            title="Rodenticida"
            fields={[
              {
                label:
                  "Aplicado",
                value:
                  form.rodenticide_applied,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "rodenticide_applied",
                      value
                    ),
              },
              {
                label:
                  "No aplicado",
                value:
                  form.rodenticide_not_applied,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "rodenticide_not_applied",
                      value
                    ),
              },
            ]}
          />

          <CheckCard
            title="Evidencia"
            fields={[
              {
                label:
                  "Consumo total",
                value:
                  form.consumption_total,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "consumption_total",
                      value
                    ),
              },
              {
                label:
                  "Consumo parcial",
                value:
                  form.consumption_partial,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "consumption_partial",
                      value
                    ),
              },
              {
                label:
                  "Deterioro",
                value:
                  form.damage,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "damage",
                      value
                    ),
              },
              {
                label:
                  "Sin hallazgo",
                value:
                  form.without_findings,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "without_findings",
                      value
                    ),
              },
            ]}
          />

          <CheckCard
            title="Dispositivo"
            fields={[
              {
                label:
                  "Funcional",
                value:
                  form.device_functional,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "device_functional",
                      value
                    ),
              },
              {
                label:
                  "Dañado",
                value:
                  form.device_damaged,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "device_damaged",
                      value
                    ),
              },
            ]}
          />

          <CheckCard
            title="Adhesivo"
            fields={[
              {
                label:
                  "Funcional",
                value:
                  form.adhesive_functional,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "adhesive_functional",
                      value
                    ),
              },
              {
                label:
                  "Reemplazo",
                value:
                  form.replacement,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "replacement",
                      value
                    ),
              },
            ]}
          />

          <CheckCard
            title="Mantenimiento"
            fields={[
              {
                label:
                  "Limpieza",
                value:
                  form.cleaning,
                onChange:
                  (value: boolean) =>
                    toggleField(
                      "cleaning",
                      value
                    ),
              },
            ]}
          />

        </div>

        {/* OBSERVACIONES */}
        <div className="mt-8">

          <label className="mb-2 block text-sm font-semibold text-gray-700">

            Observaciones

          </label>

          <textarea
            rows={5}
            value={
              form.observations
            }
            onChange={(e) =>
              setForm({
                ...form,
                observations:
                  e.target.value,
              })
            }
            className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={saveForm}
          disabled={loading}
          className="mt-8 w-full rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white"
        >

          {loading
            ? "Guardando..."
            : "Guardar formulario"}

        </button>

      </div>

    </div>
  );
}

type CheckField = {

  label: string;

  value: boolean;

  onChange: (
    value: boolean
  ) => void;

};

function CheckCard({
  title,
  fields,
}: {
  title: string;
  fields: CheckField[];
}) {

  return (
    <div className="rounded-2xl border border-gray-200 p-5">

      <h3 className="mb-4 text-sm font-bold">

        {title}

      </h3>

      <div className="space-y-3">

        {fields.map(
          (
            field,
            index
          ) => (

            <label
              key={index}
              className="flex items-center gap-3 text-sm"
            >

              <input
                type="checkbox"
                checked={
                  field.value
                }
                onChange={(e) =>
                  field.onChange(
                    e.target.checked
                  )
                }
              />

              {field.label}

            </label>
          )
        )}

      </div>

    </div>
  );
}