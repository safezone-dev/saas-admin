"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

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
                name: name,

                // FULL NAME
                full_name: name,

                // EMAIL
                email: email,

                // PHONE
                phone: phone,

                // USERNAME
                username:
                  generatedUsername,

                // PASSWORD
                password: password,

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
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-2xl font-bold text-gray-900">

              Técnicos

            </h1>

            <p className="mt-1 text-sm text-gray-500">

              Administración de técnicos

            </p>

          </div>

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >

            Nuevo técnico

          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="bg-gray-50">

                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                  <th className="p-4">
                    Nombre
                  </th>

                  <th className="p-4">
                    Usuario
                  </th>

                  <th className="p-4">
                    Email
                  </th>

                  <th className="p-4">
                    Teléfono
                  </th>

                  <th className="p-4">
                    Estado
                  </th>

                  <th className="p-4">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {technicians.map(
                  (tech) => (

                    <tr
                      key={tech.id}
                      className="border-t text-sm"
                    >

                      <td className="p-4 font-medium">

                        {tech.name}

                      </td>

                      <td className="p-4">

                        {tech.username}

                      </td>

                      <td className="p-4">

                        {tech.email}

                      </td>

                      <td className="p-4">

                        {tech.phone}

                      </td>

                      <td className="p-4">

                        <span className="rounded-xl bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                          Activo

                        </span>

                      </td>

                      <td className="p-4">

                        <button
                          onClick={() =>
                            deleteTechnician(
                              tech.id
                            )
                          }
                          className="rounded-xl bg-red-100 px-3 py-2 text-xs font-semibold text-red-700"
                        >

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

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-[28px] bg-white p-6">

            <h2 className="mb-6 text-xl font-bold text-gray-900">

              Nuevo técnico

            </h2>

            <div className="space-y-5">

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
            <div className="mt-8 flex gap-4">

              <button
                onClick={() =>
                  setOpenModal(false)
                }
                className="flex-1 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold"
              >

                Cancelar

              </button>

              <button
                onClick={
                  handleCreateTechnician
                }
                disabled={loading}
                className="flex-1 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
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
        className="w-full rounded-2xl border border-gray-200 p-4 text-sm"
      />

    </div>
  );
}