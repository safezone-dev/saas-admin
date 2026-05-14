"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

export default function AdministratorsPage() {
  const [admins, setAdmins] =
    useState<any[]>([]);

  const [showCreateModal,
    setShowCreateModal] =
    useState(false);

  const [showEditModal,
    setShowEditModal] =
    useState(false);

  const [selectedAdmin,
    setSelectedAdmin] =
    useState<any>(null);

  const [fullName,
    setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    const { data } = await supabase
      .from("administrators")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (data) {
      setAdmins(data);
    }
  }

  async function createAdmin() {
    const { error } = await supabase
      .from("administrators")
      .insert([
        {
          full_name: fullName,
          email,
          password,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();

    setShowCreateModal(false);

    loadAdmins();
  }

  function openEdit(admin: any) {
    setSelectedAdmin(admin);

    setFullName(admin.full_name);

    setEmail(admin.email);

    setPassword(admin.password);

    setShowEditModal(true);
  }

  async function updateAdmin() {
    const { error } = await supabase
      .from("administrators")
      .update({
        full_name: fullName,
        email,
        password,
      })
      .eq(
        "id",
        selectedAdmin.id
      );

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();

    setShowEditModal(false);

    loadAdmins();
  }

  async function deleteAdmin(
    id: string
  ) {
    const confirmDelete = confirm(
      "¿Eliminar administrador?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("administrators")
      .delete()
      .eq("id", id);

    loadAdmins();
  }

  function resetForm() {
    setFullName("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="min-h-screen">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Administradores
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Gestión administrativa
          </p>
        </div>

        <button
          onClick={() =>
            setShowCreateModal(true)
          }
          className="flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105"
        >
          <Plus size={18} />
          Agregar Administrador
        </button>

      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[30px] bg-white shadow-sm">

        <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <div>Administrador</div>
          <div>Email</div>
          <div>Rol</div>
          <div className="text-center">
            Acciones
          </div>
        </div>

        {admins.map((admin) => (
          <div
            key={admin.id}
            className="grid grid-cols-4 items-center border-b border-gray-100 px-6 py-5 hover:bg-gray-50"
          >

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-purple-100 p-3">
                <ShieldCheck
                  size={18}
                  className="text-purple-600"
                />
              </div>

              <h3 className="font-medium text-gray-900">
                {admin.full_name}
              </h3>

            </div>

            <div className="text-sm text-gray-600">
              {admin.email}
            </div>

            <div className="text-sm text-gray-600">
              Administrador
            </div>

            <div className="flex justify-center gap-2">

              <button
                onClick={() =>
                  openEdit(admin)
                }
                className="rounded-xl bg-blue-100 p-3 hover:scale-105"
              >
                <Pencil
                  size={16}
                  className="text-blue-600"
                />
              </button>

              <button
                onClick={() =>
                  deleteAdmin(
                    admin.id
                  )
                }
                className="rounded-xl bg-red-100 p-3 hover:scale-105"
              >
                <Trash2
                  size={16}
                  className="text-red-600"
                />
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* CREATE */}
      {showCreateModal && (
        <AdminModal
          title="Nuevo Administrador"
          buttonText="Crear Administrador"
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onClose={() =>
            setShowCreateModal(false)
          }
          onSubmit={createAdmin}
        />
      )}

      {/* EDIT */}
      {showEditModal && (
        <AdminModal
          title="Editar Administrador"
          buttonText="Guardar Cambios"
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onClose={() =>
            setShowEditModal(false)
          }
          onSubmit={updateAdmin}
        />
      )}

    </div>
  );
}

function AdminModal({
  title,
  buttonText,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  onClose,
  onSubmit,
}: any) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-5 backdrop-blur-sm">

      <div className="mx-auto my-10 w-full max-w-2xl rounded-[30px] bg-white p-8">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {title}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Gestión administrativa
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-gray-100 p-3 hover:bg-gray-200"
          >
            <X size={20} />
          </button>

        </div>

        {/* FORM */}
        <div className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Nombre Completo
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Correo Electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-purple-500"
            />
          </div>

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
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-purple-500"
            />
          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={onSubmit}
          className="mt-8 w-full rounded-2xl bg-purple-600 py-4 text-sm font-semibold text-white shadow-lg hover:scale-[1.02]"
        >
          {buttonText}
        </button>

      </div>
    </div>
  );
}