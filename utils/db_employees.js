const db_connection = require("./db_connection");
const combined_query = `SELECT employees.id AS id,
employees.first_name AS first_name,
  employees.last_name AS last_name,
roles.title AS title,
  departments.name AS department,
  roles.salary,
  CONCAT(COALESCE(managers.first_name, ''), " ", COALESCE(managers.last_name, '')) AS manager
FROM employee_db.employees AS employees
LEFT OUTER JOIN employee_db.roles AS roles ON employees.role_id = roles.id
LEFT OUTER JOIN employee_db.departments AS departments ON roles.department_id = departments.id
LEFT OUTER JOIN employee_db.employees AS managers ON employees.manager_id = managers.id;
`;

function viewEmployees(return_func) {
  db_connection.db.query(combined_query, function (err, results) {
    let parsed_results = results.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {})
    console.log("\n");
    console.table(parsed_results);
    console.log("\n");
    return_func();
  });
}

module.exports = {viewEmployees};
