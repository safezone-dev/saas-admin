"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  ClipboardCheck,
  LogOut,
} from "lucide-react";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  function logout() {

    localStorage.removeItem(
      "technician"
    );

    window.location.href =
      "/technician-login";
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 flex h-screen w-[250px] flex-col bg-[#111827] p-5 text-white shadow-xl">

        {/* LOGO */}
        <div className="mb-10">

          <h1 className="text-2xl font-bold">
            Técnico
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Panel operativo
          </p>

        </div>

        {/* MENU */}
        <nav className="flex flex-1 flex-col gap-2">

          <Link
            href="/company-dashboard"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-white/10"
          >

            <LayoutDashboard size={18} />

            Dashboard

          </Link>

          <Link
            href="/company-dashboard"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-white/10"
          >

            <ClipboardCheck size={18} />

            Servicios

          </Link>

          <Link
            href="/company-dashboard/pending-orders"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-white/10"
          >

            <ClipboardCheck size={18} />

            Pendientes

          </Link>

          <Link
            href="/company-dashboard/completed-orders"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-white/10"
          >

            <ClipboardCheck size={18} />

            Resueltas

          </Link>

          <Link
            href="/company-dashboard/reports"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-white/10"
          >

            <ClipboardCheck size={18} />

            Reportes

          </Link>


        </nav>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
        >

          <LogOut size={18} />

          Cerrar sesión

        </button>

      </aside>

      {/* CONTENT */}
      <main className="ml-[250px] min-h-screen flex-1 p-6">

        {children}

      </main>

    </div>
  );
}