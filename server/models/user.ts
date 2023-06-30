import { BuildOptions, DataTypes, Model } from 'sequelize';
import Sequelize from 'sequelize';
import sequelize from './modelDB';
import { BeUser } from '../utils';

interface UserModel extends Model<BeUser>, BeUser {}
export class UserClass extends Model<UserModel, BeUser> {}

export type UserStatic = typeof Model & {
  new(values?:object, options?: BuildOptions):UserModel
}

const User = <UserStatic>sequelize.define<UserModel>('User', {
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
