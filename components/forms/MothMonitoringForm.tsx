"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function MothMonitoringForm({
  order,
}: any) {

  const router = useRouter();

  const [loading,
    setLoading] =
    useState(false);

  const [form,
    setForm] = useState({

      fecha_registro: "",

      hora_inicio: "",

      hora_final: "",

      frecuencia: "",

      numero_estacion: "",

      conteo_insectos_voladores: 0,

      feromona_aplica: false,

      feromona_no_aplica: false,

      dispositivo_funcional: false,

      dispositivo_danado: false,

      mantenimiento_aplica: false,

      observaciones: "",

    });

  async function saveForm() {

    try {

      setLoading(true);

      const { error } =
        await supabase
          .from(
            "monitoreo_polilleros"
          )
          .insert({

            orden_trabajo_id:
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">

      <div className="mx-auto max-w-5xl rounded-[28px] bg-white p-6 shadow-sm">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-2xl font-bold text-gray-900">

            Monitoreo de Polilleros

          </h1>

          <p className="mt-2 text-sm text-gray-500">

            Registro técnico del servicio

          </p>

        </div>

        {/* FORM */}
        <div className="grid gap-5 md:grid-cols-2">

          {/* FECHA */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Fecha registro

            </label>

            <input
              type="date"
              value={
                form.fecha_registro
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  fecha_registro:
                    e.target.value,
                })
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
            />

          </div>

          {/* FRECUENCIA */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Frecuencia

            </label>

            <select
              value={
                form.frecuencia
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  frecuencia:
                    e.target.value,
                })
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
            >

              <option value="">
                Seleccionar
              </option>

              <option value="Semanal">
                Semanal
              </option>

              <option value="Mensual">
                Mensual
              </option>

              <option value="Bimestral">
                Bimestral
              </option>

              <option value="Trimestral">
                Trimestral
              </option>

              <option value="Semestral">
                Semestral
              </option>

              <option value="Anual">
                Anual
              </option>

            </select>

          </div>

          {/* HORA INICIO */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Hora inicio

            </label>

            <input
              type="time"
              value={
                form.hora_inicio
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  hora_inicio:
                    e.target.value,
                })
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
            />

          </div>

          {/* HORA FINAL */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Hora final

            </label>

            <input
              type="time"
              value={
                form.hora_final
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  hora_final:
                    e.target.value,
                })
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
            />

          </div>

          {/* ESTACION */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Número estación

            </label>

            <input
              type="text"
              value={
                form.numero_estacion
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  numero_estacion:
                    e.target.value,
                })
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
            />

          </div>

          {/* CONTEO */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Conteo insectos voladores

            </label>

            <input
              type="number"
              value={
                form.conteo_insectos_voladores
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  conteo_insectos_voladores:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
            />

          </div>

        </div>

        {/* CHECKS */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* FEROMONA */}
          <div className="rounded-2xl border border-gray-200 p-5">

            <h3 className="mb-4 text-sm font-bold">

              Reposición feromona

            </h3>

            <div className="space-y-3">

              <label className="flex items-center gap-3 text-sm">

                <input
                  type="checkbox"
                  checked={
                    form.feromona_aplica
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      feromona_aplica:
                        e.target.checked,
                    })
                  }
                />

                Aplica

              </label>

              <label className="flex items-center gap-3 text-sm">

                <input
                  type="checkbox"
                  checked={
                    form.feromona_no_aplica
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      feromona_no_aplica:
                        e.target.checked,
                    })
                  }
                />

                No aplica

              </label>

            </div>

          </div>

          {/* DISPOSITIVO */}
          <div className="rounded-2xl border border-gray-200 p-5">

            <h3 className="mb-4 text-sm font-bold">

              Condición dispositivo

            </h3>

            <div className="space-y-3">

              <label className="flex items-center gap-3 text-sm">

                <input
                  type="checkbox"
                  checked={
                    form.dispositivo_funcional
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dispositivo_funcional:
                        e.target.checked,
                    })
                  }
                />

                Funcional

              </label>

              <label className="flex items-center gap-3 text-sm">

                <input
                  type="checkbox"
                  checked={
                    form.dispositivo_danado
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dispositivo_danado:
                        e.target.checked,
                    })
                  }
                />

                Dañado

              </label>

            </div>

          </div>

        </div>

        {/* MANTENIMIENTO */}
        <div className="mt-6 rounded-2xl border border-gray-200 p-5">

          <h3 className="mb-4 text-sm font-bold">

            Mantenimiento dispositivo

          </h3>

          <label className="flex items-center gap-3 text-sm">

            <input
              type="checkbox"
              checked={
                form.mantenimiento_aplica
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  mantenimiento_aplica:
                    e.target.checked,
                })
              }
            />

            Aplica

          </label>

        </div>

        {/* OBSERVACIONES */}
        <div className="mt-8">

          <label className="mb-2 block text-sm font-semibold text-gray-700">

            Observaciones

          </label>

          <textarea
            rows={5}
            value={
              form.observaciones
            }
            onChange={(e) =>
              setForm({
                ...form,
                observaciones:
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