module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define(
        "CartItem",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            CartID: {
                type: DataTypes.INTEGER,       // ✅ INTEGER vì Cart.id là integer
                allowNull: false,
                references: {
                    model: 'Cart',
                    key: 'id'
                }
            },
            ProductID: {
                type: DataTypes.INTEGER,       // ✅ INTEGER vì Product.id là integer
                allowNull: false,
                references: {
                    model: 'Product',
                    key: 'id'
                }
            },
            Quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: { min: 1 }
            },
            ColorName: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "default"
            },
            Price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            Subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            }
        },
        {
            freezeTableName: true,
            underscored: false,
            timestamps: true
        }
    );

    CartItem.associate = (models) => {
        // CartItem thuộc về 1 Cart
        CartItem.belongsTo(models.Cart, {
            foreignKey: "CartID",
            targetKey: "id",               // ✅ Cart.id
            as: "cart"
        });

        // CartItem tham chiếu đến 1 Product
        CartItem.belongsTo(models.Product, {
            foreignKey: "ProductID",
            targetKey: "id",               // ✅ Product.id
            as: "product"
        });
    };

    // Hook tự động tính Subtotal
    CartItem.beforeSave((item) => {
        item.Subtotal = item.Price * item.Quantity;
    });

    return CartItem;
};