"use client";

import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left */}
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

        <div className="relative z-10 max-w-lg px-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <ShieldCheck size={34} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Admin MJR Ingeniería
              </h1>

              <p className="text-gray-300">
                Plataforma empresarial
              </p>
            </div>
          </div>

          <h3 className="mb-6 text-5xl font-bold leading-tight">
            Panel de control MJR
          </h3>

          <p className="text-lg text-gray-300">
            Sistema moderno desarrollado por wiledwardmunoz
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mb-5 flex justify-center lg:hidden">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white">
                <ShieldCheck size={30} />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900">
              Bienvenido
            </h1>

            <p className="mt-2 text-gray-500">
              Inicia sesión en el panel administrativo
            </p>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="admin@empresa.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-black"
            />
          </div>

          {/* Password */}
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
                  setPassword(e.target.value)
                }
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

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-black p-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Ingresando..."
              : "Ingresar"}
          </button>

          <div className="mt-8 text-center text-sm text-gray-500">
            Sistema Administrativo SaaS © 2026
          </div>
        </div>
      </div>
    </div>
  );
}