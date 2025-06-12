import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',              // Can be 'postgres', 'mysql', etc.
  storage: './db.sqlite'          // Only needed for SQLite
});

export default sequelize;