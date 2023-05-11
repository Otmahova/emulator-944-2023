import { Sequelize }from 'sequelize'

export const sequelize = new Sequelize({
    database: 'db.sqlite',
    host: 'db.sqlite',
    dialect: 'sqlite',
    logging: false
})

