const inquirer = require('inquirer');
const mysql = require('mysql2');

function main() {
  inquirer
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
      } else {
        console.log("Continuing app...")
        main();
      }
    })
}

main();
