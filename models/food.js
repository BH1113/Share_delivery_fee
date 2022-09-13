const Sequelize = require('sequelize');

module.exports = class Food extends Sequelize.Model {
    static init(sequelize) {
        return super.init ({
            chicken: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            korean: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            chFood: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            pizza: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            pigfoot: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            nightFood: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            bunsik: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            cafe: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            asian: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            dosilak: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            bugger: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Food',
            tableName: 'foods',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.Food.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    }
}