import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME || 'Database', process.env.DB_USER || 'user', process.env.PW || 'pw', {
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
