import { Eye, Plus, Search, SlidersHorizontal } from "lucide-react";
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

      <form className="toolbar-panel mb-5 grid gap-3 rounded-lg p-3 md:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 text-muted" size={17} />
          <Input
            name="busca"
            defaultValue={params.busca ?? ""}
            placeholder="Buscar por nome, telefone ou bairro"
            className="pl-10"
          />
        </div>
        <Select name="cabelo" defaultValue={params.cabelo ?? ""}>
          <option value="">Todos os cabelos</option>
          {hairTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">
          <SlidersHorizontal size={16} />
          Filtrar
        </Button>
      </form>

      {clients.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {clients.map((client) => (
            <article key={client.id} className="premium-panel rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-lilac/25 bg-lilac/12 font-semibold text-lilac">
                  {initials(client.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {client.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        {client.phone || "Sem telefone"} • {client.neighborhood || "Sem bairro"}
                      </p>
                    </div>
                    {client.hair_type ? (
                      <Badge className="border-lilac/30 bg-lilac/10 text-lilac">
                        {client.hair_type}
                      </Badge>
                    ) : null}
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-muted">Nascimento</dt>
                      <dd className="mt-1 text-foreground">
                        {client.birth_date ? dateLabel(client.birth_date) : "Não informado"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Frequência</dt>
                      <dd className="mt-1 text-foreground">
                        {client.service_frequency || "Não definida"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Alergias</dt>
                      <dd className="mt-1 truncate text-foreground">
                        {client.allergies || "Sem registro"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <LinkButton href={`/clientes/${client.id}`}>
                      <Eye size={16} />
                      Histórico
                    </LinkButton>
                    <Sheet
                      title={`Editar ${client.name}`}
                      trigger={<Button variant="secondary">Editar</Button>}
                    >
                      <ClientForm client={client} />
                    </Sheet>
                    <div className="min-w-36">
                      <QuickActionForm
                        action={deleteClientAction}
                        fields={{ id: client.id }}
                        label="Excluir"
                        variant="danger"
                        confirmMessage="Excluir esta cliente e histórico vinculado?"
                      />
                    </div>
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
      <Pagination
        basePath="/clientes"
        page={clientsPage.page}
        totalPages={clientsPage.totalPages}
        total={clientsPage.total}
        params={{ busca: params.busca, cabelo: params.cabelo }}
      />
    </>
  );
}
