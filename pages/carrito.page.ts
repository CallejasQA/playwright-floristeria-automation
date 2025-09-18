// /pages/carrito.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class CarritoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Abre la página de carrito */
  async goto(): Promise<void> {
    // busca todos los enlaces que lleven a /carrito
    const cartLinks = this.page.locator('a[href*="carrito"]');

    // intenta encontrar uno visible
    const visibleCount = await cartLinks.filter({ has: this.page.locator(':visible') }).count();

    if (visibleCount > 0) {
      const visibleLink = cartLinks.filter({ has: this.page.locator(':visible') }).first();
      await visibleLink.click();
    } else {
      // fallback: navegar directo
      await this.page.goto('/carrito/');
    }

    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page).toHaveURL(/carrito/);
  }

  /** Cantidad de items en el carrito */
  async getItemCount(): Promise<number> {
    return await this.page.locator('.cart_item').count();
  }

  /** Subtotal en texto (ej: "$120.000") */
  async getSubtotal(): Promise<string> {
    const subtotalLocator = this.page.locator('.cart-subtotal .amount, .order-total .amount').first();
    return (await subtotalLocator.textContent() ?? '').trim();
  }
}








