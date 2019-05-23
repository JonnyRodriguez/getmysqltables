#!/usr/bin/env node

const program = require('commander');
const mysql = require('./mysql');

program
	.version('0.1.0')
	.option('-d, --database <db>', 'mysql database', 'turing')
	.option('-u, --user <user>', 'mysql user', 'root')
	.option('-p, --password <password>', 'mysql password', 'password')
	.option('-j, --json', 'set json output format')
	.option('-H, --host <host>', 'mysql host', 'localhost')
	.option('-P, --port <port>', 'mysql port', '3306')
	.parse(process.argv);

const db = mysql(program.user,program.password,program.host,program.port,program.database);

