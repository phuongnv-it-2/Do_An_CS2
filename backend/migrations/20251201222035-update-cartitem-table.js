'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('CartItem');

    // 1. Thêm cột id nếu chưa có
    if (!tableDescription.id) {
      await queryInterface.addColumn('CartItem', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        first: true
      });

      await queryInterface.changeColumn('CartItem', 'id', {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      });
    }

    // 2. Thêm CartID nếu chưa có
    if (!tableDescription.CartID) {
      await queryInterface.addColumn('CartItem', 'CartID', {
        type: Sequelize.INTEGER,
        allowNull: true, // Tạm thời
        after: 'id'
      });
    }

    // 3. Đổi kiểu dữ liệu CartID nếu cần
    if (tableDescription.CartID && tableDescription.CartID.type !== 'INT') {
      await queryInterface.changeColumn('CartItem', 'CartID', {
        type: Sequelize.INTEGER,
        allowNull: false
      });
    }

    // 4. Thêm ProductID nếu chưa có
    if (!tableDescription.ProductID) {
      await queryInterface.addColumn('CartItem', 'ProductID', {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: 'CartID'
      });
    }

    // 5. Thêm Quantity nếu chưa có
    if (!tableDescription.Quantity) {
      await queryInterface.addColumn('CartItem', 'Quantity', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      });
    }

    // 6. Thêm ColorName nếu chưa có
    if (!tableDescription.ColorName) {
      await queryInterface.addColumn('CartItem', 'ColorName', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'default'
      });
    }

    // 7. Thêm Price nếu chưa có
    if (!tableDescription.Price) {
      await queryInterface.addColumn('CartItem', 'Price', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      });
    }

    // 8. Thêm Subtotal nếu chưa có
    if (!tableDescription.Subtotal) {
      await queryInterface.addColumn('CartItem', 'Subtotal', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      });
    }

    // 9. Thêm foreign key cho CartID
    try {
      await queryInterface.addConstraint('CartItem', {
        fields: ['CartID'],
        type: 'foreign key',
        name: 'fk_cartitem_cart',
        references: {
          table: 'Cart',
          field: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    } catch (error) {
      console.log('Foreign key constraint for CartID already exists:', error.message);
    }

    // 10. Thêm foreign key cho ProductID
    try {
      await queryInterface.addConstraint('CartItem', {
        fields: ['ProductID'],
        type: 'foreign key',
        name: 'fk_cartitem_product',
        references: {
          table: 'Product',
          field: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    } catch (error) {
      console.log('Foreign key constraint for ProductID already exists:', error.message);
    }

    // 11. Thêm index cho CartID
    try {
      await queryInterface.addIndex('CartItem', ['CartID'], {
        name: 'idx_cartitem_cartid'
      });
    } catch (error) {
      console.log('Index for CartID already exists:', error.message);
    }

    // 12. Thêm index cho ProductID
    try {
      await queryInterface.addIndex('CartItem', ['ProductID'], {
        name: 'idx_cartitem_productid'
      });
    } catch (error) {
      console.log('Index for ProductID already exists:', error.message);
    }

    // 13. Thêm unique constraint (1 product + 1 color chỉ xuất hiện 1 lần trong cart)
    try {
      await queryInterface.addIndex('CartItem', ['CartID', 'ProductID', 'ColorName'], {
        unique: true,
        name: 'unique_cart_product_color'
      });
    } catch (error) {
      console.log('Unique index already exists:', error.message);
    }

    // 14. Thêm timestamps nếu chưa có
    if (!tableDescription.createdAt) {
      await queryInterface.addColumn('CartItem', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }

    if (!tableDescription.updatedAt) {
      await queryInterface.addColumn('CartItem', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Xóa constraints và indexes
    try {
      await queryInterface.removeConstraint('CartItem', 'fk_cartitem_cart');
      await queryInterface.removeConstraint('CartItem', 'fk_cartitem_product');
      await queryInterface.removeIndex('CartItem', 'idx_cartitem_cartid');
      await queryInterface.removeIndex('CartItem', 'idx_cartitem_productid');
      await queryInterface.removeIndex('CartItem', 'unique_cart_product_color');
    } catch (error) {
      console.log('Cannot remove constraints/indexes:', error.message);
    }
  }
};  