"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
        await queryInterface.createTable("process_order", {
            process_order_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            processed_at: {
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
        // * Drop the 'process_order' table
        await queryInterface.dropTable("process_order");
    },
};
