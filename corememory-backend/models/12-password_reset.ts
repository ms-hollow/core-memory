"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

export interface PasswordResetAttributes {
	password_reset_id: number;
	user_id: number;
	reset_code: string;
	expires_at: Date;
	used: boolean;
}

export default (sequelize: Sequelize) => {
	class Password_Reset
		extends Model<PasswordResetAttributes>
		implements PasswordResetAttributes
	{
        public password_reset_id!: number;
        public user_id!: number;
        public reset_code!: string;
        public expires_at!: Date;
        public used!: boolean;

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models: any) {
			Password_Reset.hasMany(models.User, {
				foreignKey: "membership_type_id",
				as: "memberships",
			});
		}
	}

	Password_Reset.init(
		{
            password_reset_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            reset_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expires_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            used: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: "Password_Reset",
            tableName: "password_reset",
            timestamps: true,
            underscored: true, // Use snake_case for column names in the database
		},
	);

	return Password_Reset;
};
