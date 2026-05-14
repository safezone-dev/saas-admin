"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  User,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

export default function TechniciansPage() {
  const [technicians, setTechnicians] =
    useState<any[]>([]);

  const [companies, setCompanies] =
    useState<any[]>([]);

  const [showCreateModal,
    setShowCreateModal] =
    useState(false);

  const [showEditModal,
    setShowEditModal] =
    useState(false);

  const [selectedTechnician,
    setSelectedTechnician] =
    useState<any>(null);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [searchCompany,
    setSearchCompany] =
    useState("");

  const [selectedCompanies,
    setSelectedCompanies] =
    useState<string[]>([]);

  useEffect(() => {
    loadTechnicians();
    loadCompanies();
  }, []);

  async function loadTechnicians() {
    const { data } = await supabase
      .from("technicians")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (data) {
      setTechnicians(data);
    }
  }

  async function loadCompanies() {
    const { data } = await supabase
      .from("companies")
      .select("*");

    if (data) {
      setCompanies(data);
    }
  }

  async function createTechnician() {
    const { error } = await supabase
      .from("technicians")
      .insert([
        {
          name,
          email,
          password,
          companies:
            selectedCompanies,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();

    setShowCreateModal(false);

    loadTechnicians();
  }

  function openEdit(
    technician: any
  ) {
    setSelectedTechnician(
      technician
    );

    setName(technician.name);

    setEmail(technician.email);

    setPassword(
      technician.password
    );

    setSelectedCompanies(
      technician.companies || []
    );

    setShowEditModal(true);
  }

  async function updateTechnician() {
    const { error } = await supabase
      .from("technicians")
      .update({
        name,
        email,
        password,
        companies:
          selectedCompanies,
      })
      .eq(
        "id",
        selectedTechnician.id
      );

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();

    setShowEditModal(false);

    loadTechnicians();
  }

  async function deleteTechnician(
    id: string
  ) {
    const confirmDelete = confirm(
      "¿Eliminar técnico?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("technicians")
      .delete()
      .eq("id", id);

    loadTechnicians();
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setSelectedCompanies([]);
  }

  function toggleCompany(
    companyCode: string
  ) {
    if (
      selectedCompanies.includes(
        companyCode
      )
    ) {
      setSelectedCompanies(
        selectedCompanies.filter(
          (c) =>
            c !== companyCode
        )
      );
    } else {
      setSelectedCompanies([
        ...selectedCompanies,
        companyCode,
      ]);
    }
  }

  const filteredCompanies =
    companies.filter((company) =>
      company.company_name
        ?.toLowerCase()
        .includes(
          searchCompany.toLowerCase()
        )
    );

  return (
    <div className="min-h-screen">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Técnicos
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Gestión técnica
          </p>
        </div>

        <button
          onClick={() =>
            setShowCreateModal(true)
          }
          className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105"
        >
          <Plus size={18} />
          Agregar Técnico
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[30px] bg-white shadow-sm">

        <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <div>Técnico</div>
          <div>Email</div>
          <div>Empresas</div>
          <div className="text-center">
            Acciones
          </div>
        </div>

        {technicians.map(
          (technician) => (
            <div
              key={technician.id}
              className="grid grid-cols-4 items-center border-b border-gray-100 px-6 py-5 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3">
                  <User
                    size={18}
                    className="text-blue-600"
                  />
                </div>

                <h3 className="font-medium text-gray-900">
                  {technician.name}
                </h3>
              </div>

              <div className="text-sm text-gray-600">
                {technician.email}
              </div>

              <div className="text-sm text-gray-600">
                {
                  technician
                    .companies
                    ?.length
                }{" "}
                empresas
              </div>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() =>
                    openEdit(
                      technician
                    )
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
                    deleteTechnician(
                      technician.id
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
          )
        )}
      </div>

      {/* CREATE */}
      {showCreateModal && (
        <TechnicianModal
          title="Nuevo Técnico"
          buttonText="Crear Técnico"
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          companies={filteredCompanies}
          searchCompany={
            searchCompany
          }
          setSearchCompany={
            setSearchCompany
          }
          selectedCompanies={
            selectedCompanies
          }
          toggleCompany={
            toggleCompany
          }
          onClose={() =>
            setShowCreateModal(false)
          }
          onSubmit={
            createTechnician
          }
        />
      )}

      {/* EDIT */}
      {showEditModal && (
        <TechnicianModal
          title="Editar Técnico"
          buttonText="Guardar Cambios"
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          companies={filteredCompanies}
          searchCompany={
            searchCompany
          }
          setSearchCompany={
            setSearchCompany
          }
          selectedCompanies={
            selectedCompanies
          }
          toggleCompany={
            toggleCompany
          }
          onClose={() =>
            setShowEditModal(false)
          }
          onSubmit={
            updateTechnician
          }
        />
      )}
    </div>
  );
}

function TechnicianModal({
  title,
  buttonText,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  companies,
  searchCompany,
  setSearchCompany,
  selectedCompanies,
  toggleCompany,
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
              Gestión técnica
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
              Nombre Técnico
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

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

          {/* SEARCH */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Buscar Empresa
            </label>

            <input
              type="text"
              placeholder="Buscar empresa..."
              value={searchCompany}
              onChange={(e) =>
                setSearchCompany(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* COMPANIES */}
          <div className="max-h-72 overflow-y-auto rounded-2xl border border-gray-200 p-4">
            <div className="space-y-3">
              {companies.map(
                (company: any) => (
                  <label
                    key={company.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl p-3 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(
                        company.company_code
                      )}
                      onChange={() =>
                        toggleCompany(
                          company.company_code
                        )
                      }
                    />

                    <span className="text-sm text-gray-700">
                      {
                        company.company_name
                      }
                    </span>
                  </label>
                )
              )}
            </div>
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