import { faker } from "@faker-js/faker"
import { formatCurrency } from "../plugins/formatCurrency"

describe("Order CRUD Operations", () => {
	let orderData: {
		name: string
		precutCost: number
		laborCost: number
		totalValue: number
		dueDate: string
		notes: string
	}
	let formattedPrecutCost: string
	let formattedLaborCost: string
	let formattedTotalValue: string

	before(() => {
		
		const precutCost = parseFloat(faker.commerce.price({ min: 100, max: 500, dec: 2 }))
		const laborCost = parseFloat(faker.commerce.price({ min: 200, max: 800, dec: 2 }))
		const totalValue = precutCost + laborCost 

		orderData = {
			name: faker.company.catchPhrase().substring(0, 20),
			precutCost: precutCost,
			laborCost: laborCost,
			totalValue: totalValue,
			dueDate: faker.date.future().toISOString().split("T")[0],
			notes: faker.lorem.sentence(),
		}

		formattedPrecutCost = formatCurrency(orderData.precutCost)
		formattedLaborCost = formatCurrency(orderData.laborCost)
		formattedTotalValue = formatCurrency(orderData.totalValue)
	})

	it("should create, view, edit and delete an order", async () => {
		
		cy.fixture("testUsers").then((users) => {
			cy.login(users.testUser.email, users.testUser.password)
		})

		

		cy.visit("/estimates/form?status=accepted")
		cy.get('input[name="name"]').type(orderData.name)

		
		cy.window().then((win) => {
			;(win as any).orderFormInstance.setValue("precutCost", orderData.precutCost)
		})
		cy.window().then((win) => {
			;(win as any).orderFormInstance.setValue("laborCost", orderData.laborCost)
		})
		cy.get('input[name="dueDate"]').invoke("val", orderData.dueDate).trigger("input").trigger("change")

		
		cy.get('input[placeholder="Buscar opções..."]').type("Client One - Cypress Test")
		cy.get(".position-absolute .cursor-pointer").contains("Client One - Cypress Test").click()

		
		cy.checkMultiSelectOption(["Material One"])
		cy.checkMultiSelectOption(["Material Two"])

		
		cy.checkMultiSelectOption(["Viagem One", "250"])

		
		cy.get('button:contains("Calcular total")').click()
		cy.window().then((win) => {
			const totalValue = (win as any).orderFormInstance.getValues("totalValue")
			expect(totalValue).to.be.greaterThan(orderData.precutCost + orderData.laborCost)
		})

		
		cy.get('textarea[name="notes"]').type(orderData.notes)

		
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "criado com sucesso")
		cy.wrap(orderData.name).as("orderName")

		

		cy.visit("/orders")
		cy.get('input[placeholder*="Buscar pedidos"]').type(orderData.name)
		cy.get("table tbody tr").should("contain", orderData.name)
		cy.get("table tbody tr").should("contain", "Client One - Cypress Test")

		

		cy.get("table tbody tr")
			.contains(orderData.name)
			.parent()
			.within(() => {
				cy.get('button[title="Visualizar"]').click()
			})
		cy.url().should("include", "/estimates/view")
		cy.contains(orderData.name).should("be.visible")
		cy.contains(orderData.notes).should("be.visible")
		cy.contains("Client One - Cypress Test").should("be.visible")

		

		cy.get('button[title="Editar"]').click()
		cy.url().should("include", "/estimates/form")
		const newName = faker.company.catchPhrase().substring(0, 20)
		cy.get('input[name="name"]').clear().type(newName)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "atualizado com sucesso")
		orderData.name = newName
		cy.wrap(newName).as("updatedOrderName")

		

		cy.visit("/orders")
		cy.get('input[placeholder*="Buscar pedidos"]').type(newName)
		cy.get("table tbody tr").should("contain", newName)
		cy.get("table tbody tr").should("contain", "Client One - Cypress Test")

		

		cy.get("table tbody tr")
			.contains(orderData.name)
			.parent()
			.within(() => {
				cy.get('input[type="checkbox"]').check()
			})
		cy.get('button[title="Deletar Itens"]').click()
		cy.get(".modal").should("be.visible")
		cy.get('button[title="Excluir"]').click()
		cy.get('[role="alert"]').should("contain", "deletado")

		

		
		cy.get("body").then(($body) => {
			if ($body.find('input[placeholder*="Buscar pedidos"]').length > 0) {
				cy.get('input[placeholder*="Buscar pedidos"]').clear().type(orderData.name)
				cy.get("table tbody").should("not.contain", orderData.name)
			} else {
				cy.get("#empty-list").should("be.visible")
			}
		})
	})
})
