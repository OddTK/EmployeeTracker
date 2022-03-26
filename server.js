const inquirer = require('inquirer');
const table = require('console.table');
const connection = require('./config/connection');
require('console.table');

function runEmployees() {
    inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'option',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add department',
                'Add roles',
                'Add employees',
                'Update employee roles',
                'Update employee manager',
                'Exit'
            ]
        }).then(answer => {
            switch (answer.option) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add department":
                    addDepartment();
                    break;
                case "Add roles":
                    addRoles();
                    break;
                case "Add employees":
                    addEmployee();
                    break;
                case "Update employee roles":
                    updateEmployeeRole();
                    break;
                case "Update employee manager":
                    updateManager()
                    break;
                case "View employee by manager":
                    viewEmployeeByManager()
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        })
};

function viewAllDepartments(){
    connection.query(
        'SELECT * FROM department', (err,res) => {
            if (err) {
                throw err;
            }
            runEmployees();
        }
    )
};

function viewAllRoles(){
    connection.query(
        'select ro.title as Role_title, ro.salary as Salary , dept.name as DepartmentName from Role ro left join department as dept on dept.id = ro.department_id', (err, res) => {
            if(err){
                throw err;
            }
            runEmployees();
        }
    )
};

function viewAllEmployees(){
    const query='Select emp.id as EmployeeID, concat(emp.first_name,"  ",emp.last_name ) as EmployeeName , ro.title as Job_tittle, ro.salary as Salary,dept.name as Department_Name,concat(emp2.first_name,"  ",emp2.last_name) as ManagerName from employee_tracker_db.employee as emp left join employee_tracker_db.employee as emp2 on emp2.id=emp.manager_id left join employee_tracker_db.Role as ro on emp.role_id=ro.id left join employee_tracker_db.department as dept on dept.id = ro.department_id';
    connection.query(query, (err, res) => {
            if (err) { throw err; }
            console.table(res);
            runEmployees();
        }
    )
};

function addDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'Add a department name'
        }
    ]).then(answer=>{
        console.log(answer);
        connection.query('INSERT INTO department SET?',{name: answer.department},(err,res)=>{
            if(err)throw err;
            runEmployees();
        });
    });
};

function addRoles(){
    connection.promise().query("SELECT * FROM department")
        .then((res)=>{
            return res[0].map(dept=>{
                return{
                    name: dept.name,
                    value: dept.id
                }
            })
        })
        .then((departments)=>{
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'roles',
                    message: 'Add a role'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter a salary'
                },
                {
                    type: 'list',
                    name: 'dept',
                    choices: departments,
                    message: 'Select a department'
                }
            ])
        }).then(answer=>{
            console.log(answer);
            return connection.promise().query('INSERT INTO role SET ?',{title: answer.roles,salary: answer.salary,department_id: answer.dept});
        }).then(res=>{
            console.log('Added new role')
            runEmployees();
        }).catch(err=>{
            throw err
        });
};


function selectRole(){
    return connection.promise().query("SELECT * FROM role")
        .then(res=>{
            return res[0].map(role=>{
                return{
                    name: role.title,
                    value: role.id
                }
            })
        })
};

function selectManager(){
    return connection.promise().query("SELECT * FROM employee ")
        .then(res=>{
            return res[0].map(manager=>{
                return{
                    name: `${manager.first_name}${manager.last_name}`,
                    value: manager.id,
                }
            })
        })
};

async function addEmployee(){
    const managers = await selectManager();
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "role",
            type: "list",
            message: "What is the employee's role?",
            choices: await selectRole()
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: managers
        }
    ]).then(function(res) {
        let roleId = res.role
        let managerId = res.manager
        connection.query("INSERT INTO Employee SET ?",
            {
                first_name: res.firstName,
                last_name: res.lastName,
                manager_id: managerId,
                role_id: roleId
            },
            function(err) {
                if (err) throw err;
                runEmployees();
            })
    })
};

function updateEmployeeRole(){
    connection.promise().query('SELECT *  FROM employee')
        .then((res) => {
            return res[0].map(employee => {
                return{
                    name: employee.first_name,
                    value: employee.id
                }
            })
        }).then(async(employeeList)=>{
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeListId',
                    choices: employeeList,
                    message: 'Which employee role do you want to update?'
                },
                {
                    type: 'list',
                    name: 'roleId',
                    choices: await selectRole(),
                    message: 'Select role'
                }
            ])
        }).then(answer=>{
            console.log(answer);
            return connection.promise().query("UPDATE employee SET  role_id = ? WHERE id = ?",
                    [
                        answer.roleId,
                        answer.employeeListId,
                    ],
            );
        }).then(res=>{
            runEmployees();
        }).catch(err=>{
            throw err
        });
};

function updateManager(){
    connection.promise().query('SELECT *  FROM employee')
        .then((res)=>{
            return res[0].map(employee=>{
                return{
                    name: employee.first_name,
                    value: employee.id
                }
            })
        }).then(async(employeeList)=>{
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeListId',
                    choices: employeeList,
                    message: 'Please select the employee you want to assign manager to:.'
                },
                {
                    type: 'list',
                    name: 'managerId',
                    choices: await selectManager(),
                    message: 'Please select the employee you want to make manager.'
                }
            ])
        }).then(answer=>{
            console.log(answer);
            return connection.promise().query("UPDATE employee SET  manager_id = ? WHERE id = ?",
                    [
                        answer.managerId,
                        answer.employeeListId,
                    ],
            );
        }).then(res=>{
            runEmployees();
        }).catch(err=>{
            throw err
        });
};

runEmployees();
