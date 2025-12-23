'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Product', 'mod3D', {
      type: Sequelize.STRING, // hoặc Sequelize.TEXT nếu đường dẫn dài
      allowNull: true,        // có thể null nếu sản phẩm chưa có mod 3D
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Product', 'mod3D');
  }
};
