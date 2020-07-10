import { format } from 'date-fns'
import { defaultDateTimeFormat, defaultDateFormat, currencyFormatter, percentFormatter, numericFormatter } from './helpers'

export const cellFormatter = function (value, column, row) {
  if (column.formatter) {
    return column.formatter({ value, column, row, reverse: false })
  }
  if (!value && value !== false && value !== 0) return ''
  switch (column.type) {
    case 'date': {
      if (typeof value === 'string') value = new Date(value)
      return format(value, column.format || defaultDateFormat)
    }
    case 'datetime': {
      if (typeof value === 'string') value = new Date(value)
      return format(value, column.format || defaultDateTimeFormat)
    }
    case 'boolean': return value ? 'Y' : 'N'
    case 'numeric': return numericFormatter.format(value)
    case 'currency': return currencyFormatter.format(value)
    case 'percent': return percentFormatter.format(value)
    default: return value
  }
}
