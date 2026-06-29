export const formatDate = (date) =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(date))

export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
