"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface RatingAttributes {
    rating_id: number;
    user_id: number;
    order_detail_id: number;
    product_id: number;
    rating_value: number;
    comment: string;
    created_at: Date;
}

export default (sequelize: Sequelize) => {
    class Rating
        extends Model<RatingAttributes>
        implements RatingAttributes
    {
        public rating_id!: number;
        public user_id!: number;
        public order_detail_id!: number;
        public product_id!: number;
        public rating_value!: number;
        public comment!: string;
        public created_at!: Date;

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            Rating.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "user",
                onDelete: "CASCADE",
            });
            Rating.belongsTo(models.Order_Detail, {
                foreignKey: "order_detail_id",
                as: "order_detail",
                onDelete: "CASCADE",
            });
            Rating.belongsTo(models.Product, {
                foreignKey: "product_id",
                as: "product",
                onDelete: "CASCADE",
            });
        }
    }
    
    Rating.init(
        {
            rating_id: {
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
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            rating_value: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Rating",
            tableName: "rating",
            timestamps: false,
        }
    );

    return Rating;
}