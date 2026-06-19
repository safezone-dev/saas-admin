"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  Building2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function ClientLoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  async function login() {

    if (!email || !password) {

      alert(
        "Completa todos los campos"
      );

      return;
    }

    const {
      data,
      error,
    } =
      await supabase
        .from("companies")
        .select("*")
        .eq(
          "company_email",
          email
        )
        .eq(
          "password",
          password
        )
        .single();

    if (error || !data) {

      alert(
        "Credenciales inválidas"
      );

      return;
    }

    // GUARDAR SESIÓN
    localStorage.setItem(
      "client",
      JSON.stringify(data)
    );

    // REDIRECT
    router.push(
      "/clients-dashboard"
    );
  }

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* LEFT */}
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden bg-black text-white">

        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

        <div className="relative z-10 max-w-lg px-10">

          <div className="mb-8 flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">

              <Building2 size={34} />

            </div>

            <div>

              <h1 className="text-3xl font-bold">

                Portal Clientes MJR

              </h1>

              <p className="text-gray-300">

                Plataforma empresarial

              </p>

            </div>

          </div>

          <h2 className="mb-6 text-5xl font-bold leading-tight">

            Consulta tus servicios en línea

          </h2>

          <p className="text-lg text-gray-300">

            Accede a tus órdenes de trabajo,
            reportes técnicos y el historial
            de servicios realizados.

          </p>

        </div>

      </div>

      {/* RIGHT */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">

        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

          <div className="mb-8 text-center">

            {/* MOBILE ICON */}
            <div className="mb-5 flex justify-center lg:hidden">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white">

                <Building2 size={30} />

              </div>

            </div>

            {/* LOGO */}
            <center>

              <img
                src="https://mjr-fumigaciones.com/wp-content/uploads/2026/02/logo_colorm.png"
                alt="Logo"
                className="h-auto w-[110px] sm:w-[150px]"
              />

            </center>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">

              Acceso Clientes

            </h2>

            <p className="mt-2 text-sm text-gray-500">

              Inicia sesión para continuar

            </p>

          </div>

          {/* EMAIL */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">

              Correo electrónico

            </label>

            <input
              type="email"
              placeholder="cliente@empresa.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  login();

                }

              }}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-black"
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium text-gray-700">

              Contraseña

            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {

                    login();

                  }

                }}
                className="w-full rounded-xl border border-gray-300 p-4 pr-14 outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >

                {showPassword ? (

                  <EyeOff size={20} />

                ) : (

                  <Eye size={20} />

                )}

              </button>

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={login}
            className="w-full rounded-xl bg-black p-4 text-lg font-semibold text-white transition hover:opacity-90"
          >

            Ingresar

          </button>

          {/* FOOTER */}
          <div className="mt-8 text-center text-sm text-gray-500">

            Portal Clientes SaaS © 2026.
            Development by wiledwardmunoz

          </div>

        </div>

      </div>

    </div>

  );
}