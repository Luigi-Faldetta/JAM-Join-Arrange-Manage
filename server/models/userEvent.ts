'use strict';

import { DataTypes } from 'sequelize';
import sequelize from './modelDB.js';

const userEvents = sequelize.define(
  'userEvents',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, { timestamps: false }
);

export default userEvents;
