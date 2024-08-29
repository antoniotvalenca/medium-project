import bcrypt from "bcryptjs";
import Sequelize, { Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
        },
        is_deleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        updatedAt: "updated_at",
        createdAt: "created_at",
        paranoid: false,
        hooks: {
          beforeCreate: async (user) => {
            if (user.password) user.password = await bcrypt.hash(user.password, 9);
          },
        },
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Post, { foreignKey: "user_id" });
  }
}

export default User;
