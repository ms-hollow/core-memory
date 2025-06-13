"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "product",
            [
                {
                    product_id: 1,
                    product_name: "Core Memory Globe",
                    product_image: null,
                    description:
                        "A glowing keepsake inspired by Inside Out. Each globe reflects a core emotion and holds a meaningful memory. Scan the QR code to revisit a personal video, whether it’s a birthday, wedding, or a moment you’ll never forget.",
                    variant: JSON.stringify([
                        "Joy",
                        "Anger",
                        "Disgust",
                        "Sadness",
                        "Fear",
                    ]),
                    stock_quantity: 100,
                    price: 19.99,
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("product", null, {});
    },
};
