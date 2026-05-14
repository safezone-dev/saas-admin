import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f5f7fb]">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="ml-72 min-h-screen p-6">
        {children}
      </main>
    </div>
  );
}