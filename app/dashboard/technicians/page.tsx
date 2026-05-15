"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Plus,
  Trash2,
  Users,
} from "lucide-react";

export default function TechniciansPage() {

  const [technicians,
    setTechnicians] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(false);

  const [openModal,
    setOpenModal] =
    useState(false);

  // FORM
  const [name,
    setName] =
    useState("");

  const [email,
    setEmail] =
    useState("");

  const [phone,
    setPhone] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  // LOAD
  useEffect(() => {

    loadTechnicians();

  }, []);

  // GET TECHNICIANS
  async function loadTechnicians() {

    try {

      const { data, error } =
        await supabase
          .from("technicians")
          .select("*")
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) {

        console.log(error);

        return;
      }

      setTechnicians(
        data || []
      );

    } catch (error) {

      console.log(error);

    }
  }

  // CREATE
  async function handleCreateTechnician() {

    try {

      setLoading(true);

      if (
        !name ||
        !email ||
        !phone ||
        !password
      ) {

        alert(
          "Complete todos los campos"
        );

        setLoading(false);

        return;
      }

      // USERNAME AUTO
      const generatedUsername =
        name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(
            /[^a-z0-9]/g,
            ""
          );

      const {
        error,
      } =
        await supabase
          .from("technicians")
          .insert([

            {

              name,

              full_name:
                name,

              email,

              phone,

              username:
                generatedUsername,

              password,

              status: true,

            },

          ]);

      if (error) {

        console.log(error);

        alert(
          error.message
        );

        return;
      }

      alert(
        "Técnico creado correctamente"
      );

      // RESET
      setName("");

      setEmail("");

      setPhone("");

      setPassword("");

      setOpenModal(false);

      loadTechnicians();

    } catch (error) {

      console.log(error);

      alert(
        "Error creando técnico"
      );

    } finally {

      setLoading(false);

    }
  }

  // DELETE
  async function deleteTechnician(
    id: string
  ) {

    const confirmDelete =
      confirm(
        "¿Eliminar técnico?"
      );

    if (!confirmDelete)
      return;

    try {

      const { error } =
        await supabase
          .from("technicians")
          .delete()
          .eq("id", id);

      if (error) {

        console.log(error);

        alert(
          "Error eliminando técnico"
        );

        return;
      }

      loadTechnicians();

    } catch (error) {

      console.log(error);

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-sm">

              <Users size={26} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">

                Técnicos

              </h1>

              <p className="text-sm text-gray-500">

                Administración y gestión de técnicos

              </p>

            </div>

          </div>

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >

            <Plus size={18} />

            Nuevo técnico

          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="bg-gray-50">

                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                  <th className="p-5">
                    Nombre
                  </th>

                  <th className="p-5">
                    Usuario
                  </th>

                  <th className="p-5">
                    Email
                  </th>

                  <th className="p-5">
                    Teléfono
                  </th>

                  <th className="p-5">
                    Estado
                  </th>

                  <th className="p-5">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {technicians.map(
                  (tech) => (

                    <tr
                      key={tech.id}
                      className="border-t border-gray-100 text-sm transition hover:bg-gray-50"
                    >

                      <td className="p-5 font-medium text-gray-900">

                        {tech.name}

                      </td>

                      <td className="p-5 text-gray-600">

                        {tech.username}

                      </td>

                      <td className="p-5 text-gray-600">

                        {tech.email}

                      </td>

                      <td className="p-5 text-gray-600">

                        {tech.phone}

                      </td>

                      <td className="p-5">

                        <span className="rounded-xl bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                          Activo

                        </span>

                      </td>

                      <td className="p-5">

                        <button
                          onClick={() =>
                            deleteTechnician(
                              tech.id
                            )
                          }
                          className="flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                        >

                          <Trash2 size={14} />

                          Eliminar

                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {openModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-2xl">

            {/* HEADER */}
            <div className="mb-8 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">

                <Users size={22} />

              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-900">

                  Nuevo técnico

                </h2>

                <p className="text-sm text-gray-500">

                  Registro de nuevo técnico

                </p>

              </div>

            </div>

            {/* FORM */}
            <div className="grid gap-5 md:grid-cols-2">

              {/* NAME */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Nombre

                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none transition focus:border-black"
                />

              </div>

              {/* EMAIL */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Email

                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none transition focus:border-black"
                />

              </div>

              {/* PHONE */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">

                  Teléfono

                </label>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
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
                  className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none transition focus:border-black"
                />

              </div>

            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              <button
                onClick={() =>
                  setOpenModal(false)
                }
                className="flex-1 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:bg-gray-100"
              >

                Cancelar

              </button>

              <button
                onClick={
                  handleCreateTechnician
                }
                disabled={loading}
                className="flex-1 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >

                {loading
                  ? "Guardando..."
                  : "Guardar técnico"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}