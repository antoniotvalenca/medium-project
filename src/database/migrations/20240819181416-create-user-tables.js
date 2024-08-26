'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
	await queryInterface.createTable("users", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},

		name: {
			type: Sequelize.STRING,
			allowNull: false.valueOf,
		},

		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},

		password: {
			type: Sequelize.STRING
		},

		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		  },
		  updated_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		  }
	})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
