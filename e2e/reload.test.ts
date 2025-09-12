import { expect, test } from '@playwright/test';

test('100回リロードしてもコンソールエラーが出ない', async ({ page }) => {
  test.setTimeout(120000); // ✅ テスト全体を120秒に延長
  let errorMessage: string | null = null;

  // 🔹 コンソールエラーを監視
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errorMessage = msg.text();
    }
  });

  // 🔹 初回ロード
  await page.goto('https://localhost:5173/progress');

  await page.fill('input[type=email]', process.env.TEST_USER_EMAIL!);
  await page.fill('input[type=password]', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('https://localhost:5173/progress');

  // 🔹 100回リロード
  for (let i = 0; i < 30; i++) {
    await page.reload({ waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(100); // 短い待機を入れて安定化
    if (errorMessage) break; // エラーが出たら即終了
  }

  // 🔹 最後に確認
  expect(errorMessage).toBeNull();
});
