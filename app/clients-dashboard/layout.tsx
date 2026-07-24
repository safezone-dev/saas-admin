"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [client, setClient] =
    useState<any>(null);

  const [open, setOpen] =
    useState(false);

  useEffect(() => {

    const storedClient =
      localStorage.getItem(
        "client"
      );

    if (!storedClient) {

      router.push(
        "/client-login"
      );

      return;
    }

    setClient(
      JSON.parse(
        storedClient
      )
    );

  }, [router]);

  function logout() {

    localStorage.removeItem(
      "client"
    );

    router.push(
      "/client-login"
    );
  }

  if (!client) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        Cargando...

      </div>

    );
  }

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside
        className={`
          fixed z-50 h-full w-72 bg-black text-white transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >

        <div className="flex h-full flex-col">

          {/* HEADER */}
          <div className="border-b border-white/10 p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold">

                  Portal Cliente

                </h2>

                <p className="mt-1 text-sm text-gray-400">

                  {client.company_name}

                </p>

              </div>

              <button
                className="lg:hidden"
                onClick={() =>
                  setOpen(false)
                }
              >

                <X size={24} />

              </button>

            </div>

          </div>

          {/* MENU */}
          <nav className="flex-1 space-y-2 p-4">

  <MenuItem
    href="/clients-dashboard"
    icon={<LayoutDashboard size={18} />}
    title="Dashboard"
  />

  <MenuItem
    href="/clients-dashboard/work-orders"
    icon={<ClipboardList size={18} />}
    title="Órdenes de Servicio"
  />

  <MenuItem
    href="/clients-dashboard/service-sheets"
    icon={<FileText size={18} />}
    title="Hojas de Servicio"
  />

  <MenuItem
    href="/clients-dashboard/reports"
    icon={<FileText size={18} />}
    title="Reportes"
  />

  <MenuItem
    href="/clients-dashboard/profile"
    icon={<User size={18} />}
    title="Mi Perfil"
  />

</nav>
          {/* LOGOUT */}
          <div className="border-t border-white/10 p-4">

            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
            >

              <LogOut size={18} />

              Cerrar sesión

            </button>

          </div>

        </div>

      </aside>

      {/* CONTENT */}
      <div className="flex-1 lg:ml-72">

        {/* MOBILE HEADER */}
        <header className="sticky top-0 z-40 flex items-center justify-between bg-white px-5 py-4 shadow-sm lg:hidden">

          <button
            onClick={() =>
              setOpen(true)
            }
          >

            <Menu size={24} />

          </button>

          <h1 className="font-bold">

            Portal Cliente

          </h1>

        </header>

        <main className="p-5">

          {children}

        </main>

      </div>

    </div>
  );
}

function MenuItem({
  href,
  icon,
  title,
}: any) {

  return (

    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/10"
    >

      {icon}

      {title}

    </Link>

  );
}