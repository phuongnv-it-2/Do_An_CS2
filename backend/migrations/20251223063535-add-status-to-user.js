'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'status', {
      type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Trước tiên phải xóa ENUM constraint nếu DB dùng Postgres
    await queryInterface.removeColumn('Users', 'status');
    // Nếu Postgres, xóa ENUM type
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_User_status";');
  }
};
