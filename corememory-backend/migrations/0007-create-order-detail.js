"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("order_detail", {
            order_detail_id: {
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
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: { tableName: "product" },
                    key: "product_id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            coupon_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: { tableName: "coupon" },
                    key: "coupon_id",
                },
                onDelete: "SET NULL",
                onUpdate: "CASCADE",
            },
            core_memory_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: { tableName: "core_memory" },
                    key: "core_memory_id",
                },
                onDelete: "SET NULL",
                onUpdate: "CASCADE",
            },
            variant: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            discount_value: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            price_at_purchase: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        // * Get all foreign key constraints for the 'order_detail' table
		const foreignKeys = await queryInterface.getForeignKeyReferencesForTable("order_detail");

		// * Remove the foreign key constraints from the 'order_detail' table
		// Loop through each foreign key and remove it
        for (const fk of foreignKeys) {
            await queryInterface.removeConstraint("order_detail", fk.constraintName); // remove the foreign key constraint
        }

        // * Drop the 'order_detail' table
        await queryInterface.dropTable("order_detail");
    },
}