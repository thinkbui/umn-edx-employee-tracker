INSERT INTO departments (name)
VALUES ("Test Department"),
       ("Executive"),
       ("Sales"),
       ("Engineering"),
       ("Information Technology"),
       ("Public Relations"),
       ("Operations");

INSERT INTO roles (title, department_id, salary)
VALUES ("Test Manager", 1, 2.50),
       ("Test Employee", 1, 1.50);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Aaron", "Aaronson", 1, NULL),
       ("Alice", "Smith", 2, 1),
       ("Bob", "Jones", 2, 1);
