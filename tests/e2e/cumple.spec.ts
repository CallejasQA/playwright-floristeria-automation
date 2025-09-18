import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { CategoriaPage } from '../../pages/categoria.page';
import { CarritoPage } from '../../pages/carrito.page';

test.describe('Escenario E2E - Categoría Cumpleaños', () => {
  test('Agregar y eliminar producto con evidencia', async ({ page }) => {
    // Instancias de las Pages
    const homePage = new HomePage(page);
    const categoriaPage = new CategoriaPage(page);
    const carritoPage = new CarritoPage(page);

    // 1. Navegar al home
    await homePage.goto();

    // 2. Ir a categoría Cumpleaños
    await homePage.irACategoria('Cumpleaños');

    // 3. Seleccionar el primer producto
    const nombreProducto = await categoriaPage.getNombreProductoPorIndice(0);
    await categoriaPage.seleccionarProductoPorIndice(0);

    // 4. Ir al carrito
    await carritoPage.goto();

    // 5. Validar que el producto está en el carrito
    const productosEnCarrito = await carritoPage.getProductosEnCarrito();
    expect(productosEnCarrito).toContain(nombreProducto);

    // 6. Eliminar producto del carrito
    const removeButton = page.locator('.product-remove a.remove').first();
    await removeButton.waitFor({ state: 'attached' });
    await removeButton.click({ force: true });

    // 7. Validar que el carrito está vacío o aparece mensaje de éxito
    await expect(
      page.locator('.cart-empty, .woocommerce-message, .cart-empty.woocommerce-info')
    ).toBeVisible({ timeout: 15000 });

    // 8. 📸 Evidencia final del carrito vacío
    await test.info().attach('cumple_carrito_vacio', { body: await page.screenshot(), contentType: 'image/png' });

  });
});




