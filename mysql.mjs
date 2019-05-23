module.exports = (config) => new Promise((resolve, reject) => {

	const mysqlConfig = pick(config, 'user', 'password', 'host', 'port', 'database');
	const pool = require('mysql2').createPoolPromise(mysqlConfig);
	const db = {};

	pool.query(tablesQuery(config.database)).then(result => {
		for (let row of result[0]) {
			let { table, ...column } = row;
			if (column.pos == 1) db[table] = [];
			db[table].push(column);
		}
	}).catch(err => {
		if (pool) pool.end();
		reject(err);
	});

	pool.query(indexesQuery(config.database)).then(result => {
		for (let row of result[0]) {
			let { table, ...index } = row;
			db[table].push(index);
		}
		pool.end();
		resolve(db);
	}).catch(err => {
		if (pool) pool.end();
		reject(err);
	});

});


function tablesQuery(db) {
	return `SELECT table_name as 'table', \
		column_name as 'column', \
		ordinal_position as 'pos', \
		column_type as 'type', \
		is_nullable, \
		column_default as 'default', \
		extra \
		FROM \
		information_schema.columns \
		WHERE table_schema='${db}' \
		ORDER BY \
		table_name, ordinal_position \
	`;
}

function indexesQuery(db) {
	return `SELECT table_name as 'table', \
		index_name as 'index', \
		GROUP_CONCAT(column_name order by seq_in_index) as columns,
		index_type as 'type', \
		non_unique \
		FROM information_schema.statistics \
		WHERE table_schema='${db}' \
		GROUP BY table_name, \
        index_name, \
        index_type, \
        non_unique \
		ORDER BY table_name \
	`;
}

function pick(object, ...items) {
	const result = {};
	items.forEach(item => result[item] = object[item]);
	return result;
}
