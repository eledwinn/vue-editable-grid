import { parse, parseISO } from 'date-fns'

export const defaultDateTimeFormat = 'yyyy-MM-dd HH:mm:ss'
export const defaultDateFormat = 'yyyy-MM-dd'
export const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const numericFormatter = new Intl.NumberFormat('en-US', {})

const isFilterTypeExclude = (filterValue) => {
  return filterValue.charAt(0) === '!'
}

const applyFilter = (filterValue, row, filterKey) => {
  const value = isFilterTypeExclude(filterValue) ? filterValue.substring(1) : filterValue
  const searchString = value.trim().toLowerCase()
  const found = `${row[filterKey]}`.toLowerCase().indexOf(searchString) >= 0

  return isFilterTypeExclude(filterValue) ? !found : found
}

export const filterAndSort = (filter, data, sortBy, sortDesc) => {
  const filterKeys = Object.keys(filter)
  const filtered = data.filter(row => {
    return filterKeys.filter(filterKey => {
      const filterQuery = filter[filterKey]
      if (!filterQuery) {
        return true
      }
      if (filterQuery.indexOf('&') >= 0) {
        const filterValues = filterQuery.split('&')
        return filterValues.filter(filterValue => filterValue && applyFilter(filterValue, row, filterKey)).length === filterValues.length
      } else {
        const filterValues = filterQuery.split(',')
        return filterValues.some(filterValue => filterValue && applyFilter(filterValue, row, filterKey))
      }
    }).length === filterKeys.length
  })
  return filtered.sort((a, b) => {
    const valA = a[sortBy]
    const valB = b[sortBy]
    if (valA > valB) {
      return sortDesc ? -1 : 1
    }
    if (valA < valB) {
      return sortDesc ? 1 : -1
    }
    return 0
  })
}

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

export const cellValueParser = (column, value, fromInput) => {
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
  } else if (column.type === 'currency' || column.type === 'numeric') {
    const separators = currencyFormatter.format(111111.11).replace(/1/g, '').split('').reverse()
    const decimalSepparator = separators[0]
    const clearValue = +value.split('').filter(val => !isNaN(+val) || val === decimalSepparator).join('')
    value = clearValue
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
