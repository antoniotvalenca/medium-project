import BaseRoutes from "./base.js";
import auth from '../middlewares/auth.js';
import { UserSchema } from "../schemas/index.js";
import { UserController } from "../controllers/index.js";

export default class UserRoutes extends BaseRoutes {
    constructor() {
        super();
        this.userController = new UserController();
    }

    setup() {

		console.log("got here 1")

		this.router.get('/test', (req, res) => {
			res.send('Test route working');
		});

        this.router.post(
            "/login",
            this.validateSchema(UserSchema.login),
            this.userController.login.bind(this.userController)
        );

        this.router.post(
            "/signup",
            this.validateSchema(UserSchema.create),
            this.userController.create.bind(this.userController)
        );
		console.log("got here 2")
        this.router.put(
            "/:userid",
            auth,
            this.validateSchema(UserSchema.update),
            this.userController.update.bind(this.userController)
        );

        this.router.delete(
            "/:userid",
            auth,
            this.userController.delete.bind(this.userController)
        );

        return this.router;
    }
}
