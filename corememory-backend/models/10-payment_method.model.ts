"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface PaymentMethodAttributes {
	payment_method_id: number;
	payment_type: string;
	reference_number: string;
    payment_status: string;
    paid_at: Date;
}

export default (sequelize: Sequelize) => {
	class Payment_Method
		extends Model<PaymentMethodAttributes>
		implements PaymentMethodAttributes
	{
		public payment_method_id!: number;
		public payment_type!: string;
		public reference_number!: string;
        public payment_status!: string;
        public paid_at!: Date;

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models: any) {
            Payment_Method.hasMany(models.Checkout, {
                foreignKey: "payment_method_id",
                as: "checkout",
                onDelete: "CASCADE",
            });
        }
	}

	Payment_Method.init(
		{
			payment_method_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			payment_type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			reference_number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
            payment_status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            paid_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
		},
		{
			sequelize,
			modelName: "Payment_Method",
			tableName: "payment_method",
			timestamps: false,
			underscored: true, // Use snake_case for column names in the database
		}
	);

    return Payment_Method;
};
