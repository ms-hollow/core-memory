"use strict";

import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";

interface Config {
  use_env_variable?: string;
  database: string;
  username: string;
  password: string;
  [key: string]: any;
}

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config: Config = require(__dirname + "/../config/config.js")[env];
const db: { [key: string]: any } = {};

let sequelize: Sequelize;
// console.log(config)
if (process.env.NODE_ENV === undefined) {
  throw new Error("NODE_ENV not set");
} else if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const modelFiles = fs.readdirSync(__dirname)
  .filter((file) => file.endsWith(".ts") && file !== basename && !file.startsWith("."));

// Load models first
modelFiles.forEach(async (file) => {
  const modelModule = await import(path.join(__dirname, file));
  const model = modelModule.default || modelModule; // Handle ES6 & CommonJS
  if (typeof model === "function") {
    const initializedModel = model(sequelize, DataTypes);
    db[initializedModel.name] = initializedModel;
  } else {
    console.warn(`The file ${file} does not export a valid model function.`);
  }
});

// Call associate() after all models are initialized
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
