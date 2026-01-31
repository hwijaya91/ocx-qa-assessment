# WebdriverIO Native Demo App – Test Documentation

## 1. Overview

This document describes the setup, design decisions, locator strategy, AI usage, test cases, and observed results for automated testing of the **WebdriverIO Native Demo App** using **WebdriverIO + Appium** on Android.

The test suite validates three main user flows:

1. Login flow (positive & negative handling)
2. Forms interaction flow
3. Swipe / gesture flow (carousel)

---

## 2. Setup Steps Followed

### 2.1 Prerequisites

* Node.js (LTS)
* Java JDK (required by Appium / Android tooling)
* Android SDK
* Android Studio

### 2.2 Environment Variables

Ensure the following variables are set:

```bash
ANDROID_HOME=/path/to/Android/Sdk
ANDROID_SDK_ROOT=/path/to/Android/Sdk
```

### 2.3 Installed Dependencies

```bash
npm install webdriverio @wdio/cli @wdio/mocha-framework appium fs
```

### 2.4 Appium

* Appium server is running before executing tests
* Android driver is properly detected

### 2.5 Running the Test

```bash
npx wdio run wdio.conf.js
```

---

## 3. Element Locator Strategy

Multiple locator strategies are intentionally combined to increase test stability.

### 3.1 Accessibility ID (Primary)

Used wherever possible due to speed and reliability.

```js
$('~Login')
$('~input-email')
$('~button-LOGIN')
```

### 3.2 Android UiSelector (Fallback)

Used for text-based validation and dynamic UI elements.

```js
android=new UiSelector().textContains("You are logged in!")
android=new UiSelector().textMatches("(?i).*compatible.*")
```

### 3.4 Multi‑Selector Recovery Strategy

For unstable dialogs (e.g. OK button), the test tries **multiple selectors sequentially** to reduce flakiness.

---

## 4. AI Tools Utilized

### 4.1 ChatGPT (Test Design & Debugging)

AI was used to:

* Design robust login validation logic (success OR error)
* Improve wait strategies using `waitUntil`
* Suggest fallback selectors for unstable UI elements
* Add defensive debugging (screenshots & page source dumps)
* Improve swipe gesture reliability

### 4.2 Benefits of AI Usage

* Faster root‑cause analysis
* Reduced flaky tests
* Cleaner, more readable test structure
* Production‑style defensive automation patterns

---

## 5. Code Structure & Commenting Strategy

### 5.1 Defensive Automation

Each critical interaction includes:

* `waitForExist`
* Try/catch blocks
* Debug artifacts on failure (`.xml` + `.png`)

### 5.2 Example (Login Result Handling)

```js
// Wait until either success or error message appears
await driver.waitUntil(async () => {
  const s = await $(successTitle).isExisting().catch(() => false);
  const e = await $(errorMessage).isExisting().catch(() => false);
  return s || e;
}, { timeout: 7000 });
```

### 5.3 Debug Artifact Strategy

On failure, the test automatically saves:

* Page source (`.xml`)
* Screenshot (`.png`)

This makes post‑execution debugging much faster.

---

## 6. Test Cases

### 6.1 Test Case 1 – Login Flow

**Steps:**

* Navigate to Login screen
* Enter email and password
* Tap Login
* Validate either success or error result

**Validation:**

* Success dialog: `You are logged in!`
* Error message: `Invalid credentials`

**Result Handling:**

* Attempts to click OK using multiple selectors
* Saves debug artifacts if dialog is not found

---

### 6.2 Test Case 2 – Forms Test

**Steps:**

* Navigate to Forms screen
* Fill text input
* Toggle switch
* Select dropdown option

**Validation:**

* Text input value is verified
* Switch state change is logged

---

### 6.3 Test Case 3 – Swipe / Gesture Test

**Steps:**

* Navigate to Swipe screen
* Detect carousel cards
* Perform 5 swipe gestures
* Search for text containing "compatible"

**Advanced Validation:**
Three detection strategies are used:

1. Iterating all TextViews
2. UiSelector textContains
3. Case‑insensitive regex match

---

## 7. Test Results & Observations

### 7.1 Stability

* Accessibility IDs provided highest reliability
* Fallback selectors significantly reduced flaky failures

### 7.2 Performance

* Explicit waits outperform static pauses
* Swipe gestures require small delays for UI updates

### 7.3 Debugging Efficiency

* Automatic screenshots + XML dumps greatly improved failure analysis
* Page source inspection revealed cases where text existed but was not visible

---

## 8. Conclusion

This test suite demonstrates **production‑ready mobile automation practices**:

* Defensive coding
* Multi‑locator strategies
* AI‑assisted design
* Robust failure diagnostics

The approach is scalable, maintainable, and suitable for CI pipelines.

---

**Author:** Handi Wijaya
