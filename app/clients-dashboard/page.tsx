"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function ClientsDashboard() {

  const router =
    useRouter();

  const [client,
    setClient] =
    useState<any>(null);

  useEffect(() => {

    const storedClient =
      localStorage.getItem(
        "client"
      );

    if (!storedClient) {

      router.push(
        "/client-login"
      );

      return;
    }

    setClient(
      JSON.parse(
        storedClient
      )
    );

  }, [router]);

  if (!client) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        Cargando...

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-5">

      <div className="mx-auto max-w-7xl">

        <div className="rounded-[30px] bg-white p-8 shadow-sm">

          <h1 className="text-3xl font-bold text-gray-900">

            Bienvenido

          </h1>

          <p className="mt-2 text-gray-600">

            {client.company_name}

          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <InfoCard
              title="Código"
              value={
                client.company_code
              }
            />

            <InfoCard
              title="Correo"
              value={
                client.company_email
              }
            />

            <InfoCard
              title="Responsable"
              value={
                client.responsible_name
              }
            />

            <InfoCard
              title="Teléfono"
              value={
                client.client_phone
              }
            />

          </div>

          <button
            onClick={() => {

              localStorage.removeItem(
                "client"
              );

              router.push(
                "/client-login"
              );

            }}
            className="mt-8 rounded-2xl bg-black px-6 py-4 text-white"
          >

            Cerrar sesión

          </button>

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

    <div className="rounded-2xl border border-gray-200 p-5">

      <p className="text-sm text-gray-500">

        {title}

      </p>

      <p className="mt-2 font-semibold text-gray-900">

        {value || "-"}

      </p>

    </div>

  );
}