import 'cypress-axe';
describe('A11y - Core pages', () => {
  const pages = ['/', '/services/', '/realisations/', '/contact/', '/mentions/'];
  pages.forEach((p) => {
    it(`has no critical/serious violations on ${p}`, () => {
      cy.visit(p);
      cy.injectAxe();
      cy.checkA11y(null, { includedImpacts: ['critical','serious'] });
    });
  });
});