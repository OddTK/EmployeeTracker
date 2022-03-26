USE employee_db;

INSERT INTO department (name)
VALUES
    ('Sales');
    ('Engineering');
    ('Finance');
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1);
    ('Salesperson', 80000, 1);
    ('Lead Engineer', 150000, 2);
    ('Software Engineer', 120000, 2);
    ('Account Manager',160000, 3);
    ('Accountant', 125000, 3);
    ('Legal Team Leader',250000, 4);
    ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Naruto','Uzumaki', 1, 1);
    ('Ichigo','Kurosaki', 1, null);
    ('Neji','Hyuuga', 2, 2);
    ('John','Wick', 2, null);
    ('Peter','Parker', 3, 3);
    ('Michelle','Jones', 3, null);
    ('Cersei','Lannister', 4, 4);
    ('Tyrion','Lannister', 4, null);
