"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  Building2,
  Users,
  UserCog,
  ClipboardList,
} from "lucide-react";

export default function DashboardPage() {

  const [companies,
    setCompanies] =
    useState(0);

  const [technicians,
    setTechnicians] =
    useState(0);

  const [admins,
    setAdmins] =
    useState(0);

  const [services,
    setServices] =
    useState(0);

  const [adminName,
    setAdminName] =
    useState("");

  useEffect(() => {

    loadDashboard();

    // GET ADMIN SESSION
    const adminData =
      localStorage.getItem(
        "admin"
      );

    if (adminData) {

      const admin =
        JSON.parse(
          adminData
        );

      setAdminName(
        admin.name || ""
      );
    }

  }, []);

  async function loadDashboard() {

    // COMPANIES
    const {
      count: companiesCount,
    } = await supabase
      .from("companies")
      .select("*", {
        count: "exact",
        head: true,
      });

    // TECHNICIANS
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

    // SERVICES
    const {
      count: servicesCount,
    } = await supabase
      .from("work_orders")
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

    setAdmins(
      adminsCount || 0
    );

    setServices(
      servicesCount || 0
    );
  }

  return (
    <div className="flex min-h-screen flex-col">

      {/* CONTENT */}
      <div className="flex-1">

        {/* HEADER */}
        <div className="mb-6 rounded-[28px] bg-white p-5 shadow-sm sm:p-6">

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard Administrativo
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Bienvenido{" "}
            <span className="font-semibold text-gray-800">
              {adminName}
            </span>
          </p>

        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <DashboardCard
            title="Empresas"
            value={companies}
            icon={
              <Building2
                size={22}
              />
            }
            color="blue"
          />

          <DashboardCard
            title="Técnicos"
            value={technicians}
            icon={
              <Users
                size={22}
              />
            }
            color="green"
          />

          <DashboardCard
            title="Administradores"
            value={admins}
            icon={
              <UserCog
                size={22}
              />
            }
            color="purple"
          />

          <DashboardCard
            title="Servicios"
            value={services}
            icon={
              <ClipboardList
                size={22}
              />
            }
            color="yellow"
          />

        </div>

      </div>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-gray-200 py-5 text-center">

        <p className="text-xs text-gray-500">
          Desarrollado por wiledwardmunoz
        </p>

      </footer>

    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  color,
}: any) {

  const styles =
    color === "green"
      ? "bg-green-50 text-green-900"
      : color === "purple"
      ? "bg-purple-50 text-purple-900"
      : color === "yellow"
      ? "bg-yellow-50 text-yellow-900"
      : "bg-blue-50 text-blue-900";

  return (
    <div className={`rounded-[28px] p-5 shadow-sm ${styles}`}>

      {/* TOP */}
      <div className="flex items-center justify-between">

        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">

          {title}

        </p>

        <div>

          {icon}

        </div>

      </div>

      {/* VALUE */}
      <div className="mt-6">

        <h2 className="text-4xl font-bold">

          {value}

        </h2>

      </div>

    </div>
  );
}