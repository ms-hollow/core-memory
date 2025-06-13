"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("coupon", {
            coupon_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            coupon_code: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            discount_value: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            valid_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            expiration_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        // * Drop the 'coupon' table
        await queryInterface.dropTable("coupon");
    },
};