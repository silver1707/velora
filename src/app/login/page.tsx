import { Scissors } from "lucide-react";
import { Suspense } from "react";
import { AuthForm } from "@/components/forms/auth-form";

export default function LoginPage() {
  return (
    <main className="velora-shell flex min-h-screen items-center justify-center px-4 py-10">
      <section className="auth-card w-full max-w-md rounded-lg p-6 sm:p-8">
        <div className="mb-8">
          <div className="brand-tile mb-5 flex h-12 w-12 items-center justify-center rounded-lg text-lilac">
            <Scissors size={22} />
          </div>
          <p className="text-sm font-semibold uppercase text-lilac">Velora</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">
            Entrar no sistema
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Acesse sua agenda, clientes, histórico técnico e financeiro do salão.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="surface-row rounded-lg p-4 text-sm text-muted">
              Carregando formulário...
            </div>
          }
        >
          <AuthForm mode="login" />
        </Suspense>
      </section>
    </main>
  );
}
