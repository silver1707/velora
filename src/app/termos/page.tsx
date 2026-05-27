import { MarketingShell } from "@/components/marketing/marketing-layout";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Velora",
  description: "Termos e Condições de Uso do sistema Velora.",
};

export default function TermosPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-soft text-lilac mb-6">
            <Sparkles size={24} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Termos de Uso
          </h1>
          <p className="mt-4 text-lg text-muted">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        <article className="premium-panel rounded-3xl p-8 sm:p-12 text-base leading-relaxed text-muted animate-fade-in delay-200">
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Aceitação dos Termos</h2>
          <p className="mb-6">
            Ao acessar e utilizar o sistema Velora (&quot;nós&quot;, &quot;nosso&quot;, &quot;sistema&quot;), você concorda em cumprir e estar
            vinculado a estes Termos de Uso. O Velora é um software como serviço (SaaS) projetado
            exclusivamente para a gestão de salões de beleza e profissionais autônomos. Se você
            não concordar com qualquer parte destes termos, não poderá utilizar nossos serviços.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">2. O Plano Velora Essência</h2>
          <p className="mb-4">
            O Velora opera sob um modelo de assinatura chamado &quot;Velora Essência&quot;. Este plano garante
            o direito de uso contínuo da plataforma, abrangendo módulos de agenda, gestão de clientes
            (histórico técnico), controle de estoque e fluxo financeiro.
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>A assinatura é pessoal e intransferível.</li>
            <li>O acesso é garantido mediante o pagamento em dia da mensalidade vigente.</li>
            <li>O não pagamento pode resultar na suspensão temporária do acesso aos dados.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">3. Propriedade dos Dados</h2>
          <p className="mb-4">
            <strong>Você é o único proprietário dos dados de suas clientes.</strong> Nós não vendemos,
            alugamos ou compartilhamos a lista de contatos, histórico químico ou dados financeiros
            cadastrados no sistema com terceiros.
          </p>
          <p className="mb-6">
            O Velora atua apenas como processador e guardião tecnológico das informações inseridas
            por você. É de sua inteira responsabilidade garantir que as informações de suas clientes
            foram coletadas com o devido consentimento, respeitando a legislação local (como a LGPD no Brasil).
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">4. Uso Aceitável</h2>
          <p className="mb-4">
            O sistema Velora deve ser utilizado estritamente para a finalidade de gestão de negócios
            de beleza. É terminantemente proibido:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Tentar violar a segurança, fazer engenharia reversa ou sobrecarregar nossos servidores.</li>
            <li>Utilizar o sistema para armazenar conteúdos ilegais, ofensivos ou não relacionados à gestão do salão.</li>
            <li>Compartilhar credenciais de acesso (login e senha) com pessoas não autorizadas.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">5. Disponibilidade e Backup</h2>
          <p className="mb-6">
            Nós nos esforçamos para manter o Velora online 99.9% do tempo e realizamos backups
            automatizados regulares. No entanto, não podemos garantir que o serviço será
            ininterrupto ou livre de falhas em decorrência de eventos de força maior (como quedas
            nos provedores de nuvem). Recomendamos que você extraia relatórios periodicamente, caso deseje.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">6. Cancelamento e Encerramento</h2>
          <p className="mb-6">
            Você pode cancelar sua assinatura do Velora Essência a qualquer momento. Após o
            cancelamento, você continuará tendo acesso ao sistema até o final do período já faturado.
            Após este período, o acesso será bloqueado e seus dados poderão ser permanentemente
            excluídos após 60 (sessenta) dias, a menos que uma reativação seja solicitada.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">7. Alterações nos Termos</h2>
          <p className="mb-6">
            Podemos revisar estes Termos de Uso periodicamente. Caso realizemos mudanças significativas
            que afetem seus direitos, notificaremos você através do sistema ou por e-mail com
            antecedência razoável.
          </p>

          <hr className="my-10 border-border-soft" />
          
          <p className="text-sm">
            Para dúvidas legais ou solicitações relacionadas a estes termos, entre em contato
            com nosso suporte.
          </p>
        </article>
      </main>
    </MarketingShell>
  );
}
