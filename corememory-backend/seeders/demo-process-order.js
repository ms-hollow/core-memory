"use struct";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "process_order",
            [
                {
                    process_order_id: 1,
                    processed_at: new Date(),
                    status: "pending",
                },
            ],
            {}
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("process_order", null, {});
    },
};