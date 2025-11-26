'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Product', 'ImgPath', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'Price' // Thêm sau cột Price (chỉ hoạt động với MySQL)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Product', 'ImgPath');
  }
};