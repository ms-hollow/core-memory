"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface ProcessOrderAttributes {
	process_order_id: number;
	processed_at: Date;
	status: string;
}

export default (sequelize: Sequelize) => {
	class Process_Order
		extends Model<ProcessOrderAttributes>
		implements ProcessOrderAttributes
	{
		public process_order_id!: number;
		public processed_at!: Date;
		public status!: string;

        /**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
        static associate(models: any) {
            Process_Order.hasOne(models.Order, {
                foreignKey: "process_order_id",
                as: "order",
            });
        }
	}

    Process_Order.init(
        {
            process_order_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            processed_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("not started", "pending", "completed", "canceled"),
                allowNull: false,
                defaultValue: "pending",
            },
        },
        {
            sequelize,
            modelName: "Process_Order",
            tableName: "process_order",
            timestamps: false,
            underscored: true, // Use snake_case for column names in the database
        }
    );

    return Process_Order;
};
