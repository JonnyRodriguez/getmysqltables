const mysql = require('mysql2/promise');

module.exports = (user, password, host, port, database) => {

	const config = { user, password, host, port, database };
	const pool = mysql.createPool(config);
	const db = {};

	pool.query(tablesQuery(database)).then(result => {
		for (let row of result[0]) {
			let { Table, ...column } = row;
			if (column.Pos == 1) db[row.Table] = [];
			db[row.Table].push(column);
		}
	});

	pool.query(indexesQuery(database)).then(result => {
		for (let row of result[0]) {
			console.log(row);
		}
		//console.log(program.json ? JSON.stringify(db) : db);
	}).then(() => pool.end());
}

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
