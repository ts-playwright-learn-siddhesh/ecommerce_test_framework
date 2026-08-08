import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { SidebarMenu } from './SidebarMenu.ts';

export abstract class AuthenticatedPage extends BasePage {
  protected readonly sidebarMenu: SidebarMenu;

  constructor(page: Page) {
    super(page);
    this.sidebarMenu = new SidebarMenu(this.page);
  }

  async logout(): Promise<void> {
    await this.sidebarMenu.logout();
  }
}
