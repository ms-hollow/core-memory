"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("rating", {
            rating_id: {
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
            order_detail_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: { tableName: "order_detail" },
                    key: "order_detail_id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            rating_value: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            comment: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },
    async down(queryInterface, Sequelize) {
        // * Get all foreign key constraints for the 'rating' table
        const foreignKeys = await queryInterface.getForeignKeyReferencesForTable("rating");

        // * Remove all foreign key constraints from the 'rating' table
        // Loop through each foreign key constraint and remove it
        for (const foreignKey of foreignKeys) {
            await queryInterface.removeConstraint("rating", foreignKey.constraintName);
        }

        // * Drop the 'rating' table
        await queryInterface.dropTable("rating");
    },
}