import { NextResponse } from "next/server";
import { loginUser, registerUser } from "@/lib/ndf/auth";

function redirectToLogin(request: Request, params: Record<string, string>) {
  const url = new URL("/ndf/login", request.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const mode = formData.get("mode") === "register" ? "register" : "login";
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (mode === "login") {
    const result = await loginUser(username, password);
    if (result.ok) return NextResponse.redirect(new URL("/ndf", request.url), 303);

    const error =
      result.error === "disabled"
        ? "Ce compte a été désactivé. Contactez un administrateur."
        : "Identifiant ou mot de passe incorrect.";
    return redirectToLogin(request, { mode: "login", error, username });
  }

  const confirm = String(formData.get("confirm") ?? "");
  if (password !== confirm) {
    return redirectToLogin(request, { mode: "register", error: "Les mots de passe ne correspondent pas.", username });
  }

  const result = await registerUser(username, password);
  if (result.ok) return NextResponse.redirect(new URL("/ndf/profile?first=1", request.url), 303);

  return redirectToLogin(request, { mode: "register", error: result.error, username });
}
