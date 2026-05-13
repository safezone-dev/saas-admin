"use client";

import { useEffect, useState } from "react";

import {
  Building2,
  Mail,
  Phone,
  MapPin,
  LogOut,
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
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6">
      {/* TOPBAR */}
      <div className="mb-8 flex items-center justify-between rounded-3xl bg-white px-8 py-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
            <Building2 size={30} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {company.company_name}
            </h1>

            <p className="text-gray-500">
              Workspace Dashboard
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-2xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
        >
          <LogOut size={20} />

          Salir
        </button>
      </div>

      {/* CONTENT */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* MAIN CARD */}
        <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Building2 size={28} />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Información Empresa
              </h2>

              <p className="text-gray-500">
                Datos registrados en el sistema
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            {/* CODE */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <p className="mb-2 text-sm font-medium text-gray-500">
                Código Empresa
              </p>

              <h3 className="text-2xl font-bold text-gray-800">
                {company.company_code}
              </h3>
            </div>

            {/* EMAIL */}
            <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <Mail
                  size={22}
                  className="text-blue-600"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Correo Empresa
                </p>

                <h3 className="font-semibold text-gray-800">
                  {company.company_email}
                </h3>
              </div>
            </div>

            {/* PHONE */}
            <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <Phone
                  size={22}
                  className="text-green-600"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Teléfono
                </p>

                <h3 className="font-semibold text-gray-800">
                  {company.company_phone}
                </h3>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <MapPin
                  size={22}
                  className="text-red-500"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Dirección
                </p>

                <h3 className="font-semibold text-gray-800">
                  {company.address}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* SIDE CARD */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Building2 size={32} />
          </div>

          <h2 className="text-3xl font-bold">
            Bienvenido
          </h2>

          <p className="mt-3 text-white/80">
            Tu empresa está conectada
            correctamente al sistema SaaS.
          </p>

          <div className="mt-10 rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-white/70">
              Administrador
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {company.manager_name}
            </h3>
          </div>

          <div className="mt-5 rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-white/70">
              Estado Plataforma
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Activa 🚀
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}