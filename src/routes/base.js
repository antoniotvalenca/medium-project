import { Router } from 'express';

class BaseRoutes {
    constructor() {
        this.router = Router();
    }

    validateSchema(schema) {
        return async (req, res, next) => {
            try {
                await schema.validate(req.body);
                next();
            } catch (error) {
                res.status(400).json({ error: error.errors });
            }
        };
    }
}

export default BaseRoutes;
