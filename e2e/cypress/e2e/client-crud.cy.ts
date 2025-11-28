import { faker } from "@faker-js/faker"

describe("Client CRUD Operations", () => {
	let clientData: {
		name: string
		contactPerson: string
		email: string
		phone: string
		city: string
		address: string
		deliveryAddress: string
		notes: string
	}

	before(() => {
		
		clientData = {
			name: faker.person.fullName(),
			contactPerson: faker.person.fullName(),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			city: faker.location.city(),
			address: faker.location.streetAddress(),
			deliveryAddress: faker.location.streetAddress(),
			notes: faker.lorem.sentence(),
		}
	})

	it("should create, view, edit and delete a client", async () => {
		
		cy.fixture("testUsers").then((users) => {
			cy.login(users.testUser.email, users.testUser.password)
		})

		
		cy.visit("/clients/form")
		cy.get('input[name="name"]').type(clientData.name)
		cy.get('input[name="contactPerson"]').type(clientData.contactPerson)
		cy.get('input[name="email"]').type(clientData.email)
		cy.get('input[name="phone"]').type(clientData.phone)
		cy.get('input[name="city"]').type(clientData.city)
		cy.get('input[name="address"]').type(clientData.address)
		cy.get('input[name="deliveryAddress"]').type(clientData.deliveryAddress)
		cy.get('textarea[name="notes"]').type(clientData.notes)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "criado com sucesso")
		cy.wrap(clientData.name).as("clientName")

		
		cy.visit("/clients")
		cy.get('input[placeholder*="Buscar clientes"]').type(clientData.name)
		cy.get("table tbody tr").should("contain", clientData.name)
		cy.get("table tbody tr").should("contain", clientData.email)
		cy.get("table tbody tr").should("contain", clientData.city)

		
		cy.get("table tbody tr")
			.contains(clientData.name)
			.parent()
			.within(() => {
				cy.get('button[title="Visualizar"]').click()
			})
		cy.url().should("include", "/clients/view")
		cy.contains(clientData.name).should("be.visible")
		cy.contains(clientData.email).should("be.visible")
		cy.contains(clientData.phone).should("be.visible")
		cy.contains(clientData.city).should("be.visible")
		cy.contains(clientData.contactPerson).should("be.visible")

		
		cy.get('button[title="Editar"]').click()
		cy.url().should("include", "/clients/form")
		const newName = faker.person.fullName()
		cy.get('input[name="name"]').clear().type(newName)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "atualizado com sucesso")
		clientData.name = newName
		cy.wrap(newName).as("updatedClientName")

		
		cy.visit("/clients")
		cy.get('input[placeholder*="Buscar clientes"]').type(newName)
		cy.get("table tbody tr").should("contain", newName)
		cy.get("table tbody tr").should("contain", clientData.email)
		cy.get("table tbody tr").should("contain", clientData.city)

		
		cy.get("table tbody tr")
			.contains(clientData.name)
			.parent()
			.within(() => {
				cy.get('input[type="checkbox"]').check()
			})
		cy.get('button[title="Deletar Itens"]').click()
		cy.get(".modal").should("be.visible")
		cy.get('button[title="Excluir"]').click()
		cy.get('[role="alert"]').should("contain", "deletado")

		
		cy.get("body").then(($body) => {
			if ($body.find('input[placeholder*="Buscar clientes"]').length > 0) {
				cy.get('input[placeholder*="Buscar clientes"]').clear().type(clientData.name)
				cy.get("table tbody").should("not.contain", clientData.name)
			} else {
				cy.get("#empty-list").should("be.visible")
			}
		})
	})
})
