  it('Should complete full purchase flow with order confirmation and ID capture', () => {
    // Task 1: Navigate to https://www.demoblaze.com
    cy.visit('https://www.demoblaze.com')
    cy.get('.navbar-brand').should('contain', 'PRODUCT STORE')

    // Task 2: Browse and select a product from any category
    cy.get('.list-group').contains('Monitors').click()
    cy.contains('ASUS Full HD').click()

    // Task 3: Add the selected product to the shopping cart
    cy.contains('Add to cart').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Product added')
    })

    // Task 4: Proceed to the shopping cart and verify the product is added
    cy.contains('Cart').click()
    cy.get('.table').should('be.visible')
    cy.get('tbody').contains('ASUS Full HD').should('be.visible')
    cy.contains('Place Order').click()

    // Task 5: Fill in the order form with valid customer information
    cy.wait(1000)
    cy.get('#name').type('Handi Wijaya')
    cy.get('#country').type('Indonesia')
    cy.get('#city').type('Jakarta')
    cy.get('#card').type('6011000990139424')
    cy.get('#month').type('03')
    cy.get('#year').type('1999')
    cy.contains('Purchase').click()

    // Task 6: Confirm the order and verify the confirmation alert
    cy.get('.sweet-alert').should('be.visible')
    cy.get('.sweet-alert').contains('Thank you for your purchase!').should('be.visible')

    // Task 7: Capture and document the Order ID
    cy.get('.sweet-alert').screenshot('order-confirmation-alert')
    
    // Extract and log the Order ID
    cy.get('.sweet-alert').then(($alert) => {
      const alertText = $alert.text()
      cy.log('Complete Alert Content: ' + alertText)
      
      // Extract order ID (format: "Your order id is XXX")
      const orderIdMatch = alertText.match(/Id: (\d+)/i)
      if (orderIdMatch) {
        cy.log('✓ Order ID Captured: ' + orderIdMatch[1])
      }
    })
  })