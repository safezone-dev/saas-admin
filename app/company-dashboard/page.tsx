"use client";

import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Plus,
  Building2,
  LogOut,
  Briefcase,
  BarChart3,
  CalendarDays,
} from "lucide-react";

export default function CompanyDashboard() {
  const [company, setCompany] =
    useState<any>(null);

  useEffect(() => {
    const data =
      localStorage.getItem("company");

    if (!data) {
      window.location.href =
        "/company-login";

      return;
    }

    setCompany(JSON.parse(data));
  }, []);

  function logout() {
    localStorage.removeItem("company");

    window.location.href =
      "/company-login";
  }

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      {/* SIDEBAR */}
      <aside className="hidden w-[280px] flex-col border-r border-gray-200 bg-white lg:flex">
        {/* LOGO */}
        <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
            <Building2 size={28} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {company.company_name}
            </h2>

            <p className="text-sm text-gray-500">
              Workspace
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main
          </p>

          <div className="space-y-2">
            <button className="flex w-full items-center gap-3 rounded-2xl bg-blue-600 px-4 py-4 font-medium text-white shadow-md">
              <LayoutDashboard size={20} />

              Dashboard
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 font-medium text-gray-700 transition hover:bg-gray-100">
              <Briefcase size={20} />

              Projects
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 font-medium text-gray-700 transition hover:bg-gray-100">
              <Users size={20} />

              Employees
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 font-medium text-gray-700 transition hover:bg-gray-100">
              <CalendarDays size={20} />

              Calendar
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 font-medium text-gray-700 transition hover:bg-gray-100">
              <BarChart3 size={20} />

              Analytics
            </button>
          </div>

          {/* TEAM */}
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between px-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Teams
              </p>

              <Plus
                size={16}
                className="text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-100">
                <div className="h-3 w-3 rounded-full bg-green-500" />

                <span className="text-sm font-medium text-gray-700">
                  Marketing
                </span>
              </button>

              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-100">
                <div className="h-3 w-3 rounded-full bg-orange-500" />

                <span className="text-sm font-medium text-gray-700">
                  Sales
                </span>
              </button>

              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-100">
                <div className="h-3 w-3 rounded-full bg-pink-500" />

                <span className="text-sm font-medium text-gray-700">
                  Support
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl bg-red-500 px-4 py-4 font-medium text-white transition hover:bg-red-600"
          >
            <LogOut size={20} />

            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        {/* TOPBAR */}
        <header className="flex flex-col gap-5 border-b border-gray-200 bg-white px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back 👋
            </h1>

            <p className="mt-1 text-gray-500">
              Here's what's happening in your
              workspace today.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="hidden items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 lg:flex">
              <Search
                size={18}
                className="text-gray-400"
              />

              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none"
              />
            </div>

            {/* NOTIFICATION */}
            <button className="rounded-2xl bg-gray-100 p-3 transition hover:bg-gray-200">
              <Bell size={20} />
            </button>

            {/* USER */}
            <button className="flex items-center gap-3 rounded-2xl bg-gray-100 px-4 py-2 transition hover:bg-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <Building2 size={22} />
              </div>

              <div className="hidden text-left md:block">
                <h3 className="font-semibold text-gray-800">
                  {company.manager_name}
                </h3>

                <p className="text-sm text-gray-500">
                  Administrator
                </p>
              </div>

              <ChevronDown size={18} />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="space-y-8 p-6">
          {/* STATS */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Active Projects
              </p>

              <h2 className="mt-4 text-4xl font-bold text-gray-800">
                12
              </h2>

              <p className="mt-2 text-sm text-green-600">
                +8% this month
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Employees
              </p>

              <h2 className="mt-4 text-4xl font-bold text-gray-800">
                24
              </h2>

              <p className="mt-2 text-sm text-blue-600">
                Team growing
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Tasks Completed
              </p>

              <h2 className="mt-4 text-4xl font-bold text-gray-800">
                184
              </h2>

              <p className="mt-2 text-sm text-purple-600">
                Productivity up
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-xl">
              <p className="text-sm opacity-80">
                Workspace Status
              </p>

              <h2 className="mt-4 text-4xl font-bold">
                Active
              </h2>

              <p className="mt-2 text-sm opacity-80">
                All systems operational
              </p>
            </div>
          </div>

          {/* TABLE + ACTIVITY */}
          <div className="grid gap-6 xl:grid-cols-3">
            {/* TABLE */}
            <div className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Active Tasks
                  </h2>

                  <p className="text-sm text-gray-500">
                    Workspace progress
                  </p>
                </div>

                <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
                  + New Task
                </button>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-sm text-gray-400">
                      <th className="pb-4">
                        Task
                      </th>

                      <th className="pb-4">
                        Status
                      </th>

                      <th className="pb-4">
                        Team
                      </th>

                      <th className="pb-4">
                        Progress
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-5 font-medium text-gray-700">
                        Website redesign
                      </td>

                      <td>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                          Done
                        </span>
                      </td>

                      <td className="text-gray-600">
                        Marketing
                      </td>

                      <td>
                        <div className="h-2 w-full rounded-full bg-gray-100">
                          <div className="h-2 w-[90%] rounded-full bg-green-500" />
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-5 font-medium text-gray-700">
                        CRM Integration
                      </td>

                      <td>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
                          In Progress
                        </span>
                      </td>

                      <td className="text-gray-600">
                        Development
                      </td>

                      <td>
                        <div className="h-2 w-full rounded-full bg-gray-100">
                          <div className="h-2 w-[65%] rounded-full bg-orange-500" />
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-5 font-medium text-gray-700">
                        New campaign
                      </td>

                      <td>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                          Planned
                        </span>
                      </td>

                      <td className="text-gray-600">
                        Sales
                      </td>

                      <td>
                        <div className="h-2 w-full rounded-full bg-gray-100">
                          <div className="h-2 w-[30%] rounded-full bg-blue-500" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ACTIVITY */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Recent Activity
              </h2>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />

                  <div>
                    <h3 className="font-semibold text-gray-700">
                      New employee added
                    </h3>

                    <p className="text-sm text-gray-500">
                      2 minutes ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />

                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Project updated
                    </h3>

                    <p className="text-sm text-gray-500">
                      1 hour ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 h-3 w-3 rounded-full bg-orange-500" />

                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Task assigned
                    </h3>

                    <p className="text-sm text-gray-500">
                      Yesterday
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}