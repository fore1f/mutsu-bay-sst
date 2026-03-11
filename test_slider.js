const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    await page.evaluate(() => {
        const slider = document.getElementById('month-slider');
        slider.value = 5;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(3000);
    await browser.close();
})();
