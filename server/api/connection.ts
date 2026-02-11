import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('stationery_store', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb'
});

export { sequelize }