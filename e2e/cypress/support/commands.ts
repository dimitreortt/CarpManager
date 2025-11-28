/// <reference types="cypress" />

Cypress.Commands.add("login", (email: string, password: string) => {
	cy.visit("/login")
	cy.get('input[name="email"]').type(email)
	cy.get('input[name="password"]').type(password)
	cy.get('button[type="submit"]').click()

	cy.url().should("not.include", "/login")
	cy.contains("Dashboard").should("be.visible")
})

Cypress.Commands.add("checkMultiSelectOption", (tokens: string[]) => {
	cy.get("div.form-check")
		.filter((_, el) => {
			const label = el.querySelector("label")
			if (!label || !label.textContent) return false

			return tokens.every((token) => label.textContent.includes(token))
		})
		.within(() => {
			cy.get('input[type="checkbox"]').check({ force: true })
		})
})

declare global {
	namespace Cypress {
		interface Chainable {
			login(email: string, password: string): Chainable<void>
			checkMultiSelectOption(tokens: string[]): Chainable<void>
		}
	}
}
