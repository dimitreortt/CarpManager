import { faker } from "@faker-js/faker"
import { formatCurrency } from "../plugins/formatCurrency"

describe("Trip CRUD Operations", () => {
	let tripData: {
		name: string
		destination: string
		date: string
		numberOfTolls: number
		costOfTolls: number
		numberOfLunches: number
		costOfLunches: number
		costOfFuel: number
		totalCost: number
		service1Cost: number
		service2Cost: number
		notes: string
	}
	let formattedTotalCost: string
	let formattedService1Cost: string
	let formattedService2Cost: string

	before(() => {
		
		const costOfTolls = parseFloat(faker.commerce.price({ min: 10, max: 50, dec: 2 }))
		const costOfLunches = parseFloat(faker.commerce.price({ min: 20, max: 80, dec: 2 }))
		const costOfFuel = parseFloat(faker.commerce.price({ min: 100, max: 300, dec: 2 }))
		const totalCost = costOfTolls + costOfLunches + costOfFuel

		tripData = {
			name: faker.company.catchPhrase(),
			destination: faker.location.city(),
			date: faker.date.future().toISOString().split("T")[0],
			numberOfTolls: faker.number.int({ min: 1, max: 5 }),
			costOfTolls: costOfTolls,
			numberOfLunches: faker.number.int({ min: 1, max: 3 }),
			costOfLunches: costOfLunches,
			costOfFuel: costOfFuel,
			totalCost: totalCost,
			service1Cost: totalCost * 0.7, 
			service2Cost: totalCost * 0.3, 
			notes: faker.lorem.sentence(),
		}

		formattedTotalCost = formatCurrency(tripData.totalCost)
		formattedService1Cost = formatCurrency(tripData.service1Cost)
		formattedService2Cost = formatCurrency(tripData.service2Cost)
	})

	it("should create, view, edit and delete a trip", async () => {
		
		cy.fixture("testUsers").then((users) => {
			cy.login(users.testUser.email, users.testUser.password)
		})

		
		cy.visit("/trips/form")
		cy.get('input[name="name"]').type(tripData.name)
		cy.get('input[name="destination"]').type(tripData.destination)
		cy.get('input[name="date"]').invoke("val", tripData.date).trigger("input").trigger("change")

		
		cy.get('input[name="numberOfTolls"]').type(tripData.numberOfTolls.toString())
		cy.get('input[name="numberOfLunches"]').type(tripData.numberOfLunches.toString())

		
		cy.window().then((win) => {
			;(win as any).tripFormInstance.setValue("costOfTolls", tripData.costOfTolls)
		})
		cy.window().then((win) => {
			;(win as any).tripFormInstance.setValue("costOfLunches", tripData.costOfLunches)
		})
		cy.window().then((win) => {
			;(win as any).tripFormInstance.setValue("costOfFuel", tripData.costOfFuel)
		})

		
		cy.get('button:contains("Calcular Total")').click()

		
		
		cy.window().then((win) => {
			const totalCost = (win as any).tripFormInstance.getValues("totalCost")
			expect(totalCost).to.be.equal(tripData.totalCost)
		})

		
		cy.get('button:contains("Adicionar Serviço")').click()

		
		cy.window().then((win) => {
			;(win as any).tripFormInstance.setValue("serviceCosts.0.cost", tripData.service1Cost)
		})
		cy.window().then((win) => {
			;(win as any).tripFormInstance.setValue("serviceCosts.1.cost", tripData.service2Cost)
		})

		
		cy.get('textarea[name="notes"]').type(tripData.notes)

		
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "criada com sucesso")
		cy.wrap(tripData.name).as("tripName")

		
		cy.visit("/trips")
		cy.get('input[placeholder*="Buscar viagens"]').type(tripData.name)
		cy.get("table tbody tr").should("contain", tripData.name)
		cy.get("table tbody tr").should("contain", tripData.destination)
		cy.get("table tbody tr").should("contain", formattedTotalCost)

		
		cy.get("table tbody tr")
			.contains(tripData.name)
			.parent()
			.within(() => {
				cy.get('button[title="Visualizar"]').click()
			})
		cy.url().should("include", "/trips/view")
		cy.contains(tripData.name).should("be.visible")
		cy.contains(tripData.destination).should("be.visible")
		cy.contains(tripData.notes).should("be.visible")

		
		cy.get('button[title="Editar"]').click()
		cy.url().should("include", "/trips/form")
		const newName = faker.company.catchPhrase()
		cy.get('input[name="name"]').clear().type(newName)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "atualizada com sucesso")
		tripData.name = newName
		cy.wrap(newName).as("updatedTripName")

		
		cy.visit("/trips")
		cy.get('input[placeholder*="Buscar viagens"]').type(newName)
		cy.get("table tbody tr").should("contain", newName)
		cy.get("table tbody tr").should("contain", tripData.destination)
		cy.get("table tbody tr").should("contain", formattedTotalCost)

		
		cy.get("table tbody tr")
			.contains(tripData.name)
			.parent()
			.within(() => {
				cy.get('input[type="checkbox"]').check()
			})
		cy.get('button[title="Deletar Itens"]').click()
		cy.get(".modal").should("be.visible")
		cy.get('button[title="Excluir"]').click()
		cy.get('[role="alert"]').should("contain", "deletado")

		
		cy.get("body").then(($body) => {
			if ($body.find('input[placeholder*="Buscar viagens"]').length > 0) {
				cy.get('input[placeholder*="Buscar viagens"]').clear().type(tripData.name)
				cy.get("table tbody").should("not.contain", tripData.name)
			} else {
				cy.get("#empty-list").should("be.visible")
			}
		})
	})
})
