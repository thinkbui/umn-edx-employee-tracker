const db_connection = require("./db_connection");
const cTable = require('console.table');

// This function prints the list of all departments
function viewDepartments(return_func) {
  db_connection.db.query('SELECT * FROM departments', function (err, results) {
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

module.exports = {viewDepartments, addDepartment};
