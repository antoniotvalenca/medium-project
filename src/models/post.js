import Sequelize, { Model } from "sequelize";

class Post extends Model {
	static init(sequelize) {
		super.init({
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},

			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				  },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},

			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			text: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			likes: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			}
		}, {
			sequelize,
			timestamps: true,
			updatedAt: "updated_at",
			createdAt: "created_at",
			deletedAt: "deleted_at",
		});
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: "user_id" })
	}
};

export default Post;
