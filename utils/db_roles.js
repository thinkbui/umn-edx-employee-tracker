const db_connection = require("./db_connection");
const combined_query = `SELECT roles.id AS id,
roles.title AS title,
  departments.name AS department,
  roles.salary AS salary
FROM employee_db.roles AS roles
LEFT OUTER JOIN employee_db.departments AS departments ON roles.department_id = departments.id;
`;

function viewRoles() {
  db_connection.db.query(combined_query, function (err, results) {
    let parsed_results = results.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {})
    console.log("\n");
    console.table(parsed_results);
    console.log("\n");
  });
}

module.exports = {viewRoles};
