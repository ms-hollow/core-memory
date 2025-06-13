"use strict";

const { create } = require('domain');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const tableName = "password_reset";
		const tableDefinition = {
			password_reset_id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: { tableName: "user" },
					key: "user_id",
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			reset_code: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			expires_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			used: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
		};

		await queryInterface.createTable(tableName, tableDefinition);
	},

	async down(queryInterface, Sequelize) {
		// * Drop the 'password_reset' table
		await queryInterface.dropTable("password_reset");
	},
};
