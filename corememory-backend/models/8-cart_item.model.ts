"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface CartItemAttributes {
    cart_item_id: number;
    order_detail_id: number;
    create_at: Date;
}

export default (sequelize: Sequelize) => {
    class Cart_Item
        extends Model<CartItemAttributes>
        implements CartItemAttributes
    {
        public cart_item_id!: number;
        public order_detail_id!: number;
        public create_at!: Date;

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            Cart_Item.belongsTo(models.Order_Detail, {
                foreignKey: "order_detail_id",
                as: "order_detail",
                onDelete: "CASCADE",
            });
        }
    }

    Cart_Item.init(
        {
            cart_item_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            order_detail_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            create_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Cart_Item",
            tableName: "cart_item",
            timestamps: false,
        }
    );

    return Cart_Item

}