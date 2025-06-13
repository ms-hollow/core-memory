"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("product", {
            product_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            product_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            product_image: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            variant: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            stock_quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            price: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        // * Drop the 'product' table
        await queryInterface.dropTable("product");
    },
};
