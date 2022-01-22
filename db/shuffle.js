const knex = require("./knex");

function createList(data) {
    return knex('shuffle').insert(data)
}


function getList() {
    return knex('shuffle').select('*')
}

module.exports = {
    getList,
    createList,
}