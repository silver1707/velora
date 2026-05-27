import { expect, test } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

test.skip(!email || !password, "Preencha E2E_EMAIL e E2E_PASSWORD para rodar o fluxo autenticado.");

function localDateTimePlusDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(10, 30, 0, 0);
  return date.toISOString().slice(0, 16);
}

test("cria cliente, produto, atendimento concluído, baixa estoque e gera financeiro", async ({
  page,
}) => {
  const suffix = Date.now();
  const clientName = `Cliente E2E ${suffix}`;
  const productName = `Produto E2E ${suffix}`;

  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email!);
  await page.getByLabel("Senha").fill(password!);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/clientes");
  await page.getByRole("button", { name: "Nova cliente" }).click();
  await page.getByLabel("Nome completo").fill(clientName);
  await page.getByLabel("Telefone").fill("(11) 90000-0000");
  await page.getByLabel("Bairro").fill("Teste");
  await page.getByLabel("Tipo de cabelo").selectOption({ label: "Ondulado" });
  await page.getByRole("button", { name: "Cadastrar cliente" }).click();
  await expect(page.getByText("Cliente cadastrada com sucesso.")).toBeVisible();

  await page.goto("/produtos");
  await page.getByRole("button", { name: "Novo produto" }).click();
  await page.getByLabel("Nome").fill(productName);
  await page.getByLabel("Marca").fill("Marca E2E");
  await page.getByLabel("Categoria").selectOption({ label: "Tratamento" });
  await page.getByLabel("Quantidade em estoque").fill("10");
  await page.getByLabel("Alerta abaixo de").fill("2");
  await page.getByRole("button", { name: "Cadastrar produto" }).click();
  await expect(page.getByText("Produto cadastrado.")).toBeVisible();

  await page.goto("/atendimentos");
  await page.getByRole("button", { name: "Novo atendimento" }).click();
  await page.getByLabel("Cliente").selectOption({ label: clientName });
  await page.getByLabel("Serviço").selectOption({ label: "Hidratação" });
  await page.getByLabel("Data e horário").fill(localDateTimePlusDays(1));
  await page.getByLabel("Valor cobrado").fill("120");
  await page.getByLabel("Pagamento").selectOption({ label: "Pix" });
  await page.getByLabel(new RegExp(productName)).check();
  await page.getByRole("button", { name: "Criar atendimento" }).click();
  await expect(page.getByText("Atendimento salvo.")).toBeVisible();

  await page.goto("/atendimentos");
  const serviceCard = page
    .locator("article")
    .filter({ hasText: clientName })
    .filter({ hasText: "Hidratação" });
  await expect(serviceCard).toBeVisible();
  await serviceCard.getByRole("button", { name: "Concluir" }).click();
  await expect(page.getByText("Status atualizado.")).toBeVisible();

  await page.goto("/produtos");
  const productCard = page.locator("article").filter({ hasText: productName });
  await expect(productCard).toContainText("9");

  await page.goto("/financeiro");
  await expect(page.getByText(clientName)).toBeVisible();
  await expect(page.getByText(/R\$\s*120,00/)).toBeVisible();
});
