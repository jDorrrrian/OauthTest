
module.exports = (sequelize, DataTypes) => {

    const Client = sequelize.define('Client', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id',
        },
        clientSecret: { 
            type: DataTypes.TEXT
        },
        grants: {
            type: DataTypes.ARRAY(DataTypes.TEXT)
        },
        redirectUris : {
            type: DataTypes.ARRAY(DataTypes.TEXT)
        },
        scope: {
          type: DataTypes.TEXT
        }
    }, {
            freezeTableName: true,
            tableName: 'client',
            timestamps: true,
            underscored: true,
            omitNull:true,
            paranoid: true,
        }
    );

    Client.associate = (models) => {
      const { User } = models;
      Client.belongsTo(User, {
        as: 'user',
        foreignKey: 'id',
      })
    }
    
    Client.getClient = (clientId, clientSecret) => {
        // query db for details with client
        log({
          title: 'Get Client',
          parameters: [
            { name: 'clientId', value: clientId },
            { name: 'clientSecret', value: clientSecret },
          ]
        })
        db.client = { // Retrieved from the database
          clientId: clientId,
          clientSecret: clientSecret,
          grants: ['authorization_code', 'refresh_token'],
          redirectUris: ['http://localhost:3030/client/app'],
        }
        return new Promise(resolve => {
          resolve(db.client)
        })
      };



      
    return Client;
};