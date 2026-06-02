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

export default function TechnicalServiceReportForm({
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

      service_date:
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

      frequency: "",

      general_observations:
        "",

      items: [

        {
          product_used:
            "",

          area: "",

          area_treated_applied:
            false,

          area_treated_not_applied:
            false,

          aspersion:
            false,

          lacquered:
            false,

          bait:
            false,

          glue_boards:
            false,

          dusting:
            false,

          nebulization:
            false,

          thermonebulization:
            false,

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

          area_treated_applied:
            false,

          area_treated_not_applied:
            false,

          aspersion:
            false,

          lacquered:
            false,

          bait:
            false,

          glue_boards:
            false,

          dusting:
            false,

          nebulization:
            false,

          thermonebulization:
            false,

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
            "technical_service_reports"
          )
          .insert({
  
            work_order_id:
              order.id,
  
            service_date:
              form.service_date,
  
            start_time:
              form.start_time,
  
            end_time:
              endTime,
  
            frequency:
              form.frequency,
  
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
        "Reporte guardado correctamente"
      );
  
      router.push(
        "/company-dashboard/pending-orders"
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
    <div className="min-h-screen bg-gray-100 p-4 lg:p-6">

      <div className="mx-auto max-w-7xl rounded-[24px] bg-white p-6 shadow-sm">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-2xl font-bold text-gray-900">

            Reporte Servicio Técnico

          </h1>

          <p className="mt-1 text-sm text-gray-500">

            Registro técnico operativo

          </p>

        </div>

        {/* GENERAL */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <InputField
            label="Fecha realizado"
            type="date"
            value={
              form.service_date
            }
            onChange={(
              value: string
            ) =>
              setForm({
                ...form,
                service_date:
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
            label="Hora finalización"
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

          <SelectField
            label="Frecuencia"
            value={
              form.frequency
            }
            onChange={(
              value: string
            ) =>
              setForm({
                ...form,
                frequency:
                  value,
              })
            }
            options={[
              "Semanal",
              "Quincenal",
              "Mensual",
              "Bimensual",
              "Trimestral",
              "Semestral",
              "Anual",
            ]}
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

                {/* TOP */}
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

                {/* GRID */}
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

                {/* AREA */}
                <div className="mt-6">

                  <h3 className="mb-3 text-sm font-bold text-gray-900">

                    Área tratada

                  </h3>

                  <div className="flex gap-6">

                    <CheckboxField
                      label="Aplicado"
                      checked={
                        item.area_treated_applied
                      }
                      onChange={(
                        value: boolean
                      ) =>
                        updateItem(
                          index,
                          "area_treated_applied",
                          value
                        )
                      }
                    />

                    <CheckboxField
                      label="No aplicado"
                      checked={
                        item.area_treated_not_applied
                      }
                      onChange={(
                        value: boolean
                      ) =>
                        updateItem(
                          index,
                          "area_treated_not_applied",
                          value
                        )
                      }
                    />

                  </div>

                </div>

                {/* METHODS */}
                <div className="mt-6">

                  <h3 className="mb-3 text-sm font-bold text-gray-900">

                    Medio aplicación

                  </h3>

                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">

                    <CheckboxField
                      label="Aspersión"
                      checked={
                        item.aspersion
                      }
                      onChange={(
                        value: boolean
                      ) =>
                        updateItem(
                          index,
                          "aspersion",
                          value
                        )
                      }
                    />

                    <CheckboxField
                      label="Laqueo"
                      checked={
                        item.lacquered
                      }
                      onChange={(
                        value: boolean
                      ) =>
                        updateItem(
                          index,
                          "lacquered",
                          value
                        )
                      }
                    />

                    <CheckboxField
                      label="Cebo"
                      checked={
                        item.bait
                      }
                      onChange={(
                        value: boolean
                      ) =>
                        updateItem(
                          index,
                          "bait",
                          value
                        )
                      }
                    />

                    <CheckboxField
                      label="Planchas goma"
                      checked={
                        item.glue_boards
                      }
                      onChange={(
                        value: boolean
                      ) =>
                        updateItem(
                          index,
                          "glue_boards",
                          value
                        )
                      }
                    />

                    <CheckboxField
                      label="Espolvoreo"
                      checked={
                        item.dusting
                      }
                      onChange={(
                        value: boolean
                      ) =>
                        updateItem(
                          index,
                          "dusting",
                          value
                        )
                      }
                    />

                    <CheckboxField
                      label="Nebulización"
                      checked={
                        item.nebulization
                      }
                      onChange={(
                        value: boolean
                      ) =>
                        updateItem(
                          index,
                          "nebulization",
                          value
                        )
                      }
                    />

                    <CheckboxField
                      label="Termonebulización"
                      checked={
                        item.thermonebulization
                      }
                      onChange={(
                        value: boolean
                      ) =>
                        updateItem(
                          index,
                          "thermonebulization",
                          value
                        )
                      }
                    />

                  </div>

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

            Observación general

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
          onClick={saveForm}
          disabled={loading}
          className="mt-8 w-full rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white"
        >

          {loading
            ? "Guardando..."
            : "Guardar Reporte"}

        </button>

      </div>

    </div>
  );
}

// COMPONENTS

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
        className="w-full rounded-2xl border border-gray-200 p-3 text-sm"
      >

        <option value="">
          Seleccionar
        </option>

        {options.map(
          (
            option: string
          ) => (

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