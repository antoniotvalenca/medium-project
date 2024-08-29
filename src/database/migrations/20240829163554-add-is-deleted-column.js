'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('posts', 'is_deleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('users', 'is_deleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.removeColumn('posts', 'deleted_at');
    await queryInterface.removeColumn('users', 'deleted_at');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('posts', 'is_deleted');
    await queryInterface.removeColumn('users', 'is_deleted');

    await queryInterface.addColumn('posts', 'deleted_at', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('users', 'deleted_at', {
      type: Sequelize.DATE,
    });
  },
};
