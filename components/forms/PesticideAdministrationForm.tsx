"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PesticideAdministrationForm({
  order,
}: any) {

  const router =
    useRouter();

  const [loading,
    setLoading] =
    useState(false);

  const [general,
    setGeneral] =
    useState({

      fecha_inicio:
        order?.scheduled_date || "",

      hora_inicio:
        new Date()
          .toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),

      hora_final: "",

      frecuencia: "",

      observaciones_generales:
        "",

    });

  const [products,
    setProducts] =
    useState([
      {
        nombre_producto: "",

        numero_registro: "",

        organismo_meta: "",

        cantidad_usada: "",

        dosis: "",

        aspersion: false,

        laqueo: false,

        cebos: false,

        planchas_goma: false,

        espolvoreo: false,

        nebulizacion: false,

        termonebulizacion: false,

        area_tratada: "",

        observaciones: "",
      },
    ]);

  function addProduct() {

    setProducts([
      ...products,
      {
        nombre_producto: "",

        numero_registro: "",

        organismo_meta: "",

        cantidad_usada: "",

        dosis: "",

        aspersion: false,

        laqueo: false,

        cebos: false,

        planchas_goma: false,

        espolvoreo: false,

        nebulizacion: false,

        termonebulizacion: false,

        area_tratada: "",

        observaciones: "",
      },
    ]);
  }

  function updateProduct(
    index: number,
    field: string,
    value: any
  ) {

    const updated =
      [...products];

    updated[index] = {

      ...updated[index],

      [field]: value,

    };

    setProducts(
      updated
    );
  }

  async function saveForm() {

    try {

      setLoading(true);

      const horaFinal =
        new Date()
          .toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );

      const {
        data: applicationData,
        error,
      } = await supabase
        .from(
          "administracion_plaguicidas"
        )



        .insert({

          orden_trabajo_id:
            order.id,

          ...general,

          hora_final:
            horaFinal,

        })
        .select()
        .single();

        if (error) {

            console.log(
              "SUPABASE ERROR:",
              error
            );
          
            alert(
              JSON.stringify(
                error,
                null,
                2
              )
            );
          
            return;
          }

      const {
        error:
          detailError,
      } = await supabase
        .from(
          "administracion_plaguicidas_detalle"
        )
        .insert(

          products.map(
            (
              product
            ) => ({

              aplicacion_id:
                applicationData.id,

              ...product,

            })
          )
        );

      if (detailError) {

        console.log(
          detailError
        );

        alert(
          "Error guardando detalle"
        );

        return;
      }

      await supabase
        .from(
          "work_orders"
        )
        .update({
          status:
            "completed",
        })
        .eq(
          "id",
          order.id
        );

      alert(
        "Formulario guardado correctamente"
      );

      router.push(
        "/company-dashboard/pending-orders"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Error general"
      );

    } finally {

      setLoading(false);

    }
  }

  return (

    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">

      <div className="mx-auto max-w-7xl rounded-[28px] bg-white p-6 shadow-sm">

        <div className="mb-8">

          <h1 className="text-2xl font-bold">

            Administración de Plaguicidas

          </h1>

        </div>

        {/* DATOS GENERALES */}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <ReadOnlyField
            label="Fecha inicio"
            value={
              general.fecha_inicio
            }
          />

          <ReadOnlyField
            label="Hora inicio"
            value={
              general.hora_inicio
            }
          />

          <ReadOnlyField
            label="Hora final"
            value="Se registrará al guardar"
          />

          <SelectField
            label="Frecuencia"
            value={
              general.frecuencia
            }
            onChange={(
              value: any
            ) =>
              setGeneral({
                ...general,
                frecuencia:
                  value,
              })
            }
            options={[
              "Semanal",
              "Quincenal",
              "Mensual",
              "Bimensual",
              "Trimestral",
              "Semestral",
              "Anual",
            ]}
          />

        </div>

        {/* PRODUCTOS */}

        <div className="mt-10">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-lg font-bold">

              Productos Aplicados

            </h2>

            <button
              type="button"
              onClick={
                addProduct
              }
              className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >

              Agregar Producto

            </button>

          </div>

          <div className="space-y-6">

            {products.map(
              (
                product,
                index
              ) => (

                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 p-6"
                >

                  <h3 className="mb-5 font-bold">

                    Producto
                    {" "}
                    {index + 1}

                  </h3>

                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                    <InputField
                      label="Nombre Producto"
                      value={
                        product.nombre_producto
                      }
                      onChange={(v:any)=>
                        updateProduct(
                          index,
                          "nombre_producto",
                          v
                        )
                      }
                    />

                    <InputField
                      label="Número Registro"
                      value={
                        product.numero_registro
                      }
                      onChange={(v:any)=>
                        updateProduct(
                          index,
                          "numero_registro",
                          v
                        )
                      }
                    />

                    <InputField
                      label="Organismo Meta"
                      value={
                        product.organismo_meta
                      }
                      onChange={(v:any)=>
                        updateProduct(
                          index,
                          "organismo_meta",
                          v
                        )
                      }
                    />

                    <InputField
                      label="Cantidad Usada"
                      value={
                        product.cantidad_usada
                      }
                      onChange={(v:any)=>
                        updateProduct(
                          index,
                          "cantidad_usada",
                          v
                        )
                      }
                    />

                    <InputField
                      label="Dosis"
                      value={
                        product.dosis
                      }
                      onChange={(v:any)=>
                        updateProduct(
                          index,
                          "dosis",
                          v
                        )
                      }
                    />

                    <InputField
                      label="Área Tratada"
                      value={
                        product.area_tratada
                      }
                      onChange={(v:any)=>
                        updateProduct(
                          index,
                          "area_tratada",
                          v
                        )
                      }
                    />

                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                    <CheckField label="Aspersión" checked={product.aspersion} onChange={(v:any)=>updateProduct(index,"aspersion",v)} />
                    <CheckField label="Laqueo" checked={product.laqueo} onChange={(v:any)=>updateProduct(index,"laqueo",v)} />
                    <CheckField label="Cebos" checked={product.cebos} onChange={(v:any)=>updateProduct(index,"cebos",v)} />
                    <CheckField label="Planchas Goma" checked={product.planchas_goma} onChange={(v:any)=>updateProduct(index,"planchas_goma",v)} />
                    <CheckField label="Espolvoreo" checked={product.espolvoreo} onChange={(v:any)=>updateProduct(index,"espolvoreo",v)} />
                    <CheckField label="Nebulización" checked={product.nebulizacion} onChange={(v:any)=>updateProduct(index,"nebulizacion",v)} />
                    <CheckField label="Termonebulización" checked={product.termonebulizacion} onChange={(v:any)=>updateProduct(index,"termonebulizacion",v)} />

                  </div>

                  <div className="mt-6">

                    <label className="mb-2 block text-sm font-semibold">

                      Observaciones

                    </label>

                    <textarea
                      rows={4}
                      value={
                        product.observaciones
                      }
                      onChange={(e)=>
                        updateProduct(
                          index,
                          "observaciones",
                          e.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-gray-200 p-4"
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </div>

        <div className="mt-8">

          <label className="mb-2 block text-sm font-semibold">

            Observaciones Generales

          </label>

          <textarea
            rows={5}
            value={
              general.observaciones_generales
            }
            onChange={(e)=>
              setGeneral({
                ...general,
                observaciones_generales:
                  e.target.value,
              })
            }
            className="w-full rounded-2xl border border-gray-200 p-4"
          />

        </div>

        <button
          onClick={
            saveForm
          }
          disabled={
            loading
          }
          className="mt-10 w-full rounded-2xl bg-black px-6 py-4 text-white"
        >

          {loading
            ? "Guardando..."
            : "Guardar formulario"}

        </button>

      </div>

    </div>

  );
}

function InputField({
  label,
  value,
  onChange,
}: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-200 p-4"
      />
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
}: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
        {value}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <select
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-200 p-4"
      >
        <option value="">
          Seleccionar
        </option>

        {options.map(
          (option:string)=>(
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function CheckField({
  label,
  checked,
  onChange,
}: any) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e)=>onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}