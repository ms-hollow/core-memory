"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface OrderAttributes {
	order_id: number;
	user_id: number;
    order_detail_id: number;
    payment_method_id: number;
    full_name: string;
    full_address: string;
    contact_number: string;
    expected_delivery_start: Date;
    expected_delivery_end: Date;
    order_date: Date;
    order_reference_id: string;
    total_amount: number;
	proof_of_delivery: string;
    status: string;
    date_time: JSON;
    message_code: JSON;
    shipping_fee: number;
    vat: number;
}

export default (sequelize: Sequelize) => {
	class Order extends Model<OrderAttributes> implements OrderAttributes {
		public order_id!: number;
		public user_id!: number;
        public order_detail_id!: number;
        public payment_method_id!: number;
        public full_name!: string;
        public full_address!: string;
        public contact_number!: string;
        public expected_delivery_start!: Date;
        public expected_delivery_end!: Date;
        public order_date!: Date;
		public order_reference_id!: string;
        public total_amount!: number;
		public proof_of_delivery!: string;
        public status!: string;
        public date_time!: JSON;
        public message_code!: JSON;
        public shipping_fee!: number;
        public vat!: number;

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models: any) {
            Order.hasMany(models.Order_Detail, {
                foreignKey: "order_id",
                as: "order_detail",
            });
            Order.hasMany(models.Checkout, {
                foreignKey: "order_id",
                as: "checkout",
            });

			Order.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "user",
            });
            Order.belongsTo(models.Process_Order, {
                foreignKey: "process_order_id",
                as: "process_order",
            });
            Order.belongsTo(models.Deliver_Order, {
                foreignKey: "deliver_order_id",
                as: "deliver_order",
            });
		}
	}

	Order.init(
		{
			order_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            order_detail_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            payment_method_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            full_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            full_address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            contact_number: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expected_delivery_start: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            expected_delivery_end: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            order_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            order_reference_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            total_amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            proof_of_delivery: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            date_time: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            message_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            shipping_fee: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            vat: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
		},
		{
			sequelize,
			modelName: "Order",
			tableName: "order",
			timestamps: false,
			underscored: true, // Use snake_case for column names in the database
		}
	);

	return Order;
};
