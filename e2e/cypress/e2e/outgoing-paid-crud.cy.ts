import { faker } from "@faker-js/faker"
import { formatCurrency } from "../plugins/formatCurrency"

describe("Paid Outgoing CRUD Operations", () => {
	let outgoingData: {
		name: string
		amount: number
		date: string
		paymentMethod: string
		category: string
		accountType: string
		description: string
	}
	let formattedAmount: string

	before(() => {
		const amount = parseFloat(faker.commerce.price({ min: 100, max: 2000, dec: 2 }))

		outgoingData = {
			name: faker.company.catchPhrase().substring(0, 30),
			amount: amount,
			date: faker.date.future().toISOString().split("T")[0],
			paymentMethod: faker.helpers.arrayElement(["pix", "cartao", "boleto", "dinheiro", "transferencia", "bonificacao"]),
			category: "other",
			accountType: "Test Account",
			description: faker.lorem.sentence(),
		}

		formattedAmount = formatCurrency(outgoingData.amount)
	})

	it("should create, view, edit and delete a paid outgoing", async () => {
		cy.fixture("testUsers").then((users) => {
			cy.login(users.testUser.email, users.testUser.password)
		})

		cy.visit("/finance/outgoing/form?status=paid")
		cy.get('input[name="name"]').type(outgoingData.name)

		cy.window().then((win) => {
			;(win as any).paidOutgoingFormInstance.setValue("amount", outgoingData.amount)
		})

		cy.get('input[name="date"]').invoke("val", outgoingData.date).trigger("input").trigger("change")

		cy.get("#supplierId-search-input").type("Supplier 2 - Cypress")
		cy.get(".position-absolute .cursor-pointer").contains("Supplier 2 - Cypress").click()

		cy.get('select[name="paymentMethod"]').select(outgoingData.paymentMethod)

		cy.get('select[name="category"]').select(outgoingData.category)

		cy.get('input[name="accountType"]').type(outgoingData.accountType)

		cy.get('textarea[name="description"]').type(outgoingData.description)

		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "criada com sucesso")
		cy.wrap(outgoingData.name).as("outgoingName")

		cy.visit("/finance/outgoing?tab=paid")
		cy.get('input[placeholder*="Buscar"]').type(outgoingData.name)
		cy.get("table tbody tr").should("contain", outgoingData.name)
		cy.get("table tbody tr").should("contain", "Supplier 2 - Cypress")

		cy.get("table tbody tr")
			.contains(outgoingData.name)
			.parent()
			.within(() => {
				cy.get('button[title="Visualizar"]').click()
			})
		cy.url().should("include", "/finance/outgoing/view")
		cy.contains(outgoingData.name).should("be.visible")
		cy.contains(outgoingData.description).should("be.visible")
		cy.contains("Supplier 2 - Cypress").should("be.visible")

		cy.get('button[title="Editar"]').click()
		cy.url().should("include", "/finance/outgoing/form")
		const newName = faker.company.catchPhrase().substring(0, 30)
		cy.get('input[name="name"]').clear().type(newName)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "atualizada com sucesso")
		outgoingData.name = newName
		cy.wrap(newName).as("updatedOutgoingName")

		cy.visit("/finance/outgoing?tab=paid")
		cy.get('input[placeholder*="Buscar"]').type(newName)
		cy.get("table tbody tr").should("contain", newName)
		cy.get("table tbody tr").should("contain", "Supplier 2 - Cypress")

		cy.get("table tbody tr")
			.contains(outgoingData.name)
			.parent()
			.within(() => {
				cy.get('input[type="checkbox"]').check()
			})
		cy.get('button[title="Deletar Itens"]').click()
		cy.get(".modal").should("be.visible")
		cy.get('button[title="Excluir"]').click()
		cy.get('[role="alert"]').should("contain", "deletados")

		cy.get("body").then(($body) => {
			if ($body.find('input[placeholder*="Buscar"]').length > 0) {
				cy.get('input[placeholder*="Buscar"]').clear().type(outgoingData.name)
				cy.get("table tbody").should("not.contain", outgoingData.name)
			} else {
				cy.get("#empty-list").should("be.visible")
			}
		})
	})
})
