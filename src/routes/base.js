import { Router } from 'express';

class BaseRoutes {
    constructor() {
        this.router = Router();
    }

	validateSchema(schema) {
		return async (req, res, next) => {
			console.log("Validating schema"); // Log schema validation start
			try {
				await schema.validate(req.body, { abortEarly: false }); // Validate with multiple errors
				console.log("Schema validation successful"); // Log successful validation
				next();
			} catch (error) {
				console.error("Validation Error:", error); // Log validation error
				res.status(400).json({ message: "Validation failed", errors: error.errors });
			}
		};
	}
}

export default BaseRoutes;
