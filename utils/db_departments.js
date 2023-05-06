const db_connection = require("./db_connection");

function viewDepartments() {
  db_connection.db.query('SELECT * FROM departments', function (err, results) {
    let parsed_results = results.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {})
    console.log("\n");
    console.table(parsed_results);
    console.log("\n");
  });
}

module.exports = {viewDepartments};
