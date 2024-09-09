import BaseController from "./base";
import { PostService } from "@services";

class PostController extends BaseController {
	constructor() {
		super();

		this.PostService = new PostService();

		this.bindActions(["getById", "getAll", "create", "delete", "like", "dislike"]);
	}

	async getById (req, res) {
		try {
			const post_id = req.params.id;
			const post = await this.PostService.getPostById(post_id);

			if (!post) return res.status(404).json({ message: "Nenhum post foi achado."})

			this.successHandler(post, res)
		} catch (e) {
			this.errorHandler(e, req, res);
		}
	}

	async getAll (req, res) {
		try {
            const posts = await this.PostService.getAllPosts();

			if (!posts || posts.length === 0) {
                return res.status(404).json({ message: "No posts found" });
            }

			this.successHandler(posts, res)
		} catch (e) {
			this.errorHandler(e, req, res);
		}
	}

	async create (req, res) {
		try {
			const post = {
				title: req.body.title,
				text: req.body.text,
				user_id: req.user_id
			}

			if (!user_id) return res.status(403).json({ message: "Você não está logado."})

			const new_post = await this.PostService.createPost(post);

			this.successHandler(new_post, res)
		} catch (e) {
			this.errorHandler(e, req, res);
		}
	}

	async delete (req, res) {
		try {
			const data = {
				id: req.parans.id,
				user_id: req.user_id,
				is_deleted: false
			};

			const deleted = await this.PostService.deletePost(data);

			if (!deleted) {
                return res.status(404).json({ message: "Post não encontrado." });
            }

			this.successHandler(deleted, res)
		} catch (e) {
			this.errorHandler(e, req, res);
		}
	}

	async like(req, res) {
		try {
			const like = {
				post_id: req.params.id,
				user_id: req.user_id
			}

			await this.PostService.likePost(like);
			this.successHandler(true, res)
			return res.json({ message: `Post "${post_id}" foi curtido`});
		} catch (e) {
			this.errorHandler(e, req, res);
		}
	}

	async dislike(req, res) {
		try {
			const post_id = req.params.id;
			const user_id = req.user_id;

			await this.PostService.dislikePost(post_id, user_id);

			this.successHandler(true, res);
		} catch (e) {
			this.errorHandler(e, req, res);
		}
	}
};

export default PostController;
