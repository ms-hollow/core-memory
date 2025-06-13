"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("order", {
            order_id: {
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
            payment_method_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: { tableName: "payment_method" },
                    key: "payment_method_id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            full_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            full_address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            contact_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            expected_delivery_start: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            expected_delivery_end: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            order_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            order_reference_id: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            total_amount: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            proof_of_delivery: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM(
                    "Order Placed",
                    "Shipped Out",
                    "In-Transit",
                    "Out for Delivery",
                    "Delivered"
                ), // TODO: add more status
                allowNull: false,
                defaultValue: "Order Placed",
            },
            date_time: {
                type: Sequelize.JSON, // JSON type to store date and time of shipping information
                allowNull: false,
            },
            message_code: {
                type: Sequelize.ENUM("OP1", "SO2", "IT3", "OD4", "D5"), // Equivalent status code: OP1 = Order Placed | SO2 = Shipped Out | IT3 = In-Transit | OD4 = Out for Delivery | D5 = Delivered
                allowNull: false,
            },
            shipping_fee: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            vat: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        // * Get the list of foreign key constraints for the 'order' table
        const foreignKeys =
            await queryInterface.getForeignKeyReferencesForTable("order");

        // * Remove the foreign key constraints from the 'order' table
        // Loop through each foreign key and remove it
        for (const fk of foreignKeys) {
            await queryInterface.removeConstraint("order", fk.constraintName); // remove the foreign key constraint
        }

        // *  Drop the 'order' table
        await queryInterface.dropTable("order");
    },
};
