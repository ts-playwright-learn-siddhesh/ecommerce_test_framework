import type { Page } from '@playwright/test';
<<<<<<< HEAD
import { BasePage } from './BasePage.ts';
import { LoginPage } from './LoginPage.ts';
import { SidebarMenu } from './SidebarMenu.ts';
=======
import { BasePage } from './BasePage.js';
>>>>>>> main

export class CartPage extends BasePage {
  readonly cartContentsContainer = this.locatorForDataTest('cart-contents-container');

  constructor(page: Page) {
    super(page);
  }
}
