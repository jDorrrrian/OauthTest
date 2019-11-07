
module.exports = (sequelize, DataTypes) => {

    const AuthorizationCode = sequelize.define('AuthorizationCode', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id',
        },
        authorizationCode: {
            type: DataTypes.TEXT,
        },
        expiresAt: {
            type: DataTypes.DATE
        },
        
        redirectUri: { 
            type: DataTypes.TEXT
        },
        scope : {
            type: DataTypes.TEXT
        },
    
    }, {
            freezeTableName: true,
            tableName: 'AuthorizationCode',
            timestamps: true,
            underscored: true,
            omitNull:true,
            paranoid: true,
        }
    );


    AuthorizationCode.associate = (models) => {
        const { Client, User} = models;
        AuthorizationCode.belongsTo(Client, {
            foreignKey: 'client',
        });
  
        AuthorizationCode.belongsTo(User, {
            foreignKey: 'user',
        });
    }
    return AuthorizationCode;
};