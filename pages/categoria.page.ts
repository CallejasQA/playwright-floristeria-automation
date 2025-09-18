// /pages/categoria.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class CategoriaPage {
  readonly page: Page;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    // selectores defensivos: artículos o bloques de producto comunes
    this.productCards = page.locator('article, .product, .product-item, .woocommerce-LoopProduct-link');
  }

  /** Devuelve el nombre del producto en la posición `index` (0-based) */
  async getNombreProductoPorIndice(index: number): Promise<string> {
    const card = this.productCards.nth(index);
    await expect(card).toBeVisible();
    const titleLocator = card.locator('h2, h3, .product-title, .woocommerce-loop-product__title, a');
    const text = (await titleLocator.first().innerText().catch(() => '')).trim();
    return text;
  }

  /** Devuelve el precio del producto en la posición `index` (0-based) — string tal como aparece */
  async getPrecioProductoPorIndice(index: number): Promise<string> {
    const card = this.productCards.nth(index);
    await expect(card).toBeVisible();
    const priceLocator = card.locator('.price, .amount, .woocommerce-Price-amount, .product-price, .price');
    const text = (await priceLocator.first().innerText().catch(() => '')).trim();
    return text;
  }

  /** Abre (clic) el producto por índice */
  async abrirProductoPorIndice(index: number): Promise<void> {
    const card = this.productCards.nth(index);
    await expect(card).toBeVisible();
    const link = card.locator('a').first();
    await expect(link).toBeVisible();
    await link.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
  // Alias en español
async seleccionarProductoPorIndice(index: number): Promise<void> {
  return this.abrirProductoPorIndice(index);
}

}




