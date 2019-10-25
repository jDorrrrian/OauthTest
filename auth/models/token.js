
module.exports = (sequelize, DataTypes) => {
    
    const Token = sequelize.define('Token', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id',
        },
        accessToken: {
            type: DataTypes.TEXT,
        },
        accessTokenExpiresAt: {
            type: DataTypes.DATE
        },
        client : {
            type: DataTypes.INTEGER,
        },
        user: { 
            type: DataTypes.TEXT
        },
    }, {
            freezeTableName: true,
            tableName: 'token',
            timestamps: true,
            underscored: true,
            omitNull:true,
            paranoid: true,
        }
    );


    Token.save = (token, client, user) => {
        /* This is where you insert the token into the database */
       
        db = {
          accessToken: token.accessToken,
          accessTokenExpiresAt: token.accessTokenExpiresAt,
          refreshToken: token.refreshToken, // NOTE this is only needed if you need refresh tokens down the line
          refreshTokenExpiresAt: token.refreshTokenExpiresAt,
          client: client,
          user: user,
        }

        return Token.create(db);    
    };

    Token.get = token => {
        Token.findOne({where: {accessToken: token}})
    }
    
    return Token;
};