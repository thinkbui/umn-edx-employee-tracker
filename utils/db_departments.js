const db_connection = require("./db_connection");

function viewDepartments() {
  db_connection.db.query('SELECT * FROM departments', function (err, results) {
    let parsed_results = results.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {})
    console.log("\n");
    console.table(parsed_results);
    console.log("\n");
  });
}

async function addDepartment(inquirer) {
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
        console.log(result);
      });
    })
}

module.exports = {viewDepartments, addDepartment};
