# Velora

Velora é um sistema web completo para uma cabeleireira organizar clientes, agenda, atendimentos, produtos usados, histórico técnico, fotos antes/depois, estoque e financeiro simples. O projeto também inclui uma área pública de produto com landing page, páginas de recursos, sobre e preços.

## O Que Tem No Projeto

- Landing page pública em `/`.
- Páginas públicas em `/recursos`, `/sobre` e `/precos`.
- Login, cadastro e logout com Supabase Auth.
- Dashboard protegido após login.
- CRUD de clientes com busca, filtro, paginação, preferências, alergias, tipo de cabelo, histórico químico e fotos.
- Agenda por dia, semana e mês.
- Atendimentos com status, valor, forma de pagamento, duração, observações e produtos usados.
- Baixa automática de estoque quando um atendimento é concluído.
- Produtos com estoque, custo, categoria, marca e alerta de baixo estoque.
- Financeiro simples com totais diário, semanal e mensal.
- Supabase PostgreSQL com RLS para separar dados por usuária.
- Supabase Storage para fotos antes/depois.
- Favicon, manifest, robots, sitemap e metadata para produção.
- Testes E2E com Playwright.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth, PostgreSQL, Storage e SSR
- Zod
- Recharts
- Lucide React
- Playwright

## Rodar Localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra:

```text
http://localhost:3000
```

No PowerShell do Windows, se `npm` estiver bloqueado pela política de execução:

```bash
npm.cmd run dev
```

## Variáveis De Ambiente

Preencha `.env.local` no desenvolvimento e as mesmas variáveis no painel da Vercel em produção.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=client-photos
DATABASE_URL=
DIRECT_URL=
SUPABASE_SERVICE_ROLE_KEY=
E2E_BASE_URL=http://127.0.0.1:3000
E2E_EMAIL=
E2E_PASSWORD=
```

Obrigatórias para o app funcionar:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`

O projeto não usa `SUPABASE_SERVICE_ROLE_KEY` no frontend. Essa chave é sensível e deve ficar fora do browser.

## Configurar O Supabase

1. Acesse [Supabase](https://supabase.com) e crie um projeto.
2. Guarde a senha do banco.
3. Em `Project Settings > API`, copie:
   - `Project URL` para `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Em `Project Settings > Database`, copie a connection string se quiser preencher `DATABASE_URL` e `DIRECT_URL`.
5. Abra `SQL Editor`.
6. Cole e execute o arquivo [database/schema.sql](./database/schema.sql).

O `schema.sql` cria:

- `profiles`
- `clients`
- `products`
- `service_records`
- `service_products`
- `product_stock_movements`
- `financial_entries`
- índices
- constraints
- triggers
- função de sincronização de estoque
- políticas RLS
- bucket `client-photos`
- policies de Storage

## Configurar Auth No Supabase

No Supabase, vá em `Authentication > URL Configuration`.

Em desenvolvimento:

```text
Site URL:
http://localhost:3000

Redirect URLs:
http://localhost:3000/auth/callback
```

Em produção, depois de publicar na Vercel:

```text
Site URL:
https://seu-dominio.com

Redirect URLs:
https://seu-dominio.com/auth/callback
https://seu-dominio.com/**
```

Para uso simples com a sua mãe, você pode decidir se quer confirmação de e-mail:

- Com confirmação ligada: a conta precisa confirmar o e-mail antes de entrar.
- Com confirmação desligada: o cadastro entra mais rápido.

Essa opção fica em `Authentication > Providers > Email`.

## Storage De Fotos

O bucket padrão é:

```text
client-photos
```

Ele é criado pelo `schema.sql` e usado por:

```env
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=client-photos
```

As fotos antes/depois ficam salvas em uma pasta com o UUID da usuária. O bucket está público para facilitar o uso e renderização das imagens. Para um produto com dados muito sensíveis, uma evolução futura seria trocar para bucket privado com URLs assinadas.

## Dados De Exemplo

O seed é opcional.

1. Crie uma conta pelo app.
2. Vá em `Authentication > Users`.
3. Copie o UUID da usuária.
4. Abra [database/seed.sql](./database/seed.sql).
5. Substitua `00000000-0000-0000-0000-000000000000` pelo UUID real.
6. Execute no SQL Editor.

## Deploy Na Vercel

1. Suba o projeto para o GitHub.
2. Entre na [Vercel](https://vercel.com).
3. Clique em `Add New > Project`.
4. Importe o repositório.
5. Framework: `Next.js`.
6. Build command: `npm run build`.
7. Install command: `npm install`.
8. Configure as variáveis de ambiente:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
NEXT_PUBLIC_APP_URL=https://seu-dominio-ou-url-da-vercel
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=client-photos
```

9. Faça o deploy.
10. Copie a URL final da Vercel.
11. Volte no Supabase e atualize `Authentication > URL Configuration` com a URL final.
12. Rode um novo deploy se mudar `NEXT_PUBLIC_APP_URL`.

## Domínio Próprio

Na Vercel:

1. Vá em `Project > Settings > Domains`.
2. Adicione seu domínio.
3. Siga as instruções de DNS da Vercel.
4. Quando o domínio estiver ativo, altere:

```env
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
```

Depois atualize também o Supabase Auth:

```text
Site URL:
https://seu-dominio.com

Redirect URLs:
https://seu-dominio.com/auth/callback
https://seu-dominio.com/**
```

## Checklist De Produção

Antes de considerar pronto:

- `npm run lint` passa.
- `npm run build` passa.
- `npm run test:e2e -- public.spec.ts` passa.
- `.env.local` não foi enviado para o Git.
- Variáveis de ambiente estão na Vercel.
- `database/schema.sql` foi executado no Supabase.
- Login e cadastro foram testados.
- Bucket `client-photos` existe.
- Upload de foto antes/depois funciona.
- Criar cliente funciona.
- Criar produto funciona.
- Criar atendimento funciona.
- Marcar atendimento como concluído baixa estoque.
- Financeiro mostra o recebimento.
- Rotas protegidas redirecionam para `/login`.
- `NEXT_PUBLIC_APP_URL` usa a URL real de produção.
- URLs de callback estão configuradas no Supabase.

## Testes

Instale o navegador do Playwright uma vez:

```bash
npx playwright install chromium
```

Teste público, sem precisar de conta:

```bash
npm run test:e2e -- public.spec.ts --project=chromium
```

Teste completo autenticado:

```env
E2E_EMAIL=
E2E_PASSWORD=
```

Depois:

```bash
npm run test:e2e -- authenticated-flow.spec.ts --project=chromium
```

Esse teste cria dados com prefixo `E2E` e valida:

- login
- cliente
- produto
- atendimento concluído
- baixa de estoque
- financeiro

## Scripts

```bash
npm run dev             # desenvolvimento
npm run build           # build de produção
npm run start           # roda a build local
npm run lint            # eslint
npm run test:e2e        # testes Playwright
npm run test:e2e:headed # testes Playwright com navegador visível
```

## Estrutura

```text
database/
  schema.sql
  seed.sql
public/
  brand/
  marketing/
src/
  app/
  components/
  lib/
  server/
tests/
  e2e/
```

Principais áreas:

- `src/app`: rotas públicas, rotas protegidas, auth callback, sitemap, robots e manifest.
- `src/components`: componentes de UI, marketing, layout, formulários e dashboard.
- `src/lib`: constantes, tipos, helpers e clientes Supabase.
- `src/server`: queries, validações e server actions.
- `database`: SQL pronto para Supabase.
- `public/brand`: favicon e marca.
- `public/marketing`: imagem hero da landing.

## Pós-Deploy: Teste Rápido

Depois que a Vercel publicar:

1. Abra a home.
2. Acesse `/recursos`, `/sobre` e `/precos`.
3. Clique em `Começar`.
4. Crie uma conta.
5. Entre no dashboard.
6. Cadastre uma cliente.
7. Cadastre um produto com estoque `10`.
8. Crie um atendimento usando esse produto.
9. Marque como concluído.
10. Confira se o estoque diminuiu e se o financeiro recebeu o valor.

## Backup

Para uso pessoal, o mais importante é não perder os dados do Supabase.

Opções:

- Usar backups automáticos do Supabase em planos pagos.
- Exportar dados periodicamente pelo painel do Supabase.
- Usar ferramentas como `pg_dump` com `DATABASE_URL` se quiser backup local.

## Observações

- O projeto está preparado para produção simples na Vercel com Supabase.
- As rotas internas são protegidas por middleware.
- As policies RLS do schema fazem cada usuária acessar apenas os próprios dados.
- A landing pública é estática e otimizada pelo Next.
- O favicon, manifest, sitemap e robots já estão configurados.
