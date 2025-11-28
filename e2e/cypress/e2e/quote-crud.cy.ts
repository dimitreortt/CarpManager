import { faker } from "@faker-js/faker"
import { formatCurrency } from "../plugins/formatCurrency"

describe("Quote CRUD Operations", () => {
	let quoteData: {
		name: string
		description: string
		amount: number
		date: string
	}
	let formattedAmount: string
	before(() => {
		quoteData = {
			name: faker.company.catchPhrase().substring(0, 18),
			description: faker.lorem.sentence(),
			amount: parseFloat(faker.commerce.price({ min: 1000, max: 5000, dec: 2 })),
			date: new Date().toISOString().split("T")[0],
		}
		formattedAmount = formatCurrency(quoteData.amount)
	})

	it("should create, view, edit and delete a quote", async () => {
		cy.fixture("testUsers").then((users) => {
			cy.login(users.testUser.email, users.testUser.password)
		})

		cy.visit("/quotes/form")
		cy.get('input[name="name"]').type(quoteData.name)
		cy.get('textarea[name="description"]').type(quoteData.description)
		cy.window().then((win) => {
			;(win as any).quoteFormInstance.setValue("amount", quoteData.amount)
		})
		cy.get('input[name="date"]').invoke("val", quoteData.date).trigger("input").trigger("change")

		cy.get('input[placeholder="Buscar opções..."]').first().type("Supplier One - Cypress Test")
		cy.get(".position-absolute .cursor-pointer").contains("Supplier One - Cypress Test").click()

		cy.get('input[placeholder="Buscar opções..."]').last().type("Orçamento 1 - Cypress")
		cy.get(".position-absolute .cursor-pointer").contains("Orçamento 1 - Cypress").click()

		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "criada com sucesso")
		cy.wrap(quoteData.name).as("quoteName")

		cy.visit("/quotes")
		cy.get('input[placeholder*="Buscar cotações"]').type(quoteData.name)
		cy.get("table tbody tr").should("contain", quoteData.name)
		cy.get("table tbody tr").should("contain", quoteData.description)
		cy.get("table tbody tr").should("contain", formattedAmount)
		cy.get("table tbody tr").should("contain", "Supplier One - Cypress Test")
		cy.get("table tbody tr").should("contain", "Orçamento 1 - Cypress")

		cy.get("table tbody tr")
			.contains(quoteData.name)
			.parent()
			.within(() => {
				cy.get('button[title="Visualizar"]').click()
			})
		cy.url().should("include", "/quotes/view")
		cy.contains(quoteData.name).should("be.visible")
		cy.contains(quoteData.description).should("be.visible")
		cy.get("div.border.rounded.p-2.bg-light").should("contain", formattedAmount.replace(/\s/g, "\u00A0"))

		cy.contains("Supplier One - Cypress Test").should("be.visible")
		cy.contains("Orçamento 1 - Cypress").should("be.visible")

		cy.get('button[title="Editar"]').click()
		cy.url().should("include", "/quotes/form")
		const newName = faker.company.catchPhrase()
		cy.get('input[name="name"]').clear().type(newName)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "atualizada com sucesso")
		quoteData.name = newName
		cy.wrap(newName).as("updatedQuoteName")

		cy.visit("/quotes")
		cy.get('input[placeholder*="Buscar cotações"]').type(newName)
		cy.get("table tbody tr").should("contain", newName)
		cy.get("table tbody tr").should("contain", quoteData.description)
		cy.get("table tbody tr").should("contain", formattedAmount)
		cy.get("table tbody tr").should("contain", "Supplier One - Cypress Test")
		cy.get("table tbody tr").should("contain", "Orçamento 1 - Cypress")

		cy.get("table tbody tr")
			.contains(quoteData.name)
			.parent()
			.within(() => {
				cy.get('input[type="checkbox"]').check()
			})
		cy.get('button[title="Deletar Itens"]').click()
		cy.get(".modal").should("be.visible")
		cy.get('button[title="Excluir"]').click()
		cy.get('[role="alert"]').should("contain", "deletado")

		cy.get("body").then(($body) => {
			if ($body.find('input[placeholder*="Buscar cotações"]').length > 0) {
				cy.get('input[placeholder*="Buscar cotações"]').clear().type(quoteData.name)
				cy.get("table tbody").should("not.contain", quoteData.name)
			} else {
				cy.get("#empty-list").should("be.visible")
			}
		})
	})
})
