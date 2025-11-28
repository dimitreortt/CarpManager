export const arraysEqual = (arr1: any[], arr2: any[]) => {
	const setA = new Set(arr1)
	const setB = new Set(arr2)
	if (setA.size !== setB.size) return false
	for (const item of setA) {
		if (!setB.has(item)) return false
	}
	return true
}

export const objectArraysEqual = (objArray1: any[], objArray2: any[], fieldToCompare: string = "id") => {
	return arraysEqual(
		objArray1.map((item) => item[fieldToCompare]),
		objArray2.map((item) => item[fieldToCompare])
	)
}

/* check which items are in arr2 but not in arr1 */
export const arraysDiff = (arr1: string[], arr2: string[]) => {
	return arr2.filter((item) => !arr1.includes(item))
}
