"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface Membership_TypesAttributes {
	membership_type_id: number;
	membership_type: string;
}

export default (sequelize: Sequelize) => {
	class Membership_Type
		extends Model<Membership_TypesAttributes>
		implements Membership_TypesAttributes
	{
		public membership_type_id!: number;
		public membership_type!: string;

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models: any) {
			Membership_Type.hasMany(models.User, {
			    foreignKey: "membership_type_id",
			    as: "memberships",
			});
		}
	}

	Membership_Type.init(
		{
			membership_type_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			membership_type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Membership_Type",
			tableName: "membership_types",
			timestamps: false,
			underscored: true, // Use snake_case for column names in the database
		}
	);

	return Membership_Type;
};
