///<reference types="cypress" />;

describe('recommendation page', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5000/recommendations/reset', {});
  });

  it('should create recommendations', () => {
    const recommendation = {
      name: 'Falamansa - Xote dos Milagres',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
    };

    cy.visit('http://localhost:3000');
    cy.get('#name').type(recommendation.name);
    cy.get('#youtubeLink').type(recommendation.youtubeLink);

    cy.get('#send').click();

    cy.contains(recommendation.name);

    cy.get('#downvote').click();
    cy.get('#downvote').click();
    cy.get('#downvote').click();
    cy.get('#downvote').click();
    cy.get('#downvote').click();
    cy.get('#downvote').click();
    cy.get('#downvote').click();

    cy.contains('No recommendations yet');
  });
});
