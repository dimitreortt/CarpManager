import { z } from 'zod'

export const validateAndProvideDefaults = <T extends Record<string, any>>(values: Partial<T>, schema: z.ZodSchema<T>): T => {
	const validatedValues = { ...values } as any
	const schemaShape = (schema as any)._def?.shape || {}

	Object.keys(schemaShape).forEach(key => {
		const fieldSchema = schemaShape[key]
		const currentValue = validatedValues[key]

		if (currentValue === undefined) {
			if (fieldSchema._def?.typeName === 'ZodString') {
				validatedValues[key] = ''
			} else if (fieldSchema._def?.typeName === 'ZodNumber') {
				validatedValues[key] = 0
			} else if (fieldSchema._def?.typeName === 'ZodArray') {
				validatedValues[key] = []
			} else if (fieldSchema._def?.typeName === 'ZodBoolean') {
				validatedValues[key] = false
			} else if (fieldSchema._def?.typeName === 'ZodDate') {
				validatedValues[key] = new Date()
			} else if (fieldSchema._def?.typeName === 'ZodEnum') {
				const enumValues = fieldSchema._def.values
				validatedValues[key] = enumValues[0]
			}
		}

		if (validatedValues['date'] === '') {
			validatedValues['date'] = null
		}

		for (const key in validatedValues) {
			if (validatedValues[key] === undefined) {
				validatedValues[key] = ''
			}
		}
	})

	return validatedValues as T
}
