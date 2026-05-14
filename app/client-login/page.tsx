"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function ClientLoginPage() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    e: any
  ) {

    e.preventDefault();

    setLoading(true);

    setError("");

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

      setError(
        "Credenciales inválidas"
      );

      setLoading(false);

      return;
    }

    localStorage.setItem(
      "client",
      JSON.stringify(data)
    );

    router.push(
      "/client-dashboard"
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">

      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-sm">

        {/* LOGO */}
        <div className="mb-8 flex justify-center">

          <img
            src="https://mjr-fumigaciones.com/wp-content/uploads/2026/02/logo_colorm.png"
            alt="Logo"
            className="w-[180px]"
          />

        </div>

        {/* TITLE */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold">
            Portal Clientes
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Acceso empresarial
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none"
          />

          {error && (

            <div className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700">

              {error}

            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black px-4 py-4 text-sm font-semibold text-white"
          >

            {loading
              ? "Ingresando..."
              : "Ingresar"}

          </button>

        </form>

      </div>

    </div>
  );
}
