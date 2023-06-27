import { Sequelize } from 'sequelize';

const { __HEROKU__ } = process.env;

const sequelize = __HEROKU__ 
  ? new Sequelize(process.env.DB!)
  : new Sequelize(process.env.DB_NAME || 'Main', process.env.DB_USER || 'postgres', process.env.PW || '2603', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
  });

(async () => {
  try {
    await sequelize.sync();
    console.log('Database connected with Sequelize');
  } catch (error) {
    console.error('Failed to connect with DB 😒 ', error);
  }
})();

export default sequelize;
