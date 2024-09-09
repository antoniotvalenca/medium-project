import BaseRoutes from "./base.js";
import auth from '../middlewares/auth.js';
import { PostSchema } from "../schemas/index.js";
import { PostController } from "../controllers/index.js";

export default class PostRoutes extends BaseRoutes {
    constructor() {
        super();
        this.postController = new PostController();
    }

    setup() {
        this.router.post(
            "/create",
            auth,
            this.validateSchema(PostSchema.create),
            this.postController.create.bind(this.postController)
        );

        this.router.post(
            "/:id/like",
            auth,
            this.postController.like.bind(this.postController)
        );

        this.router.post(
            "/:id/dislike",
            auth,
            this.postController.dislike.bind(this.postController)
        );

        this.router.get(
            "/",
            this.postController.getAll.bind(this.postController)
        );

        this.router.get(
            "/:id",
            this.postController.getById.bind(this.postController)
        );

        return this.router;
    }
}
