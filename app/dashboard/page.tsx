"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Building2,
  Users,
  ShieldCheck,
} from "lucide-react";

export default function DashboardPage() {
  const [companies, setCompanies] =
    useState(0);

  const [technicians,
    setTechnicians] = useState(0);

  const [admins, setAdmins] =
    useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    // EMPRESAS
    const {
      count: companiesCount,
    } = await supabase
      .from("companies")
      .select("*", {
        count: "exact",
        head: true,
      });

    // TECNICOS
    const {
      count: techniciansCount,
    } = await supabase
      .from("technicians")
      .select("*", {
        count: "exact",
        head: true,
      });

    // ADMINS
    const {
      count: adminsCount,
    } = await supabase
      .from("administrators")
      .select("*", {
        count: "exact",
        head: true,
      });

    setCompanies(
      companiesCount || 0
    );

    setTechnicians(
      techniciansCount || 0
    );

    setAdmins(adminsCount || 0);
  }

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-4 text-xl text-gray-500">
          Resumen general del sistema
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {/* EMPRESAS */}
        <div className="rounded-[35px] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="rounded-3xl bg-blue-100 p-5">
              <Building2
                size={36}
                className="text-blue-600"
              />
            </div>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Empresas
            </span>
          </div>

          <h2 className="text-6xl font-bold text-gray-900">
            {companies}
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Empresas registradas
          </p>
        </div>

        {/* TECNICOS */}
        <div className="rounded-[35px] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="rounded-3xl bg-green-100 p-5">
              <Users
                size={36}
                className="text-green-600"
              />
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Técnicos
            </span>
          </div>

          <h2 className="text-6xl font-bold text-gray-900">
            {technicians}
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Técnicos registrados
          </p>
        </div>

        {/* ADMINS */}
        <div className="rounded-[35px] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="rounded-3xl bg-purple-100 p-5">
              <ShieldCheck
                size={36}
                className="text-purple-600"
              />
            </div>

            <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
              Administradores
            </span>
          </div>

          <h2 className="text-6xl font-bold text-gray-900">
            {admins}
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Administradores activos
          </p>
        </div>
      </div>
    </div>
  );
}