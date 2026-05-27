import { expect, test } from "@playwright/test";

test("mostra login, cadastro e redireciona páginas protegidas", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", {
      name: "Velora organiza o salão sem tirar beleza da rotina.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver recursos" })).toBeVisible();

  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Entrar no sistema" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();

  await page.getByRole("link", { name: "Criar cadastro" }).click();
  await page.waitForURL("**/cadastro", { timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Criar conta" })).toBeVisible();

  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/login", { timeout: 30_000 });
  await expect(page).toHaveURL(/\/login/);
});
