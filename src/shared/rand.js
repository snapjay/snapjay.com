export default (min, max, precision = 1) => {
  return parseFloat((Math.random() * (max - min + 1) + min).toFixed(precision)
  )
}
