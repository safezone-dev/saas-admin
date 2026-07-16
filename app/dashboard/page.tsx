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

   {/* BIENVENIDA */}

<div className="mb-8 overflow-hidden rounded-[28px] bg-gradient-to-r from-black via-gray-900 to-gray-800 p-6 text-white shadow-lg lg:p-10">

<div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

  {/* TEXTO */}

  <div className="flex-1">

    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-300 sm:text-sm">

      PANEL ADMINISTRATIVO

    </p>

    <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">

      Bienvenido al Sistema

    </h1>

    <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">

      Desde este panel puedes administrar empresas,
      técnicos, administradores y órdenes de trabajo
      de forma rápida, segura y centralizada.

    </p>

  </div>

  {/* ICONO */}

  <div className="flex justify-center lg:justify-end">

    <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/10 backdrop-blur-md sm:h-28 sm:w-28 lg:h-32 lg:w-32">

      <ClipboardList
        size={56}
        className="text-white sm:h-16 sm:w-16"
      />

    </div>

  </div>

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

    

      </div>

    </div>
  );
}