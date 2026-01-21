import { test, expect } from "@playwright/test";

test.describe("E2E: Gestión de Inventario y Admin", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Ir a la base
    await page.goto("/");

    // 2. Inyectar sesión (Admin)
    await page.evaluate(() => {
      localStorage.setItem("userName", "Ramiro Urrutia");
    });

    // 3. Recargar para que impacte el cambio
    await page.reload();
  });

  test("Flujo completo: De Home a Dashboard pasando por Logs", async ({
    page,
    isMobile,
  }) => {
    // --- PASO 1: HOME ---
    // Usamos 'Admin panel' que es lo que detectó el snapshot
    const adminPanelHeading = page.getByRole("heading", {
      name: "Admin panel",
    });
    await expect(adminPanelHeading).toBeVisible();

    // --- PASO 2: NAVEGACIÓN A LOGS ---
    // El link se llama simplemente "Logs" según el snapshot
    await page.getByRole("link", { name: "Logs" }).click();
    await expect(page).toHaveURL(/.*admin\/logs/);

    // --- PASO 3: VERIFICAR LOGS (SISTEMA DE CARDS) ---
    // No usamos 'table tr' porque usas divs/cards.
    // Buscamos el texto "Acción" que aparece en cada registro.
    await expect(
      page.getByRole("heading", { name: "Logs de Movimientos" }),
    ).toBeVisible();
    const firstLogAccion = page.getByText("Acción").first();
    await expect(firstLogAccion).toBeVisible();

    // --- PASO 4: VOLVER Y DASHBOARD ---
    // Si no hay un botón físico de "Volver", podemos usar la navegación del navegador
    // o hacer click en el logo/home si existe. Aquí usamos navegación directa para asegurar.
    await page.goto("/");
    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL(/.*admin\/dashboard/);

    // --- PASO 5: VALIDAR MÉTRICAS ---
    // Buscamos el contenedor que tiene "Items Totales" y verificamos que tenga un número
    const statsContainer = page.locator('div:has-text("Items Totales")').last();
    // Esperamos que el número (p.text-4xl) sea visible
    const valorLabel = statsContainer.locator("p.text-4xl");
    await expect(valorLabel).not.toBeEmpty();

    const valorNum = await valorLabel.innerText();
    expect(Number(valorNum)).toBeGreaterThanOrEqual(0);

    // --- PASO 6: REVISIÓN MOBILE ---
    if (isMobile) {
      // Verificamos que no haya scroll horizontal roto
      const bodyWidth = await page.evaluate(() => document.body.clientWidth);
      const viewportWidth = page.viewportSize()?.width || 0;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
    }
  });

  // 1. Sacamos la lógica de login del beforeEach general si afecta a la seguridad
  // O mejor aún, limpiamos específicamente en el test de seguridad:

  test("Seguridad: Usuario no autorizado", async ({ page }) => {
    // Ir a la página para tener el contexto del dominio
    await page.goto("/");

    // Asegurarnos de que el localStorage esté realmente limpio
    await page.evaluate(() => localStorage.clear());

    // Intentar entrar directamente a una ruta protegida
    await page.goto("/admin/dashboard");

    // Playwright esperará automáticamente a que la URL cambie
    // Si tu app redirige a "/", este expect pasará.
    await expect(page).toHaveURL("http://localhost:3000/");

    // Verificación extra: El título de Admin no debe existir
    const adminHeading = page.getByRole("heading", {
      name: "Estado del Inventario",
    });
    await expect(adminHeading).not.toBeVisible();
  });
});
