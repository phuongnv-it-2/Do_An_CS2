'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Cart');

    // 1. Thêm cột UserID nếu chưa có
    if (!tableDescription.UserID) {
      await queryInterface.addColumn('Cart', 'UserID', {
        type: Sequelize.STRING,
        allowNull: true, // Tạm thời cho phép null
        after: 'id'
      });
    }

    // 2. Thêm cột id nếu chưa có (trường hợp hiếm)
    if (!tableDescription.id) {
      // Tạo cột id mới
      await queryInterface.addColumn('Cart', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        first: true
      });

      // Set làm primary key
      await queryInterface.changeColumn('Cart', 'id', {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      });
    }

    // 3. Đổi kiểu dữ liệu UserID nếu cần (từ INT sang STRING)
    if (tableDescription.UserID && tableDescription.UserID.type !== 'VARCHAR(255)') {
      await queryInterface.changeColumn('Cart', 'UserID', {
        type: Sequelize.STRING,
        allowNull: false
      });
    }

    // 4. Thêm foreign key constraint
    try {
      await queryInterface.addConstraint('Cart', {
        fields: ['UserID'],
        type: 'foreign key',
        name: 'fk_cart_user',
        references: {
          table: 'User',
          field: 'UserID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    } catch (error) {
      console.log('Foreign key constraint already exists or failed:', error.message);
    }

    // 5. Thêm unique index cho UserID (1 user chỉ có 1 cart)
    try {
      await queryInterface.addIndex('Cart', ['UserID'], {
        unique: true,
        name: 'unique_user_cart'
      });
    } catch (error) {
      console.log('Index already exists:', error.message);
    }

    // 6. Đảm bảo có TotalPrice
    if (!tableDescription.TotalPrice) {
      await queryInterface.addColumn('Cart', 'TotalPrice', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      });
    }

    // 7. Thêm timestamps nếu chưa có
    if (!tableDescription.createdAt) {
      await queryInterface.addColumn('Cart', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }

    if (!tableDescription.updatedAt) {
      await queryInterface.addColumn('Cart', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Xóa constraints và indexes
    try {
      await queryInterface.removeConstraint('Cart', 'fk_cart_user');
    } catch (error) {
      console.log('Cannot remove constraint:', error.message);
    }

    try {
      await queryInterface.removeIndex('Cart', 'unique_user_cart');
    } catch (error) {
      console.log('Cannot remove index:', error.message);
    }

    // Có thể xóa các cột đã thêm (tùy chọn)
    // await queryInterface.removeColumn('Cart', 'UserID');
    // await queryInterface.removeColumn('Cart', 'createdAt');
    // await queryInterface.removeColumn('Cart', 'updatedAt');
  }
};