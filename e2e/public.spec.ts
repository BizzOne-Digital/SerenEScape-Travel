import { test, expect } from "@playwright/test";

test.describe("Public site", () => {
  test("homepage loads with hero headline", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Come for the Destination/i })).toBeVisible();
    await expect(page.getByText("Belong Everywhere")).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Trips/i }).first().click();
    await expect(page).toHaveURL(/\/trips/);
  });

  test("trips page loads", async ({ page }) => {
    await page.goto("/trips");
    await expect(page.getByRole("heading", { name: /Trips|Journeys|Escapes/i })).toBeVisible();
  });

  test("contact page has form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("form")).toBeVisible();
  });

  test("faq page loads", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("mobile menu opens", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu|open/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.getByRole("link", { name: /Contact/i }).first()).toBeVisible();
    }
  });
});

test.describe("Admin", () => {
  test("admin login page loads", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: /login|sign in/i })).toBeVisible();
  });
});
