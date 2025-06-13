"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

interface Core_MemoryAttributes {
    core_memory_id: number;
    user_id: number;
    attach_item: string;
    type: string;
    title: string;
    description: string;
    generated_qr_code: string;
}

export default (sequelize: Sequelize) => {
    class Core_Memory
        extends Model<Core_MemoryAttributes>
        implements Core_MemoryAttributes
    {
        public core_memory_id!: number;
        public user_id!: number;
        public attach_item!: string;
        public type!: string;
        public title!: string;
        public description!: string;
        public generated_qr_code!: string;

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            Core_Memory.hasOne(models.Order_Detail, {
                foreignKey: "core_memory_id",
                as: "order_details",
            });
            Core_Memory.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "user",
            });
        }
    }

    Core_Memory.init(
        {
            core_memory_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            attach_item: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM("file", "link"),
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            generated_qr_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Core_Memory",
            tableName: "core_memory",
            timestamps: false,
            underscored: true, // Use snake_case for column names in the database
        }
    );

    return Core_Memory;
};
