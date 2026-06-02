"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
} from "lucide-react";

export default function ReviewPage() {

  const params = useParams();

  const workOrderId =
    params.id;

    const [stations,
      setStations] =
      useState<any[]>([]);
    
    const [workOrder,
      setWorkOrder] =
      useState<any>(null);
    
    const [formData,
      setFormData] =
      useState<any>(null);
    
    const [serviceType,
      setServiceType] =
      useState("");

  async function loadData() {

    // WORK ORDER
    const {
      data: orderData,
    } = await supabase
      .from("work_orders")
      .select(`
        *,
        companies (
          company_name
        ),
        technicians (
          name
        ),
        service_types (
          name
        )
      `)
      .eq(
        "id",
        workOrderId
      )
      .single();

      if (orderData) {

        setWorkOrder(
          orderData
        );
      
        const serviceName =
          orderData?.service_types
            ?.name || "";
      
        setServiceType(
          serviceName
        );
      }

    // STATIONS
    if (
      orderData?.service_types
        ?.name ===
      "Monitoreo de Roedores"
    ) {
    
      const { data } =
        await supabase
          .from(
            "rodent_monitoring_forms"
          )
          .select("*")
          .eq(
            "work_order_id",
            workOrderId
          )
          .single();
    
      setFormData(data);
    }

  function getCapture(
    station: any
  ) {

    if (
      station.rodent_present
    ) {
      return "Presente";
    }

    if (
      station.rodent_not_present
    ) {
      return "No presente";
    }

    return "-";
  }

  function getBait(
    station: any
  ) {

    if (
      station.bait_applied
    ) {
      return "Aplicado";
    }

    if (
      station.bait_not_applied
    ) {
      return "No aplicado";
    }

    return "-";
  }

  function getEvidence(
    station: any
  ) {

    const values = [];

    if (
      station.evidence_total
    ) {
      values.push(
        "Total"
      );
    }

    if (
      station.evidence_partial
    ) {
      values.push(
        "Parcial"
      );
    }

    if (
      station.evidence_deterioration
    ) {
      values.push(
        "Deterioro"
      );
    }

    if (
      station.evidence_no_findings
    ) {
      values.push(
        "Sin hallazgo"
      );
    }

    return values.join(", ");
  }

  function getDevice(
    station: any
  ) {

    if (
      station.device_functional
    ) {
      return "Funcional";
    }

    if (
      station.device_damaged
    ) {
      return "Dañado";
    }

    return "-";
  }

  function getAdhesive(
    station: any
  ) {

    if (
      station.adhesive_functional
    ) {
      return "Funcional";
    }

    if (
      station.adhesive_replacement
    ) {
      return "Reemplazo";
    }

    return "-";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">

      {/* TOP */}
      <div className="mb-8 flex items-start justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Revisión Servicio
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Información operativa registrada
          </p>

        </div>

        {/* BACK */}
        <a
          href="/company-dashboard"
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100"
        >

          <ArrowLeft size={18} />

          Regresar

        </a>

      </div>

      {/* HEADER INFO */}
      <div className="mb-6 rounded-2xl bg-white p-6">

<pre>

  {JSON.stringify(
    formData,
    null,
    2
  )}

</pre>

</div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[30px] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            {/* HEAD */}
            <thead className="bg-gray-50">

              <tr className="border-b border-gray-200 text-left text-sm font-semibold text-gray-600">

                <th className="px-4 py-4">
                  Estación
                </th>

                <th className="px-4 py-4">
                  Captura
                </th>

                <th className="px-4 py-4">
                  Rodenticida
                </th>

                <th className="px-4 py-4">
                  Evidencia
                </th>

                <th className="px-4 py-4">
                  Dispositivo
                </th>

                <th className="px-4 py-4">
                  Adhesivo
                </th>

                <th className="px-4 py-4">
                  Limpieza
                </th>

                <th className="px-4 py-4 min-w-[300px]">
                  Observaciones
                </th>

              </tr>

            </thead>

            {/* BODY */}
            <tbody>

              {stations.length ===
                0 && (
                <tr>

                  <td
                    colSpan={8}
                    className="p-10 text-center text-sm text-gray-500"
                  >
                    No hay registros
                  </td>

                </tr>
              )}

              {stations.map(
                (station) => (

                  <tr
                    key={station.id}
                    className="border-b border-gray-100 text-sm hover:bg-gray-50"
                  >

                    <td className="px-4 py-5 font-semibold text-gray-900">
                      {
                        station.station_number
                      }
                    </td>

                    <td className="px-4 py-5 text-gray-700">
                      {getCapture(
                        station
                      )}
                    </td>

                    <td className="px-4 py-5 text-gray-700">
                      {getBait(
                        station
                      )}
                    </td>

                    <td className="px-4 py-5 text-gray-700">
                      {getEvidence(
                        station
                      ) || "-"}
                    </td>

                    <td className="px-4 py-5 text-gray-700">
                      {getDevice(
                        station
                      )}
                    </td>

                    <td className="px-4 py-5 text-gray-700">
                      {getAdhesive(
                        station
                      )}
                    </td>

                    <td className="px-4 py-5 text-gray-700">
                      {
                        station.cleaning
                          ? "Sí"
                          : "-"
                      }
                    </td>

                    <td className="px-4 py-5 text-gray-600">
                      {
                        station.observations ||
                        "-"
                      }
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function InfoCard({
  title,
  value,
}: any) {

  return (
    <div className="rounded-2xl bg-gray-50 p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-sm font-bold text-gray-900">
        {value}
      </p>

    </div>
  );
};
}