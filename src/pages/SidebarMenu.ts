import type { Locator, Page } from '@playwright/test';

export class SidebarMenu {
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async logout(): Promise<void> {
    await this.page.addStyleTag({ content: '.bm-menu-wrap, .bm-menu { transition: none !important; }' });
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }
}
