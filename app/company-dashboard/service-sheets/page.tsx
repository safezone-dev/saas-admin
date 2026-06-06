"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ServiceSheetsPage() {

  const [loading, setLoading] =
    useState(true);

  const [sheets, setSheets] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  useEffect(() => {

    loadSheets();

  }, []);

  async function loadSheets() {

    const {
      data: sessionData
    } = await supabase.auth.getSession();
    
    console.log(
      "SESSION:",
      sessionData
    );
    
    alert(
      JSON.stringify(
        sessionData,
        null,
        2
      )
    );

    try {

      setLoading(true);

      const technician =
        JSON.parse(
          localStorage.getItem(
            "technician"
          ) || "{}"
        );

      if (!technician?.id) {

        setMessage(
          "No se encontró el técnico en la sesión."
        );

        return;
      }

      const { data, error } =
      await supabase
        .from("service_sheets")
        .select("*")
        .eq(
          "technician_id",
          technician.id
        );
    
    alert(
      `Registros encontrados: ${data?.length || 0}`
    );
    
    console.log(data);
    console.log(error);

      if (error) {

        console.log(error);

        setMessage(
          error.message
        );

        return;
      }

      setSheets(
        data || []
      );

    } catch (error: any) {

      console.log(error);

      setMessage(
        error.message
      );

    } finally {

      setLoading(false);

    }
  }

  if (loading) {

    return (

      <div className="p-8">

        Cargando hojas de servicio...

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8">

          <h1 className="text-3xl font-bold">

            Mis Hojas de Servicio

          </h1>

        </div>

        {message && (

          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">

            {message}

          </div>

        )}

        <div className="mb-4">

          Total hojas:

          {" "}

          <strong>

            {sheets.length}

          </strong>

        </div>

        {sheets.length === 0 ? (

          <div className="rounded-xl bg-white p-8 shadow">

            No tienes hojas asignadas.

          </div>

        ) : (

          <div className="overflow-hidden rounded-xl bg-white shadow">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="p-4 text-left">

                    ID

                  </th>

                  <th className="p-4 text-left">

                    Fecha

                  </th>

                  <th className="p-4 text-left">

                    Estado

                  </th>

                  <th className="p-4 text-left">

                    Acción

                  </th>

                </tr>

              </thead>

              <tbody>

                {sheets.map(
                  (sheet) => (

                    <tr
                      key={sheet.id}
                      className="border-t"
                    >

                      <td className="p-4">

                        {sheet.id}

                      </td>

                      <td className="p-4">

                        {
                          sheet.service_date
                        }

                      </td>

                      <td className="p-4">

                        {
                          sheet.status
                        }

                      </td>

                      <td className="p-4">

                        <Link
                          href={`/company-dashboard/service-sheets/${sheet.id}`}
                          className="rounded-lg bg-black px-4 py-2 text-white"
                        >

                          Abrir

                        </Link>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );
}