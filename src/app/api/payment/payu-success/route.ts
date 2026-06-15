import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://securelint-api.vercel.app";
const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN || "https://securelint.in";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const params = new URLSearchParams();
  formData.forEach((value, key) => {
    params.append(key, value.toString());
  });

  try {
    const backendRes = await fetch(`${API_BASE}/api/payment/payu-success`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      redirect: "manual",
    });

    const location = backendRes.headers.get("location");
    if (location) {
      return NextResponse.redirect(location, 303);
    }
  } catch {
    // Fall through to default redirect
  }

  return NextResponse.redirect(
    `${APP_ORIGIN}/user/dashboard/subscription?payu=success`,
    303,
  );
}
