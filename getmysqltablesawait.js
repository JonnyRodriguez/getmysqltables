const mysql = require('mysql2/promise');
var conn;
main();

async function main() {

  conn=await mysql.createConnection({
    user: 'root',
    password: 'password',
    database: 'turing'
  });

  const tables=await getTables();
  const data = []
  for( let table of tables ) data.push( await getTable(table) );
  console.log( JSON.stringify(data) );
  conn.end();

}

async function getTables() {
  const result=await conn.query('SHOW TABLES');
  var tables = [];
  for( let row of result[0] )
    for( let table in row )
      tables.push(row[table]);
  return tables;
}

async function getTable(table) {
  const rows=await conn.query(`DESC ${table}`);
  const columns = [];
  for( let row of rows[0] ) {
    const column = {};
    for( let key in row )
      column[key]=row[key];
    columns.push(column);
  }
  return {table,columns};
}
