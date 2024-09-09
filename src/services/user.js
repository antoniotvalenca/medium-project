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
		const userEdit = await User.update(change, {
			where: { id: user_id }
		});

		return userEdit;
	};


	async createUser(useree) {

		try {
			const x = useree;
			// Teste findOne
			const user = await User.findOne({ where: { email: 'antoniotvalenca@gmail.com' } });
			console.log("Find One Result:", user);

			// Teste create
			const newUser = await User.create({
				email: 'antoniotvalenca@gmail.com',
				password: 'Abc123*1001',
				name: 'antonio valenca'
			});
			console.log("User Created:", newUser);
		} catch (error) {
			console.error("Error in testUserModel:", error);
		}
		// console.log("User to be created:", user);

		// try {
		// 	const is_user_created = await User.findOne({
		// 		where: { email: user.email },
		// 	});

		// 	console.log("User found:", is_user_created);

		// 	if (is_user_created) throw new Error('Email já está sendo usado');

		// 	console.log("Creating user:", user);
		// 	const user_creation = await User.create(user);
		// 	console.log("User created:", user_creation);

		// 	return user_creation;
		// } catch (error) {
		// 	console.error("Error creating user:", error);
		// 	throw error; // Re-throw the error to be handled by the caller
		// }
	}



	async deleteUser(user_id) {
		 await User.update(
			{ is_deleted: true },
			{ where: { id: user_id } }
		);

			return user_delete;
	};
};

export default UserService;
