"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  function logout() {
    localStorage.removeItem("admin");

    window.location.href = "/login";
  }

  const menu = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Empresas",
      href: "/dashboard/companies",
      icon: Building2,
    },

    {
      name: "Administradores",
      href: "/dashboard/administrators",
      icon: Building2,
    },

    {
      name: "Ordenes",
      href: "/dashboard/work-orders",
      icon: Building2,
    },

    {
      name: "Técnicos",
      href: "/dashboard/technicians",
      icon: Users,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-gray-200 bg-white">
      {/* LOGO */}
      <div className="border-b border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-800">
          MJR Admin
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sistema MJR Ingeniería
        </p>
      </div>

      {/* MENU */}
      <div className="flex-1 p-5">
        <div className="space-y-3">
          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={22} />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-100 p-5">
        <button
          onClick={logout}
          className="flex w-full items-center gap-4 rounded-2xl bg-red-500 px-5 py-4 text-white transition hover:bg-red-600"
        >
          <LogOut size={20} />

          <span className="font-medium">
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  );
}