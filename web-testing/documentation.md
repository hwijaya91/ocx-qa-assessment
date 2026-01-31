# DemoBlaze E-Commerce Test Documentation

## Test Overview
Automated end-to-end purchase flow test on https://www.demoblaze.com, from product selection to order confirmation with Order ID capture.

---

## Test Flow

| No | Task | Action | Verification |
|----|------|--------|--------------|
| 1  |Navigate | Visit demoblaze.com | Page loads with navbar contain PRODUCT STORE |
| 2  |Select Product | Click Monitors on categories section → ASUS Full HD | Product page displays |
| 3  |Add to Cart | Click "Add to cart" | Alert shows "Product added" |
| 4  |View Cart | Navigate to Cart | Product visible in table |
| 5  |Checkout | Fill form & click Purchase | Form accepts all inputs |
| 6  |Confirm Order | Verify alert | "Thank you for your purchase!" appears |
| 7  |Capture Order ID | Screenshot & extract ID | Order ID logged |

---

## AI Tools Used

- **ChatGPT**: Assist in debugging
<p align="center">
  <br>
<img src="test-script-cypress/chatgpt%20syntax.png" alt="ChatGPT" width="400">
  <br>
 This example shows how I use ChatGPT to remind me of Cypress syntax while debugging test scripts.
 <br><br>
</p>

- **GitHub Copilot**: Assisted with test structure and predict next steps
<p align="center">
  <br>
  <img src="test-script-cypress/copilot%20kasi%20template.png" alt="Copilot test template suggestion" width="400">
  <br>
This example shows how I use GitHub Copilot to generate test structure, making test creation faster and easier.
  <br><br>
  <img src="test-script-cypress/copilot%20prediksi.png" alt="Copilot Prediction" width="400">
  <br>
  This example shows how GitHub Copilot predicts the next test steps based on the existing code.
</p>


---

## Key Challenges Using AI

- AI doesn't know the correct/rigorous selectors for DOM elements
- AI doesn't account for web page load times
- AI forgets to add `cy.wait()` for timing issues
- AI needs manual guidance to understand specific website structure

---

## How to Run

```bash
# Interactive mode
npx cypress open

# Headless mode
npx cypress run
```

---

