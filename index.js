const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log(`Connected to the books_db database.`)
);

let continue_app = true;

async function main() {
  while(continue_app) {
    await inquirer
      .prompt([
        {
          type: "list",
          message: "Select from the following actions:",
          name: "main_action",
          choices: ["Continue", "Exit"]
        }
      ])
      .then((response) => {
        if(response.main_action == "Exit") {
          console.log("Have a good day!");
          continue_app = false;
          process.exit(0);
        } else {
          console.log("Continuing app...")
        }
      })
  }
}

db.query('SELECT * FROM departments', function (err, results) {
  console.log(results);
});

main();
