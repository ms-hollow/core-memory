"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "payment_method",
            [
                {
                    payment_method_id: 1,
                    payment_type: "Credit Card",
                    reference_number: "CC123456789",
                    payment_status: "completed",
                    paid_at: new Date(),
                },
                {
                    payment_method_id: 2,
                    payment_type: "PayPal",
                    reference_number: "PP987654321",
                    payment_status: "pending",
                    paid_at: new Date(),
                },
                {
                    payment_method_id: 3,
                    payment_type: "Bank Transfer",
                    reference_number: "BT123456789",
                    payment_status: "failed",
                    paid_at: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("payment_method", null, {});
    },
};