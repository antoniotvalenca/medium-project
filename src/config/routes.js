import { Router } from 'express';
import { PostRoutes, UserRoutes } from '../routes/index.js';

export default class Routes {
	constructor() {
		this.routes = new Router();

		this.userRoutes = new UserRoutes();
		this.postRoutes = new PostRoutes();
	}

	setup() {
		this.routes.use('/user', this.userRoutes.setup());
		this.routes.use('/post', this.postRoutes.setup());
		return this.routes;
	}
}


// USER
// POST http://localhost:3000/user/login
// POST http://localhost:3000/user/signup
// PUT http://localhost:3000/user/:userid (Autenticação requerida)
// DELETE http://localhost:3000/user/:userid (Autenticação requerida)

// POST
// POST http://localhost:3000/post/post/create (Autenticação requerida)
// POST http://localhost:3000/post/:id/like (Autenticação requerida)
// POST http://localhost:3000/post/:id/dislike (Autenticação requerida)
// GET http://localhost:3000/post/
// GET http://localhost:3000/post/:id
