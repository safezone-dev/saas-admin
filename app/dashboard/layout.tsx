"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  ClipboardList,
  FileText,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [open,
    setOpen] =
    useState(false);

  function logout() {

    localStorage.removeItem(
      "admin"
    );

    window.location.href =
      "/login";
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* MOBILE TOPBAR */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 lg:hidden">

        <div>

          <h1 className="text-lg font-bold text-gray-900">
            Dashboard
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
              Admin
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Panel administrativo
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
            href="/dashboard"
            icon={
              <LayoutDashboard
                size={18}
              />
            }
            label="Dashboard"
          />

          <MenuItem
            href="/dashboard/companies"
            icon={
              <Building2
                size={18}
              />
            }
            label="Empresas"
          />

          <MenuItem
            href="/dashboard/technicians"
            icon={
              <Users
                size={18}
              />
            }
            label="Técnicos"
          />

          <MenuItem
            href="/dashboard/administrators"
            icon={
              <UserCog
                size={18}
              />
            }
            label="Administradores"
          />

          <MenuItem
            href="/dashboard/work-orders"
            icon={
              <ClipboardList
                size={18}
              />
            }
            label="Servicios"
          />

          {/* NUEVO MODULO */}
          <MenuItem
            href="/dashboard/service-sheets"
            icon={
              <FileText
                size={18}
              />
            }
            label="Hojas de Servicio"
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

        <div className="w-full p-3 sm:p-4 lg:p-6">

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