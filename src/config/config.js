const dotenv = require('dotenv');

dotenv.config(); // carrega as variáveis do arquivo .env e injeta no obj process.env

const config = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  secretKey: process.env.TOKEN_SECRET,
  port: process.env.PORT,

  define: { // configurações padrão para sequelize
    timestamps: true, // adicionar automaticamente as colunas created_at e updated_at
    underscored: true, // define o padrão das colunas para snake_case
    underscoredAll: true, // mesmo do acima, mas se aplica às keys, foreign keys, etc
    createdAt: "created_at",
    updatedAt: "updated_at",
  },

  dialectOptions: {
    timezone: "America/Sao_Paulo" // fuso horário para interagir corretamente com o banco
  },

  timezone: "America/Sao_Paulo"
};

module.exports = config;
