import { Post, Like } from "../models";

class PostService {

	async getPostById(post_id) {
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
	}


	async getAllPosts() {
			return await Post.findAll({
				where: { is_deleted: false }
			});
	}

	async createPost (post) {
			return await Post.create(post);
	}

	async deletePost(data) {
			const post = await Post.findOne({
				where: data
			});

			if (!post) {
				return null;
			}

			await post.update({ is_deleted: true });

			return true;
	}


	async likePost(like) {
		const transaction = await sequelize.transaction();

            const isPostLiked = await Like.findOne({ where: like },{ transaction });

			if (isPostLiked) {
				await transaction.rollback();
				return null;
			}
            await Like.create(like, { transaction });
            await Post.increment('likes', { by: 1, where: { id: like.post_id }, transaction });
			await transaction.commit();
    }

    async dislikePost(post_id, user_id) {
        const transaction = await Like.sequelize.transaction();

            const postLike = await Like.findOne({
                where: { post_id, user_id },
                transaction
            });

            if (!postLike) {
                throw new Error('O usuário não curtiu este post.');
            }

            await postLike.destroy({ transaction });

            await Post.decrement('likes', { by: 1, where: { id: post_id }, transaction });

            await transaction.commit();
    }
};

export default PostService;
