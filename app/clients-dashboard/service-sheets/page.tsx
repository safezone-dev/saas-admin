"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ClientServiceSheetsPage() {

  const router = useRouter();

const [client, setClient] = useState<any>(null);

const [serviceSheets, setServiceSheets] = useState<any[]>([]);

const [loading, setLoading] = useState(true);

useEffect(() => {

  const storedClient = localStorage.getItem("client");

  if (!storedClient) {

    router.push("/client-login");

    return;

  }

  const clientData = JSON.parse(storedClient);

  setClient(clientData);

  loadServiceSheets(clientData.id);

}, []);

async function loadServiceSheets(companyId: string) {

  setLoading(true);

  const { data, error } = await supabase
    .from("service_sheets")
    .select(`
      id,
      service_date,
      status,
      items,
      technician_id,
      technicians!service_sheets_technician_id_fkey(
        id,
        full_name
      )
    `)
    .eq("company_id", companyId)
    .order("service_date", {
      ascending: false,
    });

  if (error) {

    console.error(error);

  } else {

    console.log(JSON.stringify(data, null, 2));// <-- Agrega esta línea

    setServiceSheets(data || []);

  }

  setLoading(false);

}



  return (

    <div className="min-h-screen bg-gray-100 p-5">

      <div className="mx-auto max-w-7xl">

        <div className="rounded-[30px] bg-white p-8 shadow-sm">

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold">

                Hojas de Servicio

              </h1>

              <p className="mt-2 text-gray-500">

                Consulte el historial de servicios realizados.

              </p>

            </div>

            <Link
              href="/clients-dashboard"
              className="rounded-2xl bg-gray-200 px-5 py-3 text-sm font-semibold"
            >

              ← Volver

            </Link>

          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-4 text-left">

                    Fecha

                  </th>

                  <th className="p-4 text-left">

                    Técnico

                  </th>

                  <th className="p-4 text-left">

                    Estado

                  </th>

                  <th className="p-4 text-center">

                    Productos

                  </th>

                  <th className="p-4 text-center">

                    Acción

                  </th>

                </tr>

              </thead>

              <tbody>

{loading ? (

  <tr>

    <td
      colSpan={5}
      className="p-10 text-center"
    >

      Cargando hojas de servicio...

    </td>

  </tr>

) : serviceSheets.length === 0 ? (

  <tr>

    <td
      colSpan={5}
      className="p-10 text-center text-gray-500"
    >

      No existen hojas de servicio registradas.

    </td>

  </tr>

) : (

  serviceSheets.map((sheet: any) => (

    <tr
      key={sheet.id}
      className="border-t"
    >

      <td className="p-4">

        {sheet.service_date}

      </td>

      <td className="p-4">

        {sheet.technicians?.full_name ?? "-"}

      </td>

      <td className="p-4">

        {sheet.status}

      </td>

      <td className="p-4 text-center">

        {Array.isArray(sheet.items)
          ? sheet.items.length
          : 0}

      </td>

      <td className="p-4 text-center">

      <Link
  href={`/clients-dashboard/service-sheets/${sheet.id}`}
  className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
>
  Ver
</Link>

      

      </td>

    </tr>

  ))

)}

</tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}