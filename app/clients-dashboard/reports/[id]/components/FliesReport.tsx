"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase }
from "@/lib/supabase";

import {
  Bug,
} from "lucide-react";

export default function FliesReport({
  workOrder,
}: any) {

  const [report,
    setReport] =
    useState<any>(null);

  const [stations,
    setStations] =
    useState<any[]>([]);

  useEffect(() => {

    loadReport();

  }, []);

  async function loadReport() {

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "monitoreo_moscas"
        )
        .select("*")
        .eq(
          "orden_trabajo_id",
          workOrder.id
        )
        .single();

    if (error || !data) {

      console.log(error);

      return;
    }

    setReport(data);

    loadStations(data.id);
  }

  async function loadStations(
    monitoreoId: string
  ) {

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "monitoreo_moscas_estaciones"
        )
        .select("*")
        .eq(
          "monitoreo_id",
          monitoreoId
        )
        .order(
          "numero_estacion",
          {
            ascending: true,
          }
        );

    if (error) {

      console.log(error);

      return;
    }

    setStations(data || []);
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

            <Bug size={28} />

          </div>

          <div>

            <h1 className="text-2xl font-bold">

              Monitoreo de Moscas

            </h1>

            <p className="text-gray-500">

              {workOrder.technicians?.name}

            </p>

          </div>

        </div>

      </div>

      {/* RESUMEN */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-bold">

          Información General

        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

          <InfoField
            label="Fecha"
            value={
              report.fecha_registro
            }
          />

          <InfoField
            label="Hora inicio"
            value={
              report.hora_inicio
            }
          />

          <InfoField
            label="Hora final"
            value={
              report.hora_final
            }
          />

          <InfoField
            label="Frecuencia"
            value={
              report.frecuencia
            }
          />

          <InfoField
            label="Resultado"
            value={
              report.con_actividad

                ? "Con actividad"

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

                  Conteo

                </th>

                <th className="px-4 py-3">

                  Feromona

                </th>

                <th className="px-4 py-3">

                  Dispositivo

                </th>

                <th className="px-4 py-3">

                  Mantenimiento

                </th>

              </tr>

            </thead>

            <tbody>

              {stations.map(
                (
                  station
                ) => (

                  <tr
                    key={
                      station.id
                    }
                    className="border-t"
                  >

                    <td className="px-4 py-4">

                      {
                        station.numero_estacion
                      }

                    </td>

                    <td className="px-4 py-4">

                      {
                        station.conteo_moscas
                      }

                    </td>

                    <td className="px-4 py-4">

                      {station.feromona_aplicado

                        ? "Aplicada"

                        : "No aplicada"}

                    </td>

                    <td className="px-4 py-4">

                      {station.dispositivo_funcional

                        ? "Funcional"

                        : "Dañado"}

                    </td>

                    <td className="px-4 py-4">

                      {station.mantenimiento_si

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

          {stations.map(
            (
              station
            ) => (

              station.observaciones && (

                <div
                  key={
                    station.id
                  }
                  className="rounded-2xl bg-gray-50 p-4"
                >

                  <strong>

                    {
                      station.numero_estacion
                    }

                  </strong>

                  <p className="mt-2 text-gray-700">

                    {
                      station.observaciones
                    }

                  </p>

                </div>

              )
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