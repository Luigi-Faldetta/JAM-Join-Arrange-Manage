import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME || 'Main', process.env.DB_USER || 'postgres', process.env.PW || '2603', {
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
