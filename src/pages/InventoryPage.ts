import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class InventoryPage extends BasePage {
  readonly inventoryContainer = this.locatorForDataTest('inventory-container');

  constructor(page: Page) {
    super(page);
  }
}
