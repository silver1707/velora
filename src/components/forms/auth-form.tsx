"use client";

import { Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("full_name") ?? "");

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setMessage(result.error.message);
      setLoading(false);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("Cadastro criado. Confirme seu e-mail para acessar o Velora.");
      setLoading(false);
      return;
    }

    const next = searchParams.get("next") ?? "/dashboard";
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {!hasSupabaseConfig ? (
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm leading-6 text-gold">
          Preencha o `.env.local` com as chaves do Supabase antes de usar login,
          cadastro e banco de dados.
        </div>
      ) : null}

      {mode === "signup" ? (
        <Field label="Nome profissional">
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-3 text-muted" size={17} />
            <Input
              name="full_name"
              required
              minLength={2}
              placeholder="Ex.: Marina Alves"
              className="pl-10"
            />
          </div>
        </Field>
      ) : null}

      <Field label="E-mail">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-3 text-muted" size={17} />
          <Input
            name="email"
            type="email"
            required
            placeholder="voce@salao.com"
            className="pl-10"
          />
        </div>
      </Field>

      <Field label="Senha">
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-3 text-muted" size={17} />
          <Input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            className="pl-10"
          />
        </div>
      </Field>

      {message ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm leading-6 text-danger">
          {message}
        </div>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {mode === "login" ? "Entrar" : "Criar conta"}
      </Button>

      <p className="text-center text-sm text-muted">
        {mode === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
        <Link
          href={mode === "login" ? "/cadastro" : "/login"}
          className="font-medium text-lilac hover:text-foreground"
        >
          {mode === "login" ? "Criar cadastro" : "Entrar"}
        </Link>
      </p>
    </form>
  );
}
