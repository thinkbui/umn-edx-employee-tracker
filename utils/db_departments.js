const db_connection = require("./db_connection");
const cTable = require('console.table');
const budget_query = `SELECT departments.name, IFNULL(budget_query.budget,0.00) AS budget
FROM umn_edx_employee_tracker_db.departments
  LEFT OUTER JOIN (
  SELECT departments.name, SUM(salary) AS budget
    FROM umn_edx_employee_tracker_db.employees AS employees
          LEFT OUTER JOIN umn_edx_employee_tracker_db.roles AS roles on employees.role_id = roles.id
          LEFT OUTER JOIN umn_edx_employee_tracker_db.departments AS departments ON roles.department_id = departments.id
          GROUP BY departments.name
  ) AS budget_query ON departments.name = budget_query.name;
`;

// This function prints the list of all departments
function viewDepartments(return_func) {
  db_connection.db.query('SELECT * FROM departments', function (err, results) {
    let parsed_results = cTable.getTable(results);
    console.log(parsed_results);
    return_func();
  });
}

function viewDepartmentBudgets(return_func) {
  db_connection.db.query(budget_query, function (err, results) {
    let parsed_results = cTable.getTable(results);
    console.log(parsed_results);
    return_func();
  });
}

// This function adds a new department after prompting the user for the
// information needed to create it
async function addDepartment(inquirer, return_func) {
  await inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter the new department's name:",
        name: "name"
      }
    ])
    .then((response) => {
      db_connection.db.query(`INSERT INTO departments (name) VALUES (?)`, response.name, (err, result) => {
        if (err) {
          console.log(err);
        }
        return_func();
      });
    })
}

module.exports = {viewDepartments, viewDepartmentBudgets, addDepartment};
