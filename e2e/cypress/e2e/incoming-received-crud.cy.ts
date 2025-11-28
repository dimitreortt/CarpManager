import { faker } from "@faker-js/faker"
import { formatCurrency } from "../plugins/formatCurrency"

describe("Received Incoming CRUD Operations", () => {
	let incomingData: {
		name: string
		amount: number
		date: string
		paymentMethod: string
		notes: string
	}
	let formattedAmount: string

	before(() => {
		
		const amount = parseFloat(faker.commerce.price({ min: 100, max: 2000, dec: 2 }))

		incomingData = {
			name: faker.company.catchPhrase().substring(0, 30),
			amount: amount,
			date: faker.date.future().toISOString().split("T")[0],
			paymentMethod: faker.helpers.arrayElement(["pix", "cartao", "boleto", "dinheiro", "transferencia", "bonificacao"]),
			notes: faker.lorem.sentence(),
		}

		formattedAmount = formatCurrency(incomingData.amount)
	})

	it("should create, view, edit and delete a received incoming", async () => {
		
		cy.fixture("testUsers").then((users) => {
			cy.login(users.testUser.email, users.testUser.password)
		})

		
		cy.visit("/finance/incoming/form?status=received")
		cy.get('input[name="name"]').type(incomingData.name)

		
		cy.window().then((win) => {
			;(win as any).receivedIncomingFormInstance.setValue("amount", incomingData.amount)
		})

		
		cy.get('input[name="date"]').invoke("val", incomingData.date).trigger("input").trigger("change")

		
		cy.get("#clientId-search-input").type("Client One - Cypress Test")
		cy.get(".position-absolute .cursor-pointer").contains("Client One - Cypress Test").click()

		
		cy.get("#estimateId-search-input").type("Orçamento 1 - Cypress")
		cy.get(".position-absolute .cursor-pointer").contains("Orçamento 1 - Cypress").click()

		
		cy.get('select[name="paymentMethod"]').select(incomingData.paymentMethod)

		
		cy.get('textarea[name="notes"]').type(incomingData.notes)

		
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "criada com sucesso")
		cy.wrap(incomingData.name).as("incomingName")

		
		cy.visit("/finance/incoming?tab=received")
		cy.get('input[placeholder*="Buscar"]').type(incomingData.name)
		cy.get("table tbody tr").should("contain", incomingData.name)
		cy.get("table tbody tr").should("contain", "Client One - Cypress Test")
		cy.get("table tbody tr").should("contain", "Orçamento 1 - Cypress")

		
		cy.get("table tbody tr")
			.contains(incomingData.name)
			.parent()
			.within(() => {
				cy.get('button[title="Visualizar"]').click()
			})
		cy.url().should("include", "/finance/incoming/view?status=received")
		cy.contains(incomingData.name).should("be.visible")
		cy.contains(incomingData.notes).should("be.visible")
		cy.contains("Client One - Cypress Test").should("be.visible")
		cy.contains("Orçamento 1 - Cypress").should("be.visible")

		
		cy.get('button[title="Editar"]').click()
		cy.url().should("include", "/finance/incoming/form?status=received")
		const newName = faker.company.catchPhrase().substring(0, 30)
		cy.get('input[name="name"]').clear().type(newName)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "atualizada com sucesso")
		incomingData.name = newName
		cy.wrap(newName).as("updatedIncomingName")

		
		cy.visit("/finance/incoming?tab=received")
		cy.get('input[placeholder*="Buscar"]').type(newName)
		cy.get("table tbody tr").should("contain", newName)
		cy.get("table tbody tr").should("contain", "Client One - Cypress Test")
		cy.get("table tbody tr").should("contain", "Orçamento 1 - Cypress")

		
		cy.get("table tbody tr")
			.contains(incomingData.name)
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
				cy.get('input[placeholder*="Buscar"]').clear().type(incomingData.name)
				cy.get("table tbody").should("not.contain", incomingData.name)
			} else {
				cy.get("#empty-list").should("be.visible")
			}
		})
	})
})
