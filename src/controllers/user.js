import { pick } from "lodash";
import BaseController from "./base.js";
import { UserService } from "../services";

class UserController extends BaseController {
	constructor() {
		super()

		this.UserService = new UserService();

		this.bindActions(["login", "create", "update", "delete"]);
	}

	async login (req, res) {
		try {
			const login_infos = pick(req.body, ["email", "password"]);
			const login_token = await this.UserService.loginUser(login_infos);

			this.successHandler(login_token, res)
		} catch (e) {
			this.errorHandler(e, req, res);
		}

	}

	async create (req, res) {
		console.log("Entering create method");
		try {
			const user_data = pick(req.body, ["email", "password", "name"]);
			const user = await this.UserService.createUser(user_data);

			this.successHandler(user, res)
		} catch (e) {
			this.errorHandler(e, req, res);
		}
	}

	async update (req, res) {
		try {
			const change = pick (req.body, ["name", "email", "password"]);
			const id = {
				id: req.user_id
			};

			const userChange = await this.UserService.updateUser(change, id);

			this.successHandler(userChange, res)
		} catch (e) {
			this.errorHandler(e, req, res);
		};
	}

	async delete (req, res) {
		try {
			const id = req.user_id;
			const deletedUser = await this.UserService.deleteUser(id);

			this.successHandler(deletedUser, res)
		} catch (e) {
			this.errorHandler(e, req, res);
		}
	}
};

export default UserController;
