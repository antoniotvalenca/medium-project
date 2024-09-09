import Sequelize from 'sequelize';
import BaseModel from "./base.js";

class Like extends BaseModel {
  static load(sequelize) {
    return super.init(
      {
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        post_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        deletedAt: 'deleted_at',
      }
    );
  }

  static associate(models) {
	this.belongsTo(models.User, { foreignKey: 'user_id' });
	this.belongsTo(models.Post, { foreignKey: 'post_id' });
  }
}

export default Like;

