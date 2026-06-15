import { NextResponse } from "next/server";

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN || "https://securelint.in";

export async function POST() {
  return NextResponse.redirect(
    `${APP_ORIGIN}/user/dashboard/billing?payu=failed`,
    303,
  );
}
