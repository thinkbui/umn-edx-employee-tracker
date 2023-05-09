const inquirer = require('inquirer');
const db_connection = require("./utils/db_connection");
const db_departments = require("./utils/db_departments");
const db_employees = require("./utils/db_employees");
const db_roles = require("./utils/db_roles");
const logo = `
___________              .__                              
\\_   _____/ _____ ______ |  |   ____ ___.__. ____   ____  
 |    __)_ /     \\\\____ \\|  |  /  _ <   |  |/ __ \\_/ __ \\ 
 |        \\  Y Y  \\  |_> >  |_(  <_> )___  \\  ___/\\  ___/ 
/_______  /__|_|  /   __/|____/\\____// ____|\\___  >\\___  >
        \\/      \\/|__|               \\/         \\/     \\/ 
___________                     __                        
\\__    ___/___________    ____ |  | __ ___________        
  |    |  \\_  __ \\__  \\ _/ ___\\|  |/ // __ \\_  __ \\       
  |    |   |  | \\// __ \\\\  \\___|    <\\  ___/|  | \\/       
  |____|   |__|  (____  /\\___  >__|_ \\\\___  >__|          
                      \\/     \\/     \\/    \\/              
"Aio, quantitas magna frumentorum est"
`;

// This function is what begins the app
function init_app() {
  console.log(logo);
  main();
}

// This is the somewhat recursive function that contains the main prompt
// It passes itself as a parameter to all functions it calls so that the
// user is returned to the main prompt when those functions are complete.
function main() {
    inquirer
      .prompt([
        {
          type: "list",
          message: "Select from the following actions:",
          name: "main_action",
          choices: ["View All Departments", "View Department Budgets", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Update Employee Manager", "Exit"]
        }
      ])
      .then((response) => {
        switch(response.main_action) {
          case "View All Departments":
            db_departments.viewDepartments(main);
            break;
          case "View Department Budgets":
            db_departments.viewDepartmentBudgets(main);
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
          case "Update Employee Manager":
            db_employees.updateEmployeeManager(inquirer, main);
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

init_app();
