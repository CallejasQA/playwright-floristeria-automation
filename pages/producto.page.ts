// /pages/producto.page.ts
import { Page, expect } from '@playwright/test';

export class ProductoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Devuelve el título del producto en la página de detalle */
  async getTitle(): Promise<string> {
    const heading = this.page.getByRole('heading').first();
    await expect(heading).toBeVisible();
    return (await heading.innerText()).trim();
  }

  /** Devuelve el precio tal como aparece (string) */
  async getPrice(): Promise<string> {
    const precioLoc = this.page.locator('.price, .product-price, .woocommerce-Price-amount, .amount').first();
    await expect(precioLoc).toBeVisible();
    const raw = await precioLoc.innerText().catch(() => '');
    return raw.trim();
  }

  /**
   * Agrega el producto al carrito.
   * Usa selectores robustos y hace fallback si no encuentra el botón por role.
   */
  async addToCart(): Promise<void> {
    // botón más común con role=button
    const btn = this.page.getByRole('button', { name: /agregar al carrito|añadir al carrito|add to cart|comprar/i }).first();
    if ((await btn.count()) > 0) {
      await expect(btn).toBeVisible();
      await btn.click();
    } else {
      // fallback a selectores CSS comunes
      const fallback = this.page.locator('button.add_to_cart_button, button.single_add_to_cart_button').first();
      await expect(fallback).toBeVisible();
      await fallback.click();
    }

    // esperar alguna señal de que se agregó (mini-cart, mensaje, contador)
    const mini = this.page.locator('#cart, .mini-cart, .widget_shopping_cart, .added_to_cart').first();
    await mini.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  /** Alias en español si prefieres llamar agregarAlCarrito() */
  async agregarAlCarrito(): Promise<void> {
    return this.addToCart();
  }

  /** Comprueba visibilidad de un producto en listado */
  async isProductVisible(nombreProducto: string): Promise<boolean> {
    const producto = this.page.getByText(new RegExp(nombreProducto, 'i'));
    return await producto.isVisible().catch(() => false);
  }
}





