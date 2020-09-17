import { parse, parseISO } from 'date-fns'

export const defaultDateTimeFormat = 'yyyy-MM-dd HH:mm:ss'
export const defaultDateFormat = 'yyyy-MM-dd'
export const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const numericFormatter = new Intl.NumberFormat('en-US', {})

export const checkFocus = (element, func) => {
  let isFocused = null
  document.addEventListener('click', event => {
    let targetElement = event.target
    do {
      if (targetElement === element) {
        if (isFocused !== true) {
          func(true)
          isFocused = true
        }
        return
      }
      targetElement = targetElement.parentNode
    } while (targetElement)
    if (isFocused !== false) {
      func(false)
      isFocused = false
    }
  })
}

export const parseCellDateTime = (value, column, format) => {
  value = parse(value, column.format || format, new Date())
  if (isNaN(value)) {
    throw new Error(`Invalid date format ${format}`)
  }
  return value
}

export const cellValueParser = (column, row, value, fromInput) => {
  if (column.formatter) {
    return column.formatter({ value, row, column, fromInput, reverse: true })
  }
  if (!value && value !== 0 && value !== false) {
    return value
  }
  if (!column.type || column.type === 'text') {
    return value
  }
  if (column.type === 'date') {
    if (fromInput) {
      value = parse(value, 'yyyy-MM-dd', new Date())
    } else {
      value = parseCellDateTime(value, column, defaultDateFormat)
    }
  } else if (column.type === 'datetime') {
    if (fromInput) {
      value = parseISO(value)
    } else {
      value = parseCellDateTime(value, column, defaultDateTimeFormat)
    }
  } else if (column.type === 'boolean') {
    value = ['y', 'yes', 'true', 't', 'si', 's', '1'].indexOf(value.toLowerCase()) >= 0
  } else if (column.type === 'currency' || column.type === 'numeric' || column.type === 'percent') {
    const separators = currencyFormatter.format(111111.11).replace(/1/g, '').split('').reverse()
    const decimalSepparator = separators[0]
    const clearValue = +value.split('').filter(val => !isNaN(+val) || val === decimalSepparator).join('')
    value = value.startsWith('-') ? clearValue * -1 : clearValue
  }
  if (isNaN(value)) {
    throw new Error('Invalid value')
  }
  return value
}

export const sameDates = (date1, date2) => {
  if (!date1 && date2) return false
  if (date1 && !date2) return false
  if (!date1 && !date2) return true
  return date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate() &&
  date1.getHours() === date2.getHours() &&
  date1.getMinutes() === date2.getMinutes()
}
