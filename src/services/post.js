import { Post, Like } from "../models";

class PostService {

	async getPostById(post_id) {
		try {
			const post = await Post.findOne({
				where: {
					id: post_id,
					is_deleted: false
				}
			});

			if (!post) {
				return null;
			}

			return post;
		} catch (e) {
			throw new Error(`Erro ao buscar o post: ${e.message}`);
		}
	}


	async getAllPosts() {
		try {
			return await Post.findAll({
				where: { is_deleted: false }
			});
		} catch (e) {
			throw new Error(`Erro ao buscar os posts: ${e.message}`);
		}
	}

	async createPost (post) {
        try {
			return await Post.create(post);
        } catch (e) {
            throw new Error(`Erro ao criar post: ${e.message}`);
        };
	}

	async deletePost(data) {
		try {
			const post = await Post.findOne({
				where: data
			});

			if (!post) {
				return null;
			}

			await post.update({ is_deleted: true });

			return true;
		} catch (e) {
			throw new Error(`Erro ao deletar post: ${e.message}`);
		}
	}


	async likePost(like) {
		const transaction = await sequelize.transaction();

        try {
            const isPostLiked = await Like.findOne({ where: like },{ transaction });

			if (isPostLiked) {
				await transaction.rollback();
				return null;
			}
            await Like.create(like, { transaction });
            await Post.increment('likes', { by: 1, where: { id: like.post_id }, transaction });
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
