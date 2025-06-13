"use strict";

const { profile } = require('console');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"user",
			[
				{
					user_id: 1,
					email: "temp@email.com",
					username: "temp_user",
					password: "$2b$10$tRehYKczq1tfaTqb2sf8pugByoP1IlYLXweyKZHjBUVPGYSZJBnne",
					first_name: "Temp First Name",
					last_name: "Temp Last Name",
					address: "Temp Address",
					city: "Temp City",
					region: "Temp Region",
					postal_code: "12345",
					contact_number: "1234567890",
					birth_date: "2000-01-01",
                    profile_picture: null,
					user_type_id: 1,
					membership_type_id: 1,
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					user_id: 2,
					email: "sherwin.laguidao533@gmail.com",
					username: "sungjinwooo",
					password: "$2b$10$tRehYKczq1tfaTqb2sf8pugByoP1IlYLXweyKZHjBUVPGYSZJBnne",
					first_name: "Sherwin",
					last_name: "Laguidao",
					address: "Temp Address",
					city: "Temp City",
					region: "Temp Region",
					postal_code: "12345",
					contact_number: "1234567890",
					birth_date: "2000-01-01",
                    profile_picture: null,
					user_type_id: 1,
					membership_type_id: 1,
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);

		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("user", null, {});
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
