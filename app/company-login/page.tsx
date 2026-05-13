"use client";

import { useState } from "react";

import { Building2 } from "lucide-react";

import { supabase } from "../../lib/supabase";

export default function CompanyLoginPage() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    if (!username || !password) {
      alert("Completa todos los campos");

      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    setLoading(false);

    if (error || !data) {
      alert("Credenciales inválidas");

      return;
    }

    // Guardar sesión
    localStorage.setItem(
      "company",
      JSON.stringify(data)
    );

    // Redirección
    window.location.href =
      "/company-dashboard";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white">
              <Building2 size={32} />
            </div>
          </div>

          <h1 className="text-4xl font-bold">
            Login Empresa
          </h1>

          <p className="mt-2 text-gray-500">
            Acceso empresarial
          </p>
        </div>

        {/* Usuario */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium">
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
            className="w-full rounded-xl border p-4"
            placeholder="empresa123"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">
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
            className="w-full rounded-xl border p-4"
            placeholder="********"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-xl bg-black p-4 text-lg font-semibold text-white"
        >
          {loading
            ? "Ingresando..."
            : "Ingresar"}
        </button>
      </div>
    </div>
  );
}