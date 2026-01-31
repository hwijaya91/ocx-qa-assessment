# QA Technical Test

---

## 1. Executive Summary

### a. What Was Tested Across All Three Platforms

This technical test covered **end-to-end quality validation** across three platforms:

* **Web (UI Automation - Cypress)**

  * User flows such as login, form submission, and UI feedback validation
  * Element interaction reliability and visual confirmation

* **API (Postman)**

  * REST endpoints using multiple HTTP methods (GET, POST, PUT, PATCH, DELETE)
  * Validation of status codes, response schema, and error handling

* **Mobile (Android – Native App - Appium)**

  * Login flow (success and failure handling)
  * Forms interaction (text input, switch, dropdown)
  * Gesture-based interaction (swipe / carousel validation)

---

### b. Overall Test Results Summary

| Platform | Coverage               | Result                             |
| -------- | ---------------------- | ---------------------------------- |
| Web      | Core user flows        | ✅ Passed                           |
| API      | All routes & methods (/posts and /comments endpoint)   | ⚠️ Expected quirks observed        |
| Mobile   | Login, Forms, Gestures | ✅ Passed  |

Most tests passed successfully. Some **expected inconsistencies** were observed in API behavior (e.g. PATCH on non-existent IDs returning success), which were documented rather than treated as failures.

---

### c. Key Findings and Insights

* Accessibility IDs significantly improve mobile test stability
* Defensive waits reduce flaky mobile UI tests
* APIs may behave "successfully" even when data does not exist — tests must validate logic, not just status codes
* Gesture-based tests require additional synchronization
* AI-assisted development dramatically reduced debugging and iteration time

---

## 2. AI Tools Usage Report

### a. AI Tools Used Per Testing Area

| Testing Area      | AI Tool Used | Purpose                                      |
| ----------------- | ------------ | -------------------------------------------- |
| Mobile Automation | ChatGPT, Claude, Github Copilot Chat      | Locator strategy, waits, gestures, debugging, installation |
| API Testing       | ChatGPT      | Test case generation, positive case analysis     |
| Website Automation     | ChatGPT      | Test script structure     |

---

### b. How AI Accelerated the Testing Process

AI tools accelerated testing by:

* Generating complete test flows in seconds
* Suggesting fallback selectors and defensive patterns
* Helping analyze flaky failures using logs and page source
* Structuring professional QA documentation quickly
* Helping debugging faster

---

### c. Specific Examples of AI-Generated Code or Logic

```js
await driver.waitUntil(async () => {
  const success = await $(successSelector).isExisting().catch(() => false);
  const error = await $(errorSelector).isExisting().catch(() => false);
  return success || error;
}, { timeout: 7000 });
```
```js
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
```

This pattern was AI-assisted and ensures the test handles **multiple valid outcomes** without flakiness.

---

### d. Pros and Cons of Using AI for Test Automation

**Pros:**

* Faster test creation
* Better edge-case awareness
* Improved readability and structure
* Reduced debugging time

**Cons:**

* Requires human validation
* Can overgeneralize if context is missing
* Not a replacement for domain knowledge
* Selectors sometimes wrong

---

## 3. Edge Cases & Quality Insights

This section identifies realistic edge cases based on the actual Web, API, and Mobile tests executed, focusing on scenarios that could break functionality or expose quality risks.

### a. Identified Edge Cases (Based on Implemented Tests)

### Web Application – Demoblaze

1. **Checkout can be triggered without validating cart contents**  
   *Why this matters:* The site allows navigation to checkout without strict server-side validation.  
   *What breaks:* Users can attempt a purchase without confirmed items, breaking business rules.

2. **Cart state depends on the browser session**  
   *Why this matters:* Refreshing or reopening the page can reset the cart.  
   *What breaks:* Users lose selected products and cannot reliably complete a purchase.

3. **Checkout form accepts invalid or empty values**
   *Why this matters:* I've checked the only needed is Name and Credit Card.  
   *What breaks:* Invalid order data is submitted.

---

### API – JSONPlaceholder

4. **PATCH request returns success for a non-existent resource**  
   *Why this matters:* This behavior is observable and documented in JSONPlaceholder.  
   *What breaks:* Client applications relying only on status codes receive misleading success signals.

5. **DELETE request does not actually remove data**  
   *Why this matters:* JSONPlaceholder is a mock API and does not persist changes.  
   *What breaks:* Applications expecting real deletion behave incorrectly.

---

### Mobile Application – WebdriverIO Native Demo App

6. **Login button is tappable before email and password fields are ready**
   *Why this matters:* The screen loads visually, but input fields may not yet be interactable.  
   *What breaks:* User taps Login with empty or unregistered input, blocking the flow.

7. **Swipe gesture reaches end of carousel with no further feedback**
   *Why this matters:* App provides no indication that the last card is reached.  
   *What breaks:* User cannot tell whether the swipe action is still working or stuck.


---

### b. How These Edge Cases Would Be Tested

---

#### Web Application – Demoblaze

**1. Checkout can be triggered without validating cart contents**
- Navigate directly to the Cart page
- Ensure the cart is empty
- Click the “Place Order” button
- Verify whether the checkout modal appears
- Validate if the application prevents or allows submission

**2. Cart state depends on the browser session**
- Add a product to the cart
- Refresh the browser or reopen the site in a new tab
- Navigate to the Cart page
- Verify whether the previously added product still exists

**3. Checkout form accepts invalid or empty values**
- Add a product to the cart
- Open the checkout modal
- Submit the form with only Name and Credit Card filled
- Leave other fields empty or invalid
- Verify whether the order is still processed and send the product where

---

#### API – JSONPlaceholder

**4. PATCH request returns success for a non-existent resource**
- Send a PATCH request to `/posts/{non-existent-id}`
- Observe the HTTP status code and response body
- Validate that the API returns a success response
- Document that the behavior is expected for a mock API

**5. DELETE request does not actually remove data**
- Send a DELETE request to `/posts/{id}`
- Send a GET request for the same `{id}`
- Verify that the resource is still accessible
- Confirm non-persistent behavior

---

#### Mobile Application – WebdriverIO Native Demo App

**6. Login button is tappable before input fields are ready**
- Navigate to the Login screen
- Immediately tap the Login button before entering credentials
- Observe the app response
- Verify whether an error message is shown or action is blocked

**7. Swipe gesture reaches end of carousel with no further feedback**
- Navigate to the Swipe screen
- Perform continuous swipe gestures until no new content appears
- Observe UI behavior after the last swipe
- Verify whether the app provides any visual indication or state change

---

## 4. Scalability Strategy

### a. Scaling to 100+ Test Cases

* Modularize test logic (Page Object Model / Screen Object Model)
* Reuse common utilities (waits, gestures, API helpers)
* Tag and group tests by feature or module
* Use AI to create test cases and improve them

---

### b. Framework Suggestions

### Web Automation: Cypress / Playwright
**Conclusion Benefit:**  
Fast, stable web testing that scales easily as test cases increase.

**Reason:**
- Handles modern web apps well
- Reduces flaky tests with built-in waits
- Backed by a fast-growing community with strong documentation and support

---

### API Automation: Postman
**Conclusion Benefit:**  
Quick and reliable API validation that fits well into CI/CD pipelines.

**Reason:**
- Easy to create and maintain API test collections
- Large, active community with many shared examples and best practices

---

### Mobile Automation: Appium
**Conclusion Benefit:**  
One automation solution that scales across Android and iOS platforms.

**Reason:**
- Industry-standard mobile automation tool
- Reusable test logic across devices
- Mature and continuously growing community ensures long-term support

---

### c. CI/CD Integration Ideas

* GitHub Actions / GitLab CI / Jenkins
* Using Forks so all test development is done in the forked repository without affecting the original codebase
* Pull requests are created from the fork to the main repository
* CI pipelines run on the pull request to validate tests before merging
* Using Branches to isolate work within the same repository
* The `production` or `develop` or `qa` branch remains stable and production-ready
* CI pipelines are triggered on branch pushes and pull requests.

---

### d. Long-Term Maintenance Strategy

* Enforce locator standards (prefer accessibility IDs) so everyone can help each other when needed
* Regularly review flaky tests
* Maintain test data independently
* Use AI as an assistant, not an authority
* For version control, Use meaningful commit messages for test updates
* Add meaningful logs, screenshots, and context on failure to reduce investigation time in CI pipelines
* Protect critical flows with smoke and regression layers

---
