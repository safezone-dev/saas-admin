"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  Plus,
  Trash2,
} from "lucide-react";

export default function FlyingInsectsMonitoringForm({
  order,
}: any) {

  const router = useRouter();

  const [loading,
    setLoading] =
    useState(false);

  // DATOS GENERALES
  const [general,
    setGeneral] =
    useState({
  
      fecha_aplicacion:
        order?.scheduled_date || "",
  
      hora_inicio:
        new Date()
          .toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
  
      hora_final: "",
  
      frecuencia: "",
  
      limpieza_equipo: false,
  
      funcionamiento: false,
  
      estado_bulbo: "",
  
      cambio_adhesivo: false,
  
      conexion_electrica: "",
  
    });

  // MULTIPLES ESTACIONES
  const [stations,
    setStations] =
    useState([
      {
        numero_estacion: "",

        palomilla: 0,

        mosca_metalica: 0,

        mosca_domestica: 0,

        mosca_fruta: 0,

        mosquitos: 0,

        escarabajos: 0,

        hormigas_alas: 0,

        observaciones: "",
      },
    ]);

  // AGREGAR ESTACION
  function addStation() {

    setStations([
      ...stations,

      {
        numero_estacion: "",

        palomilla: 0,

        mosca_metalica: 0,

        mosca_domestica: 0,

        mosca_fruta: 0,

        mosquitos: 0,

        escarabajos: 0,

        hormigas_alas: 0,

        observaciones: "",
      },
    ]);
  }

  // ELIMINAR ESTACION
  function removeStation(
    index: number
  ) {

    const updated =
      [...stations];

    updated.splice(
      index,
      1
    );

    setStations(updated);
  }

  // ACTUALIZAR ESTACION
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
      const horaFinal =
  new Date()
    .toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

      // GUARDAR CABECERA
      const {
        data: monitorData,
        error,
      } = await supabase
        .from(
          "monitoreo_insectos_voladores"
        )
        .insert({

          orden_trabajo_id:
            order.id,
        
          ...general,
        
          hora_final:
            horaFinal,
        
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

      // GUARDAR ESTACIONES
      await supabase
        .from(
          "monitoreo_insectos_estaciones"
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">

      <div className="mx-auto max-w-7xl rounded-[28px] bg-white p-6 shadow-sm">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-2xl font-bold text-gray-900">

            Monitoreo de Insectos Voladores

          </h1>

        </div>

        {/* DATOS GENERALES */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

<div>

  <label className="mb-2 block text-sm font-semibold text-gray-700">

    Fecha asignada

  </label>

  <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm">

    {general.fecha_aplicacion}

  </div>

</div>

<div>

  <label className="mb-2 block text-sm font-semibold text-gray-700">

    Hora inicio

  </label>

  <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm">

    {general.hora_inicio}

  </div>

</div>

<div>

  <label className="mb-2 block text-sm font-semibold text-gray-700">

    Hora final

  </label>

  <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm">

    Se registrará al guardar

  </div>

</div>

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
    "Mensual",
    "Bimensual",
    "Trimestral",
    "Semestral",
    "Anual",
  ]}
/>

</div>

        {/* ESTACIONES */}
        <div className="mt-10">

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

                  {/* TOP */}
                  <div className="mb-5 flex items-center justify-between">

                    <h3 className="text-sm font-bold text-gray-900">

                      Estación
                      {" "}
                      {index + 1}

                    </h3>

                    {stations.length >
                      1 && (

                      <button
                        type="button"
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
                      label="Palomilla"
                      type="number"
                      value={
                        station.palomilla
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "palomilla",
                          Number(
                            value
                          )
                        )
                      }
                    />

                    <InputField
                      label="Mosca metálica"
                      type="number"
                      value={
                        station.mosca_metalica
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "mosca_metalica",
                          Number(
                            value
                          )
                        )
                      }
                    />

                    <InputField
                      label="Mosca doméstica"
                      type="number"
                      value={
                        station.mosca_domestica
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "mosca_domestica",
                          Number(
                            value
                          )
                        )
                      }
                    />

                    <InputField
                      label="Mosca fruta"
                      type="number"
                      value={
                        station.mosca_fruta
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "mosca_fruta",
                          Number(
                            value
                          )
                        )
                      }
                    />

                    <InputField
                      label="Mosquitos"
                      type="number"
                      value={
                        station.mosquitos
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "mosquitos",
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

                    <InputField
                      label="Hormigas con alas"
                      type="number"
                      value={
                        station.hormigas_alas
                      }
                      onChange={(value: any) =>
                        updateStation(
                          index,
                          "hormigas_alas",
                          Number(
                            value
                          )
                        )
                      }
                    />

                  </div>

                  {/* EQUIPO */}
                  <div className="mt-8 rounded-2xl border border-gray-200 p-6">

                    <h2 className="mb-6 text-lg font-bold text-gray-900">

                      Estado del equipo

                    </h2>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                      <CheckField
                        label="Limpieza equipo"
                        checked={
                          general.limpieza_equipo
                        }
                        onChange={(value: any) =>
                          setGeneral({
                            ...general,
                            limpieza_equipo:
                              value,
                          })
                        }
                      />

                      <CheckField
                        label="Funcionamiento"
                        checked={
                          general.funcionamiento
                        }
                        onChange={(value: any) =>
                          setGeneral({
                            ...general,
                            funcionamiento:
                              value,
                          })
                        }
                      />

                      <CheckField
                        label="Cambio adhesivo"
                        checked={
                          general.cambio_adhesivo
                        }
                        onChange={(value: any) =>
                          setGeneral({
                            ...general,
                            cambio_adhesivo:
                              value,
                          })
                        }
                      />

                      <SelectField
                        label="Estado bulbo"
                        value={
                          general.estado_bulbo
                        }
                        onChange={(value: any) =>
                          setGeneral({
                            ...general,
                            estado_bulbo:
                              value,
                          })
                        }
                        options={[
                          "Bueno",
                          "Malo",
                        ]}
                      />

                      <SelectField
                        label="Conexión eléctrica"
                        value={
                          general.conexion_electrica
                        }
                        onChange={(value: any) =>
                          setGeneral({
                            ...general,
                            conexion_electrica:
                              value,
                          })
                        }
                        options={[
                          "Buena",
                          "Mala",
                        ]}
                      />

                    </div>

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

                  {/* ADD BUTTON */}
                  {index ===
                    stations.length -
                      1 && (

                    <button
                      type="button"
                      onClick={
                        addStation
                      }
                      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
                    >

                      <Plus size={16} />

                      Agregar estación

                    </button>
                  )}

                </div>
              )
            )}

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