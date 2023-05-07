const inquirer = require('inquirer');
const db_connection = require("./utils/db_connection");
const db_departments = require("./utils/db_departments");
const db_employees = require("./utils/db_employees");
const db_roles = require("./utils/db_roles");

let continue_app = true;

async function main() {
// function main() {
  while(continue_app) {
    await inquirer
    // inquirer
      .prompt([
        {
          type: "list",
          message: "Select from the following actions:",
          name: "main_action",
          choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Exit"]
        }
      ])
      .then((response) => {
        switch(response.main_action) {
          case "View All Departments":
            db_departments.viewDepartments();
            break;
          case "View All Roles":
            db_roles.viewRoles();
            break;
          case "View All Employees":
            db_employees.viewEmployees();
            break;
          case "Add Department":
            db_departments.addDepartment(inquirer);
            break;
          case "Exit":
            console.log("Have a good day!");
            continue_app = false;
            process.exit(0);
            break;
          default:
            console.error("ERROR: Unknown input.  Please try again.");
        }
      })
  }
}

main();
