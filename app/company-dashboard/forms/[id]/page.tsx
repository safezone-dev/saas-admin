"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  Plus,
  Trash2,
} from "lucide-react";

export default function RodentFormPage() {

  const params = useParams();

  const workOrderId = params.id;

  const [stations,
    setStations] =
    useState([
      createStation(),
    ]);

  function createStation() {
    return {

      station_number: "",

      rodent_present: false,
      rodent_not_present: false,

      bait_applied: false,
      bait_not_applied: false,

      evidence_total: false,
      evidence_partial: false,
      evidence_deterioration: false,
      evidence_no_findings: false,

      device_functional: false,
      device_damaged: false,

      adhesive_functional: false,
      adhesive_replacement: false,

      cleaning: false,

      observations: "",
    };
  }

  function addStation() {
    setStations([
      ...stations,
      createStation(),
    ]);
  }

  function removeStation(
    index: number
  ) {

    const updated =
      [...stations];

    updated.splice(index, 1);

    setStations(updated);
  }

  function updateStation(
    index: number,
    field: string,
    value: any
  ) {

    const updated =
      [...stations];

    (
      updated[index] as any
    )[field] = value;

    setStations(updated);
  }

  async function saveForm() {

    const payload =
      stations.map(
        (station) => ({
          work_order_id:
            workOrderId,

          ...station,
        })
      );

    // GUARDAR FORMULARIO
    const { error } =
      await supabase
        .from("rodent_forms")
        .insert(payload);

    if (error) {
      alert(error.message);
      return;
    }

    // ACTUALIZAR STATUS
    const {
      error: updateError,
    } = await supabase
      .from("work_orders")
      .update({
        status: "completed",
      })
      .eq("id", workOrderId);

    if (updateError) {
      alert(updateError.message);
      return;
    }

    // ALERTA
    alert(
      "Formulario guardado correctamente"
    );

    // REDIRECT
    window.location.href =
      "/company-dashboard";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Monitoreo de Roedores
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Registro técnico operativo
          </p>

        </div>

        <button
          onClick={addStation}
          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
        >
          + Estación
        </button>

      </div>

      {/* STATIONS */}
      <div className="space-y-6">

        {stations.map(
          (station, index) => (
            <div
              key={index}
              className="rounded-[30px] bg-white p-6 shadow-sm"
            >

              {/* TOP */}
              <div className="mb-6 flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Estación #
                    {index + 1}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Inspección operativa
                  </p>

                </div>

                {stations.length >
                  1 && (
                  <button
                    onClick={() =>
                      removeStation(
                        index
                      )
                    }
                    className="rounded-2xl bg-red-100 p-3 text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

              </div>

              {/* NUMERO */}
              <Input
                label="Número Estación"
                value={
                  station.station_number
                }
                onChange={(v: string) =>
                  updateStation(
                    index,
                    "station_number",
                    v
                  )
                }
              />

              {/* CAPTURA */}
              <SectionTitle
                title="Captura de roedor"
              />

              <div className="grid gap-4 md:grid-cols-2">

                <Checkbox
                  label="Presente"
                  checked={
                    station.rodent_present
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "rodent_present",
                      v
                    )
                  }
                />

                <Checkbox
                  label="No presente"
                  checked={
                    station.rodent_not_present
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "rodent_not_present",
                      v
                    )
                  }
                />

              </div>

              {/* RODENTICIDA */}
              <SectionTitle
                title="Reposición de rodenticida"
              />

              <div className="grid gap-4 md:grid-cols-2">

                <Checkbox
                  label="Aplicado"
                  checked={
                    station.bait_applied
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "bait_applied",
                      v
                    )
                  }
                />

                <Checkbox
                  label="No aplicado"
                  checked={
                    station.bait_not_applied
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "bait_not_applied",
                      v
                    )
                  }
                />

              </div>

              {/* EVIDENCIA */}
              <SectionTitle
                title="Tipo de evidencia encontrada"
              />

              <div className="grid gap-4 md:grid-cols-2">

                <Checkbox
                  label="Consumo total"
                  checked={
                    station.evidence_total
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "evidence_total",
                      v
                    )
                  }
                />

                <Checkbox
                  label="Consumo parcial"
                  checked={
                    station.evidence_partial
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "evidence_partial",
                      v
                    )
                  }
                />

                <Checkbox
                  label="Deterioro"
                  checked={
                    station.evidence_deterioration
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "evidence_deterioration",
                      v
                    )
                  }
                />

                <Checkbox
                  label="Sin hallazgo"
                  checked={
                    station.evidence_no_findings
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "evidence_no_findings",
                      v
                    )
                  }
                />

              </div>

              {/* DISPOSITIVO */}
              <SectionTitle
                title="Condición dispositivo"
              />

              <div className="grid gap-4 md:grid-cols-2">

                <Checkbox
                  label="Funcional"
                  checked={
                    station.device_functional
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "device_functional",
                      v
                    )
                  }
                />

                <Checkbox
                  label="Dañado"
                  checked={
                    station.device_damaged
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "device_damaged",
                      v
                    )
                  }
                />

              </div>

              {/* ADHESIVO */}
              <SectionTitle
                title="Estado del adhesivo"
              />

              <div className="grid gap-4 md:grid-cols-2">

                <Checkbox
                  label="Funcional"
                  checked={
                    station.adhesive_functional
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "adhesive_functional",
                      v
                    )
                  }
                />

                <Checkbox
                  label="Reemplazo"
                  checked={
                    station.adhesive_replacement
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "adhesive_replacement",
                      v
                    )
                  }
                />

              </div>

              {/* MANTENIMIENTO */}
              <SectionTitle
                title="Mantenimiento dispositivo"
              />

              <div className="grid gap-4">

                <Checkbox
                  label="Limpieza"
                  checked={
                    station.cleaning
                  }
                  onChange={(v:boolean)=>
                    updateStation(
                      index,
                      "cleaning",
                      v
                    )
                  }
                />

              </div>

              {/* OBS */}
              <div className="mt-8">

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Observaciones
                </label>

                <textarea
                  rows={4}
                  value={
                    station.observations
                  }
                  onChange={(e)=>
                    updateStation(
                      index,
                      "observations",
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none"
                />

              </div>

            </div>
          )
        )}

      </div>

      {/* SAVE */}
      <button
        onClick={saveForm}
        className="mt-8 w-full rounded-2xl bg-blue-600 py-5 text-sm font-semibold text-white"
      >
        Guardar Formulario
      </button>

    </div>
  );
}

function SectionTitle({
  title,
}: any) {

  return (
    <h3 className="mt-8 mb-4 text-lg font-bold text-gray-900">
      {title}
    </h3>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: any) {

  return (
    <label className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4">

      <input
        type="checkbox"
        checked={checked}
        onChange={(e)=>
          onChange(
            e.target.checked
          )
        }
      />

      <span className="text-sm text-gray-700">
        {label}
      </span>

    </label>
  );
}

function Input({
  label,
  value,
  onChange,
}: any) {

  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e)=>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none"
      />

    </div>
  );
}