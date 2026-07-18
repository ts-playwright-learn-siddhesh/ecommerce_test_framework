import type { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  currentUrl(): string {
    return this.page.url();
  }

  protected locatorForDataTest(dataTestValue: string): Locator {
    return this.page.locator(`[data-test="${dataTestValue}"]`);
  }
}
