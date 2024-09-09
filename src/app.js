import http from "http";
import express from 'express';
import Database from "../src/config/databases";
import { UserRoutes, PostRoutes } from "./routes/index.js";
import Routes from "./config/routes.js"

class App {
    constructor() {
        this.app = express();
		this.port = process.env.PORT || "3000";
        this.middlewares();
		this.httpServer = http.createServer(this.app);

		this.databaseModule = new Database();
    }

    middlewares() {
        this.app.use(express.json());
		this.app.use((req, res, next) => {
            console.log(`Received ${req.method} request for ${req.url}`);
            next();
        });
    }

	async initializeModules () {
		return Promise.all([this.databaseModule.connect()]);
	}

	async setup () {
		const routes = new Routes();

		this.app.use(express.json());
		this.app.use(routes.setup());
	}

    // routes() {
    //     const userRoutes = new UserRoutes();
    //     const postRoutes = new PostRoutes();

    //     this.app.use('/user', userRoutes.setup());
    //     this.app.use('/post', postRoutes.setup());
    // }

	gracefulStop() {
		return () => {
			this.httpServer.close(async (error) => {
				await Promise.all([this.databaseModule.disconnect()]);

				return error ? process.exit(1) : process.exit(0);
			});
		};
	}

    async start() {
		await this.initializeModules();
		this.setup();

        this.httpServer.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });

		process.on("SIGINT", () => this.gracefulStop());
    }
};

export default App;
