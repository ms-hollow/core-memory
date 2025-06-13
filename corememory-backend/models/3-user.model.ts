"use strict";
import bcrypt from "bcrypt";
import { DataTypes, Model, Sequelize } from "sequelize";

interface UserAttributes {
	user_id: number;
	email: string;
	username: string;
	password: string;
	first_name: string;
	last_name: string;
	address: string;
	city: string;
	region: string;
	postal_code: string;
	contact_number: string;
	birth_date: Date;
    profile_picture?: string;
	user_type_id: number;
	membership_type_id: number;
}

module.exports = (sequelize: Sequelize) => {
	class User extends Model<UserAttributes> implements UserAttributes {
		public user_id!: number;
		public email!: string;
		public username!: string;
		public password!: string;
		public first_name!: string;
		public last_name!: string;
		public address!: string;
		public city!: string;
		public region!: string;
		public postal_code!: string;
		public contact_number!: string;
		public birth_date!: Date;
        public profile_picture?: string;
		public user_type_id!: number;
		public membership_type_id!: number;

		/**
		 * Helper method for defining associations.
		 */
		static associate(models: any) {
			// Define associations for User model
			User.belongsTo(models.User_Type, {
				foreignKey: "user_type_id",
				as: "user_type",
			});
			User.belongsTo(models.Membership_Type, {
				foreignKey: "membership_type_id",
				as: "membership_type",
			});

			User.hasMany(models.Order, {
				foreignKey: "user_id",
				as: "order",
			});
            User.hasMany(models.Rating, {
                foreignKey: "user_id",
                as: "rating",
            });
            User.hasMany(models.Order_Detail, {
                foreignKey: "user_id",
                as: "order_detail",
            })
		}

		/**
		 * Method to check password validity
		 */
		async isValidPassword(password: string): Promise<boolean> {
			return bcrypt.compare(password, this.password);
		}
	}

	User.init(
		{
			user_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			city: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			region: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			postal_code: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			contact_number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			birth_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
            profile_picture: {
                type: DataTypes.STRING,
                allowNull: true,
            },
			user_type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "user_types",
					key: "user_type_id",
				},
			},
			membership_type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "membership_types",
					key: "membership_type_id",
				},
			},
		},
		{
			sequelize,
			modelName: "User",
			tableName: "user",
			timestamps: true,
			underscored: true,
			hooks: {
				//? Hash password before saving
				beforeCreate: async (user: User) => {
					if (user.password) {
						user.password = await bcrypt.hash(user.password, 10);
					}
				},
				//? Hash password if updated
				beforeUpdate: async (user: User) => {
                    if (user.changed("password") && user.previous("password") !== user.password) {
                      user.password = await bcrypt.hash(user.password, 10);
                    }
                },
			},
		}
	);

	return User;
};
