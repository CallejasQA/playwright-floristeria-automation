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
    itemsLocator() {
    return this.page.locator('.cart_item, .woocommerce-cart-form__cart-item');
  }
  async getNombreProductoPorIndice(index: number): Promise<string> {
  const item = this.itemsLocator().nth(index);
  return (await item.locator('a, .product-name, .name, .product-title').first().innerText().catch(() => '')).trim();
}

async getPrecioProductoPorIndice(index: number): Promise<string> {
  const item = this.itemsLocator().nth(index);
  return (await item.locator('.amount, .product-price, .price, .woocommerce-Price-amount').first().innerText().catch(() => '')).trim();
}
/** Devuelve todos los nombres de productos en el carrito */
  async getProductosEnCarrito(): Promise<string[]> {
    const items = this.itemsLocator();
    const count = await items.count();
    const nombres: string[] = [];

    for (let i = 0; i < count; i++) {
      const nombre = await items
        .nth(i)
        .locator('a, .product-name, .name, .product-title')
        .first()
        .innerText()
        .catch(() => '');
      nombres.push(nombre.trim());
    }

    return nombres;
  }

  /** Elimina un producto del carrito por su índice */
  async eliminarProductoPorIndice(index: number): Promise<void> {
    const removeButtons = this.page.locator('.remove, .product-remove a');
    const total = await removeButtons.count();

    if (index < total) {
      await removeButtons.nth(index).click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      throw new Error(`No existe un producto en la posición ${index}`);
    }
  }

}








