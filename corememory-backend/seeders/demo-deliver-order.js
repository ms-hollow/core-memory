"use struct";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "deliver_order",
            [
                {
                    deliver_order_id: 1,
                    delivered_at: new Date(),
                    status: "pending",
                },
            ],
            {}
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("deliver_order", null, {});
    },
};