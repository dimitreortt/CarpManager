import { faker } from "@faker-js/faker"

describe("Material CRUD Operations", () => {
	let materialData: {
		name: string
		code: string
		price: string
		description: string
	}
	let formattedPrice: string

	before(() => {
		
		materialData = {
			name: faker.commerce.productName(),
			code: faker.string.alphanumeric(8),
			price: faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
			description: faker.commerce.productDescription(),
		}
	})

	it("should create, view, edit and delete a material", async () => {
		
		cy.fixture("testUsers").then((users) => {
			cy.login(users.testUser.email, users.testUser.password)
		})

		
		cy.visit("/materials/form")
		cy.get('input[name="name"]').type(materialData.name)
		cy.get('input[name="code"]').type(materialData.code)
		cy.window().then((win) => {
			;(win as any).materialFormInstance.setValue("price", parseFloat(materialData.price))
		})
		cy.get('textarea[name="description"]').type(materialData.description)

		
		cy.get('input[placeholder="Buscar opções..."]').type("Supplier One - Cypress Test")
		cy.get(".position-absolute .cursor-pointer").contains("Supplier One - Cypress Test").click()

		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "criado com sucesso")
		cy.wrap(materialData.name).as("materialName")

		
		cy.visit("/materials")
		cy.get('input[placeholder*="Buscar materiais"]').type(materialData.name)
		cy.get("table tbody tr").should("contain", materialData.name)
		cy.get("table tbody tr").should("contain", materialData.code)
		cy.get("table tbody tr").should("contain", `R$ ${materialData.price}`)
		cy.get("table tbody tr").should("contain", "Supplier One - Cypress Test")

		
		cy.get("table tbody tr")
			.contains(materialData.name)
			.parent()
			.within(() => {
				cy.get('button[title="Visualizar"]').click()
			})
		cy.url().should("include", "/materials/view")
		cy.contains(materialData.name).should("be.visible")
		cy.contains(materialData.code).should("be.visible")
		cy.contains(`R$ ${materialData.price}`).should("be.visible")
		cy.contains("Supplier One - Cypress Test").should("be.visible")
		cy.contains(materialData.description).should("be.visible")

		
		cy.get('button[title="Editar"]').click()
		cy.url().should("include", "/materials/form")
		const newName = faker.commerce.productName()
		cy.get('input[name="name"]').clear().type(newName)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "atualizado com sucesso")
		materialData.name = newName
		cy.wrap(newName).as("updatedMaterialName")

		
		cy.visit("/materials")
		cy.get('input[placeholder*="Buscar materiais"]').type(newName)
		cy.get("table tbody tr").should("contain", newName)
		cy.get("table tbody tr").should("contain", materialData.code)
		cy.get("table tbody tr").should("contain", `${materialData.price}`)
		cy.get("table tbody tr").should("contain", "Supplier One - Cypress Test")

		
		cy.get("table tbody tr")
			.contains(materialData.name)
			.parent()
			.within(() => {
				cy.get('input[type="checkbox"]').check()
			})
		cy.get('button[title="Deletar Itens"]').click()
		cy.get(".modal").should("be.visible")
		cy.get('button[title="Excluir"]').click()
		cy.get('[role="alert"]').should("contain", "deletado")

		
		cy.get("body").then(($body) => {
			if ($body.find('input[placeholder*="Buscar materiais"]').length > 0) {
				cy.get('input[placeholder*="Buscar materiais"]').clear().type(materialData.name)
				cy.get("table tbody").should("not.contain", materialData.name)
			} else {
				cy.get("#empty-list").should("be.visible")
			}
		})
	})
})
