'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */  

    try {
      await queryInterface.createTable('User', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        facebookId: {
            type: Sequelize.TEXT,
            field: 'facebook_id'
        },
        facebookUrl: {
            type: Sequelize.TEXT,
            field: 'facebook_url'
        },
        facebookUsername: {
            type: Sequelize.TEXT,
            field: 'facebook_username'
        },
        name: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        firstName: {
            type: Sequelize.TEXT,
            field: 'first_name'
        },
        lastName: {
            type: Sequelize.TEXT,
            field: 'last_name'
        },
        email: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        authTicket: {
            type: Sequelize.TEXT,
            field: 'auth_ticket'
        },
        password: {
            type: Sequelize.TEXT
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'created_at'
        },
        updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at'
        },
        deletedAt: {
            type: Sequelize.DATE,
            field: 'deleted_at'
        }
      });


      await queryInterface.createTable('Client', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          field: 'id',
        },
        clientSecret: {
            type: Sequelize.TEXT
        },
        grants: {
            type: Sequelize.ARRAY(Sequelize.TEXT)
        },
        redirectUris : {
            type: Sequelize.ARRAY(Sequelize.TEXT)
        },
        scope: {
          type: Sequelize.TEXT
        },
        user: { 
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'User',
              key: 'id'
            }
          },
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'created_at'
        },
        updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at'
        },
        deletedAt: {
            type: Sequelize.DATE,
            field: 'deleted_at'
        }
      });

      await queryInterface.createTable('Token', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          field: 'id',
        },
        accessToken: {
            type: Sequelize.TEXT,
        },
        accessTokenExpiresAt: {
            type: Sequelize.DATE
        },
        scope: {
          type: Sequelize.TEXT
        },
        client : {
            type: Sequelize.INTEGER,
            references: {
              model: {
                tableName: 'Client',
                key: 'id'
              }
            },
        },
        user: { 
            type: Sequelize.INTEGER,
            references: {
              model: {
                tableName: 'User',
                key: 'id'
              }
            },
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'created_at'
        },
        updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at'
        },
        deletedAt: {
            type: Sequelize.DATE,
            field: 'deleted_at'
        }
      });

      


      await queryInterface.createTable('AuthorizationCode', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          field: 'id',
        },
        authorizationCode: {
            type: Sequelize.TEXT,
        },
        expiresAt: {
            type: Sequelize.DATE
        },
        
        redirectUri: { 
            type: Sequelize.TEXT
        },
        scope: {
            type: Sequelize.TEXT
        },
        client : {
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'Client',
              key: 'id'
            }
          },
        },
        user: { 
            type: Sequelize.INTEGER,
            references: {
              model: {
                tableName: 'User',
                key: 'id'
              }
            },
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'created_at'
        },
        updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at'
        },
        deletedAt: {
            type: Sequelize.DATE,
            field: 'deleted_at'
        }
      });


    } catch(e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   await queryInterface.dropTable('Token');
   await queryInterface.dropTable('AuthorizationCode');
   await queryInterface.dropTable('ColabUser');
    await queryInterface.dropTable('Client');

  }
};
