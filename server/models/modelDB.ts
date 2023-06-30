import { Sequelize } from 'sequelize';
const { __HEROKU__, NODE_ENV } = process.env;

const sequelize = __HEROKU__
  ? new Sequelize(process.env.DB!)
  : NODE_ENV === 'test'
    ? new Sequelize(process.env.TEST_DB!, process.env.DB_USER!, process.env.PW!, {
      host: 'localhost',
      dialect: 'postgres',
      port: 5432,
      logging: false,
    })
    : new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.PW!, {
      host: 'localhost',
      dialect: 'postgres',
      port: 5432,
      logging: false,
    });

NODE_ENV !=='test' && (async () => {
  try {
    // await sequelize.sync();
    await sequelize.sync({alter: true});
    console.log(`Connected to database '${NODE_ENV === 'test' ? process.env.TEST_DB : process.env.DB_NAME}'`);
  } catch (error) {
    console.error('Failed to connect with Database =(', error);
  }
})();

export default sequelize;
