const knex = require("./knex");

function createPerson(person) {
    return knex('people').insert(person)
}

function createList(item) {
    return knex('people').insert(item)
}

function getAllPeople() {
    return knex('people').select('*')
}

function deletePerson(id) {
    return knex('people').where('id', id).del()
}

function updatePerson(id, person) {
    return knex('people').where('id', id).update(person)
}

module.exports = {
    createPerson,
    getAllPeople,
    deletePerson,
    updatePerson,
    createList,
}