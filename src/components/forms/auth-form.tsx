"use client";

import { Loader2 } from "lucide-react";
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
    <form onSubmit={onSubmit} className="grid gap-5">
      {!hasSupabaseConfig ? (
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm leading-6 text-gold">
          Preencha o `.env.local` com as chaves do Supabase antes de usar login,
          cadastro e banco de dados.
        </div>
      ) : null}

      {mode === "signup" ? (
        <Field label="Nome completo">
          <Input
            name="full_name"
            required
            minLength={2}
            placeholder="Marina Alves"
          />
        </Field>
      ) : null}

      <Field label="E-mail profissional">
        <Input
          name="email"
          type="email"
          required
          placeholder="marina@salao.com.br"
        />
      </Field>

      <Field label="Senha">
        <Input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="••••••••"
        />
      </Field>

      {message ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm leading-6 text-danger">
          {message}
        </div>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full mt-2 h-12 text-[15px]">
        {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
        {mode === "login" ? "Entrar na minha conta" : "Criar minha conta"}
      </Button>

      <p className="mt-4 text-center text-[15px] text-muted">
        {mode === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
        <Link
          href={mode === "login" ? "/cadastro" : "/login"}
          className="font-semibold text-lilac hover:text-lilac-strong transition-colors"
        >
          {mode === "login" ? "Criar cadastro" : "Entrar agora"}
        </Link>
      </p>
    </form>
  );
}
