import { User } from "../models";
import { compareSync } from "bcryptjs";
import jwt from "jsonwebtoken"

class UserService {

	async loginUser (credentials) {
		const user = await User.findOne({
			where: {
				email: credentials.email,
				is_deleted: false
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

	async updateUser(change, user_id) {
		try {
			const userEdit = await User.update(change, {
				where: { id: user_id }
			});

			return userEdit;
		} catch (e) {
			throw new Error(`Erro ao atualizar user: ${e.message}`);
		}
	}


	async createUser(user) {
		const is_user_created = await User.findOne({
			where: { email: user.email },
		});

		if (is_user_created) throw new Error('Email já está sendo usado');

		try {
			const user_creation = await User.create(user);
			return user_creation;
		} catch (e) {
			throw new Error(`Erro ao criar usuário: ${e.message}`);
		}
	}


	async deleteUser(user_id) {
		try {
			const user_delete = await User.update(
				{ is_deleted: true },
				{ where: { id: user_id } }
			);

			return user_delete;
		} catch (e) {
			throw new Error(`Erro ao deletar user: ${e.message}`);
		}
	};
}

export default UserService;
