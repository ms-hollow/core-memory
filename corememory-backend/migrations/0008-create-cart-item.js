"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("cart_item", {
            cart_item_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            order_detail_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "order_detail",
                    key: "order_detail_id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            create_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        // * Get all foreign key constraints for the 'cart_item' table
        const foreignKeys = await queryInterface.getForeignKeyReferencesForTable("cart_item");

        // * Remove all foreign key constraints from the 'cart_item' table
        // Loop through each foreign key constraint and remove it
        for (const foreignKey of foreignKeys) {
            await queryInterface.removeConstraint("cart_item", foreignKey.constraintName);
        }

        // * Drop the 'cart_item' table
        await queryInterface.dropTable("cart_item");
    },
}
