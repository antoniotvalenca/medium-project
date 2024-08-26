import { pick } from "lodash";
import { UserService } from "@services";

class UserController {
	constructor() {
		this.UserService = new UserService();
	}

	async login (req, res) {
		try {
			const login_infos = pick(req.body, ["email", "password"]);
			const login_token = await this.UserService.loginUser(login_infos);

			return res.json(login_token);
		} catch (e) {
			res.status(500).json({ message: "erro ao logar: ", e });
		}

	}

	async create (req, res) {
		try {
			const user_data = pick(req.body, ["email", "password", "name"]);
			const user = await this.UserService.createUser(user_data);

			return res.json({ user });
		} catch (e) {
			return res.status(500).json({ message: "erro ao criar user: ", e })
		}
	}

	async update (req, res) {
		try {
			const change = pick (req.body, ["name", "email", "password"]);
			const id = {
				id: req.user_id
			};

			const userChange = await this.UserService.updateUser(change, id);

			return res.json({ userChange });
		} catch (e) {
			return res.status(500).json({ message: "erro ao atualizar user: ", e })
		};
	}

	async delete (req, res) {
		try {
			const id = req.user_id;
			const deletedUser = await this.UserService.deleteUser(id);

			return res.json(deletedUser);
		} catch (e) {
			return res.status(500).json({ message: "erro ao deletar user: ", e })
		}
	}
};

export default UserController;
