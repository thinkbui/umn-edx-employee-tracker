const inquirer = require('inquirer');
const db_connection = require("./utils/db_connection");

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

main();
