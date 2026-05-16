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

export default function TechnicalServiceReportAdminForm({
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

      register_date: "",

      start_time: "",

      end_time: "",

      general_observations:
        "",

      items: [

        {
          product_used:
            "",

          area: "",

          treated_area:
            "",

          application_method:
            "",

          dosage:
            "",

          observed_pest:
            "",
        },

      ],
    });

  // ADD ITEM
  function addItem() {

    setForm({

      ...form,

      items: [

        ...form.items,

        {

          product_used:
            "",

          area: "",

          treated_area:
            "",

          application_method:
            "",

          dosage:
            "",

          observed_pest:
            "",
        },

      ],
    });
  }

  // DELETE ITEM
  function removeItem(
    index: number
  ) {

    const updated =
      [...form.items];

    updated.splice(
      index,
      1
    );

    setForm({
      ...form,
      items: updated,
    });
  }

  // UPDATE ITEM
  function updateItem(
    index: number,
    field: string,
    value: any
  ) {

    const updated =
      [...form.items];

    updated[index] = {

      ...updated[index],

      [field]: value,
    };

    setForm({
      ...form,
      items: updated,
    });
  }

  // SAVE
  async function saveReport() {

    try {

      setLoading(true);

      const { error } =
        await supabase
          .from(
            "technical_service_reports"
          )
          .insert({

            work_order_id:
              order.id,

            register_date:
              form.register_date,

            start_time:
              form.start_time,

            end_time:
              form.end_time,

            items:
              form.items,

            general_observations:
              form.general_observations,

          });

      if (error) {

        console.log(error);

        alert(
          error.message
        );

        return;
      }

      alert(
        "Reporte creado correctamente"
      );

      router.push(
        "/dashboard/work-orders"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Error guardando reporte"
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

            Crear Reporte Técnico

          </h1>

          <p className="mt-1 text-sm text-gray-500">

            Formulario administrativo

          </p>

        </div>

        {/* GENERAL */}
        <div className="grid gap-4 md:grid-cols-3">

          <InputField
            label="Fecha registro"
            type="date"
            value={
              form.register_date
            }
            onChange={(
              value: string
            ) =>
              setForm({
                ...form,
                register_date:
                  value,
              })
            }
          />

          <InputField
            label="Hora inicio"
            type="time"
            value={
              form.start_time
            }
            onChange={(
              value: string
            ) =>
              setForm({
                ...form,
                start_time:
                  value,
              })
            }
          />

          <InputField
            label="Hora final"
            type="time"
            value={
              form.end_time
            }
            onChange={(
              value: string
            ) =>
              setForm({
                ...form,
                end_time:
                  value,
              })
            }
          />

        </div>

        {/* ITEMS */}
        <div className="mt-8 space-y-6">

          {form.items.map(
            (
              item,
              index
            ) => (

              <div
                key={index}
                className="rounded-[24px] border border-gray-200 p-5"
              >

                <div className="mb-5 flex items-center justify-between">

                  <h2 className="text-lg font-bold text-gray-900">

                    Item #{index + 1}

                  </h2>

                  {form.items
                    .length >
                    1 && (

                    <button
                      onClick={() =>
                        removeItem(
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

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                  <InputField
                    label="Producto utilizado"
                    value={
                      item.product_used
                    }
                    onChange={(
                      value: string
                    ) =>
                      updateItem(
                        index,
                        "product_used",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Área"
                    value={
                      item.area
                    }
                    onChange={(
                      value: string
                    ) =>
                      updateItem(
                        index,
                        "area",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Área tratada"
                    value={
                      item.treated_area
                    }
                    onChange={(
                      value: string
                    ) =>
                      updateItem(
                        index,
                        "treated_area",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Medio aplicación"
                    value={
                      item.application_method
                    }
                    onChange={(
                      value: string
                    ) =>
                      updateItem(
                        index,
                        "application_method",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Dosis"
                    value={
                      item.dosage
                    }
                    onChange={(
                      value: string
                    ) =>
                      updateItem(
                        index,
                        "dosage",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Plaga observada"
                    value={
                      item.observed_pest
                    }
                    onChange={(
                      value: string
                    ) =>
                      updateItem(
                        index,
                        "observed_pest",
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
          onClick={addItem}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
        >

          <Plus size={16} />

          Agregar Item

        </button>

        {/* OBS */}
        <div className="mt-8">

          <label className="mb-2 block text-sm font-semibold text-gray-700">

            Observaciones generales

          </label>

          <textarea
            rows={5}
            value={
              form.general_observations
            }
            onChange={(e) =>
              setForm({
                ...form,
                general_observations:
                  e.target.value,
              })
            }
            className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
          />

        </div>

        {/* SAVE */}
        <button
          onClick={saveReport}
          disabled={loading}
          className="mt-8 w-full rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white"
        >

          {loading
            ? "Guardando..."
            : "Crear reporte"}

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