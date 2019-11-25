
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
  


      
    return Client;
};