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
