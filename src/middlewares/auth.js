import jwt from "jsonwebtoken";
import { User } from "@models";

const auth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            errors: ['Usuário não está logado'],
        });
    }

    const [, token] = authorization.split(' ');

    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        const { id, email } = data;

        const user = await User.findOne({
            where: {
                id,
                email
            },
            raw: true,
        });

        if (!user) throw new Error('Invalid Credentials');

        req.user_id = id;
        req.email = email;

        return next();
    } catch (e) {
        return res.status(401).json({
            message: ['Token expirado ou inválido'],
        });
    }
};

export default auth;
