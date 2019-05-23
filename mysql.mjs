module.exports = (config) => new Promise((resolve, reject) => {

	const mysqlConfig = pick(config, 'user', 'password', 'host', 'port', 'database');
	const pool = require('mysql2').createPoolPromise(mysqlConfig);
	const db = {};

	pool.query(tablesQuery(config.database)).then(result => {
		for (let row of result[0]) {
			let { Table, ...column } = row;
			if (column.Pos == 1) db[Table] = [];
			db[Table].push(column);
		}
	});

	pool.query(indexesQuery(config.database)).then(result => {
		for (let row of result[0]) {
			let { Table, ...index } = row;
			db[Table].push(index);
		}
	}).then(() => {
		pool.end();
		resolve(db);
	});

});


function tablesQuery(db) {
	return `SELECT table_name as 'Table', \
		column_name as 'Column', \
		ordinal_position as 'Pos', \
		column_type as 'Type', \
		is_nullable, \
		column_default as 'Default', \
		extra \
		FROM \
		information_schema.columns \
		WHERE table_schema='${db}' \
		ORDER BY \
		table_name, ordinal_position \
	`;
}

function indexesQuery(db) {
	return `SELECT table_name as 'Table', \
		index_name, \
		GROUP_CONCAT(column_name order by seq_in_index) as columns,
		index_type, \
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
