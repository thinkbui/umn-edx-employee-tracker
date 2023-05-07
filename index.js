const inquirer = require('inquirer');
const db_connection = require("./utils/db_connection");
const db_departments = require("./utils/db_departments");
const db_employees = require("./utils/db_employees");
const db_roles = require("./utils/db_roles");

function main() {
    inquirer
      .prompt([
        {
          type: "list",
          message: "Select from the following actions:",
          name: "main_action",
          choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Exit"]
        }
      ])
      .then((response) => {
        switch(response.main_action) {
          case "View All Departments":
            db_departments.viewDepartments(main);
            break;
          case "View All Roles":
            db_roles.viewRoles(main);
            break;
          case "View All Employees":
            db_employees.viewEmployees(main);
            break;
          case "Add Department":
            db_departments.addDepartment(inquirer, main);
            break;
          case "Add Role":
            db_roles.addRole(inquirer, main);
            break;
          case "Add Employee":
            db_employees.addEmployee(inquirer, main);
            break;
          case "Update Employee Role":
            db_employees.updateEmployeeRole(inquirer, main);
            break;
          case "Exit":
            console.log("Have a good day!");
            continue_app = false;
            process.exit(0);
            break;
          default:
            console.error("ERROR: Unknown input.  Please try again.");
            main();
        }
      })
}

main();
