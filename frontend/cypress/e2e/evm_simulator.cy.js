describe('EVM Simulator', () => {
  beforeEach(() => {
    cy.visit('/evm');
  });

  it('completes the full voting process', () => {
    // Start the demo
    cy.contains('Start Practice Demo').click();

    // Verify we are on the voting unit
    cy.contains('Ballot Unit').should('be.visible');

    // Vote for Candidate A
    cy.get('[aria-label*="Candidate A"]').first().click();

    // Verify VVPAT screen
    cy.contains('VVPAT Verification').should('be.visible');
    cy.contains('Candidate A').should('be.visible');

    // Wait for the VVPAT timer to complete (7 seconds)
    cy.wait(8000);

    // Verify completion screen
    cy.contains('Practice Complete!').should('be.visible');
    cy.contains('successfully simulated the voting process').should('be.visible');

    // Reset
    cy.contains('Try Again').click();
    cy.contains('Interactive EVM Practice').should('be.visible');
  });
});
