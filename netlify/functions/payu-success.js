const API_BASE   = process.env.NEXT_PUBLIC_API_BASE    || "https://securelint-api.vercel.app";
const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN  || "https://securelint.in";

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body   = event.body || "";
  const params = new URLSearchParams(body);
  const txnid  = params.get("txnid") || "";

  try {
    const backendRes = await fetch(`${API_BASE}/api/payment/payu-success`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      redirect: "manual",
    });

    const location = backendRes.headers.get("location");
    if (location) {
      return { statusCode: 303, headers: { Location: location }, body: "" };
    }
  } catch (_) {
    // Backend unreachable — fall through to txnid-based recovery.
  }

  if (txnid) {
    return {
      statusCode: 303,
      headers: {
        Location: `${APP_ORIGIN}/user/dashboard/subscription?payu=success&txnid=${encodeURIComponent(txnid)}`,
      },
      body: "",
    };
  }

  return {
    statusCode: 303,
    headers: { Location: `${APP_ORIGIN}/user/dashboard/billing?payu=failed` },
    body: "",
  };
};
