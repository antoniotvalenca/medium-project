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

        this.router.put(
            "/:userid",
            auth,
            this.validateSchema(UserSchema.update),
            this.userController.update.bind(this.userController)
        );

        this.router.delete(
            "/:userid",
            auth,
            this.userController.remove.bind(this.userController)
        );

        return this.router;
    }
}
