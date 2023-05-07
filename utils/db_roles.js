const db_connection = require("./db_connection");
const cTable = require('console.table');
const combined_query = `SELECT roles.id AS id,
roles.title AS title,
  departments.name AS department,
  roles.salary AS salary
FROM roles
LEFT OUTER JOIN departments ON roles.department_id = departments.id;
`;

function viewRoles(return_func) {
  db_connection.db.query(combined_query, function (err, results) {
    let parsed_results = cTable.getTable(results);
    console.log(parsed_results);
    return_func();
  });
}

function addRole(inquirer, return_func) {
  db_connection.db.query("SELECT id, name FROM departments;", function (err, results) {
    dept_choices = results.map(function(itm) {return {key: itm.id, value: itm.name}})
    dept_decode = {}
    dept_choices.forEach(element => {
      dept_decode[element.value] = element.key;
    });
    inquirer
      .prompt([
        {
          type: "input",
          message: "Please enter the new role's title:",
          name: "title"
        },
        {
          type: "number",
          message: "Please enter the new role's salary:",
          name: "salary"
        },
        {
          type: "list",
          message: "Please select the new role's department:",
          name: "dept",
          choices: dept_choices
        }
      ])
      .then((response) => {
        db_connection.db.query(`INSERT INTO roles (title, department_id, salary) VALUES (?, ?, ?)`, [response.title, dept_decode[response.dept], response.salary], (err, result) => {
          if (err) {
            console.log(err);
          }
          return_func();
        });
      })
    });

}

module.exports = {viewRoles, addRole};
