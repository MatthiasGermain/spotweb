"use server";

import { redirect } from "next/navigation";
import { loginUser, registerUser } from "@/lib/ndf/auth";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const result = await loginUser(username, password);
  if (result.ok) redirect("/ndf");

  const error =
    result.error === "disabled"
      ? "Ce compte a été désactivé. Contactez un administrateur."
      : "Identifiant ou mot de passe incorrect.";
  redirect(`/ndf/login?mode=login&error=${encodeURIComponent(error)}&username=${encodeURIComponent(username)}`);
}

export async function registerAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password !== confirm) {
    redirect(
      `/ndf/login?mode=register&error=${encodeURIComponent("Les mots de passe ne correspondent pas.")}&username=${encodeURIComponent(username)}`
    );
  }

  const result = await registerUser(username, password);
  if (result.ok) redirect("/ndf/profile?first=1");

  redirect(`/ndf/login?mode=register&error=${encodeURIComponent(result.error)}&username=${encodeURIComponent(username)}`);
}
