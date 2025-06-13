"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface ProductAttributes {
    product_id: number;
    product_name: string;
    product_image: string;
    description: string;
    variant: JSON;
    stock_quantity: number;
    price: number;
}

export default (sequelize: Sequelize) => {
    class Product
        extends Model<ProductAttributes>
        implements ProductAttributes
    {
        public product_id!: number;
        public product_name!: string;
        public product_image!: string;
        public description!: string;
        public variant!: JSON;
        public stock_quantity!: number;
        public price!: number;

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            Product.hasMany(models.Order_Detail, {
                foreignKey: "product_id",
                as: "order_detail",
            });
            Product.hasMany(models.Rating, {
                foreignKey: "product_id",
                as: "rating",
            });
        }
    }

    Product.init(
        {
            product_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            product_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            product_image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            variant: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            stock_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Product",
            tableName: "product",
            timestamps: false,
            underscored: true, // Use snake_case for column names in the database
        }
    );

    return Product;
};
