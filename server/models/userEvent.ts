'use strict';

import { DataTypes } from 'sequelize';
import sequelize from './modelDB.js';
import Sequelize from 'sequelize';

const UserEvents = sequelize.define(
  'userEvents',
  {
    XuserId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    XeventId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
  }, { timestamps: false }
);

export default UserEvents;
