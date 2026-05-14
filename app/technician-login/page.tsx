"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

import { useRouter } from "next/navigation";

export default function TechnicianLogin() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function login() {

    const { data, error } =
      await supabase
        .from("technicians")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

    if (error || !data) {
      alert("Credenciales inválidas");
      return;
    }

    // GUARDAR SESION
    localStorage.setItem(
      "technician",
      JSON.stringify(data)
    );

    // REDIRECT
    router.push(
      "/company-dashboard"
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-5">

      <div className="w-full max-w-md rounded-[30px] bg-white p-8 shadow-sm">

        {/* TOP */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            Técnico
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Iniciar sesión
          </p>

        </div>

        {/* FORM */}
        <div className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Correo
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-blue-500"
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
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={login}
          className="mt-8 w-full rounded-2xl bg-blue-600 py-4 text-sm font-semibold text-white"
        >
          Ingresar
        </button>

      </div>
    </div>
  );
}