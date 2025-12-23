'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === 'postgres') {
      // PostgreSQL - thêm giá trị mới vào ENUM type
      await queryInterface.sequelize.query(
        "ALTER TYPE \"enum_Users_Role\" ADD VALUE 'ADMIN';"
      );
    } else if (dialect === 'mysql') {
      // MySQL - cần tạo lại cột với ENUM mới
      await queryInterface.changeColumn('Users', 'Role', {
        type: Sequelize.ENUM('CUSTOMER', 'SELLER', 'ADMIN'),
        allowNull: false
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    // Lưu ý: Việc xóa giá trị từ ENUM phức tạp và không được hỗ trợ trực tiếp
    // Thông thường chỉ rollback bằng cách xóa migration
    if (dialect === 'mysql') {
      await queryInterface.changeColumn('Users', 'Role', {
        type: Sequelize.ENUM('CUSTOMER', 'SELLER'),
        allowNull: false
      });
    }
    // PostgreSQL không hỗ trợ xóa giá trị ENUM trực tiếp
  }
};