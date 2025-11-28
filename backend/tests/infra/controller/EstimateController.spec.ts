import request from "supertest"
import { EstimateController } from "../../../src/infra/controller/EstimateController"
import { Database } from "../../../src/infra/database/Database"
import { EstimateService } from "../../../src/application/EstimateService"
import { HttpServerMock } from "../../mocks/HttpServerMock"
import { mockDatabase as mockDb } from "../../mocks/mockDatabase"
import { CreateOrderData } from "../../../src/application/dto/CreateOrderData"

describe("EstimateController", () => {
	let mockDatabase: jest.Mocked<Database> = mockDb
	let estimateController: EstimateController
	let server: HttpServerMock

	beforeAll(() => {
		server = new HttpServerMock()
		estimateController = new EstimateController(server.app as any, mockDatabase, new EstimateService(mockDatabase))
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe("PUT /:id/accept", () => {
		const validEstimateId = "123e4567-e89b-12d3-a456-426614174000"
		const invalidEstimateId = "invalid-id"

		it("should successfully accept an estimate when it exists", async () => {
			const mockAcceptedEstimate = {
				id: validEstimateId,
				status: "accepted",
				client: "Test Client",
				dueDate: "2024-01-01",
			}

			mockDatabase.update.mockResolvedValue(mockAcceptedEstimate)

			const response = await request(server.app).put(`/${validEstimateId}/accept`).expect(200)

			expect(response.body).toEqual(mockAcceptedEstimate)
		})

		it("should return 404 when estimate is not found", async () => {
			const errorMessage = "Não foi possível aceitar o orçamento: orçamento não encontrado"
			mockDatabase.update.mockRejectedValue({ code: "P2025" })

			const response = await request(server.app).put(`/${invalidEstimateId}/accept`).expect(404)

			expect(response.body).toEqual({ message: errorMessage })
		})
	})

	describe("POST /:id/create-order", () => {
		it("should successfully create an order when it exists", async () => {
			const id = "123e4567-e89b-12d3-a456-426614174000"
			const mockCreateOrder: CreateOrderData = {
				estimateName: "Test Estimate",
				paymentMethod: "Test Payment Method",
				signReceived: 100,
				orderDueDate: new Date(),
				installments: [
					{
						amount: 100,
						date: new Date().toISOString(),
						paymentMethod: "Test Payment Method",
					},
				],
			}

			mockDatabase.update.mockResolvedValue("")
			mockDatabase.createMany.mockResolvedValue("")

			const response = await request(server.app).post(`/${id}/create-order`).send(mockCreateOrder).expect(200)

			expect(mockDatabase.update).toHaveBeenCalledWith("estimate", { id }, { status: "accepted", dueDate: expect.any(String) })
			expect(mockDatabase.createMany).toHaveBeenCalledWith("incoming", {
				data: [
					{
						name: "Sinal recebido - Test Estimate",
						amount: 100,
						date: expect.any(String),
						paymentMethod: "Test Payment Method",
						status: "received",
						estimateId: id,
					},
					{
						name: "Parcela 1 - Test Estimate",
						amount: 100,
						date: expect.any(String),
						paymentMethod: "Test Payment Method",
						status: "pending",
						estimateId: id,
					},
				],
			})
		})
	})
})
