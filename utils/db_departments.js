const db_connection = require("./db_connection");

function viewDepartments(return_func) {
  db_connection.db.query('SELECT * FROM departments', function (err, results) {
    let parsed_results = results.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {})
    console.log("\n");
    console.table(parsed_results);
    console.log("\n");
    return_func();
  });
}

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
