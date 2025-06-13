"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "rating",
            [
                {
                    rating_id: 1,
                    user_id: 1,
                    product_id: 1,
                    order_detail_id: 1,
                    rating_value: 5,
                    comment: "Excellent product!",
                    created_at: new Date(),
                },
            ],
            {}
        );
    }
}