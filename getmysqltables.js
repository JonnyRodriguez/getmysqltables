#!/usr/bin/env node

const mysql = require('mysql2/promise');
const program = require('commander');

program
	.version('0.1')
	.option('-d, --database <db>', 'mysql database', 'turing')
	.option('-u, --user <user>', 'mysql user', 'root')
	.option('-p, --password <password>', 'mysql password', 'password')
	.option('-j, --json', 'json output')
	.option('-H, --host <host>', 'mysql host', 'localhost')
	.option('-P, --port <port>', 'mysql port', '3306')
	.parse(process.argv);

const db = {};
const pool = mysql.createPool(pick(program, ['user', 'password', 'host', 'port']));

pool.query(tablesQuery()).then(result => {
	for (let row of result[0]) {
		let { Table, ...column } = row;
		if (column.Pos == 1) db[row.Table] = [];
		db[row.Table].push(column);
	}
	console.log(program.json ? JSON.stringify(db) : db);
}).then(() => pool.end());

function tablesQuery() {
	return `SELECT table_name as 'Table', \
		column_name as 'Column', \
		ordinal_position as 'Pos', \
		column_type as 'Type', \
		is_nullable, \
		column_default as 'Default', \
		extra \
		FROM \
		information_schema.columns \
		WHERE table_schema='${program.database}' \
		ORDER BY \
		table_name, ordinal_position \
	`;
}

function pick(object, items) {
	const result = {};
	items.forEach(item => result[item] = object[item]);
	return result;
}
