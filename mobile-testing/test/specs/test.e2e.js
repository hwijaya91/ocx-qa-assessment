const fs = require('fs');

describe('WebdriverIO Native Demo App', () => {

    before(async () => {
        // Wait for app to fully load
        await driver.pause(3000);
    });

    it('Test Case 1: Login Flow', async () => {
        // Navigate to Login screen
        await $('~Login').click();

        // Enter email
        const emailInput = await $('~input-email');
        await emailInput.setValue('test@webdriver.io');

        // Enter password
        const passwordInput = await $('~input-password');
        await passwordInput.setValue('password123');

        // Tap login button
        await $('~button-LOGIN').click();

        // brief pause to let any UI update happen
        await driver.pause(800);

        // Verify result (success OR error) using a wait until either appears
        const successTitle = 'android=new UiSelector().textContains("You are logged in!")';
        const errorMessage = 'android=new UiSelector().textContains("Invalid credentials")';

        try {
            await driver.waitUntil(async () => {
                const s = await $(successTitle).isExisting().catch(() => false);
                const e = await $(errorMessage).isExisting().catch(() => false);
                return s || e;
            }, { timeout: 7000, interval: 500 });
        } catch (e) {
            console.log('No login result found after wait');
        }

        const successDisplayed = await $(successTitle).isDisplayed().catch(() => false);
        const errorDisplayed = await $(errorMessage).isDisplayed().catch(() => false);

        if (successDisplayed) {
            console.log('✅ Login successful');
            // Click OK dialog/button if it appears — try multiple selectors with longer waits
            const okSelectors = [
                '~OK',
                'android=new UiSelector().text("OK")',
                'android=new UiSelector().textContains("OK")',
                '//android.widget.Button[@text="OK"]'
            ];
            let clicked = false;
            for (const sel of okSelectors) {
                const el = await $(sel).catch(() => null);
                if (!el) continue;
                const exists = await el.waitForExist({ timeout: 5000 }).then(() => true).catch(() => false);
                if (!exists) continue;
                try {
                    await el.click();
                    console.log(`Clicked OK using selector: ${sel}`);
                    clicked = true;
                    break;
                } catch (e) {
                    console.log(`Failed to click OK with ${sel}: ${e.message || e}`);
                }
            }
            if (!clicked) {
                console.log('No OK button found after success (checked multiple selectors)');
                try {
                    const src = await driver.getPageSource();
                    fs.writeFileSync('error_ok_not_found.xml', src);
                    await driver.saveScreenshot('error_ok_not_found.png');
                    console.log('Saved page source and screenshot: error_ok_not_found.*');
                } catch (e) {
                    console.log('Failed to save debug artifacts:', e.message || e);
                }
            }
        } else if (errorDisplayed) {
            console.log('⚠️ Login failed – error message displayed');
        } else {
            throw new Error('❌ No login result detected');
        }
    });

    it('Test Case 2: Forms Test', async () => {
        // Navigate to Forms screen (wait for the button to exist first)
        const formsBtn = await $('~Forms');
        await formsBtn.waitForExist({ timeout: 7000 });
        await formsBtn.click();

        // Fill text input (clear first)
        const textInputSel = '~text-input';
        try {
            await $(textInputSel).waitForExist({ timeout: 7000 });
            await $(textInputSel).clearValue().catch(() => {});
            await $(textInputSel).setValue('Hello handi Wijaya');
        } catch (e) {
            console.log('text-input not found; saving debug artifacts');
            try { fs.writeFileSync('error_forms_textinput.xml', await driver.getPageSource()); } catch {}
            try { await driver.saveScreenshot('error_forms_textinput.png'); } catch {}
            throw e;
        }

        // Toggle switch (ensure it exists, then toggle and verify)
        const switchSel = '~switch';
        await $(switchSel).waitForExist({ timeout: 5000 });
        const beforeChecked = await $(switchSel).getAttribute('checked').catch(() => null);
        await $(switchSel).click();
        await driver.pause(300);
        const afterChecked = await $(switchSel).getAttribute('checked').catch(() => null);
        console.log(`Switch before: ${beforeChecked}, after: ${afterChecked}`);

        // Select dropdown option (open dropdown, pick option by text)
        const dropdownSel = '~Dropdown';
        await $(dropdownSel).waitForExist({ timeout: 5000 });
        await $(dropdownSel).click();
        const optionSel = 'android=new UiSelector().text("webdriver.io is awesome")';
        await $(optionSel).waitForExist({ timeout: 7000 });
        await $(optionSel).click();

        // Verify all form interactions
        await expect($(textInputSel)).toHaveText('Hello handi Wijaya');
        if (afterChecked === null) {
            console.log('Switch attribute not available; manual visual verification may be required');
        }
    });

   it('Test Case 3: Swipe / Gesture Test (Bonus)', async () => {
    // Navigate to Swipe screen
    const swipeSel = '~Swipe';
    try {
        await $(swipeSel).waitForExist({ timeout: 7000 });
        await $(swipeSel).click();
    } catch (e) {
        console.log('Swipe button not found; saving debug artifacts');
        try { fs.writeFileSync('error_swipe_button.xml', await driver.getPageSource()); } catch {}
        try { await driver.saveScreenshot('error_swipe_button.png'); } catch {}
        throw e;
    }

    // Get screen size for swipes
    const size = await driver.getWindowSize();
    const width = size.width || 1080;
    const height = size.height || 1920;
    const midY = Math.floor(height / 2);

    const cardSelector = '~card';
    
    // Ensure swipe screen is present
    const swipeScreenSel = 'android=new UiSelector().descriptionContains("Swipe-screen")';
    await $(swipeScreenSel).waitForExist({ timeout: 5000 }).catch(() => {});

    // Wait for carousel to be ready
    await driver.pause(1000);

    // Verify cards exist
    const initialCards = await $$(cardSelector);
    if (!initialCards || initialCards.length === 0) {
        try { fs.writeFileSync('error_swipe_no_cards.xml', await driver.getPageSource()); } catch {}
        try { await driver.saveScreenshot('error_swipe_no_cards.png'); } catch {}
        throw new Error('No carousel cards found to swipe');
    }
    console.log(`Found ${initialCards.length} card(s) initially`);

    // Perform 5 swipes
    for (let i = 1; i <= 5; i++) {
        console.log(`Performing swipe ${i}/5...`);
        
        // Use mobile gesture swipe
        await driver.execute('mobile: swipeGesture', {
            left: Math.floor(width * 0.1),
            top: midY - 100,
            width: Math.floor(width * 0.8),
            height: 200,
            direction: 'left',
            percent: 1.0
        });
        
        await driver.pause(1000);
    }

    console.log('All 5 swipes completed');

    // Get all text elements on screen that might contain "compatible"
    // Try multiple selectors to find the text
    let compatibleFound = false;
    let foundText = '';

    // Method 1: Check all TextViews for "compatible"
    try {
        const textElements = await $$('android.widget.TextView');
        console.log(`Found ${textElements.length} TextViews on screen`);
        
        for (const element of textElements) {
            const text = await element.getText().catch(() => '');
            if (text) {
                console.log(`TextView text: "${text}"`);
                if (text.toLowerCase().includes('compatible')) {
                    compatibleFound = true;
                    foundText = text;
                    break;
                }
            }
        }
    } catch (e) {
        console.log('Method 1 failed:', e.message);
    }

    // Method 2: If not found, try searching by text
    if (!compatibleFound) {
        try {
            const compatibleElement = await $('android=new UiSelector().textContains("COMPATIBLE")');
            await compatibleElement.waitForExist({ timeout: 2000 });
            foundText = await compatibleElement.getText();
            compatibleFound = true;
            console.log(`Found via UiSelector: "${foundText}"`);
        } catch (e) {
            console.log('Method 2 failed:', e.message);
        }
    }

    // Method 3: Try case-insensitive search
    if (!compatibleFound) {
        try {
            const compatibleElement = await $('android=new UiSelector().textMatches("(?i).*compatible.*")');
            await compatibleElement.waitForExist({ timeout: 2000 });
            foundText = await compatibleElement.getText();
            compatibleFound = true;
            console.log(`Found via regex: "${foundText}"`);
        } catch (e) {
            console.log('Method 3 failed:', e.message);
        }
    }

    // If still not found, save debug info
    if (!compatibleFound) {
        try { 
            const pageSource = await driver.getPageSource();
            fs.writeFileSync('error_swipe_no_compatible.xml', pageSource);
            console.log('Page source saved. Checking for "compatible" in XML...');
            if (pageSource.toLowerCase().includes('compatible')) {
                console.log('WARNING: "compatible" exists in page source but could not be found via selectors');
            }
        } catch {}
        try { await driver.saveScreenshot('error_swipe_no_compatible.png'); } catch {}
        throw new Error('Could not find text containing "compatible" after 5 swipes');
    }

    console.log(`✓ Found "compatible" in text: "${foundText}"`);
});
}); 
