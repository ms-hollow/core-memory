"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "order",
            [
                {
                    order_id: 1,
                    user_id: 1,
                    order_detail_id: 1,
                    payment_method_id: 1,
                    full_name: "John Doe",
                    full_address: "123 Main St, Springfield, USA",
                    contact_number: "123-456-7890",
                    expected_delivery_start: new Date(
                        new Date().setDate(new Date().getDate() + 1)
                    ), // 1 day from now
                    expected_delivery_end: new Date(
                        new Date().setDate(new Date().getDate() + 7)
                    ), // 7 days from now
                    order_date: new Date(),
                    order_reference_id: "ORD000001",
                    total_amount: 200.0,
                    proof_of_delivery: "temp_proof_1.jpg",
                    status: "Order Placed",
                    date_time: JSON.stringify([
                        new Date(),
                        new Date(),
                        new Date(),
                        new Date(),
                        new Date(),
                    ]), // Serialize to JSON
                    message_code: "D5", // Serialize to JSON //code: "OP1, SO2, IT3, OfD4, D5"
                    shipping_fee: 0.0,
                    vat: 12,
                },
            ],
            {}
        );

        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("order", null, {});
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
