export default function DashboardPage() {
    return (
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Dashboard
          </h1>
  
          <p className="mt-2 text-gray-600">
            Bienvenido al sistema administrativo SaaS
          </p>
        </div>
  
        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-sm text-gray-500">
              Empresas
            </h2>
  
            <p className="mt-3 text-4xl font-bold">
              0
            </p>
          </div>
  
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-sm text-gray-500">
              Administradores
            </h2>
  
            <p className="mt-3 text-4xl font-bold">
              1
            </p>
          </div>
  
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-sm text-gray-500">
              Usuarios
            </h2>
  
            <p className="mt-3 text-4xl font-bold">
              0
            </p>
          </div>
  
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-sm text-gray-500">
              Estado
            </h2>
  
            <p className="mt-3 text-xl font-bold text-green-600">
              Online
            </p>
          </div>
        </div>
  
        {/* Content */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            Panel Administrativo
          </h2>
  
          <p className="mt-3 text-gray-600">
            Aquí comenzará el sistema modular
            multiempresa.
          </p>
        </div>
      </div>
    );
  }