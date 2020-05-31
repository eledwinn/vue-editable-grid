import { format } from 'date-fns'
import { defaultDateTimeFormat, defaultDateFormat, currencyFormatter, numericFormatter } from './helpers'

export const cellFormatter = function (value, column) {
  if (!value && value !== false && value !== 0) return ''
  switch (column.type) {
    case 'date': return format(value, column.format || defaultDateFormat)
    case 'datetime': return format(value, column.format || defaultDateTimeFormat)
    case 'boolean': return value ? 'Y' : 'N'
    case 'numeric': return numericFormatter.format(value)
    case 'currency': return currencyFormatter.format(value)
    default: return value
  }
}
