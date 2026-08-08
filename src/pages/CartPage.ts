import type { Page } from '@playwright/test';
import { AuthenticatedPage } from './AuthenticatedPage.ts';

export class CartPage extends AuthenticatedPage {
  readonly cartContentsContainer = this.locatorForDataTest('cart-contents-container');

  constructor(page: Page) {
    super(page);
  }
}
