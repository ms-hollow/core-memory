"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("payment_method", {
            payment_method_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            payment_type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            reference_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            payment_status: {
                type: Sequelize.ENUM("pending", "completed", "failed"),
                allowNull: false,
            },
            paid_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        // * Drop the 'payment_method' table
        await queryInterface.dropTable("payment_method");
    },
};