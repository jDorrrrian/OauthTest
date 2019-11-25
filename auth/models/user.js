module.exports = (sequelize, DataTypes) => {


    User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        facebookId: {
            type: DataTypes.TEXT,
            field: 'facebook_id'
        },
        facebookUrl: {
            type: DataTypes.TEXT,
            field: 'facebook_url'
        },
        facebookUsername: {
            type: DataTypes.TEXT,
            field: 'facebook_username'
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        firstName: {
            type: DataTypes.TEXT,
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.TEXT,
            field: 'last_name'
        },
        email: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        authTicket: {
            type: DataTypes.TEXT,
            field: 'auth_ticket'
        },
        password: {
            type: DataTypes.TEXT
        },
    }, {
            freezeTableName: true,
            tableName: 'user',
            timestamps: true,
            underscored: true,
            paranoid: true
        }
    );

    return User;
}