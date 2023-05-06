const Department = require('./Department');
const Employee = require('./Employee');
const Role = require('./Role');

Role.belongsTo(Department, {
  foreignKey: 'department_id',
});

Department.hasMany(Role, {
  foreignKey: 'department_id',
  onDelete: 'CASCADE',
});

Role.hasMany(Employee, {
  foreignKey: 'role_id',
  onDelete: 'CASCADE',
});

Employee.belongsTo(Role, {
  foreignKey: 'role_id',
});

module.exports = {Department, Employee, Role};
