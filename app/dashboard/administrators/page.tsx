"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  ShieldCheck,
  Plus,
  Trash2,
} from "lucide-react";

export default function AdministratorsPage() {

  const [administrators,
    setAdministrators] =
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

    loadAdministrators();

  }, []);

  // GET
  async function loadAdministrators() {

    try {

      const { data, error } =
        await supabase
          .from("administrators")
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

      setAdministrators(
        data || []
      );

    } catch (error) {

      console.log(error);

    }
  }

  // CREATE
  async function handleCreateAdministrator() {

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

      const { error } =
        await supabase
          .from("administrators")
          .insert([

            {

              name: name,

              full_name:
                name,

              username:
                generatedUsername,

              email: email,

              phone: phone,

              password:
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
        "Administrador creado correctamente"
      );

      // RESET
      setName("");

      setEmail("");

      setPhone("");

      setPassword("");

      setOpenModal(false);

      loadAdministrators();

    } catch (error) {

      console.log(error);

      alert(
        "Error creando administrador"
      );

    } finally {

      setLoading(false);

    }
  }

  // DELETE
  async function deleteAdministrator(
    id: string
  ) {

    const confirmDelete =
      confirm(
        "¿Eliminar administrador?"
      );

    if (!confirmDelete)
      return;

    try {

      const { error } =
        await supabase
          .from("administrators")
          .delete()
          .eq("id", id);

      if (error) {

        console.log(error);

        alert(
          "Error eliminando administrador"
        );

        return;
      }

      loadAdministrators();

    } catch (error) {

      console.log(error);

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-sm">

              <ShieldCheck size={22} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">

                Administradores

              </h1>

              <p className="text-sm text-gray-500">

                Administración de administradores

              </p>

            </div>

          </div>

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >

            <Plus size={16} />

            Nuevo administrador

          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full table-auto">

              <thead className="bg-gray-50">

                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                  <th className="min-w-[220px] px-4 py-3">

                    Usuario

                  </th>

                  <th className="min-w-[260px] px-4 py-3">

                    Email

                  </th>

                  <th className="min-w-[100px] px-4 py-3">

                    Estado

                  </th>

                  <th className="min-w-[140px] px-4 py-3 text-center">

                    Acciones

                  </th>

                </tr>

              </thead>

              <tbody>

                {administrators.map(
                  (admin) => (

                    <tr
                      key={admin.id}
                      className="border-t border-gray-100 text-sm transition hover:bg-gray-50"
                    >

                      {/* USERNAME */}
                      <td className="px-4 py-4 align-top">

                        <div className="font-semibold text-gray-900">

                          {admin.username ||
                            "Sin usuario"}

                        </div>

                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-4 align-top">

                        <div className="break-words text-gray-700">

                          {admin.email}

                        </div>

                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4 align-top">

                        <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                          Activo

                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-4 align-top text-center">

                        <button
                          onClick={() =>
                            deleteAdministrator(
                              admin.id
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                        >

                          <Trash2 size={12} />

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

          <div className="w-full max-w-xl rounded-[24px] bg-white p-6 shadow-2xl">

            {/* HEADER */}
            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">

                <ShieldCheck size={19} />

              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-900">

                  Nuevo administrador

                </h2>

                <p className="text-sm text-gray-500">

                  Registro de administrador

                </p>

              </div>

            </div>

            {/* FORM */}
            <div className="grid gap-4 md:grid-cols-2">

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
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
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
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
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
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
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
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
                />

              </div>

            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() =>
                  setOpenModal(false)
                }
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold transition hover:bg-gray-100"
              >

                Cancelar

              </button>

              <button
                onClick={
                  handleCreateAdministrator
                }
                disabled={loading}
                className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >

                {loading
                  ? "Guardando..."
                  : "Guardar"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}