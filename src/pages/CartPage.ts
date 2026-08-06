import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';

export class CartPage extends BasePage {
  readonly cartContentsContainer = this.locatorForDataTest('cart-contents-container');

  constructor(page: Page) {
    super(page);
  }
}
