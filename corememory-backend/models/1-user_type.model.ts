"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface User_TypeAttributes {
	user_type_id: number;
	user_type: string;
}

export default (sequelize: Sequelize) => {
	class User_Type
		extends Model<User_TypeAttributes>
		implements User_TypeAttributes
	{
		public user_type_id!: number;
		public user_type!: string;

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models: any) {
			User_Type.hasMany(models.User, {
				foreignKey: "user_type_id",
				as: "user",
			});
		}
	}

	User_Type.init(
		{
			user_type_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			user_type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "User_Type",
			tableName: "user_types",
			timestamps: false,
            underscored: true, // Use snake_case for column names in the database
		}
	);

	return User_Type;
};
