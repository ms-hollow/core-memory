"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface OrderDetailAttributes {
    order_detail_id: number
    user_id: number;
    product_id: number;
    coupon_id: number;
    core_memory_id: number;
    variant: string;
    quantity: number;
    discount_value: number;
    price_at_purchase: number;
}

export default (sequelize: Sequelize) => {
    class Order_Detail
        extends Model<OrderDetailAttributes>
        implements OrderDetailAttributes
    {
        public order_detail_id!: number;
        public user_id!: number;
        public product_id!: number;
        public coupon_id!: number;
        public core_memory_id!: number;
        public variant!: string;
        public quantity!: number;
        public discount_value!: number;
        public price_at_purchase!: number;

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            Order_Detail.hasMany(models.Rating, {
                foreignKey: "order_detail_id",
                as: "rating",
            });
            Order_Detail.hasMany(models.Cart_Item, {
                foreignKey: "order_detail_id",
                as: "cart_item",
            });
            Order_Detail.hasMany(models.Order, {
                foreignKey: "order_detail_id",
                as: "order",
            })

            Order_Detail.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "user",
            });
            Order_Detail.belongsTo(models.Product, {
                foreignKey: "product_id",
                as: "product",
            });
            Order_Detail.belongsTo(models.Coupon, {
                foreignKey: "coupon_id",
                as: "coupon",
            });
            Order_Detail.belongsTo(models.Core_Memory, {
                foreignKey: "core_memory_id",
                as: "core_memory",
            });
        }
    }

    Order_Detail.init(
        {
            order_detail_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            coupon_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            core_memory_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            variant: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            discount_value: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            price_at_purchase: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Order_Detail",
            tableName: "order_detail",
            timestamps: false,
            underscored: true, // Use snake_case for column names in the database
        }
    );

    return Order_Detail;
}