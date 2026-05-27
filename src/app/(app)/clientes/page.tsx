import { Eye, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import Form from "next/form";
import { ClientForm } from "@/components/forms/client-form";
import { QuickActionForm } from "@/components/forms/quick-action-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/field";
import { Pagination } from "@/components/ui/pagination";
import { Sheet } from "@/components/ui/sheet";
import { hairTypes } from "@/lib/constants";
import { dateLabel, initials } from "@/lib/utils";
import { deleteClientAction } from "@/server/actions/clients";
import { getClientsPage } from "@/server/queries";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; cabelo?: string; page?: string }>;
}) {
  const params = await searchParams;
  const clientsPage = await getClientsPage({
    search: params.busca,
    hairType: params.cabelo,
    page: params.page,
  });
  const clients = clientsPage.data;

  return (
    <>
      <PageHeader
        eyebrow="Relacionamento"
        title="Clientes"
        description="Cadastre preferências, histórico químico, alergias e observações para cada atendimento ser mais certeiro."
        action={
          <Sheet
            title="Nova cliente"
            description="Registre os dados principais e detalhes técnicos."
            trigger={
              <Button>
                <Plus size={16} />
                Nova cliente
              </Button>
            }
          >
            <ClientForm />
          </Sheet>
        }
      />

      <Form action="/clientes" className="premium-panel mb-8 grid gap-4 rounded-2xl p-4 md:grid-cols-[1fr_220px_auto] items-center shadow-lg">
        <div className="relative group">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-lilac" size={18} />
          <Input
            name="busca"
            defaultValue={params.busca ?? ""}
            placeholder="Buscar por nome, telefone ou bairro"
            className="pl-11 border-transparent bg-background/50 hover:border-lilac/30"
          />
        </div>
        <Select name="cabelo" defaultValue={params.cabelo ?? ""} className="border-transparent bg-background/50 hover:border-lilac/30">
          <option value="">Todos os cabelos</option>
          {hairTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </Select>
        <Button type="submit" variant="primary" className="h-12">
          <SlidersHorizontal size={16} />
          Filtrar
        </Button>
      </Form>

      {clients.length ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {clients.map((client) => (
            <article key={client.id} className="premium-panel group rounded-2xl p-6 transition-all duration-300 hover:border-lilac/40 hover:shadow-[0_0_30px_-15px_var(--lilac)]">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lilac-strong to-lilac-deep text-lg font-bold text-white shadow-lg">
                  {initials(client.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        {client.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        {client.phone || "Sem telefone"} • {client.neighborhood || "Sem bairro"}
                      </p>
                    </div>
                    {client.hair_type ? (
                      <Badge className="border-lilac/30 bg-lilac/10 text-lilac font-medium">
                        {client.hair_type}
                      </Badge>
                    ) : null}
                  </div>

                  <dl className="mt-5 grid gap-4 rounded-xl border border-border-soft bg-background/30 p-4 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-muted text-xs uppercase tracking-wider mb-1">Nascimento</dt>
                      <dd className="font-medium text-foreground">
                        {client.birth_date ? dateLabel(client.birth_date) : "Não informado"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted text-xs uppercase tracking-wider mb-1">Frequência</dt>
                      <dd className="font-medium text-foreground">
                        {client.service_frequency || "Não definida"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted text-xs uppercase tracking-wider mb-1">Alergias</dt>
                      <dd className="truncate font-medium text-danger">
                        {client.allergies || <span className="text-muted">Nenhuma</span>}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <LinkButton href={`/clientes/${client.id}`} variant="primary" size="sm">
                        <Eye size={16} />
                        Ver Histórico
                      </LinkButton>
                      <Sheet
                        title={`Editar ${client.name}`}
                        trigger={<Button variant="secondary" size="sm">Editar</Button>}
                      >
                        <ClientForm client={client} />
                      </Sheet>
                    </div>
                    
                    <QuickActionForm
                      action={deleteClientAction}
                      fields={{ id: client.id }}
                      label={<Trash2 size={16} />}
                      variant="danger"
                      confirmMessage={`Excluir ${client.name} e todo seu histórico?`}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Nenhuma cliente encontrada"
          description="Ajuste a busca ou cadastre a primeira cliente para começar o histórico."
        />
      )}
      <div className="mt-8">
        <Pagination
          basePath="/clientes"
          page={clientsPage.page}
          totalPages={clientsPage.totalPages}
          total={clientsPage.total}
          params={{ busca: params.busca, cabelo: params.cabelo }}
        />
      </div>
    </>
  );
}
