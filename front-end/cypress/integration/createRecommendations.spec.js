///<reference types="cypress" />;

describe('recommendation page', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5000/recommendations/reset', {});
  });

  it('should create recommendations', () => {
    const recommendation = {
      name: 'Falamansa - Xote dos Milagre',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
    };

    cy.visit('http://localhost:3000');
    cy.get('#name').type(recommendation.name);
    cy.get('#youtubeLink').type(recommendation.youtubeLink);

    cy.intercept('post', 'http://localhost:5000/recommendations').as(
      'recommendation'
    );

    cy.get('#send').click();

    cy.wait('@recommendation');

    cy.contains(recommendation.name);

    cy.get('#upvote').click();
    cy.get('#downvote').click();

    cy.contains(recommendation.name);

    cy.get('#top').click();

    cy.contains(recommendation.name);

    cy.get('#upvote').click();
    cy.get('#downvote').click();

    cy.get('#random').click();

    cy.contains(recommendation.name);

    cy.get('#upvote').click();
    cy.get('#downvote').click();
  });
});
