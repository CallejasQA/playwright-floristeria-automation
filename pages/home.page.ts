// /pages/home.page.ts
import { Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navega al home usando el baseURL configurado en playwright.config.ts */
  async goto(): Promise<void> {
    await this.page.goto('/'); // usa baseURL si está configurado
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Abre la categoría cuyo nombre contiene `nombreCategoria` (case-insensitive).
   * Intenta primero un link con role=link y luego un texto visible.
   */
  async goToCategoria(nombreCategoria: string): Promise<void> {
    const link = this.page.getByRole('link', { name: new RegExp(nombreCategoria, 'i') }).first();
    if ((await link.count()) > 0) {
      await expect(link).toBeVisible();
      await link.click();
      return;
    }

    // fallback: buscar por texto en cualquier elemento visible
    const texto = this.page.getByText(new RegExp(nombreCategoria, 'i')).first();
    await expect(texto).toBeVisible();
    await texto.click();
  }
}
