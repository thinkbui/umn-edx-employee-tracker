const db_connection = require("./db_connection");
const cTable = require('console.table');
const budget_query = `SELECT departments.name AS department, IFNULL(budget_query.budget,0.00) AS budget
FROM departments
  LEFT OUTER JOIN (
  SELECT departments.name, SUM(salary) AS budget
    FROM employees
          LEFT OUTER JOIN roles on employees.role_id = roles.id
          LEFT OUTER JOIN departments ON roles.department_id = departments.id
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

// This function prints the combined salaries for each department
// Displays "0.00" if the department has no employees
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

// This function prompts which department to delete then makes the SQL call
function deleteDepartment(inquirer, return_func) {
  db_connection.db.query('SELECT id, name FROM departments', function (err, results) {
    dept_choices = results.map((element) => {return {key: element.id, value: element.name}})
    dept_decode = {};
    dept_choices.forEach((element) => {
      dept_decode[element.value] = element.key;
    })
    inquirer
      .prompt([
        {
          type: "list",
          message: "Please select a department:",
          name: "dept",
          choices: dept_choices
        }
      ])
      .then((response) => {
        db_connection.db.query(`DELETE FROM departments WHERE id = ?`, dept_decode[response.dept], (err, result) => {
          if (err) {
            console.log(err);
          }
          return_func();
        });
      })
  });
}

module.exports = {viewDepartments, viewDepartmentBudgets, addDepartment, deleteDepartment};
