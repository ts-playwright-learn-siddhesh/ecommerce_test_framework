import type { Locator, Page } from '@playwright/test';
import { SidebarMenu } from './SidebarMenu.ts';

export abstract class BasePage {
  protected readonly sidebarMenu: SidebarMenu;

  constructor(protected readonly page: Page) {
    this.sidebarMenu = new SidebarMenu(this.page);
  }

  get currentPage(): Page {
    return this.page;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  currentUrl(): string {
    return this.page.url();
  }

  protected locatorForDataTest(dataTestValue: string): Locator {
    return this.page.locator(`[data-test="${dataTestValue}"]`);
  }

  async logout(): Promise<void> {
    await this.sidebarMenu.logout();
  }
}
