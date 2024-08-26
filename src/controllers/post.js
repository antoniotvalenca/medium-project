import { PostService } from "@services";

class PostController {
	constructor() {
		this.PostService = new PostService();
	}

	async getById (req, res) {
		try {
			const post_id = req.params.id;
			const post = await this.PostService.getPostById(post_id);

			if (!post) return res.status(404).json({ message: "Nenhum post foi achado."})

			return res.json(post)
		} catch (e) {
			return res.status(500).json({ message: "erro achar post: ", e })
		}
	}

	async getAll (req, res) {
		try {
            const posts = await this.PostService.getAllPosts();

			if (!posts || posts.length === 0) {
                return res.status(404).json({ message: "No posts found" });
            }

            return res.json(posts);
		} catch (e) {
			return res.status(500).json({ message: "erro ao listar posts: ", e })
		}
	}

	async create (req, res) {
		try {
			const title = req.body.title;
			const text = req.body.text;
			const user_id = req.user_id

			if (!user_id) return res.status(403).json({ message: "Você não está logado."})

			const new_post = await this.PostService.createPost(title, text, user_id);

			return res.status(201).json(new_post);
		} catch (e) {
			return res.status(500).json({ message: "erro ao criar posts: ", e })
		}
	}

	async delete (req, res) {
		try {
			const user_id = req.user_id
			const post_id = req.params.id;
			const deleted = await this.PostService.deletePost(post_id, user_id);

			if (!deleted) {
                return res.status(404).json({ message: "Post não encontrado." });
            }

			return res.json({ message: `Post ${post_id} deletado com sucesso.` });
		} catch (e) {
			return res.status(500).json({ message: "erro ao deletar post: ", e })
		}
	}

	async like(req, res) {
		try {

			const post_id = req.params.id;
			const user_id = req.user_id;

			await this.PostService.likePost(post_id, user_id);

			return res.json({ message: `Post "${post_id}" foi curtido`});
		} catch (error) {
			return res.status(500).json({ message: "erro ao dar like em post: ", e })
		}
	}

	async dislike(req, res) {
		try {
			const post_id = req.params.id;
			const user_id = req.user_id;

			await this.PostService.dislikePost(post_id, user_id);

			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}
};

export default PostController;
