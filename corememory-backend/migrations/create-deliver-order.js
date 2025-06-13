"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
        await queryInterface.createTable("deliver_order", {
            deliver_order_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            delivered_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM("not started", "pending", "completed", "cancelled"),
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        // * Drop the 'deliver_order' table
        await queryInterface.dropTable("deliver_order");
    },
};
