import fs from 'fs';
import config from './config.js';
import Sequelize from 'sequelize';
import Logger from '../utils/logger.js';

class Database { // gerencia conexao com o banco de dados e o carregamento dos models usando sequelize
	constructor() {
		this.models = {};
		this.databaseOptions = {
			dialect: config.dialect,
			host: config.host,
			port: config.port || 5432,
			username: config.username,
			password: config.password,
			database: config.database,
			define: config.define,
			dialectOptions: config.dialectOptions,
			timezone: config.timezone,
			logging: false, // pra evitar que fique registrando as queries sql no console
			minifyAliases: true,
			query: {
				raw: true
			},
			replication: {
				read: config.database.read,
				write: config.database.master
			}
		};

		this._instance = new Sequelize(
			this.databaseOptions.database,
			this.databaseOptions.username,
			this.databaseOptions.password,
			this.databaseOptions);
	}

	_loadModels() {
		const modelDir = `${__dirname}/../models`;
		console.log(`Loading models from directory: ${modelDir}`);

		fs.readdirSync(modelDir, { withFileTypes: true })
			.filter(entry =>
				fs.statSync(`${modelDir}/${entry.name}`).isFile() &&
				entry.name.endsWith('.js') &&
				entry.name !== 'index.js' // Excluir index.js
			)
			.map(entry => `${modelDir}/${entry.name}`)
			.forEach(filePath => {
				try {
					console.log(`Loading model from ${filePath}`);
					const Model = require(filePath).default;

					if (!Model) {
						console.error(`Model not found in ${filePath}`);
						return;
					}

					console.log(`Loaded model: ${Model.name}`);

					if (Model.name === "BaseModel") {
						console.log(`Skipping BaseModel`);
						return;
					}

					this.models[Model.name] = Model.init(this._instance);

					if (this.models[Model.name]) {
						console.log(`Model initialized: ${Model.name}`);
					} else {
						console.error(`Failed to initialize model: ${Model.name}`);
					}
				} catch (error) {
					console.error(`Error loading model from ${filePath}: ${error}`);
				}
			});
	}




	_instantiateModels() {
		console.log(JSON.stringify(this.models, null, 2));
		Object.values(this.models)
			.filter(model => typeof model.associate === "function")
			.forEach(model => {
				model.models = this.models;
				model.sequelize = this._instance;
				try {
					console.log(`Associating model: ${model.name}`);
					model.associate(this.models);
				} catch (error) {
					console.error(`Error while associating model ${model.name}: ${error}`);
				}
			});
	}



	_authenticate() {
		return this._instance
			.authenticate()
			.then(() => Logger.success("Database is connected"))
			.catch((error) => {
				Logger.error(`Database connection error: ${error}`);
				throw error;
			});
	}

	disconnect() {
		return this._instance
			.close()
			.then(() => Logger.success("Database is disconnected"))
			.catch((error) =>
				Logger.error(`Database disconnection error: ${error}`)
			);
	}

	connect() {
		this._loadModels();
		this._instantiateModels();

		return this._authenticate();
	}
}

export default Database;
