const db_connection = require("./db_connection");

function viewRoles() {
  db_connection.db.query('SELECT * FROM roles', function (err, results) {
    let parsed_results = results.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {})
    console.log("\n");
    console.table(parsed_results);
    console.log("\n");
  });
}

module.exports = {viewRoles};
