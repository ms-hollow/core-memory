"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "order_detail",
            [
                {
                    order_detail_id: 1,
                    user_id: 1,
                    product_id: 1,
                    coupon_id: 1,
                    core_memory_id: 1,
                    variant: "joy",
                    quantity: 2,
                    discount_value: 0.0,
                    price_at_purchase: 100.0,
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("order_detail", null, {});
    },
};