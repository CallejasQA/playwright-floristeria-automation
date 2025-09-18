// tests/e2e/amor.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { CategoriaPage } from '../../pages/categoria.page';
import { ProductoPage } from '../../pages/producto.page';
import { CarritoPage } from '../../pages/carrito.page';

/** Helper para convertir strings de precio a número (maneja puntos y comas) */
function parsePrice(raw?: string): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^\d.,-]/g, '').trim();
  const lastDot = cleaned.lastIndexOf('.');
  const lastComma = cleaned.lastIndexOf(',');
  let normalized = cleaned;

  if (lastDot > -1 && lastComma > -1) {
    // ambos presentes: el que esté más a la derecha es decimal
    if (lastDot > lastComma) {
      // punto es decimal -> quitar comas (miles)
      normalized = cleaned.replace(/,/g, '');
    } else {
      // coma es decimal -> quitar puntos y cambiar coma por punto
      normalized = cleaned.replace(/\./g, '').replace(',', '.');
    }
  } else if (lastComma > -1) {
    // solo coma presente -> coma decimal
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // solo puntos o ninguno -> quitar comas
    normalized = cleaned.replace(/,/g, '');
  }

  const n = parseFloat(normalized);
  return Number.isNaN(n) ? 0 : n;
}

test.describe('Escenario E2E - Categoría Amor', () => {
  test('Seleccionar dos productos y validar carrito', async ({ page }) => {
    const homePage = new HomePage(page);
    const categoriaPage = new CategoriaPage(page);
    const productoPage = new ProductoPage(page);
    const carritoPage = new CarritoPage(page);

    // 1) Ir al home y categoría Amor
    await homePage.goto();
    await homePage.goToCategoria('Amor');

    // 2) Primer producto (índice 0)
    const nombre1 = await categoriaPage.getNombreProductoPorIndice(0);
    const precioStr1 = await categoriaPage.getPrecioProductoPorIndice(0);
    await categoriaPage.abrirProductoPorIndice(0);

    // Interceptar respuesta de add-to-cart (si existe)
    const addResp1Promise = page.waitForResponse(resp =>
      (resp.url().toLowerCase().includes('cart') || resp.request().url().toLowerCase().includes('add')) &&
      resp.status() >= 200 && resp.status() < 300, { timeout: 10_000 }
    ).catch(() => null);

    await productoPage.addToCart();
    const resp1 = await addResp1Promise;
    if (resp1) expect(resp1.ok()).toBeTruthy();

    // 3) Volver a categoría Amor
    await homePage.goToCategoria('Amor');

    // 4) Segundo producto (índice 1)
    const nombre2 = await categoriaPage.getNombreProductoPorIndice(1);
    const precioStr2 = await categoriaPage.getPrecioProductoPorIndice(1);
    await categoriaPage.abrirProductoPorIndice(1);

    const addResp2Promise = page.waitForResponse(resp =>
      (resp.url().toLowerCase().includes('cart') || resp.request().url().toLowerCase().includes('add')) &&
      resp.status() >= 200 && resp.status() < 300, { timeout: 10_000 }
    ).catch(() => null);

    await productoPage.addToCart();
    const resp2 = await addResp2Promise;
    if (resp2) expect(resp2.ok()).toBeTruthy();

    // 5) Ir al carrito
    await carritoPage.goto();

    // 6) Validaciones
    const itemCount = await carritoPage.getItemCount();
    expect(itemCount).toBe(2);

    // comparar nombres (parcial)
    const cartItems = page.locator('.cart_item');
    await expect(cartItems.first()).toContainText(nombre1.slice(0, Math.min(12, nombre1.length)));
    await expect(cartItems.nth(1)).toContainText(nombre2.slice(0, Math.min(12, nombre2.length)));

    // comparar precios en texto (puede variar por formato)
    await expect(cartItems.first()).toContainText(precioStr1.slice(0, Math.min(8, precioStr1.length)));
    await expect(cartItems.nth(1)).toContainText(precioStr2.slice(0, Math.min(8, precioStr2.length)));

    // subtotal
    const subtotalStr = await carritoPage.getSubtotal();
    const subtotal = parsePrice(subtotalStr);
    const p1 = parsePrice(precioStr1);
    const p2 = parsePrice(precioStr2);
    const esperado = p1 + p2;

    expect(Math.abs(subtotal - esperado)).toBeLessThanOrEqual(0.6);

    // adjuntar screenshot al reporte
    await test.info().attach('carrito-2-items', { body: await page.screenshot(), contentType: 'image/png' });
  });
});

