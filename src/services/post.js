import { Post, Like } from "../models";

class PostService {

	async getPostById (post_id) {
        try {
            const post = await Post.findByPk(post_id);

            if (!post) {
                return null;
            }

            return post;
        } catch (e) {
            throw new Error(`Erro ao buscar o post: ${e.message}`);
        }
    };

	async getAllPosts () {
        try {
            const posts = await Post.findAll();

            if (!posts || posts.length === 0) {
                return [];
            }

            return posts;
        } catch (e) {
            throw new Error(`Erro ao buscar os posts: ${e.message}`);
        }
    }

	async createPost (title, text, user_id) {
        const transaction = await Post.sequelize.transaction();

        try {
			const post = await Post.create({
				title: title,
				text: text,
				user_id: user_id
			}, { transaction });

			await transaction.commit();
			return post;
        } catch (e) {
            await transaction.rollback()
            throw new Error(`Erro ao criar post: ${e.message}`);
        };
	}

    async deletePost(post_id, user_id) {
        const transaction = await Post.sequelize.transaction();

        try {
			const post = await Post.findOne({
                where: { id: post_id, user_id: user_id },
                transaction
            });

            if (!post) {
                return null;
            }

			await post.destroy({ transaction });
            await transaction.commit();

            return true;
        } catch (e) {
            await transaction.rollback();
            throw new Error(`Erro ao deletar post: ${e.message}`);
        }
    }

	async likePost(post_id, user_id) {
        const transaction = await Like.sequelize.transaction();

        try {
            const isPostLiked = await Like.findOne({
                where: { post_id, user_id },
                transaction
            });

            if (isPostLiked) {
                await this.dislikePost(post_id, user_id);
            } else {
                await Like.create({ post_id, user_id }, { transaction });

                await Post.increment('likes', { by: 1, where: { id: post_id }, transaction });
            }

            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw new Error(`Erro ao curtir/descurtir post: ${e.message}`);
        }
    }

    async dislikePost(post_id, user_id) {
        const transaction = await Like.sequelize.transaction();

        try {
            const isPostLiked = await Like.findOne({
                where: { post_id, user_id },
                transaction
            });

            if (!isPostLiked) {
                throw new Error('O usuário não curtiu este post.');
            }

            await isPostLiked.destroy({ transaction });

            await Post.decrement('likes', { by: 1, where: { id: post_id }, transaction });

            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw new Error(`Erro ao remover like do post: ${e.message}`);
        }
    }
};

export default PostService;
