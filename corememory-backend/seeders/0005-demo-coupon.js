"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "coupon",
            [
            {
                coupon_id: 1,
                coupon_code: "DISCOUNT10",
                discount_value: 10,
                created_at: new Date(),
                valid_date: new Date(),
                expiration_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            },
            ],
            {}
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("coupon", null, {});
    },
};