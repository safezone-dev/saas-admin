"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PesticidesReviewPage() {

  const params = useParams();

  const workOrderId =
    params.id as string;

  const [loading,
    setLoading] =
    useState(true);

  const [workOrder,
    setWorkOrder] =
    useState<any>(null);

  const [application,
    setApplication] =
    useState<any>(null);

  const [products,
    setProducts] =
    useState<any[]>([]);

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    try {

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

      setWorkOrder(
        orderData
      );

      const {
        data: applicationData,
      } = await supabase
        .from(
          "administracion_plaguicidas"
        )
        .select("*")
        .eq(
          "orden_trabajo_id",
          workOrderId
        )
        .single();

      if (
        applicationData
      ) {

        setApplication(
          applicationData
        );

        const {
          data:
            productsData,
        } = await supabase
          .from(
            "administracion_plaguicidas_detalle"
          )
          .select("*")
          .eq(
            "aplicacion_id",
            applicationData.id
          );

        setProducts(
          productsData || []
        );

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  function getMethod(
    item: any
  ) {

    const methods = [];

    if (
      item.aspersion
    )
      methods.push(
        "Aspersión"
      );

    if (
      item.laqueo
    )
      methods.push(
        "Laqueo"
      );

    if (
      item.cebos
    )
      methods.push(
        "Cebos"
      );

    if (
      item.planchas_goma
    )
      methods.push(
        "Planchas Goma"
      );

    if (
      item.espolvoreo
    )
      methods.push(
        "Espolvoreo"
      );

    if (
      item.nebulizacion
    )
      methods.push(
        "Nebulización"
      );

    if (
      item.termonebulizacion
    )
      methods.push(
        "Termonebulización"
      );

    return methods.join(
      ", "
    );
  }

  if (loading) {

    return (
      <div className="p-8">
        Cargando...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-4 lg:p-6">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">

              Administración de Plaguicidas

            </h1>

            <p className="text-sm text-gray-500">

              Información registrada por el técnico

            </p>

          </div>

          <Link
            href="/company-dashboard/completed-orders"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm"
          >

            <ArrowLeft size={16} />

            Regresar

          </Link>

        </div>

        {/* DATOS ORDEN */}

        <div className="mb-6 grid gap-4 md:grid-cols-5">

          <InfoCard
            title="Empresa"
            value={
              workOrder?.companies
                ?.company_name || "-"
            }
          />

          <InfoCard
            title="Técnico"
            value={
              workOrder?.technicians
                ?.name || "-"
            }
          />

          <InfoCard
            title="Servicio"
            value={
              workOrder?.service_types
                ?.name || "-"
            }
          />

          <InfoCard
            title="Fecha"
            value={
              workOrder?.scheduled_date || "-"
            }
          />

          <InfoCard
            title="Estado"
            value={
              workOrder?.status || "-"
            }
          />

        </div>

        {/* DATOS GENERALES */}

        <div className="mb-6 grid gap-4 md:grid-cols-5">

          <InfoCard
            title="Fecha Inicio"
            value={
              application?.fecha_inicio || "-"
            }
          />

          <InfoCard
            title="Hora Inicio"
            value={
              application?.hora_inicio || "-"
            }
          />

          <InfoCard
            title="Hora Final"
            value={
              application?.hora_final || "-"
            }
          />

          <InfoCard
            title="Frecuencia"
            value={
              application?.frecuencia || "-"
            }
          />

          <InfoCard
            title="Productos"
            value={
              products.length
            }
          />

        </div>

        {/* OBSERVACIONES */}

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-3 text-lg font-bold">

            Observaciones Generales

          </h2>

          <p>

            {
              application?.observaciones_generales ||
              "Sin observaciones"
            }

          </p>

        </div>

        {/* TABLA */}

        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-4 py-3 text-left">
                    Producto
                  </th>

                  <th className="px-4 py-3 text-left">
                    Registro
                  </th>

                  <th className="px-4 py-3 text-left">
                    Organismo Meta
                  </th>

                  <th className="px-4 py-3 text-left">
                    Cantidad
                  </th>

                  <th className="px-4 py-3 text-left">
                    Dosis
                  </th>

                  <th className="px-4 py-3 text-left">
                    Método
                  </th>

                  <th className="px-4 py-3 text-left">
                    Área Tratada
                  </th>

                  <th className="px-4 py-3 text-left">
                    Observaciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.length === 0 && (

                  <tr>

                    <td
                      colSpan={8}
                      className="p-8 text-center"
                    >

                      No hay registros

                    </td>

                  </tr>

                )}

                {products.map(
                  (
                    item: any,
                    index: number
                  ) => (

                    <tr
                      key={index}
                      className="border-t"
                    >

                      <td className="px-4 py-3">
                        {item.nombre_producto}
                      </td>

                      <td className="px-4 py-3">
                        {item.numero_registro}
                      </td>

                      <td className="px-4 py-3">
                        {item.organismo_meta}
                      </td>

                      <td className="px-4 py-3">
                        {item.cantidad_usada}
                      </td>

                      <td className="px-4 py-3">
                        {item.dosis}
                      </td>

                      <td className="px-4 py-3">
                        {getMethod(item)}
                      </td>

                      <td className="px-4 py-3">
                        {item.area_tratada}
                      </td>

                      <td className="px-4 py-3">
                        {item.observaciones}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

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

    <div className="rounded-xl bg-white p-4 shadow-sm">

      <p className="text-xs uppercase text-gray-500">

        {title}

      </p>

      <p className="mt-2 font-semibold">

        {value}

      </p>

    </div>

  );
}