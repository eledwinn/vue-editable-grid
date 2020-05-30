import { format } from 'date-fns'
import { defaultDateTimeFormat, defaultDateFormat } from './helpers'

export const cellFormatter = function (value, column) {
  if (!value) return ''
  if (column.type === 'date') return format(value, column.format || defaultDateFormat)
  if (column.type === 'datetime') return format(value, column.format || defaultDateTimeFormat)
  return value
}
