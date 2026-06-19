"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldAlert } from "lucide-react";

export default function RodentReport({
  workOrder,
}: any) {

  const [report, setReport] =
    useState<any>(null);

  const [stations, setStations] =
    useState<any[]>([]);

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {

    const {
      data,
      error,
    } = await supabase
      .from("rodent_monitoring_forms")
      .select("*")
      .eq(
        "work_order_id",
        workOrder.id
      )
      .single();

    if (error || !data) {
      console.log(error);
      return;
    }

    setReport(data);

    // Las estaciones vienen en el JSON de rodent_monitoring_forms
    setStations(data.stations || []);
  }


  if (!report) {

    return (
      <div className="rounded-[24px] bg-white p-10 shadow-sm">
        Cargando reporte...
      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">

            <ShieldAlert size={28} />

          </div>

          <div>

            <h1 className="text-2xl font-bold">

              Monitoreo de Roedores

            </h1>

            <p className="text-gray-500">

              {workOrder.technicians?.name}

            </p>

          </div>

        </div>

      </div>

      {/* INFORMACIÓN */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-bold">

          Información General

        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <InfoField
            label="Fecha"
            value={
              report.register_date
            }
          />

          <InfoField
            label="Hora inicio"
            value={
              report.start_time
            }
          />

          <InfoField
            label="Hora final"
            value={
              report.end_time
            }
          />

          <InfoField
            label="Resultado"
            value={
              report.activity_detected
                ? "Actividad detectada"
                : "Sin actividad"
            }
          />

        </div>

      </div>

      {/* ESTACIONES */}
      <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

        <div className="border-b p-6">

          <h2 className="text-lg font-bold">

            Estaciones Revisadas

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                <th className="px-4 py-3">
                  Estación
                </th>

                <th className="px-4 py-3">
                  Roedor
                </th>

                <th className="px-4 py-3">
                  Cebo
                </th>

                <th className="px-4 py-3">
                  Dispositivo
                </th>

                <th className="px-4 py-3">
                  Evidencia
                </th>

                <th className="px-4 py-3">
                  Limpieza
                </th>

              </tr>

            </thead>

            <tbody>

              {stations.map(
                (station) => (

                  <tr
                    key={station.id}
                    className="border-t"
                  >

                    <td className="px-4 py-4">

                      {
                        station.station_number
                      }

                    </td>

                    <td className="px-4 py-4">

                      {station.rodent_present

                        ? "Presente"

                        : "No presente"}

                    </td>

                    <td className="px-4 py-4">

                      {station.bait_applied

                        ? "Aplicado"

                        : "No aplicado"}

                    </td>

                    <td className="px-4 py-4">

                      {station.device_functional

                        ? "Funcional"

                        : station.device_damaged

                          ? "Dañado"

                          : "-"}

                    </td>

                    <td className="px-4 py-4">

                      {station.evidence_total
                        ? "Total"

                        : station.evidence_partial
                        ? "Parcial"

                        : station.evidence_deterioration
                        ? "Deterioro"

                        : station.evidence_no_findings
                        ? "Sin hallazgos"

                        : "-"}

                    </td>

                    <td className="px-4 py-4">

                      {station.cleaning
                        ? "Sí"
                        : "No"}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* OBSERVACIONES */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-bold">

          Observaciones

        </h2>

        <div className="space-y-4">

          {stations
            .filter(
              (s) =>
                s.observations
            )
            .map(
              (station) => (

                <div
                  key={station.id}
                  className="rounded-2xl bg-gray-50 p-4"
                >

                  <strong>

                    {
                      station.station_number
                    }

                  </strong>

                  <p className="mt-2 text-gray-700">

                    {
                      station.observations
                    }

                  </p>

                </div>

              )
            )}

        </div>

      </div>

    </div>
  );
}

function InfoField({
  label,
  value,
}: any) {

  return (

    <div>

      <p className="text-sm text-gray-500">

        {label}

      </p>

      <p className="mt-1 font-semibold">

        {value || "-"}

      </p>

    </div>

  );
}