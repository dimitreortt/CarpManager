import { act, screen, fireEvent } from '@testing-library/react'

export const fillInput = async (input: HTMLElement | string, value: string) => {
	if (typeof input === 'string') {
		input = screen.getByTestId(input)
	}
	await act(async () => {
		fireEvent.input(input, { target: { value } })
		fireEvent.change(input, { target: { value } })
		fireEvent.blur(input)
	})
}

export const clickButton = async (button: HTMLElement | string) => {
	if (typeof button === 'string') {
		button = screen.getByTestId(button)
	}
	await act(async () => {
		fireEvent.click(button)
	})
}
