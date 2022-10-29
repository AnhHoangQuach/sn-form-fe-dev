export const toNumericPairs = (input) => {
  const entries = Object.entries(input)
  return entries.map((entry) => Object.assign(entry, { 0: +entry[0] }))
}
