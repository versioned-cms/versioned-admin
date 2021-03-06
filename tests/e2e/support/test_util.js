const u = require('./util')

const TITLE_FIELD = {
  name: 'Title',
  type: 'string'
}

function Model (model) {
  const modelDefaults = {
    coll: u.dbFriendly(model.name)
  }
  const fieldDefaults = {
    category: 'data',
    type: 'string'
  }
  function fieldsWithDefaults (fields) {
    return (fields || []).map((field) => {
      const key = u.dbFriendly(field.name)
      return Object.assign({key}, fieldDefaults, field)
    })
  }
  return Object.assign({}, modelDefaults, model, {
    fields: fieldsWithDefaults(model.fields),
    expectedFields: fieldsWithDefaults(model.expectedFields)
  })
}

module.exports = {
  TITLE_FIELD,
  Model
}
