"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface DeliverOrderAttributes {
    deliver_order_id: number;
    delivered_at: Date;
    status: string;
}

export default (sequelize: Sequelize) => {
    class Deliver_Order
        extends Model<DeliverOrderAttributes>
        implements DeliverOrderAttributes
    {
        public deliver_order_id!: number;
        public delivered_at!: Date;
        public status!: string;

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            Deliver_Order.hasOne(models.Order, {
                foreignKey: "order_id",
                as: "order",
            });
        }
    }

    Deliver_Order.init(
        {
            deliver_order_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            delivered_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("not started", "pending", "completed", "cancelled"),
                allowNull: false,
                defaultValue: "pending",
            },
        },
        {
            sequelize,
            modelName: "Deliver_Order",
            tableName: "deliver_order",
            timestamps: false,
            underscored: true, // Use snake_case for column names in the database
        }
    );

    return Deliver_Order;
}

