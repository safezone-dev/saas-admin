"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function CrawlingInsectsMonitoringForm({
  order,
}: any) {

  const router = useRouter();

  const [loading,
    setLoading] =
    useState(false);

  // GENERALES
  const [general,
    setGeneral] =
    useState({

      fecha_registro: "",

      hora_inicio: "",

      hora_final: "",

      frecuencia: "",

      sin_actividad: false,

      con_actividad: false,

    });

  // ESTACIONES
  const [stations,
    setStations] =
    useState([
      {
        numero_estacion: "",

        cucarachas: 0,

        moscas: 0,

        hormigas: 0,

        escarabajos: 0,

        goma_aplicado: false,

        goma_no_aplicado: false,

        dispositivo_funcional: false,

        dispositivo_danado: false,

        mantenimiento_si: false,

        observaciones: "",
      },
    ]);

  // AGREGAR ESTACION
  function addStation() {

    setStations([
      ...stations,

      {
        numero_estacion: "",

        cucarachas: 0,

        moscas: 0,

        hormigas: 0,

        escarabajos: 0,

        goma_aplicado: false,

        goma_no_aplicado: false,

        dispositivo_funcional: false,

        dispositivo_danado: false,

        mantenimiento_si: false,

        observaciones: "",
      },
    ]);
  }

  // ACTUALIZAR
  function updateStation(
    index: number,
    field: string,
    value: any
  ) {

    const updated =
      [...stations];

    updated[index] = {

      ...updated[index],

      [field]: value,

    };

    setStations(updated);
  }

  async function saveForm() {

    try {

      setLoading(true);

      // PRINCIPAL
      const {
        data: monitorData,
        error,
      } = await supabase
        .from(
          "monitoreo_insectos_rastreros"
        )
        .insert({

          orden_trabajo_id:
            order.id,

          ...general,

        })
        .select()
        .single();

      if (error) {

        console.log(error);

        alert(
          "Error guardando formulario"
        );

        return;
      }

      // ESTACIONES
      await supabase
        .from(
          "monitoreo_rastreros_estaciones"
        )
        .insert(

          stations.map(
            (station) => ({

              monitoreo_id:
                monitorData.id,

              ...station,

            })
          )
        );

      // COMPLETAR
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">

      <div className="mx-auto max-w-7xl rounded-[28px] bg-white p-6 shadow-sm">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-2xl font-bold text-gray-900">

            Monitoreo de Insectos Rastreros

          </h1>

        </div>

        {/* GENERALES */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <InputField
            label="Fecha registro"
            type="date"
            value={
              general.fecha_registro
            }
            onChange={(value: any) =>
              setGeneral({
                ...general,
                fecha_registro:
                  value,
              })
            }
          />

          <InputField
            label="Hora inicio"
            type="time"
            value={
              general.hora_inicio
            }
            onChange={(value: any) =>
              setGeneral({
                ...general,
                hora_inicio:
                  value,
              })
            }
          />

          <InputField
            label="Hora final"
            type="time"
            value={
              general.hora_final
            }
            onChange={(value: any) =>
              setGeneral({
                ...general,
                hora_final:
                  value,
              })
            }
          />

          <SelectField
            label="Frecuencia"
            value={
              general.frecuencia
            }
            onChange={(value: any) =>
              setGeneral({
                ...general,
                frecuencia:
                  value,
              })
            }
            options={[
              "Semanal",
              "Quincenal",
              "Mensual",
              "Bi mensual",
              "Trimestral",
              "Semestral",
              "Anual",
            ]}
          />

        </div>

        {/* ESTACIONES */}
        <div className="mt-10">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-lg font-bold text-gray-900">

              Datos por estación

            </h2>

            <button
              type="button"
              onClick={addStation}
              className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >

              Agregar estación

            </button>

          </div>

          <div className="space-y-6">

            {stations.map(
              (
                station,
                index
              ) => (

                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 p-6"
                >

                  <h3 className="mb-5 text-sm font-bold text-gray-900">

                    Estación
                    {" "}
                    {index + 1}

                  </h3>

                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                    <InputField
                      label="Número estación"
                      value={
                        station.numero_estacion
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "numero_estacion",
                          value
                        )
                      }
                    />

                    <InputField
                      label="Cucarachas"
                      type="number"
                      value={
                        station.cucarachas
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "cucarachas",
                          Number(
                            value
                          )
                        )
                      }
                    />

                    <InputField
                      label="Moscas"
                      type="number"
                      value={
                        station.moscas
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "moscas",
                          Number(
                            value
                          )
                        )
                      }
                    />

                    <InputField
                      label="Hormigas"
                      type="number"
                      value={
                        station.hormigas
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "hormigas",
                          Number(
                            value
                          )
                        )
                      }
                    />

                    <InputField
                      label="Escarabajos"
                      type="number"
                      value={
                        station.escarabajos
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "escarabajos",
                          Number(
                            value
                          )
                        )
                      }
                    />

                  </div>

                  {/* CHECKS */}
                  <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                    <CheckField
                      label="Goma aplicado"
                      checked={
                        station.goma_aplicado
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "goma_aplicado",
                          value
                        )
                      }
                    />

                    <CheckField
                      label="Goma no aplicado"
                      checked={
                        station.goma_no_aplicado
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "goma_no_aplicado",
                          value
                        )
                      }
                    />

                    <CheckField
                      label="Dispositivo funcional"
                      checked={
                        station.dispositivo_funcional
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "dispositivo_funcional",
                          value
                        )
                      }
                    />

                    <CheckField
                      label="Dispositivo dañado"
                      checked={
                        station.dispositivo_danado
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "dispositivo_danado",
                          value
                        )
                      }
                    />

                    <CheckField
                      label="Mantenimiento"
                      checked={
                        station.mantenimiento_si
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "mantenimiento_si",
                          value
                        )
                      }
                    />

                  </div>

                  {/* OBSERVACIONES */}
                  <div className="mt-6">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                      Observaciones

                    </label>

                    <textarea
                      rows={4}
                      value={
                        station.observaciones
                      }
                      onChange={(e) =>
                        updateStation(
                          index,
                          "observaciones",
                          e.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </div>

        {/* ACTIVIDAD */}
        <div className="mt-10 rounded-2xl border border-gray-200 p-6">

          <h2 className="mb-6 text-lg font-bold text-gray-900">

            Actividad durante inspección

          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <CheckField
              label="No se registraron actividades"
              checked={
                general.sin_actividad
              }
              onChange={(value: any) =>
                setGeneral({
                  ...general,
                  sin_actividad:
                    value,
                })
              }
            />

            <CheckField
              label="Se registraron actividades"
              checked={
                general.con_actividad
              }
              onChange={(value: any) =>
                setGeneral({
                  ...general,
                  con_actividad:
                    value,
                })
              }
            />

          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={saveForm}
          disabled={loading}
          className="mt-10 w-full rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white"
        >

          {loading
            ? "Guardando..."
            : "Guardar formulario"}

        </button>

      </div>

    </div>
  );
}

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
        className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
      />

    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: any) {

  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">

        {label}

      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
      >

        <option value="">
          Seleccionar
        </option>

        {options.map(
          (option: string) => (

            <option
              key={option}
              value={option}
            >

              {option}

            </option>
          )
        )}

      </select>

    </div>
  );
}

function CheckField({
  label,
  checked,
  onChange,
}: any) {

  return (
    <label className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4 text-sm">

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