"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Users,
  Plus,
  Pencil,
  Trash2,
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

  const [editingId,
    setEditingId] =
    useState<string | null>(
      null
    );

  // FORM
  const [fullName,
    setFullName] =
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

  const [username,
    setUsername] =
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

  // RESET FORM
  function resetForm() {

    setEditingId(null);

    setFullName("");

    setEmail("");

    setPhone("");

    setPassword("");

    setUsername("");
  }

  // EDIT
  function handleEdit(
    tech: any
  ) {

    setEditingId(
      tech.id
    );

    setFullName(
      tech.full_name || ""
    );

    setEmail(
      tech.email || ""
    );

    setPhone(
      tech.phone || ""
    );

    setUsername(
      tech.username || ""
    );

    setPassword("");

    setOpenModal(true);
  }

  // SAVE
  async function handleSaveTechnician() {

    try {

      setLoading(true);

      if (
        !fullName ||
        !email ||
        !phone ||
        !username
      ) {

        alert(
          "Complete todos los campos"
        );

        setLoading(false);

        return;
      }

      // EDIT
      if (editingId) {

        const { error } =
          await supabase
            .from("technicians")
            .update({

              full_name:
                fullName,

              email: email,

              phone: phone,

              username:
                username,

              ...(password && {
                password:
                  password,
              }),

            })
            .eq(
              "id",
              editingId
            );

        if (error) {

          console.log(error);

          alert(
            error.message
          );

          return;
        }

        alert(
          "Técnico actualizado"
        );

      } else {

        // CREATE
        const { error } =
          await supabase
            .from("technicians")
            .insert([

              {

                full_name:
                  fullName,

                email: email,

                phone: phone,

                username:
                  username,

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
          "Técnico registrado"
        );
      }

      resetForm();

      setOpenModal(false);

      loadTechnicians();

    } catch (error) {

      console.log(error);

      alert(
        "Error guardando técnico"
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
        "¿Desactivar técnico?"
      );

    if (!confirmDelete)
      return;

    try {

      const { error } =
        await supabase
          .from("technicians")
          .update({
            status: false,
          })
          .eq("id", id);

      if (error) {

        console.log(error);

        alert(
          error.message
        );

        return;
      }

      alert(
        "Técnico desactivado"
      );

      loadTechnicians();

    } catch (error) {

      console.log(error);

      alert(
        "Error eliminando técnico"
      );

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-sm">

              <Users size={22} />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900">

                Técnicos

              </h1>

              <p className="mt-1 text-sm text-gray-500">

                Administración de técnicos asignados

              </p>

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={() => {

              resetForm();

              setOpenModal(true);

            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >

            <Plus size={16} />

            Registrar técnico

          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full table-auto">

              <thead className="bg-gray-50">

                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                  <th className="min-w-[220px] px-4 py-3">

                    Técnico

                  </th>

                  <th className="min-w-[200px] px-4 py-3">

                    Usuario

                  </th>

                  <th className="min-w-[240px] px-4 py-3">

                    Correo

                  </th>

                  <th className="min-w-[180px] px-4 py-3">

                    Teléfono

                  </th>

                  <th className="min-w-[120px] px-4 py-3">

                    Estado

                  </th>

                  <th className="min-w-[140px] px-4 py-3 text-center">

                    Editar

                  </th>

                  <th className="min-w-[140px] px-4 py-3 text-center">

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

                      {/* NAME */}
                      <td className="px-4 py-4">

                        <div className="font-semibold text-gray-900">

                          {
                            tech.full_name
                          }

                        </div>

                      </td>

                      {/* USERNAME */}
                      <td className="px-4 py-4 text-gray-700">

                        {
                          tech.username
                        }

                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-4 text-gray-700">

                        {tech.email}

                      </td>

                      {/* PHONE */}
                      <td className="px-4 py-4 text-gray-700">

                        {tech.phone}

                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4">

                        <span
                          className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                            tech.status
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >

                          {tech.status
                            ? "Activo"
                            : "Inactivo"}

                        </span>

                      </td>

                      {/* EDIT */}
                      <td className="px-4 py-4 text-center">

                        <button
                          onClick={() =>
                            handleEdit(
                              tech
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-200"
                        >

                          <Pencil size={12} />

                          Editar

                        </button>

                      </td>

                      {/* DELETE */}
                      <td className="px-4 py-4 text-center">

                        <button
                          onClick={() =>
                            deleteTechnician(
                              tech.id
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                        >

                          <Trash2 size={12} />

                          Desactivar

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

          <div className="w-full max-w-2xl rounded-[24px] bg-white p-6 shadow-2xl">

            {/* HEADER */}
            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">

                <Users size={20} />

              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-900">

                  {editingId
                    ? "Editar técnico"
                    : "Registrar técnico"}

                </h2>

                <p className="text-sm text-gray-500">

                  Gestión administrativa de técnicos

                </p>

              </div>

            </div>

            {/* FORM */}
            <div className="grid gap-4 md:grid-cols-2">

              <InputField
                label="Nombre completo"
                value={fullName}
                onChange={setFullName}
              />

              <InputField
                label="Usuario"
                value={username}
                onChange={setUsername}
              />

              <InputField
                label="Correo"
                value={email}
                onChange={setEmail}
                type="email"
              />

              <InputField
                label="Teléfono"
                value={phone}
                onChange={setPhone}
              />

              <div className="md:col-span-2">

                <InputField
                  label="Contraseña"
                  value={password}
                  onChange={setPassword}
                  type="password"
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
                  handleSaveTechnician
                }
                disabled={loading}
                className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >

                {loading
                  ? "Guardando..."
                  : editingId
                  ? "Actualizar"
                  : "Registrar"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: any) {

  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">

        {label}

      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-black"
      />

    </div>
  );
}