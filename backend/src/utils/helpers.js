exports.paginate = (page = 1, limit = 20) => ({
  offset: (page - 1) * limit,
  limit: Number(limit),
})

exports.pick = (obj, keys) =>
  keys.reduce((acc, k) => (k in obj ? { ...acc, [k]: obj[k] } : acc), {})
