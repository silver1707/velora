import { MarketingShell } from "@/components/marketing/marketing-layout";
import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidade | Velora",
  description: "Política de Privacidade e Proteção de Dados do sistema Velora.",
};

export default function PrivacidadePage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-soft text-mint mb-6">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-4 text-lg text-muted">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        <article className="premium-panel rounded-3xl p-8 sm:p-12 text-base leading-relaxed text-muted animate-fade-in delay-200">
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Nosso Compromisso</h2>
          <p className="mb-6">
            No Velora, a privacidade e a segurança dos seus dados e dos dados das suas clientes
            são nossa maior prioridade. Desenvolvemos nossa plataforma sob o princípio de
            &quot;Privacy by Design&quot;, garantindo que a confidencialidade das informações técnicas
            e pessoais dos salões seja absoluta.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">2. Coleta de Dados</h2>
          <p className="mb-4">
            <strong>Dados do Titular (Profissional/Salão):</strong> Coletamos seu nome, e-mail e dados
            básicos de cadastro exclusivamente para a criação da sua conta, faturamento da
            assinatura do &quot;Velora Essência&quot; e comunicação técnica.
          </p>
          <p className="mb-6">
            <strong>Dados das Suas Clientes (Histórico Técnico):</strong> Todas as informações de
            contato, datas de nascimento, anotações de serviços, químicas usadas e alertas
            de alergias inseridas no sistema pertencem a você. Nós armazenamos esses dados
            em bancos de dados criptografados, visando única e exclusivamente o funcionamento
            do sistema (como exibir sua agenda ou calcular métricas do dashboard).
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">3. Sigilo e Compartilhamento</h2>
          <p className="mb-6">
            <strong>Nós não vendemos, alugamos ou &quot;tretamos&quot; dados.</strong> 
            As informações do seu salão são isoladas no banco de dados. Um salão jamais terá 
            acesso à base de clientes de outro salão. Os dados também não são repassados a 
            empresas de marketing de terceiros ou marcas de cosméticos.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">4. Hospedagem e Segurança (Supabase)</h2>
          <p className="mb-6">
            O Velora utiliza o <strong>Supabase</strong> como provedor de infraestrutura (Database as a Service). 
            Todos os dados são transmitidos utilizando criptografia TLS (Transport Layer Security) e
            armazenados em servidores seguros. Utilizamos Políticas de Segurança de Linha (RLS - Row Level Security)
            no banco de dados, o que significa que, a nível de servidor, suas informações só podem
            ser lidas quando a sua chave única de autenticação está ativa.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">5. Seus Direitos (LGPD)</h2>
          <p className="mb-4">
            Em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD), você tem o direito de:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Acessar todos os seus dados armazenados.</li>
            <li>Corrigir ou atualizar informações diretamente pelo sistema.</li>
            <li>Exportar seus dados (portabilidade).</li>
            <li>Solicitar a exclusão definitiva de sua conta e de todo o banco de clientes atrelado a ela.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">6. Cookies</h2>
          <p className="mb-6">
            Utilizamos apenas cookies estritamente necessários para manter sua sessão de login
            ativa de forma segura (cookies de autenticação). Não utilizamos rastreadores invasivos
            ou cookies de anúncios de terceiros em nossa aplicação logada.
          </p>

          <hr className="my-10 border-border-soft" />
          
          <p className="text-sm">
            Ficou com alguma dúvida sobre como tratamos a segurança do seu negócio? 
            Nossa equipe de suporte está pronta para ajudar.
          </p>
        </article>
      </main>
    </MarketingShell>
  );
}
