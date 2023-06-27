import { DataTypes } from 'sequelize';
import Sequelize from 'sequelize';
import sequelize from './modelDB';

const User = sequelize.define('User', {
  // userId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   primaryKey: true 
  // },
  userId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePic: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { timestamps: false });

export default User;
