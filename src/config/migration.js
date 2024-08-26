const config = require("./config.js");

const json = {
	dialect: config.dialect,
	host: config.host,
	username: config.username,
	database: config.database,
	password: config.password,
	port: config.port
};

module.exports = {
	test: json,
	production: json,
	development: json
};
