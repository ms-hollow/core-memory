const dotenv = require("dotenv");
dotenv.config();

function parseDbUrl(dbUrl) {
    if (!dbUrl) throw new Error("Database URL is not defined");

    const regex = /^(?<dialect>.+):\/\/(?<user>[^:]+):(?<password>[^@]+)@(?<host>[^:\/]+)(?::(?<port>\d+))?\/(?<database>.+)$/;
	const match = dbUrl.match(regex);

	if (dbUrl === undefined || dbUrl === null) {
		throw new Error("Database URL is not defined");
	}
	if (!match || !match.groups) {
		throw new Error(
			"Invalid database URL format, you need to provide a valid database URL. ex: mysql://user:password@host:port/database_name"
		);
	}

	return {
		DB_DIALECT: match.groups.dialect,
		DB_USER: match.groups.user,
		DB_PASSWORD: match.groups.password,
		DB_HOST: match.groups.host,
		DB_PORT: match.groups.port || "3306", // Default MySQL port
		DB_NAME: match.groups.database,
	};
}

if (process.env.NODE_ENV === undefined) throw new Error("NODE_ENV is not defined");
const db_url = process.env[`${(process.env.NODE_ENV || "").toUpperCase()}_DB_URL`]
const parsedDbUrl = parseDbUrl(db_url);

module.exports = {
	development: {
		username: parsedDbUrl.DB_USER,
		password: parsedDbUrl.DB_PASSWORD,
		database: parsedDbUrl.DB_NAME,
		host: parsedDbUrl.DB_HOST,
		dialect: parsedDbUrl.DB_DIALECT,
	},
	test: {
		username: parsedDbUrl.DB_USER,
		password: parsedDbUrl.DB_PASSWORD,
		database: parsedDbUrl.DB_NAME,
		host: parsedDbUrl.DB_HOST,
		dialect: parsedDbUrl.DB_DIALECT,
	},
	production: {
		username: parsedDbUrl.DB_USER,
		password: parsedDbUrl.DB_PASSWORD,
		database: parsedDbUrl.DB_NAME,
		host: parsedDbUrl.DB_HOST,
		dialect: parsedDbUrl.DB_DIALECT,
	},
};
