"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { supabase }
from "@/lib/supabase";

import {
  Plus,
  Trash2,
} from "lucide-react";

export default function MothMonitoringForm({
  order,
}: any) {

  const router =
    useRouter();

  const [loading,
    setLoading] =
    useState(false);

    const [form,
      setForm] =
      useState({
    
        register_date:
          order?.scheduled_date || "",
    
        start_time:
          new Date()
            .toLocaleTimeString(
              "en-GB",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
    
        end_time: "",
    
        no_activity:
          false,
    
        activity_detected:
          false,
    
        stations: [

        {

          station_number:
            "",

          flying_insects_count:
            "",

          pheromone_applied:
            false,

          pheromone_not_applied:
            false,

          device_functional:
            false,

          device_damaged:
            false,

          cleaning:
            false,

          observations:
            "",
        },

      ],
    });

  // ADD STATION
  function addStation() {

    setForm({

      ...form,

      stations: [

        ...form.stations,

        {

          station_number:
            "",

          flying_insects_count:
            "",

          pheromone_applied:
            false,

          pheromone_not_applied:
            false,

          device_functional:
            false,

          device_damaged:
            false,

          cleaning:
            false,

          observations:
            "",
        },

      ],
    });
  }

  // DELETE
  function removeStation(
    index: number
  ) {

    const updated =
      [...form.stations];

    updated.splice(
      index,
      1
    );

    setForm({
      ...form,
      stations:
        updated,
    });
  }

  // UPDATE
  function updateStation(
    index: number,
    field: string,
    value: any
  ) {

    const updated =
      [...form.stations];

    updated[index] = {

      ...updated[index],

      [field]: value,
    };

    setForm({
      ...form,
      stations:
        updated,
    });
  }

  // SAVE
  async function saveForm() {

    try {

      setLoading(true);

      const endTime =
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
            "moth_monitoring_forms"
          )
          .insert({

            work_order_id:
              order.id,
          
            register_date:
              form.register_date,
          
            start_time:
              form.start_time,
          
            end_time:
              endTime,
          
            stations:
              form.stations,
          
            no_activity:
              form.no_activity,
          
            activity_detected:
              form.activity_detected,
          
          });

      if (error) {

        console.log(error);

        alert(
          error.message
        );

        return;
      }

      // COMPLETE ORDER
      await supabase
        .from(
          "work_orders"
        )
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
        "Error guardando formulario"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-7xl rounded-[24px] bg-white p-6 shadow-sm">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-2xl font-bold text-gray-900">

            Monitoreo de Polilleros

          </h1>

          <p className="mt-1 text-sm text-gray-500">

            Registro técnico operativo

          </p>

        </div>

        {/* GENERAL */}
        <div className="grid gap-4 md:grid-cols-3">

  <div>

    <label className="mb-2 block text-sm font-semibold text-gray-700">

      Fecha asignada

    </label>

    <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm">

      {form.register_date}

    </div>

  </div>

  <div>

    <label className="mb-2 block text-sm font-semibold text-gray-700">

      Hora inicio

    </label>

    <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm">

      {form.start_time}

    </div>

  </div>

  <div>

    <label className="mb-2 block text-sm font-semibold text-gray-700">

      Hora final

    </label>

    <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm">

      Se registrará al guardar

    </div>

  </div>

</div>
        {/* STATIONS */}
        <div className="mt-8 space-y-6">

          {form.stations.map(
            (
              station,
              index
            ) => (

              <div
                key={index}
                className="rounded-[24px] border border-gray-200 p-5"
              >

                {/* TOP */}
                <div className="mb-5 flex items-center justify-between">

                  <h2 className="text-lg font-bold text-gray-900">

                    Estación #{index + 1}

                  </h2>

                  {form.stations
                    .length >
                    1 && (

                    <button
                      onClick={() =>
                        removeStation(
                          index
                        )
                      }
                      className="rounded-xl bg-red-100 p-2 text-red-700"
                    >

                      <Trash2
                        size={18}
                      />

                    </button>
                  )}

                </div>

                {/* GRID */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                  <InputField
                    label="Número estación"
                    value={
                      station.station_number
                    }
                    onChange={(
                      value: string
                    ) =>
                      updateStation(
                        index,
                        "station_number",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Conteo insectos voladores"
                    type="number"
                    value={
                      station.flying_insects_count
                    }
                    onChange={(
                      value: string
                    ) =>
                      updateStation(
                        index,
                        "flying_insects_count",
                        value
                      )
                    }
                  />

                </div>

                {/* CHECKBOXES */}
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                  {/* FEROMONAS */}
                  <CheckboxGroup
                    title="Reposición feromonas"
                    items={[

                      {
                        label:
                          "Aplicado",

                        checked:
                          station.pheromone_applied,

                        onChange:
                          (
                            value: boolean
                          ) =>
                            updateStation(
                              index,
                              "pheromone_applied",
                              value
                            ),
                      },

                      {
                        label:
                          "No aplicado",

                        checked:
                          station.pheromone_not_applied,

                        onChange:
                          (
                            value: boolean
                          ) =>
                            updateStation(
                              index,
                              "pheromone_not_applied",
                              value
                            ),
                      },

                    ]}
                  />

                  {/* DISPOSITIVO */}
                  <CheckboxGroup
                    title="Condición dispositivo"
                    items={[

                      {
                        label:
                          "Funcional",

                        checked:
                          station.device_functional,

                        onChange:
                          (
                            value: boolean
                          ) =>
                            updateStation(
                              index,
                              "device_functional",
                              value
                            ),
                      },

                      {
                        label:
                          "Dañado",

                        checked:
                          station.device_damaged,

                        onChange:
                          (
                            value: boolean
                          ) =>
                            updateStation(
                              index,
                              "device_damaged",
                              value
                            ),
                      },

                    ]}
                  />

                  {/* MANTENIMIENTO */}
                  <CheckboxGroup
                    title="Mantenimiento dispositivo"
                    items={[

                      {
                        label:
                          "Limpieza",

                        checked:
                          station.cleaning,

                        onChange:
                          (
                            value: boolean
                          ) =>
                            updateStation(
                              index,
                              "cleaning",
                              value
                            ),
                      },

                    ]}
                  />

                </div>

                {/* OBSERVACIONES */}
                <div className="mt-6">

                  <InputField
                    label="Observaciones"
                    value={
                      station.observations
                    }
                    onChange={(
                      value: string
                    ) =>
                      updateStation(
                        index,
                        "observations",
                        value
                      )
                    }
                  />

                </div>

              </div>
            )
          )}

        </div>

        {/* ADD */}
        <button
          onClick={addStation}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
        >

          <Plus size={16} />

          Agregar estación

        </button>

        {/* FINAL */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">

          <CheckboxField
            label="No se registró actividad durante la inspección"
            checked={
              form.no_activity
            }
            onChange={(
              value: boolean
            ) =>
              setForm({
                ...form,
                no_activity:
                  value,
              })
            }
          />

          <CheckboxField
            label="Se registró actividad durante la inspección"
            checked={
              form.activity_detected
            }
            onChange={(
              value: boolean
            ) =>
              setForm({
                ...form,
                activity_detected:
                  value,
              })
            }
          />

        </div>

        {/* SAVE */}
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

// INPUT
function InputField({
  label,
  value,
  onChange,
  type = "text",
}: any) {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">

        {label}

      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-2xl border border-gray-200 p-3 text-sm"
      />

    </div>
  );
}

// CHECKBOX GROUP
function CheckboxGroup({
  title,
  items,
}: any) {

  return (

    <div>

      <h3 className="mb-3 text-sm font-bold text-gray-900">

        {title}

      </h3>

      <div className="space-y-2">

        {items.map(
          (
            item: any,
            index: number
          ) => (

            <CheckboxField
              key={index}
              label={item.label}
              checked={
                item.checked
              }
              onChange={
                item.onChange
              }
            />
          )
        )}

      </div>

    </div>
  );
}

// CHECKBOX
function CheckboxField({
  label,
  checked,
  onChange,
}: any) {

  return (

    <label className="flex items-center gap-3 text-sm">

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(
            e.target.checked
          )
        }
      />

      {label}

    </label>
  );
}