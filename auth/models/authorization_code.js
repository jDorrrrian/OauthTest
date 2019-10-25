
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
        client : {
            type: DataTypes.INTEGER,
        },
        user : {
            type: DataTypes.INTEGER
        }
    
    }, {
            freezeTableName: true,
            tableName: 'authorization_code',
            timestamps: true,
            underscored: true,
            omitNull:true,
            paranoid: true,
        }
    );


    AuthorizationCode.associate = (models) => {
        
    }
    return AuthorizationCode;
};