
exports.up = function(knex) {
  return knex.schema
      .createTable('tickets', function (table) {
          table.increments('id');
          table.string('user_id', 255).notNullable();
          table.string('title', 255).notNullable();
      })
      .createTable('tags', function (table) {
          table.increments('id');
          table.integer('count').notNullable();
          table.string('tag_name', 255).notNullable();
      });
};

exports.down = function(knex) {
  return knex.schema
            .dropTable('tickets')
            .dropTable('tags');
};
