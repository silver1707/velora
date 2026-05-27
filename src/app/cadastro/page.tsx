import { Sparkles } from "lucide-react";
import { Suspense } from "react";
import { AuthForm } from "@/components/forms/auth-form";

export default function SignupPage() {
  return (
    <main className="velora-shell flex min-h-screen items-center justify-center px-4 py-10">
      <section className="auth-card w-full max-w-md rounded-lg p-6 sm:p-8">
        <div className="mb-8">
          <div className="brand-tile mb-5 flex h-12 w-12 items-center justify-center rounded-lg text-lilac">
            <Sparkles size={22} />
          </div>
          <p className="text-sm font-semibold uppercase text-lilac">Velora</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">
            Criar conta
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Configure sua rotina de atendimento em poucos minutos.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="surface-row rounded-lg p-4 text-sm text-muted">
              Carregando formulário...
            </div>
          }
        >
          <AuthForm mode="signup" />
        </Suspense>
      </section>
    </main>
  );
}
