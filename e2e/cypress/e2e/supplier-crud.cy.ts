import { faker } from "@faker-js/faker"

describe("Supplier CRUD Operations", () => {
	let supplierData: {
		name: string
		email: string
		phone: string
		city: string
		state: string
		cnpj: string
		contactPerson: string
		address: string
		notes: string
	}

	before(() => {
		supplierData = {
			name: faker.company.name(),
			email: faker.internet.email(),
			phone: faker.phone.number({ style: "national" }),
			city: faker.location.city(),
			state: faker.helpers.arrayElement(["SP", "RJ", "MG", "RS", "PR", "SC"]),
			cnpj: faker.string.numeric(14),
			contactPerson: faker.person.fullName(),
			address: faker.location.streetAddress(),
			notes: faker.lorem.sentence(),
		}
	})

	it("should create, view, edit and delete a supplier", async () => {
		cy.fixture("testUsers").then((users) => {
			cy.login(users.testUser.email, users.testUser.password)
		})

		cy.visit("/suppliers/form")
		cy.get('input[name="name"]').type(supplierData.name)
		cy.get('input[name="email"]').type(supplierData.email)
		cy.get('input[name="phone"]').type(supplierData.phone)
		cy.get('input[name="city"]').type(supplierData.city)
		cy.get('input[name="state"]').type(supplierData.state)
		cy.get('input[name="cnpj"]').type(supplierData.cnpj)
		cy.get('input[name="contactPerson"]').type(supplierData.contactPerson)
		cy.get('textarea[name="address"]').type(supplierData.address)
		cy.get('textarea[name="notes"]').type(supplierData.notes)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "criado com sucesso")
		cy.wrap(supplierData.name).as("supplierName")

		cy.visit("/suppliers")
		cy.get('input[placeholder*="Buscar fornecedores"]').type(supplierData.name)
		cy.get("table tbody tr").should("contain", supplierData.name)
		cy.get("table tbody tr").should("contain", supplierData.email)
		cy.get("table tbody tr").should("contain", supplierData.city)

		cy.get("table tbody tr")
			.contains(supplierData.name)
			.parent()
			.within(() => {
				cy.get('button[title="Visualizar"]').click()
			})
		cy.url().should("include", "/suppliers/view")
		cy.contains(supplierData.name).should("be.visible")
		cy.contains(supplierData.email).should("be.visible")
		cy.contains(supplierData.phone).should("be.visible")
		cy.contains(supplierData.city).should("be.visible")
		cy.contains(supplierData.contactPerson).should("be.visible")

		cy.get('button[title="Editar"]').click()
		cy.url().should("include", "/suppliers/form")
		const newName = faker.company.name()
		cy.get('input[name="name"]').clear().type(newName)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "atualizado com sucesso")
		supplierData.name = newName
		cy.wrap(newName).as("updatedSupplierName")

		cy.visit("/suppliers")
		cy.get('input[placeholder*="Buscar fornecedores"]').type(newName)
		cy.get("table tbody tr").should("contain", newName)
		cy.get("table tbody tr").should("contain", supplierData.email)
		cy.get("table tbody tr").should("contain", supplierData.city)

		cy.get("table tbody tr")
			.contains(supplierData.name)
			.parent()
			.within(() => {
				cy.get('input[type="checkbox"]').check()
			})
		cy.get('button[title="Deletar Itens"]').click()
		cy.get(".modal").should("be.visible")
		cy.get('button[title="Excluir"]').click()
		cy.get('[role="alert"]').should("contain", "deletado")

		cy.get("body").then(($body) => {
			if ($body.find('input[placeholder*="Buscar fornecedores"]').length > 0) {
				cy.get('input[placeholder*="Buscar fornecedores"]').clear().type(supplierData.name)
				cy.get("table tbody").should("not.contain", supplierData.name)
			} else {
				cy.get("#empty-list").should("be.visible")
			}
		})
	})
})
