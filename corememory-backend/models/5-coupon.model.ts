"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface CouponAttributes {
	coupon_id: number;
	coupon_code: string;
	discount_value: number;
	created_at: Date;
	valid_date: Date;
	expiration_date: Date;
}

export default (sequelize: Sequelize) => {
	class Coupon extends Model<CouponAttributes> implements CouponAttributes {
		public coupon_id!: number;
		public coupon_code!: string;
		public discount_value!: number;
		public created_at!: Date;
		public valid_date!: Date;
		public expiration_date!: Date;

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models: any) {
            Coupon.hasOne(models.Order_Detail, {
                foreignKey: "coupon_id",
                as: "order_detail",
            });
		}
	}

    Coupon.init(
        {
            coupon_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            coupon_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            discount_value: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            valid_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            expiration_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Coupon",
            tableName: "coupon",
            timestamps: false,
            underscored: true, // Use snake_case for column names in the database
        }
    );

    return Coupon;
};
