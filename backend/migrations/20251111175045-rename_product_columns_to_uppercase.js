'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Products', 'name', 'Name');
    await queryInterface.renameColumn('Products', 'description', 'Description');
    await queryInterface.renameColumn('Products', 'price', 'Price');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Products', 'Name', 'name');
    await queryInterface.renameColumn('Products', 'Description', 'description');
    await queryInterface.renameColumn('Products', 'Price', 'price');
  }
};
