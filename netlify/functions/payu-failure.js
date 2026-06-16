const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN || "https://securelint.in";

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  return {
    statusCode: 303,
    headers: { Location: `${APP_ORIGIN}/user/dashboard/billing?payu=failed` },
    body: "",
  };
};
