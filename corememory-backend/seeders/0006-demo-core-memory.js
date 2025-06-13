"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "core_memory",
            [
                {
                    core_memory_id: 1,
                    user_id: 1,
                    attach_item: "sample.jpg",
                    type: "file",
                    title: "Joy",
                    description: "A joyful product",
                    generated_qr_code:
                        "https://i.imgflip.com/707bul.png?a484752",
                },
            ],
            {}
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("core_memory", null, {});
    },
};
