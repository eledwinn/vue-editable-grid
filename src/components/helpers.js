import { parse, parseISO } from 'date-fns'

const defaultDateTimeFormat = 'yyyy-MM-dd HH:mm:ss'
const defaultDateFormat = 'yyyy-MM-dd'

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
        return filterValues.filter(filterValue => filterValue && `${row[filterKey]}`.toLowerCase().indexOf(filterValue.trim().toLowerCase()) >= 0).length === filterValues.length
      } else {
        const filterValues = filterQuery.split(',')
        return filterValues.some(filterValue => filterValue && `${row[filterKey]}`.toLowerCase().indexOf(filterValue.trim().toLowerCase()) >= 0)
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

export const cellValueParser = (column, value, fromInput) => {
  if (value && column.type === 'date') {
    if (fromInput) {
      value = parse(value, 'yyyy-MM-dd')
    } else {
      const format = defaultDateFormat
      value = parse(value, format)
      if (isNaN(value)) {
        throw new Error(`Invalid date format ${format}`)
      }
    }
  } else if (value && column.type === 'datetime') {
    if (fromInput) {
      value = parseISO(value)
    } else {
      const format = defaultDateTimeFormat
      value = parse(value, format, new Date())
      if (isNaN(value)) {
        throw new Error(`Invalid date format ${format}`)
      }
    }
  } else if (value && column.type === 'boolean') {
    value = ['y', 'yes', 'true', 't', 'si', 's', '1'].indexOf(value.toLowerCase()) >= 0
  }
  if (isNaN(value)) {
    throw new Error('Invalid value')
  }
  return value
}
