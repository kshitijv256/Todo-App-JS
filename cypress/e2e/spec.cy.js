describe("Testing sign up", () => {
  it("visit", () => {
    cy.visit("http://localhost:3000/signup");

    cy.get("input[name=firstName]").type("test");
    cy.get("input[name=lastName]").type("user");
    cy.get("input[name=email]").type("test@user.com");
    cy.get("input[name=password]").type("123456");
    cy.get("button").click();
    cy.url().should("include", "/todos");
  });
});

describe("Testing sign in", () => {
  it("visit", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("input[name=email]").type("test@user.com");
    cy.get("input[name=password]").type("123456");
    cy.get("button").click();
    cy.url().should("include", "/todos");
  });
});

describe("Testing log out", () => {
  it("visit", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("input[name=email]").type("test@user.com");
    cy.get("input[name=password]").type("123456");
    cy.get("button").click();
    cy.get("button:first").click();
    cy.url().should("include", "/login");
  });
});

describe("Testing add todo", () => {
  it("visit", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("input[name=email]").type("test@user.com");
    cy.get("input[name=password]").type("123456");
    cy.get("button").click();
    cy.visit("http://localhost:3000/todos");
    cy.get("input[name=title]").type("test todo");
    cy.get("input[name=dueDate]").type("2021-12-12");
    cy.get("button[type=submit]").click();
    cy.get("li").should("have.length", 1);
  });
});
