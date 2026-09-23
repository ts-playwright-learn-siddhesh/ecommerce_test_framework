import type { Locator, Page } from '@playwright/test';

export class SidebarMenu {
  readonly menuButton: Locator;
  readonly closeButton: Locator;
  readonly menuWrap: Locator;
  readonly menuLinks: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeButton = page.locator('#react-burger-cross-btn');
    this.menuWrap = page.locator('.bm-menu-wrap');
    this.menuLinks = page.locator('.bm-item-list a');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async open(): Promise<void> {
    await this.page.addStyleTag({ content: '.bm-menu-wrap, .bm-menu { transition: none !important; }' });
    await this.menuButton.click();
    await this.menuWrap.waitFor({ state: 'visible' });
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async logout(): Promise<void> {
    await this.open();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }
}
