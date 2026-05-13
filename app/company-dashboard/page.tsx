"use client";

import { useEffect, useState } from "react";

import {
  Building2,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Bell,
} from "lucide-react";

export default function CompanyDashboard() {
  const [company, setCompany] =
    useState<any>(null);

  useEffect(() => {
    const data =
      localStorage.getItem("company");

    if (!data) {
      window.location.href =
        "/company-login";

      return;
    }

    setCompany(JSON.parse(data));
  }, []);

  function logout() {
    localStorage.removeItem("company");

    window.location.href =
      "/company-login";
  }

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      {/* SIDEBAR */}
      <aside className="hidden w-72 flex-col border-r bg-white lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-4 border-b p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
            <Building2 size={30} />
          </div>

          <div>
            <h2 className="font-bold">
              {company.company_name}
            </h2>

            <p className="text-sm text-gray-500">
              Empresa
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-5">
          <div className="space-y-2">
            <button className="flex w-full items-center gap-3 rounded-2xl bg-black px-4 py-4 text-white">
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 transition hover:bg-gray-100">
              <Users size={20} />
              Empleados
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 transition hover:bg-gray-100">
              <Settings size={20} />
              Configuración
            </button>
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t p-5">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl bg-red-500 px-4 py-4 text-white transition hover:bg-red-600"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1">
        {/* TOPBAR */}
        <header className="flex items-center justify-between border-b bg-white px-6 py-5">
          <div>
            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>

            <p className="text-gray-500">
              Bienvenido nuevamente
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-2xl bg-gray-100 p-3">
              <Bell size={20} />
            </button>

            <div className="flex items-center gap-3 rounded-2xl bg-gray-100 px-4 py-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                <Building2 size={22} />
              </div>

              <div className="hidden md:block">
                <h3 className="font-semibold">
                  {company.manager_name}
                </h3>

                <p className="text-sm text-gray-500">
                  Administrador
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className="p-6">
          {/* STATS */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-gradient-to-r from-black to-gray-800 p-6 text-white shadow-xl">
              <p className="text-sm opacity-70">
                Empresa
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                Activa
              </h2>

              <p className="mt-2 text-sm opacity-70">
                Sistema funcionando
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Código Empresa
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                {company.company_code}
              </h2>

              <p className="mt-2 text-sm text-green-600">
                Cuenta verificada
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Plan
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                Premium
              </h2>

              <p className="mt-2 text-sm text-blue-600">
                SaaS Empresarial
              </p>
            </div>
          </div>

          {/* INFO */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Company Info */}
            <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Información Empresa
                </h2>

                <button className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                  Ver más
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
                  <Mail size={22} />

                  <div>
                    <p className="text-sm text-gray-500">
                      Correo
                    </p>

                    <h3 className="font-semibold">
                      {
                        company.company_email
                      }
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
                  <Phone size={22} />

                  <div>
                    <p className="text-sm text-gray-500">
                      Teléfono
                    </p>

                    <h3 className="font-semibold">
                      {
                        company.company_phone
                      }
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5 md:col-span-2">
                  <MapPin size={22} />

                  <div>
                    <p className="text-sm text-gray-500">
                      Dirección
                    </p>

                    <h3 className="font-semibold">
                      {company.address}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold">
                Accesos Rápidos
              </h2>

              <div className="space-y-4">
                <button className="flex w-full items-center justify-between rounded-2xl bg-gray-50 p-5 transition hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <Users size={22} />

                    <span className="font-semibold">
                      Empleados
                    </span>
                  </div>

                  <ChevronRight size={18} />
                </button>

                <button className="flex w-full items-center justify-between rounded-2xl bg-gray-50 p-5 transition hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <Settings size={22} />

                    <span className="font-semibold">
                      Configuración
                    </span>
                  </div>

                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}