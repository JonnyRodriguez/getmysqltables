var mysql = require('mysql');
var conn = mysql.createConnection({
  user: 'root',
  password: 'password',
  database: 'turing'
});

const query = sql => {
  return new Promise( (resolve, reject) => {
    conn.query(sql, function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

const getTable = table => {
  return query(`desc ${table}`).then( rows => {
    var columns = [];
    for( let row of rows ) {
      var column = {};
      for( let key in row )
        column[key]=row[key];
      columns.push(column);
    }
    return {table,columns};
  });
}

query('show tables').then( rows => {
  var tables = [];
  for( let row of rows )
    for( let table in row )
      tables.push(row[table]);
  return tables;
}).then( tables => {
  tablesQuery = tables.map( table => getTable(table) );
  Promise.all(tablesQuery).then( data => {
    console.log(JSON.stringify(data));
    conn.end();
  });
});

