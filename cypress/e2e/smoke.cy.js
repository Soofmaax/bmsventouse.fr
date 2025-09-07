describe('Smoke E2E', () => {
  const pages = [
    '/',
    '/services/ventousage/',
    '/services/convoyage/'
  ];
  pages.forEach((url) => {
    it(`loads ${url} and contains header/footer/cards`, () => {
      cy.visit(url);
      cy.get('header').should('exist');
      cy.get('footer').should('exist');
      cy.get('.content-card,.service-card,.card').should('exist');
      cy.get('body').should('be.visible');
    });
  });
});