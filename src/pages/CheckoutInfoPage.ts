import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { CartPage } from './CartPage.ts';
import { CheckoutOverviewPage } from './CheckoutOverviewPage.ts';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutInfoPage extends BasePage {
  static readonly url = /checkout-step-one\.html/;

  readonly firstNameInput = this.locatorForDataTest('firstName');
  readonly lastNameInput = this.locatorForDataTest('lastName');
  readonly postalCodeInput = this.locatorForDataTest('postalCode');
  readonly cancelButton = this.locatorForDataTest('cancel');
  readonly continueButton = this.locatorForDataTest('continue');
  readonly errorMessage = this.locatorForDataTest('error');

  constructor(page: Page) {
    super(page);
  }

  private async fillInfo(info: Partial<CheckoutInfo>): Promise<void> {
    if (info.firstName !== undefined) {
      await this.firstNameInput.fill(info.firstName);
    }
    if (info.lastName !== undefined) {
      await this.lastNameInput.fill(info.lastName);
    }
    if (info.postalCode !== undefined) {
      await this.postalCodeInput.fill(info.postalCode);
    }
  }

  async continueCheckout(info: CheckoutInfo): Promise<CheckoutOverviewPage> {
    await this.fillInfo(info);
    await this.continueButton.click();
    await this.page.waitForURL(CheckoutOverviewPage.url);
    return new CheckoutOverviewPage(this.page);
  }

  async continueExpectingFailure(info: Partial<CheckoutInfo>): Promise<void> {
    await this.fillInfo(info);
    await this.continueButton.click();
  }

  async cancel(): Promise<CartPage> {
    await this.cancelButton.click();
    await this.page.waitForURL(CartPage.url);
    return new CartPage(this.page);
  }
}
