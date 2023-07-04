describe('homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('Should test Landing page', () => {
    cy.location('pathname').should('eq', '/');
    cy.get('#tohero').click();
    cy.contains('Join');
    cy.get('#toabout').click();
    cy.contains('About');
    cy.get('#tofaqs').click();
    cy.contains('Frequently');
    cy.get('#tohero').click();
  });

  it('Should create a new user', () => {
    cy.get('.text-blue-700').click();
    cy.contains('Sign Up Here');
    cy.get('#name').type('Test User');
    cy.get('#email').type('test@mail.com'); // change before test
    cy.get('#password').type('password');
    cy.get('#repeat-password').type('password');
    cy.get('#login-btn').click();
    cy.location('pathname').should('eq', '/user-dashboard')
  });

  it('Should login and logout properly', () => {
    cy.contains('Log In');
    cy.get('#email-input').type('test@mail.com');
    cy.get('#password-input').type('password');
    cy.get('#login').click();
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.get('.profile-pic').click();
    cy.get('#signout-btn').click();
    cy.get('#cancel-getout').click();
    cy.get('.profile-pic').click();
    cy.get('#signout-btn').click();
    cy.get('#getout').click();
    cy.location('pathname').should('eq', '/');
  });


  it('Should login and edit profile data', () => {
    cy.contains('Log In');
    cy.get('#email-input').type('bilbo@theshire.com');
    cy.get('#password-input').type('password');
    cy.get('#login').click();
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.get('.profile-pic').click();
    cy.get('#profile-btn').click();
    cy.get('input[type=file]').selectFile('cypress/fixtures/bilbo.jpg')
    cy.get('[name="username"]').type('Bilbo Bolson')
    cy.get('[name="email"]').type('bilbo@theshire.com')
    cy.get('[name="phone"]').type('555-333-222')
    cy.get('[name="password"]').type('password')
    cy.get('[name="confirmpassword"]').type('password')
    cy.get('#save-profile').click()
    cy.location('pathname').should('eq', '/profile');
    // cy.get("#delete-profile").click()
    // cy.get('#cancel-delete-user-btn').click()
    // cy.get("#delete-profile").click()
    // cy.get('#delete-user-btn').click()
    // cy.location('pathname').should('eq', '/');
  });

  it('Should delete the user', ()=> {
    cy.contains('Log In');
    cy.get('#email-input').type('bilbo@theshire.com');
    cy.get('#password-input').type('password');
    cy.get('#login').click();
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.get('.profile-pic').click();
    cy.get('#profile-btn').click();
    cy.contains('Bilbo Bolson');
    cy.get("#delete-profile").click()
    cy.get('#cancel-delete-user-btn').click()
    cy.get("#delete-profile").click()
    cy.get('#delete-user-btn').click()
    cy.location('pathname').should('eq', '/');
  })



});
