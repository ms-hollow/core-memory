"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("user", {
			user_id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				validate: { isEmail: true },
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			first_name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			last_name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			address: {
				type: Sequelize.STRING,
			},
			city: {
				type: Sequelize.STRING,
			},
			postal_code: {
				type: Sequelize.STRING,
			},
			region: {
				type: Sequelize.STRING,
			},
			contact_number: {
				type: Sequelize.STRING,
			},
			birth_date: {
				type: Sequelize.DATE,
			},
            profile_picture: {
                type: Sequelize.STRING,
                allowNull: true,
            },
			user_type_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: { tableName: "user_types" },
					key: "user_type_id",
				},
				onDelete: "CASCADE", // if the user type is deleted, delete the user
				onUpdate: "CASCADE", // if the user type is updated, update the user
			},
			membership_type_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: { tableName: "membership_types" },
					key: "membership_type_id",
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal(
					"CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
				),
			},
		});

		// Modify the username column to use utf8_bin collation
		await queryInterface.sequelize.query(
			`ALTER TABLE user MODIFY username VARCHAR(255) COLLATE utf8_bin;` // Change the collation of the username column to utf8_bin to make it case-sensitive
		);
	},
	async down(queryInterface, Sequelize) {
		// * Get the list of foreign key constraints for the 'user' table
		const foreignKeys = await queryInterface.getForeignKeyReferencesForTable("user");

		// * Remove the foreign key constraints from the 'user' table
		// Loop through each foreign key and remove it
        for (const fk of foreignKeys) {
            await queryInterface.removeConstraint("user", fk.constraintName); // remove the foreign key constraint
        }

		// * Drop the 'user' table
		await queryInterface.dropTable("user");
	},
};
