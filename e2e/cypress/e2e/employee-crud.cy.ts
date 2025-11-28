import { faker } from "@faker-js/faker"

describe("Employee CRUD Operations", () => {
	let employeeData: {
		name: string
		email: string
		phone: string
		position: string
		department: string
		salary: number
		hireDate: string
		city: string
		state: string
		address: string
		emergencyContact: string
		emergencyPhone: string
		bankAccount: string
		bankBranch: string
		bankCode: string
		notes: string
	}

	before(() => {
		employeeData = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			phone: faker.phone.number({ style: "national" }),
			position: faker.person.jobTitle(),
			department: faker.helpers.arrayElement(["Produção", "Administrativo", "Vendas"]),
			salary: faker.number.int({ min: 2000, max: 10000 }),
			hireDate: faker.date.past().toISOString().split("T")[0],
			city: faker.location.city(),
			state: faker.helpers.arrayElement(["SP", "RJ", "MG", "RS", "PR", "SC"]),
			address: faker.location.streetAddress(),
			emergencyContact: faker.person.fullName(),
			emergencyPhone: faker.phone.number({ style: "national" }),
			bankAccount: faker.finance.accountNumber(),
			bankBranch: faker.finance.routingNumber(),
			bankCode: faker.finance.routingNumber(),
			notes: faker.lorem.sentence(),
		}
	})

	it("should create a new employee", async () => {
		cy.fixture("testUsers").then((users) => {
			cy.login(users.testUser.email, users.testUser.password)
		})

		cy.visit("/employees/form")
		cy.get('input[name="name"]').type(employeeData.name)
		cy.get('input[name="email"]').type(employeeData.email)
		cy.get('input[name="phone"]').type(employeeData.phone)
		cy.get('input[name="position"]').type(employeeData.position)
		cy.get('input[name="department"]').type(employeeData.department)
		cy.get('input[name="hireDate"]').invoke("val", employeeData.hireDate).trigger("input").trigger("change")

		cy.get('input[name="address"]').type(employeeData.address)
		cy.get('input[name="city"]').type(employeeData.city)
		cy.get('input[name="state"]').type(employeeData.state)
		cy.get('input[name="emergencyContact"]').type(employeeData.emergencyContact)
		cy.get('input[name="emergencyPhone"]').type(employeeData.emergencyPhone)
		cy.get('input[name="bankAccount"]').type(employeeData.bankAccount)
		cy.get('input[name="bankBranch"]').type(employeeData.bankBranch)
		cy.get('input[name="bankCode"]').type(employeeData.bankCode)
		cy.get('textarea[name="notes"]').type(employeeData.notes)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "criado com sucesso")
		cy.wrap(employeeData.name).as("employeeName")

		cy.visit("/employees")
		cy.get('input[placeholder*="Buscar funcionários"]').type(employeeData.name)
		cy.get("table tbody tr").should("contain", employeeData.name)
		cy.get("table tbody tr").should("contain", employeeData.position)
		cy.get("table tbody tr").should("contain", employeeData.department)

		cy.get("table tbody tr")
			.contains(employeeData.name)
			.parent()
			.within(() => {
				cy.get('button[title="Visualizar"]').click()
			})
		cy.url().should("include", "/employees/view")
		cy.contains(employeeData.name).should("be.visible")
		cy.contains(employeeData.email).should("be.visible")
		cy.contains(employeeData.position).should("be.visible")
		cy.contains(employeeData.department).should("be.visible")

		cy.get('button[title="Editar"]').click()
		cy.url().should("include", "/employees/form")
		const newName = faker.person.fullName()
		cy.get('input[name="name"]').clear().type(newName)
		cy.get('button[type="submit"]').click()
		cy.get('[role="alert"]').should("contain", "atualizado com sucesso")
		employeeData.name = newName
		cy.wrap(newName).as("updatedEmployeeName")

		cy.visit("/employees")
		cy.get('input[placeholder*="Buscar funcionários"]').type(newName)
		cy.get("table tbody tr").should("contain", newName)
		cy.get("table tbody tr").should("contain", employeeData.position)
		cy.get("table tbody tr").should("contain", employeeData.department)

		cy.get("table tbody tr")
			.contains(employeeData.name)
			.parent()
			.within(() => {
				cy.get('input[type="checkbox"]').check()
			})
		cy.get('button[title="Deletar Itens"]').click()
		cy.get(".modal").should("be.visible")
		cy.get('button[title="Excluir"]').click()
		cy.get('[role="alert"]').should("contain", "deletado")
		cy.get('input[placeholder*="Buscar funcionários"]').clear().type(employeeData.name)
		cy.get("table tbody").should("not.contain", employeeData.name)
	})
})
