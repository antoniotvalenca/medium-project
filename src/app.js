import express from 'express';
// import routes from './routes';
import './config/databases'; // Importa e executa a configuração do banco de dados

class App {
    constructor() {
        this.app = express();
		this.port = process.env.PORT || "3000";
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
    }

    // routes() {
    //     this.app.use(routes);
    // }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
};

export default App;
