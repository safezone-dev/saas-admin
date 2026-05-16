"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [open,
    setOpen] =
    useState(false);

  function logout() {

    localStorage.removeItem(
      "technician"
    );

    window.location.href =
      "/technician-login";
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* MOBILE TOPBAR */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 lg:hidden">

        <div>

          <h1 className="text-lg font-bold text-gray-900">
            Técnico
          </h1>

        </div>

        <button
          onClick={() =>
            setOpen(!open)
          }
          className="rounded-xl bg-gray-100 p-2"
        >

          {open ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}

        </button>

      </div>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() =>
            setOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col bg-[#111827] p-5 text-white shadow-xl transition-all duration-300
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }
        lg:translate-x-0`}
      >

        {/* LOGO */}
        <div className="mb-10 flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold">
              Técnico
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Panel operativo
            </p>

          </div>

          {/* CLOSE MOBILE */}
          <button
            onClick={() =>
              setOpen(false)
            }
            className="lg:hidden"
          >

            <X size={22} />

          </button>

        </div>

        {/* MENU */}
        <nav className="flex flex-1 flex-col gap-2">

          <MenuItem
            href="/company-dashboard"
            icon={
              <LayoutDashboard
                size={18}
              />
            }
            label="Dashboard"
          />

          {/* NUEVO MODULO */}
          <MenuItem
            href="/company-dashboard/service-sheets"
            icon={
              <FileText
                size={18}
              />
            }
            label="Mis Hojas"
          />

          <MenuItem
            href="/company-dashboard/pending-orders"
            icon={
              <ClipboardList
                size={18}
              />
            }
            label="Órdenes Pendientes"
          />

          <MenuItem
            href="/company-dashboard/completed-orders"
            icon={
              <CheckCircle2
                size={18}
              />
            }
            label="Órdenes Respondidas"
          />

          <MenuItem
            href="/company-dashboard/reports"
            icon={
              <BarChart3
                size={18}
              />
            }
            label="Reportes"
          />

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
      <main className="min-h-screen pt-[80px] transition-all lg:ml-[260px] lg:pt-0">

        <div className="w-full">

          {children}

        </div>

      </main>

    </div>
  );
}

function MenuItem({
  href,
  icon,
  label,
}: any) {

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-white/10"
    >

      {icon}

      {label}

    </Link>
  );
}