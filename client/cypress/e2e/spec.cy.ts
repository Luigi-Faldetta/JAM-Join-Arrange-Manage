describe('homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  // it('Should test Landing page', () => {
  //   cy.location('pathname').should('eq', '/');
  //   cy.get('#tohero').click();
  //   cy.contains('Join');
  //   cy.get('#toabout').click();
  //   cy.contains('About');
  //   cy.get('#tofaqs').click();
  //   cy.contains('Frequently');
  //   cy.get('#tohero').click();
  // });

  // it('Should create a new user', () => {
  //   cy.get('.text-blue-700').click();
  //   cy.contains('Sign Up Here');
  //   cy.get('#name').type('Test User');
  //   cy.get('#email').type('test@mail.com'); // change before test
  //   cy.get('#password').type('password');
  //   cy.get('#repeat-password').type('password');
  //   cy.get('#login-btn').click();
  //   cy.location('pathname').should('eq', '/user-dashboard')
  // });

  // it('Should login and logout properly', () => {
  //   cy.contains('Log In');
  //   cy.get('#email-input').type('test@mail.com');
  //   cy.get('#password-input').type('password');
  //   cy.get('#login').click();
  //   cy.location('pathname').should('eq', '/user-dashboard');
  //   cy.get('.profile-pic').click();
  //   cy.get('#signout-btn').click();
  //   cy.get('#cancel-getout').click();
  //   cy.get('.profile-pic').click();
  //   cy.get('#signout-btn').click();
  //   cy.get('#getout').click();
  //   cy.location('pathname').should('eq', '/');
  // });

  // it('Should login and edit profile data', () => {
  //   cy.contains('Log In');
  //   cy.get('#email-input').type('test@mail.com');
  //   cy.get('#password-input').type('password');
  //   cy.get('#login').click();
  //   cy.location('pathname').should('eq', '/user-dashboard');
  //   cy.get('.profile-pic').click();
  //   cy.get('#profile-btn').click();
  //   cy.get('input[type=file]').selectFile('cypress/fixtures/bilbo.jpg')
  //   cy.get('[name="username"]').type('Bilbo Bolson')
  //   cy.get('[name="email"]').type('bilbolovesthering@theshire.com')
  //   cy.get('[name="phone"]').type('555-333-222')
  //   cy.get('[name="password"]').type('gimmedaring')
  //   cy.get('[name="confirmpassword"]').type('gimmedaring')
  //   cy.get('#save-profile').click()
  //   cy.wait(8000);
  //   cy.location('pathname').should('eq', '/profile');
  //   cy.get('.profile-pic').click();
  //   cy.get('#signout-btn').click();
  //   cy.get('#getout').click();
  //   cy.location('pathname').should('eq', '/');
  // });

  it('Should delete the user', () => {
    // cy.contains('Log In');
    // cy.get('#email-input').type('bilbolovesthering@theshire.com');
    // cy.get('#password-input').type('gimmedaring');
    // cy.get('#login').click();
    // cy.location('pathname').should('eq', '/user-dashboard');
    // cy.get('.profile-pic').click();
    // cy.get('#profile-btn').click();
    // cy.contains('Bilbo Bolson');
    //   cy.get("#delete-profile").click()
    //   cy.get('#cancel-delete-user-btn').click()
    //   cy.get("#delete-profile").click()
    //   cy.get('#delete-user-btn').click()
    //   cy.location('pathname').should('eq', '/');
  });

  it('Should create a new event', () => {
    const moment = require('moment');
    const date = moment().format('MMMM Do YYYY, h:mm:ss a');

    cy.contains('Log In');
    cy.get('#email-input').type('bilbolovesthering@theshire.com');
    cy.get('#password-input').type('gimmedaring');
    cy.get('#login').click();
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.get('.btn').click();
    cy.contains('Event Name');
    cy.get('#eventName').type("Bilbo's 111th birthday party");
    cy.get('#event-date').click();
    cy.get('.react-datepicker__day--014').click().type('{esc}');
    cy.get('#eventLocation').type('The Shire Square');
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/bilbo-baggins-birthday-cake.jpeg'
    );
    cy.get('#create-event-btn').click();
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.contains('Bilbo').click()
    cy.contains('COMPLETED');
    cy.get('.bg-pink-500').click();
    cy.contains('BALANCE');
    cy.get('.bg-pink-500').click();
    cy.get('.absolute > .btn')

  });
});
