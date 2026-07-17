"use client";

import {
  useState,
  useEffect,
} from "react";

import { supabase }
from "@/lib/supabase";
import SearchSelect
from "@/components/ui/SearchSelect";

type ServiceItem = {

  product_used: string;

  area: string;

  treated_area: string;

  application_methods: string[];

  dosage: string;

  observed_pest: string;

};

export default function ServiceSheetAdminForm({
  companies,
  technicians,
  onSuccess,
}: any) {

  const [companyId,
    setCompanyId] =
    useState("");

  const [technicianId,
    setTechnicianId] =
    useState("");

  const [serviceDate,
    setServiceDate] =
    useState("");

  const [generalObservations,
    setGeneralObservations] =
    useState("");

    const [products,
      setProducts] =
      useState<any[]>([]);

      const [showProductModal,
        setShowProductModal] =
        useState(false);
      
      const [newProduct,
        setNewProduct] =
        useState("");

  const [items,
    setItems] =
    useState<ServiceItem[]>([

      {

        product_used: "",

        area: "",

        treated_area:
          "Tratada",

        application_methods:
          [],

        dosage: "",

        observed_pest: "",

      },

    ]);
    useEffect(() => {

      loadProducts();
    
    }, []);
    
    async function loadProducts() {
    
      const { data, error } =
        await supabase
          .from("products")
          .select("*")
          .eq("active", true)
          .order("name");
    
      if (error) {
    
        console.log(error);
    
        return;
    
      }
    
      setProducts(data || []);
    
    }

    async function saveNewProduct(productName: string) {

      if (!productName.trim()) return;
    
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: productName,
        })
        .select()
        .single();
    
      if (error) {
    
        alert(error.message);
    
        return null;
    
      }
    
      await loadProducts();
    
      return data;
    
    }

  function addItem() {

    setItems([

      ...items,

      {

        product_used: "",

        area: "",

        treated_area:
          "Tratada",

        application_methods:
          [],

        dosage: "",

        observed_pest: "",

      },

    ]);
  }

  function updateItem(
    index: number,
    field: keyof ServiceItem,
    value: string
  ) {

    const updated =
      [...items];

    updated[index][field]
      = value as never;

    setItems(updated);
  }

  function toggleMethod(
    index: number,
    method: string
  ) {

    const updated =
      [...items];

    const methods =
      updated[index]
        .application_methods;

    if (
      methods.includes(method)
    ) {

      updated[index]
        .application_methods =
        methods.filter(
          (m: string) =>
            m !== method
        );

    } else {

      updated[index]
        .application_methods =
        [
          ...methods,
          method,
        ];
    }

    setItems(updated);
  }

  async function saveSheet() {

    const { error } =
      await supabase
        .from(
          "service_sheets"
        )
        .insert([

          {

            company_id:
              companyId,

            technician_id:
              technicianId,

            service_date:
              serviceDate,

            admin_observations:
              generalObservations,

            items,

            status:
              "pending",

          },

        ]);

    if (error) {

      alert(error.message);

      return;
    }

    alert(
      "Hoja creada correctamente"
    );

    onSuccess();
  }

  return (
    <div className="space-y-6">

      {/* GENERAL */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {/* EMPRESA */}
        <div>

          <label className="mb-2 block text-sm font-semibold">

            Empresa

          </label>

          <select
            value={companyId}
            onChange={(e) =>
              setCompanyId(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-gray-200 p-3 text-sm"
          >

            <option value="">
              Seleccionar
            </option>

            {companies.map(
              (company: any) => (

                <option
                  key={company.id}
                  value={company.id}
                >

                  {
                    company.company_name
                  }

                </option>
              )
            )}

          </select>

        </div>

        {/* TECNICO */}
        <div>

          <label className="mb-2 block text-sm font-semibold">

            Técnico

          </label>

          <select
            value={
              technicianId
            }
            onChange={(e) =>
              setTechnicianId(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-gray-200 p-3 text-sm"
          >

            <option value="">
              Seleccionar
            </option>

            {technicians.map(
              (tech: any) => (

                <option
                  key={tech.id}
                  value={tech.id}
                >

                  {tech.full_name}

                </option>
              )
            )}

          </select>

        </div>

        {/* FECHA */}
        <div>

          <label className="mb-2 block text-sm font-semibold">

            Fecha servicio

          </label>

          <input
            type="date"
            value={serviceDate}
            onChange={(e) =>
              setServiceDate(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-gray-200 p-3 text-sm"
          />

        </div>

      </div>

      {/* ITEMS */}
      <div className="space-y-6">

        {items.map(
          (
            item,
            index
          ) => (

            <div
              key={index}
              className="rounded-[24px] border border-gray-200 p-5"
            >

              <h2 className="mb-5 text-lg font-bold">

                Item #{index + 1}

              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                {/* PRODUCTO */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">

                    Producto utilizado

                  </label>

                  <div className="flex gap-2 items-start">

<div className="flex-1">

  <SearchSelect

    options={products.map(product => ({

      id: product.id,

      name: product.name,

    }))}

    value={item.product_used}

    placeholder="Buscar producto..."

    allowCreate={true}

    onCreate={async (value) => {

      const product = await saveNewProduct(value);
    
      if (product) {
    
        updateItem(
          index,
          "product_used",
          product.name
        );
    
      }
    
    }}

    onChange={(product) =>

      updateItem(
        index,
        "product_used",
        product.name
      )
    
    }

  />

</div>

</div>

                </div>

                {/* AREA */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">

                    Área

                  </label>

                  <input
                    value={
                      item.area
                    }
                    onChange={(e) =>
                      updateItem(
                        index,
                        "area",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm"
                  />

                </div>

                {/* AREA TRATADA */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">

                    Área tratada

                  </label>

                  <select
                    value={
                      item.treated_area
                    }
                    onChange={(e) =>
                      updateItem(
                        index,
                        "treated_area",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm"
                  >

                    <option>
                      Tratada
                    </option>

                    <option>
                      No tratada
                    </option>

                  </select>

                </div>

                {/* DOSIS */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">

                    Dosis

                  </label>

                  <input
                    value={
                      item.dosage
                    }
                    onChange={(e) =>
                      updateItem(
                        index,
                        "dosage",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm"
                  />

                </div>

                {/* PLAGA */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">

                    Plaga observada

                  </label>

                  <input
                    value={
                      item.observed_pest
                    }
                    onChange={(e) =>
                      updateItem(
                        index,
                        "observed_pest",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm"
                  />

                </div>

              </div>

              {/* METODOS */}
              <div className="mt-5">

                <label className="mb-3 block text-sm font-semibold">

                  Método aplicación

                </label>

                <div className="grid gap-3 md:grid-cols-3">

                  {[
                    "Aspersión",
                    "Laqueo",
                    "Cebo",
                    "Planchas de goma",
                    "Espolvoreo",
                    "Nebulización",
                    "Termonebulización",
                  ].map((method) => (

                    <label
                      key={method}
                      className="flex items-center gap-2 text-sm"
                    >

                      <input
                        type="checkbox"
                        checked={
                          item.application_methods.includes(
                            method
                          )
                        }
                        onChange={() =>
                          toggleMethod(
                            index,
                            method
                          )
                        }
                      />

                      {method}

                    </label>
                  ))}

                </div>

              </div>

            </div>
          )
        )}

      </div>

      {/* ADD ITEM */}
      <button
        type="button"
        onClick={addItem}
        className="rounded-2xl bg-gray-200 px-5 py-3 text-sm font-semibold"
      >

        Agregar Item

      </button>

      {/* OBSERVACIONES */}
      <div>

        <label className="mb-2 block text-sm font-semibold">

          Observaciones generales

        </label>

        <textarea
          rows={5}
          value={
            generalObservations
          }
          onChange={(e) =>
            setGeneralObservations(
              e.target.value
            )
          }
          className="w-full rounded-xl border border-gray-200 p-3 text-sm"
        />

      </div>

      {/* SAVE */}
      {showProductModal && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

<div className="w-full max-w-md rounded-[24px] bg-white p-6">

<h2 className="mb-5 text-xl font-bold">

Nuevo Producto

</h2>

<input
value={newProduct}
onChange={(e)=>
setNewProduct(
e.target.value
)
}
placeholder="Nombre del producto"
className="w-full rounded-xl border border-gray-200 p-3"
/>

<div className="mt-6 flex justify-end gap-3">

<button
type="button"
onClick={()=>
setShowProductModal(false)
}
className="rounded-xl bg-gray-200 px-5 py-2"
>

Cancelar

</button>

<button
type="button"
onClick={saveNewProduct}
className="rounded-xl bg-black px-5 py-2 text-white"
>

Guardar

</button>

</div>

</div>

</div>

)}

      <button
        type="button"
        onClick={saveSheet}
        className="w-full rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white"
      >

        Guardar Hoja de Servicio

      </button>

    </div>
  );
}