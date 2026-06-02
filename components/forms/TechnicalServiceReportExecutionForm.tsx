"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { supabase }
from "@/lib/supabase";

export default function TechnicalServiceReportExecutionForm({
  order,
}: any) {

  const router =
    useRouter();

  const [loading,
    setLoading] =
    useState(false);

  const [report,
    setReport] =
    useState<any>(null);

  const [technicianNotes,
    setTechnicianNotes] =
    useState("");

  const [serviceCompleted,
    setServiceCompleted] =
    useState(false);

  const [loadingReport,
    setLoadingReport] =
    useState(true);

  useEffect(() => {

    loadReport();

  }, []);

  async function loadReport() {

    try {

      setLoadingReport(true);

      const { data, error }
        = await supabase
          .from(
            "technical_service_reports"
          )
          .select("*")
          .eq(
            "work_order_id",
            order.id
          )
          .single();

      // NO EXISTE REPORTE
      if (error) {

        console.log(error);

        setReport(null);

        return;
      }

      setReport(data);

      setTechnicianNotes(
        data.technician_notes || ""
      );

      setServiceCompleted(
        data.service_completed ||
          false
      );

    } catch (error) {

      console.log(error);

      setReport(null);

    } finally {

      setLoadingReport(false);

    }
  }

  async function completeService() {

    try {
  
      setLoading(true);
  
      const registerDate =
        new Date()
          .toISOString()
          .split("T")[0];
  
      const startTime =
        report.start_time ||
        new Date()
          .toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );
  
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
          .update({
  
            technician_notes:
              technicianNotes,
  
            service_completed:
              serviceCompleted,
  
            register_date:
              registerDate,
  
            start_time:
              startTime,
  
            end_time:
              endTime,
  
            completed_at:
              new Date(),
  
          })
          .eq(
            "id",
            report.id
          );
  
      if (error) {
  
        console.log(error);
  
        alert(
          error.message
        );
  
        return;
      }
  
      // COMPLETAR ORDEN
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
        "Servicio finalizado correctamente"
      );
  
      router.push(
        "/company-dashboard/pending-orders"
      );
  
    } catch (error) {
  
      console.log(error);
  
      alert(
        "Error finalizando servicio"
      );
  
    } finally {
  
      setLoading(false);
  
    }
  }

  // LOADING
  if (loadingReport) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-100">

        <div className="rounded-2xl bg-white px-8 py-6 text-sm font-semibold shadow-sm">

          Cargando reporte...

        </div>

      </div>
    );
  }

  // NO REPORT
  if (!report) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">

        <div className="w-full max-w-lg rounded-[28px] bg-white p-8 text-center shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900">

            Reporte no disponible

          </h1>

          <p className="mt-3 text-sm text-gray-500">

            El reporte de servicio aún no ha sido generado por administración.

          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-7xl rounded-[24px] bg-white p-6 shadow-sm">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-2xl font-bold text-gray-900">

            Ejecución Servicio Técnico

          </h1>

          <p className="mt-1 text-sm text-gray-500">

            Información creada por administración

          </p>

        </div>

        {/* GENERAL */}
        <div className="grid gap-4 md:grid-cols-3">

          <ReadField
            label="Fecha registro"
            value={
              report.register_date
            }
          />

          <ReadField
            label="Hora inicio"
            value={
              report.start_time
            }
          />

          <ReadField
            label="Hora final"
            value={
              report.end_time
            }
          />

        </div>

        {/* ITEMS */}
        <div className="mt-8 space-y-6">

          {report.items?.map(
            (
              item: any,
              index: number
            ) => (

              <div
                key={index}
                className="rounded-[24px] border border-gray-200 p-5"
              >

                <h2 className="mb-5 text-lg font-bold text-gray-900">

                  Item #{index + 1}

                </h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                  <ReadField
                    label="Producto utilizado"
                    value={
                      item.product_used
                    }
                  />

                  <ReadField
                    label="Área"
                    value={
                      item.area
                    }
                  />

                  <ReadField
                    label="Área tratada"
                    value={
                      item.treated_area
                    }
                  />

                  <ReadField
                    label="Medio aplicación"
                    value={
                      item.application_method
                    }
                  />

                  <ReadField
                    label="Dosis"
                    value={
                      item.dosage
                    }
                  />

                  <ReadField
                    label="Plaga observada"
                    value={
                      item.observed_pest
                    }
                  />

                </div>

              </div>
            )
          )}

        </div>

        {/* OBSERVACIONES GENERALES */}
        <div className="mt-8">

          <label className="mb-2 block text-sm font-semibold text-gray-700">

            Observaciones generales

          </label>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm">

            {
              report.general_observations
            }

          </div>

        </div>

        {/* TECNICO */}
        <div className="mt-8">

          <label className="mb-2 block text-sm font-semibold text-gray-700">

            Observaciones del técnico

          </label>

          <textarea
            rows={5}
            value={
              technicianNotes
            }
            onChange={(e) =>
              setTechnicianNotes(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
          />

        </div>

        {/* CHECK */}
        <div className="mt-6">

          <label className="flex items-center gap-3 text-sm font-semibold">

            <input
              type="checkbox"
              checked={
                serviceCompleted
              }
              onChange={(e) =>
                setServiceCompleted(
                  e.target.checked
                )
              }
            />

            Servicio realizado

          </label>

        </div>

        {/* SAVE */}
        <button
          onClick={
            completeService
          }
          disabled={loading}
          className="mt-8 w-full rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white"
        >

          {loading
            ? "Finalizando..."
            : "Finalizar servicio"}

        </button>

      </div>

    </div>
  );
}

// READ FIELD
function ReadField({
  label,
  value,
}: any) {

  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">

        {label}

      </label>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">

        {value || "-"}

      </div>

    </div>
  );
}