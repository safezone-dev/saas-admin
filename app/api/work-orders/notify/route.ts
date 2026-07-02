import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const { workOrderId } = await request.json();

    if (!workOrderId) {
      return NextResponse.json(
        { error: "workOrderId es requerido" },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("work_orders")
      .select(`
      *,
      companies (
        company_name,
        company_email,
        company_phone,
        manager_name
      ),
      technicians (
        full_name,
        email,
        phone
      ),
      service_types (
        name
      )
    `)
      .eq("id", workOrderId)
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        error,
        { status: 500 }
      );
    }

    // ENVÍO A MAKE
    console.log("========== ENVIANDO A MAKE ==========");
console.log(order);

const makeResponse = await fetch(
  "https://hook.us1.make.com/2wmpzsa4pnf4l5zca42uoaqr3r8jni7f",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  }
);

console.log("Status Make:", makeResponse.status);

const responseText = await makeResponse.text();

console.log("Respuesta Make:");
console.log(responseText);

    return NextResponse.json({
      success: true,
      makeStatus: makeResponse.status,
      order,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        error: "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}