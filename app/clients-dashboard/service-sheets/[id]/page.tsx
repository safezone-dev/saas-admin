"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ServiceSheetDetailPage() {

  const params = useParams();
  const router = useRouter();

  const [sheet, setSheet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadSheet();

  }, []);

  async function loadSheet() {

    const { data, error } = await supabase

      .from("service_sheets")

      .select(`
        *,
        technicians!service_sheets_technician_id_fkey(
          full_name
        )
      `)

      .eq("id", params.id)

      .single();

    if (error) {

      console.error(error);

    } else {

      setSheet(data);

    }

    setLoading(false);

  }

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        Cargando...

      </div>

    );

  }

  if (!sheet) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        Hoja no encontrada

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-100 p-5">

      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow">

        <div className="mb-8 flex items-center justify-between">

          <h1 className="text-3xl font-bold">

            Hoja de Servicio

          </h1>

          <Link
            href="/clients-dashboard/service-sheets"
            className="rounded-xl bg-gray-200 px-5 py-3"
          >

            ← Volver

          </Link>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <Info
            title="Fecha"
            value={sheet.service_date}
          />

          <Info
            title="Estado"
            value={sheet.status}
          />

          <Info
            title="Técnico"
            value={sheet.technicians?.full_name}
          />

          <Info
            title="Frecuencia"
            value={sheet.frequency}
          />

        </div>

        <div className="mt-10">

  <h2 className="mb-4 text-2xl font-bold">

    Productos Aplicados

  </h2>

  <div className="overflow-x-auto rounded-2xl border border-gray-200">

    <table className="w-full">

      <thead className="bg-gray-100">

        <tr>

          <th className="p-4 text-left">Producto</th>

          <th className="p-4 text-left">Área</th>

          <th className="p-4 text-left">Área tratada</th>

          <th className="p-4 text-left">Método</th>

          <th className="p-4 text-left">Dosis</th>

          <th className="p-4 text-left">Plaga</th>

        </tr>

      </thead>

      <tbody>

        {sheet.items?.map((item: any, index: number) => (

          <tr
            key={index}
            className="border-t"
          >

            <td className="p-4">

              {item.product_used}

            </td>

            <td className="p-4">

              {item.area}

            </td>

            <td className="p-4">

              {item.treated_area}

            </td>

            <td className="p-4">

              {item.application_methods?.join(", ")}

            </td>

            <td className="p-4">

              {item.dosage}

            </td>

            <td className="p-4">

              {item.observed_pest}

            </td>

          </tr>

        ))}

      </tbody>

    </table>

    <div className="mt-10 grid gap-6 lg:grid-cols-2">

  <div className="rounded-2xl border border-gray-200 p-6">

    <h2 className="mb-4 text-xl font-bold">

      Observaciones del Administrador

    </h2>

    <p className="whitespace-pre-wrap text-gray-700">

      {sheet.admin_observations || "No se registraron observaciones."}

    </p>

  </div>

  <div className="rounded-2xl border border-gray-200 p-6">

    <h2 className="mb-4 text-xl font-bold">

      Observaciones del Técnico

    </h2>

    <p className="whitespace-pre-wrap text-gray-700">

      {sheet.technician_execution_observations ||
        sheet.technician_observations ||
        "No se registraron observaciones."}

    </p>

  </div>

</div>

  </div>

</div>

      </div>

    </div>

  );

}

function Info({
  title,
  value,
}: any) {

  return (

    <div className="rounded-2xl border p-5">

      <p className="text-sm text-gray-500">

        {title}

      </p>

      <p className="mt-2 font-semibold">

        {value || "-"}

      </p>

    </div>

  );

}