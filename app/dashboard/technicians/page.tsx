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

  // FORM STATES
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

    setTechnicians(data || []);
  }

  // CREATE TECHNICIAN
  const handleCreateTechnician =
    async () => {

      try {

        setLoading(true);

        // VALIDAR CAMPOS
        if (
          !name ||
          !email ||
          !phone ||
          !password
        ) {

          alert(
            "Complete todos los campos"
          );

          return;
        }

        // GENERAR USERNAME
        const generatedUsername =
          name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");

        // INSERTAR
        const { error } =
          await supabase
            .from("technicians")
            .insert([

              {

                // NOMBRE
                full_name:
                  name,

                // EMAIL
                email: email,

                // TELEFONO
                phone: phone,

                // USERNAME
                username:
                  generatedUsername,

                // PASSWORD
                password:
                  password,

                // STATUS
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
          "Técnico registrado correctamente"
        );

        // LIMPIAR
        setName("");

        setEmail("");

        setPhone("");

        setPassword("");

        // RECARGAR
        loadTechnicians();

        // CERRAR MODAL
        setOpenModal(false);

      } catch (error) {

        console.log(error);

        alert(
          "Error registrando técnico"
        );

      } finally {

        setLoading(false);

      }
    };

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
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-sm">

              <Users size={22} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">

                Técnicos

              </h1>

              <p className="text-sm text-gray-500">

                Administración de técnicos

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

            Nuevo técnico

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

                  <th className="min-w-[220px] px-4 py-3">

                    Usuario

                  </th>

                  <th className="min-w-[240px] px-4 py-3">

                    Email

                  </th>

                  <th className="min-w-[150px] px-4 py-3">

                    Teléfono

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

                {technicians.map(
                  (tech) => (

                    <tr
                      key={tech.id}
                      className="border-t border-gray-100 text-sm transition hover:bg-gray-50"
                    >

                      {/* NOMBRE */}
                      <td className="px-4 py-4 align-top">

                        <div className="font-semibold text-gray-900">

                          {tech.full_name}

                        </div>

                      </td>

                      {/* USERNAME */}
                      <td className="px-4 py-4 align-top text-gray-700">

                        {tech.username}

                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-4 align-top">

                        <div className="break-words text-gray-700">

                          {tech.email}

                        </div>

                      </td>

                      {/* PHONE */}
                      <td className="px-4 py-4 align-top text-gray-700">

                        {tech.phone}

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
                            deleteTechnician(
                              tech.id
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

                <Users size={19} />

              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-900">

                  Nuevo técnico

                </h2>

                <p className="text-sm text-gray-500">

                  Registro de técnico

                </p>

              </div>

            </div>

            {/* FORM */}
            <div className="grid gap-4 md:grid-cols-2">

              <InputField
                label="Nombre"
                value={name}
                onChange={setName}
              />

              <InputField
                label="Email"
                value={email}
                onChange={setEmail}
                type="email"
              />

              <InputField
                label="Teléfono"
                value={phone}
                onChange={setPhone}
              />

              <InputField
                label="Contraseña"
                value={password}
                onChange={setPassword}
                type="password"
              />

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
                  handleCreateTechnician
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