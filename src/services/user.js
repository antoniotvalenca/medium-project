import { User } from "../models";
import { compareSync } from "bcryptjs";
import jwt from "jsonwebtoken"

class UserService {

	async loginUser (credentials) {
		const user = await User.findOne({
			where: {
				email: credentials.email
			}
		});

        if (!user) throw 'Nome de usuário ou senha inválidos';

		const valid_password = compareSync(credentials.password, user.password);
        if (!valid_password) throw 'Nome de usuário ou senha inválidos';

        return jwt.sign({
            user_id: user.id,
            name: user.name,
        }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
    };

	async updateUser (change, user_id) {
		const transaction = await User.sequelize.transaction();

		try {
			const userEdit = await User.update(change, {
				where: { id: user_id },
				transaction
			});

			await transaction.commit();

			return userEdit;

		} catch (e) {
			await transaction.rollback();
			throw new Error(`Erro ao atualizar user: ${e.message}`);;
		};
    };

	async createUser (user) {
		const is_user_created = await User.findOne({
            where: { email: user.email },
        });

        if (is_user_created) throw 'Nickname já está sendo usado';

        const transaction = await User.sequelize.transaction();

        try {
            user_creation = await User.create(user, { transaction: transaction });
            await transaction.commit()
        } catch (e) {
            await transaction.rollback()
            throw new Error(`Erro ao criar user: ${e.message}`);
        };

        return user_creation;
	}

	async deleteUser (user_id) {
		const transaction = await User.sequelize.transaction();

		try {
			const user_delete = await User.destroy({
				where: {id: user_id},
				transaction,
			});

			await transaction.commit();

			return user_delete;
		} catch (e) {
			await transaction.rollback();
			throw new Error(`Erro ao deletar user: ${e.message}`);
		}
	}
}

export default UserService;
