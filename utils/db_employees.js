const db_connection = require("./db_connection");
const cTable = require('console.table');
const combined_query = `SELECT employees.id AS id,
employees.first_name AS first_name,
  employees.last_name AS last_name,
roles.title AS title,
  departments.name AS department,
  roles.salary,
  CONCAT(COALESCE(managers.first_name, ''), " ", COALESCE(managers.last_name, '')) AS manager
FROM employees
LEFT OUTER JOIN roles ON employees.role_id = roles.id
LEFT OUTER JOIN departments ON roles.department_id = departments.id
LEFT OUTER JOIN employees AS managers ON employees.manager_id = managers.id;
`;

function viewEmployees(return_func) {
  db_connection.db.query(combined_query, function (err, results) {
    let parsed_results = cTable.getTable(results);
    console.log(parsed_results);
    return_func();
  });
}

function addEmployee(inquirer, return_func) {
  db_connection.db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees;", function (err, results) {
    mgr_choices = results.map(function(itm) {return {key: itm.id, value: itm.full_name}})
    mgr_decode = {}
    mgr_choices.forEach(element => {
      mgr_decode[element.value] = element.key;
    });
    db_connection.db.query("SELECT id, title FROM roles;", function (err, results) {
      role_choices = results.map(function(itm) {return {key: itm.id, value: itm.title}})
      role_decode = {}
      role_choices.forEach(element => {
        role_decode[element.value] = element.key;
      });
        inquirer
          .prompt([
            {
              type: "input",
              message: "Please enter the new employee's first name:",
              name: "first_name"
            },
            {
              type: "input",
              message: "Please enter the new employee's last name:",
              name: "last_name"
            },
            {
              type: "list",
              message: "Please select the new employee's role:",
              name: "role",
              choices: role_choices
            },
            {
              type: "list",
              message: "Please select the new employee's manager:",
              name: "mgr",
              choices: mgr_choices
            }
          ])
          .then((response) => {
            db_connection.db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [response.first_name, response.last_name, role_decode[response.role], mgr_decode[response.mgr]], (err, result) => {
              if (err) {
                console.log(err);
              }
              return_func();
            });
          })
    });
  });
}

function updateEmployeeRole(inquirer, return_func) {
  db_connection.db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees;", function (err, results) {
    emp_choices = results.map(function(itm) {return {key: itm.id, value: itm.full_name}})
    emp_decode = {}
    emp_choices.forEach(element => {
      emp_decode[element.value] = element.key;
    });
    db_connection.db.query("SELECT id, title FROM roles;", function (err, results) {
      role_choices = results.map(function(itm) {return {key: itm.id, value: itm.title}})
      role_decode = {}
      role_choices.forEach(element => {
        role_decode[element.value] = element.key;
      });
        inquirer
          .prompt([
            {
              type: "list",
              message: "Please the employee to update:",
              name: "emp",
              choices: emp_choices
            },
            {
              type: "list",
              message: "Please select the employee's new role:",
              name: "role",
              choices: role_choices
            }
          ])
          .then((response) => {
            db_connection.db.query(`UPDATE employees SET role_id = ? WHERE id = ?;`, [role_decode[response.role], emp_decode[response.emp]], (err, result) => {
              if (err) {
                console.log(err);
              }
              return_func();
            });
          })
    });
  });
}

module.exports = {viewEmployees, addEmployee, updateEmployeeRole};
