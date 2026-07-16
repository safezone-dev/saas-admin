"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

export default function ProductsPage() {

  const [products, setProducts] =
    useState<any[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [productName, setProductName] =
    useState("");

   const [editingProduct, setEditingProduct] =
    useState<any>(null);

  useEffect(() => {

    loadProducts();

  }, []);

  async function loadProducts() {

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");
  
    if (error) {
  
      console.log(error);
  
      return;
  
    }
  
    setProducts(data || []);
  
  }
  
  async function saveProduct() {
  
    if (!productName.trim()) {
  
      alert("Digite el nombre del producto");
  
      return;
  
    }
  
    const { data: existe } = await supabase
      .from("products")
      .select("id")
      .eq("name", productName)
      .limit(1);
  
    if (
      existe &&
      existe.length > 0 &&
      (!editingProduct ||
        existe[0].id !== editingProduct.id)
    ) {
  
      alert("Ese producto ya existe.");
  
      return;
  
    }
  
    if (editingProduct) {
  
      const { error } = await supabase
        .from("products")
        .update({
  
          name: productName,
  
        })
        .eq("id", editingProduct.id);
  
      if (error) {
  
        alert(error.message);
  
        return;
  
      }
  
    } else {
  
      const { error } = await supabase
        .from("products")
        .insert({
  
          name: productName,
  
        });
  
      if (error) {
  
        alert(error.message);
  
        return;
  
      }
  
    }
  
    setProductName("");
  
    setEditingProduct(null);
  
    setShowModal(false);
  
    loadProducts();
  
  }
  
  async function toggleProduct(product: any) {

    console.log("Producto:", product);
  
    const { data, error } = await supabase
      .from("products")
      .update({
        active: !product.active,
      })
      .eq("id", product.id)
      .select();
  
    console.log("Data:", data);
    console.log("Error:", error);
  
    if (error) {
  
      alert(error.message);
  
      return;
  
    }
  
    loadProducts();
  
  }
  return (

    <div className="min-h-screen bg-gray-100 p-4 lg:p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">

              <Package size={22} />

            </div>

            <div>

              <h1 className="text-2xl font-bold">

                Productos

              </h1>

              <p className="text-sm text-gray-500">

                Catálogo de productos

              </p>

            </div>

          </div>

          <button
            onClick={() => {

                setEditingProduct(null);
              
                setProductName("");
              
                setShowModal(true);
              
              }}
            className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >

            <Plus size={16} className="inline mr-2"/>

            Nuevo Producto

          </button>

        </div>

        {/* TABLA */}

        <div className="overflow-hidden rounded-[24px] bg-white shadow">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="p-4 text-left">

                  Producto

                </th>

                <th className="p-4 text-center">

                  Estado

                </th>

                <th className="p-4 text-center">

                  Acciones

                </th>

              </tr>

            </thead>

            <tbody>

              {products.map((product) => (

                <tr
                  key={product.id}
                  className="border-t"
                >

                  <td className="p-4">

                    {product.name}

                  </td>

                  <td className="p-4 text-center">

                  {product.active ? (

<span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

  Activo

</span>

) : (

<span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

  Inactivo

</span>

)}

                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

                    <button
  onClick={() => {

    setEditingProduct(product);

    setProductName(product.name);

    setShowModal(true);

  }}
  className="text-blue-600 hover:text-blue-800"
>

  <Pencil size={18} />

</button>
<button
  onClick={() =>
    toggleProduct(product)
  }
  className={
    product.active
      ? "text-red-600 hover:text-red-800"
      : "text-green-600 hover:text-green-800"
  }
>

  {product.active ? "Desactivar" : "Activar"}

</button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="w-full max-w-md rounded-[24px] bg-white p-6">

            <div className="mb-6 flex items-center justify-between">

            <h2 className="text-xl font-bold">

{editingProduct

  ? "Editar Producto"

  : "Nuevo Producto"}

</h2>

              <button
                onClick={() => setShowModal(false)}
              >

                <X/>

              </button>

            </div>

            <input
              value={productName}
              onChange={(e)=>

                setProductName(e.target.value)

              }
              placeholder="Nombre del producto"
              className="w-full rounded-xl border p-3"
            />

            <button
              onClick={saveProduct}
              className="mt-5 w-full rounded-xl bg-black py-3 text-white"
            >

              Guardar

            </button>

          </div>

        </div>

      )}

    </div>

  );

}