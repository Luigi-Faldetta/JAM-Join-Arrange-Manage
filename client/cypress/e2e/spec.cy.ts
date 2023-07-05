describe('homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('Should test Landing page', () => {
    cy.location('pathname').should('eq', '/');
    cy.get('#tohero').click();
    cy.contains('Join');
    cy.get('#toabout').click();
    cy.wait(1000);
    cy.contains('About');
    cy.get('#tofaqs').click();
    cy.wait(1000);
    cy.get('[data-testid="flowbite-accordion"] > :nth-child(1)').click()
    cy.wait(500);
    cy.get('[data-testid="flowbite-accordion"] > :nth-child(3)').click()
    cy.wait(500);
    cy.get('[data-testid="flowbite-accordion"] > :nth-child(5)').click()
    cy.wait(500);
    cy.get('[data-testid="flowbite-accordion"] > :nth-child(7)').click()
    cy.wait(500);
    cy.get('[data-testid="flowbite-accordion"] > :nth-child(9)').click()
    cy.wait(500);
    cy.contains('Frequently');
    cy.wait(1000);
    cy.get('#tohero').click();
  });

  it('Should create a new user', () => {
    cy.get('.text-blue-700').click();
    cy.contains('Sign Up Here');
    cy.wait(200);
    cy.get('#name').type('Test User');
    cy.wait(200);
    cy.get('#email').type('test20@mail.com'); // change before test
    cy.wait(200);
    cy.get('#password').type('password');
    cy.wait(200);
    cy.get('#repeat-password').type('password');
    cy.wait(200);
    cy.get('#login-btn').click();
    cy.wait(200);
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.wait(200);
  });

  it('Should login and logout properly', () => {
    cy.contains('Log In');
    cy.get('#email-input').type('test20@mail.com');
    cy.wait(200);
    cy.get('#password-input').type('password');
    cy.wait(200);
    cy.get('#login').click();
    cy.wait(200);
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.wait(200);
    cy.get('.profile-pic').click();
    cy.wait(200);
    cy.get('#signout-btn').click();
    cy.wait(200);
    cy.get('#cancel-getout').click();
    cy.wait(200);
    cy.get('.profile-pic').click();
    cy.wait(200);
    cy.get('#signout-btn').click();
    cy.wait(200);
    cy.get('#getout').click();
    cy.wait(200);
    cy.location('pathname').should('eq', '/');
  });

  it('Should login and edit profile data', () => {
    cy.contains('Log In');
    cy.wait(200);
    cy.get('#email-input').type('test20@mail.com');
    cy.wait(200);
    cy.get('#password-input').type('password');
    cy.wait(200);
    cy.get('#login').click();
    cy.wait(200);
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.wait(200);
    cy.get('.profile-pic').click();
    cy.wait(200);
    cy.get('#profile-btn').click();
    cy.wait(200);
    cy.get('input[type=file]').selectFile('cypress/fixtures/bilbo.jpg');
    cy.wait(200);
    cy.get('[name="username"]').type('Bilbo Baggins');
    cy.wait(200);
    cy.get('[name="email"]').type('bilbobolson2020@theshire.com');
    cy.wait(200);
    cy.get('[name="phone"]').type('555-333-222');
    cy.wait(200);
    cy.get('[name="password"]').type('gimmedaring');
    cy.wait(200);
    cy.get('[name="confirmpassword"]').type('gimmedaring');
    cy.wait(200);
    cy.get('#save-profile').click();
    cy.wait(5000);
    cy.location('pathname').should('eq', '/profile');
    cy.wait(200);
    cy.get('.profile-pic').click();
    cy.wait(200);
    cy.get('#signout-btn').click();
    cy.wait(200);
    cy.get('#getout').click();
    cy.wait(200);
    cy.location('pathname').should('eq', '/');
    cy.wait(200);
  });

  it('Should create a new event and use the chat', () => {
    const moment = require('moment');
    const date = moment().format('MMMM Do YYYY, h:mm:ss a');

    cy.contains('Log In');
    cy.get('#email-input').type('bilbobolson2020@theshire.com');
    cy.wait(200);
    cy.get('#password-input').type('gimmedaring');
    cy.wait(200);
    cy.get('#login').click();
    cy.wait(200);
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.wait(200);
    cy.get('.btn').click();
    cy.wait(200);
    cy.contains('Event Name');
    cy.wait(200);
    cy.get('#eventName').type("Bilbo's 111th birthday party");
    cy.wait(200);
    cy.get('#event-date').click();
    cy.wait(200);
    cy.get('.react-datepicker__day--014').click().type('{esc}');
    cy.wait(200);
    cy.get('#eventLocation').type('The Shire Square');
    cy.wait(200);
    cy.get('input[type=file]').selectFile(
      'cypress/fixtures/bilbo-baggins-birthday-cake.jpeg'
    );
    cy.wait(400);
    cy.get('#create-event-btn').click();
    cy.wait(200);
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.wait(200);
    cy.contains('Bilbo').click();
    cy.wait(200);
    cy.get('.ml-4').type('Pipe-weed');
    cy.wait(200);
    cy.get('.w-12').click();
    cy.wait(200);
    cy.get('.bg-pink-500').click();
    cy.wait(200);
    cy.get('.text-white > .flex > .w-full').type("Halflings' Leaf");
    cy.wait(200);
    cy.get('.money').type('50');
    cy.wait(200);
    cy.get('.w-12').click();
    cy.wait(200);
    cy.get('#exp-todo').click();
    cy.wait(200);
    cy.get('.absolute > .btn').click();
    cy.wait(200);
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.wait(200);
    cy.get('#user-menu-button').click();
    cy.wait(200);
    cy.get('.event-item').click();
    cy.wait(200);
    cy.get('.input-container').type('Gollum is not invited').type('{enter}');
    cy.wait(2000);
    cy.get('.close').click();
    cy.wait(200);
  });

  it('Should delete the user', () => {
    cy.contains('Log In');
    cy.wait(200);
    cy.get('#email-input').type('bilbobolson2020@theshire.com');
    cy.wait(200);
    cy.get('#password-input').type('gimmedaring');
    cy.wait(200);
    cy.get('#login').click();
    cy.wait(200);
    cy.location('pathname').should('eq', '/user-dashboard');
    cy.wait(200);
    cy.get('.profile-pic').click();
    cy.wait(200);
    cy.get('#profile-btn').click();
    cy.wait(200);
    cy.contains('Bilbo Baggins');
    cy.wait(200);
    cy.get('#delete-profile').click();
    cy.wait(200);
    cy.get('#cancel-delete-user-btn').click();
    cy.wait(200);
    cy.get('#delete-profile').click();
    cy.wait(200);
    cy.get('#delete-user-btn').click();
    cy.wait(200);
    cy.location('pathname').should('eq', '/');
    cy.wait(200);
  });
});
