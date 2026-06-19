"use client";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { useReactToPrint } from "react-to-print";

import {
  ShieldAlert,
} from "lucide-react";

export default function FlyingInsectsReportPage() {

    const params = useParams();
  
    const id = params.id;
  
    const [report, setReport] = useState<any>(null);
  
    const [stations, setStations] = useState<any[]>([]);
  
    const [workOrder, setWorkOrder] = useState<any>(null);
  
    const [loading, setLoading] = useState(true);
  
    const printRef =
      useRef<HTMLDivElement>(null);
  
    const handlePrint =
      useReactToPrint({
        contentRef: printRef,
        documentTitle:
          `Reporte_Insectos_Voladores_${report?.fecha_aplicacion || ""}`
      });
  
    useEffect(() => {
      loadReport();
    }, []);

  async function loadReport() {
    

    const {
        data: reportData,
        error: reportError,
      } =
        await supabase
          .from(
            "monitoreo_insectos_voladores"
          )
          .select("*")
          .eq(
            "orden_trabajo_id",
            id
          )
          .single();

  
    if (reportError) {
  
      console.log(reportError);
      
  
      setLoading(false);
  
      return;
    }
  
    const {
      data: workOrderData,
      error: workOrderError,
    } =
      await supabase
        .from("work_orders")
        .select(`
          *,
          companies (
            company_name
          ),
          technicians (
            full_name,
            email,
            phone
          )
        `)
        .eq("id", id)
        .single();
  
    if (workOrderError) {
  
      console.log(workOrderError);
  
    }
  
  
const {
  data: stationsData,
  error: stationsError,
} =
  await supabase
    .from(
      "monitoreo_insectos_estaciones"
    )
    .select("*")
    .eq(
      "monitoreo_id",
      reportData.id
    )
    .order(
      "numero_estacion",
      {
        ascending: true,
      }
    );

if (stationsError) {

  console.log(
    stationsError
  );

}

setReport(
  reportData
);

setWorkOrder(
  workOrderData
);

setStations(
  stationsData || []
);

setLoading(false);

} // <- cierre de loadReport()

  if (loading) {

    return (
      <div className="p-10">
        Cargando...
      </div>
    );
  }

  if (!report) {

    return (
      <div className="p-10">
        Reporte no encontrado
      </div>
    );
  }

 
const totalPalomillas =
stations.reduce(
  (t, s) =>
    t +
    (s.palomilla || 0),
  0
);

const totalMoscaMetalica =
stations.reduce(
  (t, s) =>
    t +
    (
      s.mosca_metalica || 0
    ),
  0
);

const totalMosquitos =
stations.reduce(
  (t, s) =>
    t +
    (
      s.mosquitos || 0
    ),
  0
);

  return (

    <div
    ref={printRef}
    className="mx-auto w-full max-w-7xl space-y-6 px-3 py-4 md:px-6"
  >

<div className="flex justify-end">

<button
  onClick={handlePrint}
  className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
>
  Descargar PDF
</button>

</div>
{/* ENCABEZADO EMPRESA */}
<div className="rounded-[24px] bg-white p-6 shadow-sm">

  <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

    <div className="flex items-center gap-4">

      <img
        src="https://mjr-fumigaciones.com/wp-content/uploads/2026/02/logo_colorm.png"
        alt="Logo"
        className="h-16"
      />

      <div>

        <h1 className="text-2xl font-bold">

        Monitoreo de Insectos Voladores

        </h1>

        <p className="text-sm text-gray-500">

          Reporte Técnico de Servicio

        </p>

      </div>

    </div>

    <div className="text-right">

      <p className="text-sm text-gray-500">

        Fecha del Reporte

      </p>

      <p className="font-semibold">

      {report.fecha_aplicacion}
      </p>

    </div>

  </div>

</div>

{/* EMPRESA Y TÉCNICO */}
<div className="rounded-[24px] bg-white p-6 shadow-sm">

<h2 className="mb-5 text-lg font-bold">

  Información del Servicio

</h2>

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

  <InfoField
    label="Empresa"
    value={
      workOrder?.companies
        ?.company_name
    }
  />

  <InfoField
    label="Técnico"
    value={
      workOrder?.technicians
        ?.full_name
    }
  />

  <InfoField
    label="Correo"
    value={
      workOrder?.technicians
        ?.email
    }
  />

  <InfoField
    label="Teléfono"
    value={
      workOrder?.technicians
        ?.phone
    }
  />

</div>

</div>

{/* RESUMEN */}

<div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4">

      <Card
  title="Estaciones"
  value={stations.length}
/>

<Card
  title="Palomillas"
  value={totalPalomillas}
/>

<Card
  title="Mosca Metálica"
  value={totalMoscaMetalica}
/>

<Card
  title="Mosquitos"
  value={totalMosquitos}
/>

      </div>

{/* INFORMACIÓN */}

      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-lg font-bold">

          Información General

        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

        <InfoField
  label="Fecha"
  value={
    report.fecha_aplicacion
  }
/>

<InfoField
  label="Hora Inicio"
  value={
    report.hora_inicio
  }
/>

<InfoField
  label="Hora Final"
  value={
    report.hora_final
  }
/>

<InfoField
  label="Frecuencia"
  value={
    report.frecuencia
  }
/>

<InfoField
  label="Estado Bulbo"
  value={
    report.estado_bulbo
  }
/>

<InfoField
  label="Conexión Eléctrica"
  value={
    report.conexion_electrica
  }
/>

        </div>

      </div>

      <div className="rounded-[24px] bg-white p-6 shadow-sm">

<h2 className="mb-4 text-lg font-bold">

Estado del Equipo

</h2>

<div className="grid gap-4 md:grid-cols-4">

<InfoField
label="Limpieza"
value={
report.limpieza_equipo
? "Sí"
: "No"
}
/>

<InfoField
label="Funcionamiento"
value={
report.funcionamiento
? "Correcto"
: "Incorrecto"
}
/>

<InfoField
label="Cambio Adhesivo"
value={
report.cambio_adhesivo
? "Sí"
: "No"
}
/>

<InfoField
label="Bulbo"
value={
report.estado_bulbo
}
/>

</div>

</div>


{/* VISTA MOVIL */}

<div className="rounded-[24px] bg-white p-6 shadow-sm">

  <h2 className="mb-5 text-lg font-bold">
    Estaciones Revisadas
  </h2>

  <div className="space-y-4">

    {stations.map((station) => (

      <div
        key={station.id}
        className="rounded-2xl border bg-gray-50 p-5"
      >

        <div className="mb-4 border-b pb-3">

          <h3 className="font-bold text-lg">

            Estación {station.numero_estacion}

          </h3>

        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <InfoField
            label="Palomillas"
            value={station.palomilla}
          />

          <InfoField
            label="Mosca Metálica"
            value={station.mosca_metalica}
          />

          <InfoField
            label="Mosca Doméstica"
            value={station.mosca_domestica}
          />

          <InfoField
            label="Mosca Fruta"
            value={station.mosca_fruta}
          />

          <InfoField
            label="Mosquitos"
            value={station.mosquitos}
          />

          <InfoField
            label="Escarabajos"
            value={station.escarabajos}
          />

          <InfoField
            label="Hormigas Aladas"
            value={station.hormigas_alas}
          />

        </div>

        {station.observaciones && (

          <div className="mt-4 rounded-xl bg-white p-4">

            <p className="mb-1 text-xs font-semibold text-gray-500">
              Observaciones
            </p>

            <p className="text-sm text-gray-700">
              {station.observaciones}
            </p>

          </div>

        )}

      </div>

    ))}

  </div>

</div>




{/* OBSERVACIONES */}


<div className="rounded-[24px] bg-white p-6 shadow-sm">

<h2 className="mb-5 text-lg font-bold">

  Observaciones

</h2>

<div className="space-y-3">

  {stations.map(
    (
      station,
      index
    ) => (

      <div
        key={index}
        className="rounded-xl bg-gray-50 p-4"
      >

        <p className="font-semibold">

          Estación {
            station.numero_estacion
          }

        </p>

        <p className="mt-1 text-sm text-gray-600">

          {
            station.observaciones ||
            "Sin observaciones"
          }

        </p>

      </div>

    )
  )}

</div>

</div>

    </div>



  );
}

function Card({
  title,
  value,
}: any) {

  return (

    <div className="rounded-[24px] bg-white p-5 shadow-sm">

      <p className="text-sm text-gray-500">

        {title}

      </p>

      <h3 className="mt-2 text-3xl font-bold">

        {value}

      </h3>

    </div>

  );
}

function InfoField({
  label,
  value,
}: any) {

  return (

    <div>

      <p className="text-sm text-gray-500">

        {label}

      </p>

      <p className="font-semibold">

        {value || "-"}

      </p>

    </div>

  );
}