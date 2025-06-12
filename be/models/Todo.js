import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './db.sqlite' });

const Todo = sequelize.define('Todo', {
  text: { type: DataTypes.STRING, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false }
});

await sequelize.sync(); // Creates table if not exists
export default Todo;