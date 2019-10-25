const fs = require('fs');
const path = require('path');

const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../configs/db.json')[env];
require('pg').defaults.parseInt8 = true;
Sequelize.postgres.DECIMAL.parse = function (value) { return parseFloat(value); };

const { user, password, database, options } = dbConfig;
const sequelize = new Sequelize(database, user, password, Object.assign({}, options, { logging: options.logging ? console.log : undefined }));

const _ = require('lodash');

const db = {};

fs.readdirSync(__dirname)
    .filter(file => ((file.indexOf('.') !== 0) && (file !== basename)))
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if ('associate' in db[modelName]) {
        console.log(db[modelName]);
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.series = function (startDate, endDate, step, timeZone) {
    step = step || 'day';
    return sequelize.query(`SELECT date_trunc($step, x) AT TIME ZONE $timeZone AS date FROM generate_series(date_trunc($step, $startDate::timestamp), date_trunc($step, $endDate::timestamp), '${step === 'quarter' ? '3 months' : `1 ${step}`}') x WHERE x < $endDate`, {
        bind: { startDate, endDate, step, timeZone },
        type: sequelize.QueryTypes.SELECT
    }).then(rows => _.map(rows, row => row.date));
};

module.exports = db;