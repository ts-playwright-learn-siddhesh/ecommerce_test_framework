import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { CheckoutCompletePage } from './CheckoutCompletePage.ts';
import { InventoryPage } from './InventoryPage.ts';

export class CheckoutOverviewPage extends BasePage {
  static readonly url = /checkout-step-two\.html/;

  readonly summaryContainer = this.locatorForDataTest('checkout-summary-container');
  readonly cartItems = this.locatorForDataTest('inventory-item');
  readonly paymentInfoValue = this.locatorForDataTest('payment-info-value');
  readonly shippingInfoValue = this.locatorForDataTest('shipping-info-value');
  readonly subtotalLabel = this.locatorForDataTest('subtotal-label');
  readonly taxLabel = this.locatorForDataTest('tax-label');
  readonly totalLabel = this.locatorForDataTest('total-label');
  readonly cancelButton = this.locatorForDataTest('cancel');
  readonly finishButton = this.locatorForDataTest('finish');

  constructor(page: Page) {
    super(page);
  }

  itemName(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-name"]');
  }

  itemPrice(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-price"]');
  }

  async finish(): Promise<CheckoutCompletePage> {
    await this.finishButton.click();
    await this.page.waitForURL(CheckoutCompletePage.url);
    return new CheckoutCompletePage(this.page);
  }

  async cancel(): Promise<InventoryPage> {
    await this.cancelButton.click();
    await this.page.waitForURL(InventoryPage.url);
    return new InventoryPage(this.page);
  }
}
