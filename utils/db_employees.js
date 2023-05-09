const { default: inquirer } = require("inquirer");
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
LEFT OUTER JOIN employees AS managers ON employees.manager_id = managers.id
`;
const manager_query = `SELECT DISTINCT managers.id, CONCAT(managers.first_name, ' ', managers.last_name) AS full_name
FROM employees AS managers
  INNER JOIN employees ON managers.id = employees.manager_id;
`;

// This function prints the list of all employees
// If a manager id is provided, only employees with that manager are printed
// If a dept id is provided, only employees in that dept are printed
function viewEmployees(return_func, id, type) {
  let full_query = combined_query;
  if(id && type) {
    if(type == "mgr"){
      full_query += ` WHERE employees.manager_id = ${parseInt(id)}`
    } else {
      full_query += ` WHERE departments.id = ${parseInt(id)}`
    }
  }
  full_query += ';'
  db_connection.db.query(full_query, function (err, results) {
    let parsed_results = cTable.getTable(results);
    console.log(parsed_results);
    return_func();
  });
}

// This function asks which manager whose subordinates to print
// The main viewEmployees function is then called with the manager id
function viewByManager(inquirer, return_func) {
  db_connection.db.query(manager_query, function(err, results) {
    mgr_choices = results.map(function(itm) {return {key: itm.id, value: itm.full_name}})
    mgr_decode = {}
    mgr_choices.forEach(element => {
      mgr_decode[element.value] = element.key;
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: "Please select a manager:",
          name: "mgr",
          choices: mgr_choices
        }
      ])
      .then((response) => {
        viewEmployees(return_func, mgr_decode[response.mgr], "mgr");
      })
  });
}

function viewByDepartment(inquirer, return_func) {
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
        console.log(response);
        viewEmployees(return_func, dept_decode[response.dept], "dept");
      })
  });
}

// This function adds a new employee after prompting the user for the
// information needed to create it
// TODO: Move roles SELECT query to db_roles.js
function addEmployee(inquirer, return_func) {
  db_connection.db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees;", function (err, results) {
    mgr_choices = [{value:"(none)"}].concat(results.map(function(itm) {return {key: itm.id, value: itm.full_name}}))
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

// This function updates the role of an employee after prompting the user
// for the information needed for the update
// TODO: Move roles SELECT query to db_roles.js
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

// This function updates the manager of an employee after prompting the user
// for the information needed for the update
// TODO: Remove employee from list of potential managers
function updateEmployeeManager(inquirer, return_func) {
  db_connection.db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees;", function (err, results) {
    emp_choices = results.map(function(itm) {return {key: itm.id, value: itm.full_name}})
    emp_decode = {}
    emp_choices.forEach(element => {
      emp_decode[element.value] = element.key;
    });
    mgr_choices = [{value: "(none)"}].concat(emp_choices);
    mgr_decode = {}
    mgr_choices.forEach(element => {
      mgr_decode[element.value] = element.key;
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
          message: "Please select the employee's new manager:",
          name: "mgr",
          choices: mgr_choices
        }
      ])
      .then((response) => {
        db_connection.db.query(`UPDATE employees SET manager_id = ? WHERE id = ?;`, [mgr_decode[response.mgr], emp_decode[response.emp]], (err, result) => {
          if (err) {
            console.log(err);
          }
          return_func();
        });
      })
  });
}

module.exports = {viewEmployees, viewByManager, viewByDepartment, addEmployee, updateEmployeeRole, updateEmployeeManager};
