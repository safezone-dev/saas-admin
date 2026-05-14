"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function ClientLoginPage() {

  const router = useRouter();

  const [username,
    setUsername] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  async function handleLogin() {

    try {

      setLoading(true);

      const { data, error } =
        await supabase
          .from("companies")
          .select("*")
          .eq(
            "username",
            username
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

      // GUARDAR SESION
      localStorage.setItem(
        "client",
        JSON.stringify(data)
      );

      // REDIRECCION
      router.push(
        "/client-dashboard"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Error iniciando sesión"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">

      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl">

        {/* LOGO */}
        <div className="mb-8 flex justify-center">

          <img
            src="https://mjr-fumigaciones.com/wp-content/uploads/2026/02/logo_colorm.png"
            alt="Logo"
            className="h-auto w-[220px] object-contain"
          />

        </div>

        {/* TITLE */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-gray-900">

            Portal Clientes

          </h1>

          <p className="mt-2 text-sm text-gray-500">

            Ingrese sus credenciales

          </p>

        </div>

        {/* FORM */}
        <div className="space-y-5">

          {/* USERNAME */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Usuario

            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              placeholder="Ingrese usuario"
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none transition focus:border-black"
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Contraseña

            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Ingrese contraseña"
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none transition focus:border-black"
            />

          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >

            {loading
              ? "Ingresando..."
              : "Ingresar"}

          </button>

        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center text-xs text-gray-500">

          Desarrollado por
          {" "}
          wiledwardmunoz

        </div>

      </div>

    </div>
  );
}