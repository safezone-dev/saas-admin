"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Building2,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";

export default function CompaniesPage() {
  const [companies, setCompanies] =
    useState<any[]>([]);

  const [showCreateModal,
    setShowCreateModal] =
    useState(false);

  const [showEditModal,
    setShowEditModal] =
    useState(false);

  const [selectedCompany,
    setSelectedCompany] =
    useState<any>(null);

  const [companyName,
    setCompanyName] =
    useState("");

  const [companyCode,
    setCompanyCode] =
    useState("");

  const [companyEmail,
    setCompanyEmail] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    const { data } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (data) {
      setCompanies(data);
    }
  }

  async function createCompany() {

    const generatedCode =
      "EMP-" +
      Math.floor(
        1000 +
          Math.random() * 9000
      );

    const { error } = await supabase
      .from("companies")
      .insert([
        {
          company_name: companyName,
          company_code:
            generatedCode,
          company_email:
            companyEmail,
          username,
          password,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();

    setShowCreateModal(false);

    loadCompanies();
  }

  function openEdit(company: any) {
    setSelectedCompany(company);

    setCompanyName(
      company.company_name
    );

    setCompanyCode(
      company.company_code
    );

    setCompanyEmail(
      company.company_email
    );

    setUsername(company.username);

    setPassword(company.password);

    setShowEditModal(true);
  }

  async function updateCompany() {
    const { error } = await supabase
      .from("companies")
      .update({
        company_name: companyName,
        company_email:
          companyEmail,
        username,
        password,
      })
      .eq(
        "id",
        selectedCompany.id
      );

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();

    setShowEditModal(false);

    loadCompanies();
  }

  async function deleteCompany(
    id: string
  ) {
    const confirmDelete = confirm(
      "¿Eliminar empresa?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("companies")
      .delete()
      .eq("id", id);

    loadCompanies();
  }

  function resetForm() {
    setCompanyName("");
    setCompanyCode("");
    setCompanyEmail("");
    setUsername("");
    setPassword("");
  }

  return (
    <div className="min-h-screen">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Empresas
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Gestión empresarial
          </p>
        </div>

        <button
          onClick={() =>
            setShowCreateModal(true)
          }
          className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105"
        >
          <Plus size={18} />
          Agregar Empresa
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[30px] bg-white shadow-sm">

        {/* HEAD */}
        <div className="grid grid-cols-5 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <div>Empresa</div>
          <div>Código</div>
          <div>Usuario</div>
          <div>Email</div>
          <div className="text-center">
            Acciones
          </div>
        </div>

        {/* BODY */}
        {companies.map((company) => (
          <div
            key={company.id}
            className="grid grid-cols-5 items-center border-b border-gray-100 px-6 py-5 hover:bg-gray-50"
          >
            {/* EMPRESA */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3">
                <Building2
                  size={18}
                  className="text-blue-600"
                />
              </div>

              <h3 className="font-medium text-gray-900">
                {company.company_name}
              </h3>
            </div>

            {/* CODIGO */}
            <div className="text-sm text-gray-600">
              {company.company_code}
            </div>

            {/* USER */}
            <div className="text-sm text-gray-600">
              {company.username}
            </div>

            {/* EMAIL */}
            <div className="text-sm text-gray-600">
              {company.company_email}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-center gap-2">

              <button
                onClick={() =>
                  openEdit(company)
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
                  deleteCompany(
                    company.id
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
        <CompanyModal
          title="Nueva Empresa"
          buttonText="Crear Empresa"
          companyName={companyName}
          setCompanyName={
            setCompanyName
          }
          companyCode=""
          companyEmail={
            companyEmail
          }
          setCompanyEmail={
            setCompanyEmail
          }
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onClose={() =>
            setShowCreateModal(false)
          }
          onSubmit={createCompany}
        />
      )}

      {/* EDIT */}
      {showEditModal && (
        <CompanyModal
          title="Editar Empresa"
          buttonText="Guardar Cambios"
          companyName={companyName}
          setCompanyName={
            setCompanyName
          }
          companyCode={companyCode}
          companyEmail={
            companyEmail
          }
          setCompanyEmail={
            setCompanyEmail
          }
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onClose={() =>
            setShowEditModal(false)
          }
          onSubmit={updateCompany}
        />
      )}

    </div>
  );
}

function CompanyModal({
  title,
  buttonText,
  companyName,
  setCompanyName,
  companyCode,
  companyEmail,
  setCompanyEmail,
  username,
  setUsername,
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
              Gestión empresarial
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

          {/* NOMBRE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Nombre Empresa
            </label>

            <input
              type="text"
              value={companyName}
              onChange={(e) =>
                setCompanyName(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* CODIGO SOLO EDIT */}
          {companyCode && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Código Empresa
              </label>

              <input
                type="text"
                value={companyCode}
                disabled
                className="w-full rounded-2xl border border-gray-200 bg-gray-100 p-4 text-sm text-gray-500 outline-none"
              />
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Correo Empresarial
            </label>

            <input
              type="email"
              value={companyEmail}
              onChange={(e) =>
                setCompanyEmail(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* USER */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Usuario Login
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(
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
          onClick={onSubmit}
          className="mt-8 w-full rounded-2xl bg-blue-600 py-4 text-sm font-semibold text-white shadow-lg hover:scale-[1.02]"
        >
          {buttonText}
        </button>

      </div>
    </div>
  );
}