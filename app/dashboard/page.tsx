"use client";

import Link from "next/link";

import {
  Building2,
  Users,
  ShieldCheck,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {

  const cards = [

    {
      title: "Empresas",
      description:
        "Administración y gestión de empresas",
      icon: Building2,
      href: "/dashboard/companies",
    },

    {
      title: "Técnicos",
      description:
        "Administración de técnicos",
      icon: Users,
      href: "/dashboard/technicians",
    },

    {
      title: "Administradores",
      description:
        "Gestión de administradores",
      icon: ShieldCheck,
      href: "/dashboard/administrators",
    },

    {
      title: "Órdenes",
      description:
        "Gestión de órdenes de trabajo",
      icon: ClipboardList,
      href: "/dashboard/work-orders",
    },

  ];

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-900">

              Dashboard

            </h1>

            <p className="mt-1 text-sm text-gray-500">

              Panel principal del sistema

            </p>

          </div>

        </div>

        {/* GRID */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {cards.map((card, index) => {

            const Icon = card.icon;

            return (
              <Link
                key={index}
                href={card.href}
                className="group overflow-hidden rounded-[24px] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">

                  <Icon size={22} />

                </div>

                <h2 className="text-lg font-bold text-gray-900">

                  {card.title}

                </h2>

                <p className="mt-2 text-sm text-gray-500">

                  {card.description}

                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-black">

                  Ver módulo

                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />

                </div>

              </Link>
            );
          })}

        </div>

        {/* PANEL */}
        <div className="mt-8 rounded-[24px] bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">

            Bienvenido al sistema

          </h2>

          <p className="mt-2 text-sm text-gray-500">

            Desde este panel puedes administrar empresas,
            técnicos, administradores y órdenes de trabajo.

          </p>

        </div>

      </div>

    </div>
  );
}