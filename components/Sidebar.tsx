"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

import { supabase } from "../lib/supabase";

export default function Sidebar() {
  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <aside className="flex h-screen w-72 flex-col bg-black text-white">
      {/* Logo */}
      <div className="border-b border-gray-800 p-6">
        <h1 className="text-3xl font-bold">
          SaaS Admin
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Plataforma Empresarial
        </p>
      </div>

      {/* Menu */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-900"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            href="/companies"
            className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-900"
          >
            <Building2 size={20} />
            Empresas
          </Link>

          <Link
            href="/admins"
            className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-900"
          >
            <Users size={20} />
            Administradores
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-900"
          >
            <Settings size={20} />
            Configuración
          </Link>
        </nav>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-900"
        >
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}