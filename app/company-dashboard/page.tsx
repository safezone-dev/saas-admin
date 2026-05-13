"use client";

import { useEffect, useState } from "react";

import {
  Building2,
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
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
      <div className="flex min-h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-black text-white shadow-lg">
            <Building2 size={38} />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              {company.company_name}
            </h1>

            <p className="mt-1 text-gray-600">
              Dashboard Empresarial
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-2xl bg-red-500 px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-red-600"
        >
          <LogOut size={20} />

          Cerrar Sesión
        </button>
      </div>

      {/* Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Código Empresa
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {company.company_code}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Estado
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-600">
            Activa
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Sistema
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            SaaS
          </h2>
        </div>
      </div>

      {/* Información */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-8 text-3xl font-bold">
          Información Empresa
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
            <User size={24} />

            <div>
              <p className="text-sm text-gray-500">
                Encargado
              </p>

              <h3 className="font-semibold">
                {company.manager_name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
            <Mail size={24} />

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <h3 className="font-semibold">
                {company.company_email}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
            <Phone size={24} />

            <div>
              <p className="text-sm text-gray-500">
                Teléfono
              </p>

              <h3 className="font-semibold">
                {company.company_phone}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
            <MapPin size={24} />

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
    </div>
  );
}