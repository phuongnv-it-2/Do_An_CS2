module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define(
        "OrderItem",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            OrderID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Orders",
                    key: "id"
                }
            },
            ProductID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Product",
                    key: "id"
                }
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            color: {
                type: DataTypes.STRING,
                allowNull: true
            },
            subtotal: {
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

    OrderItem.associate = (models) => {
        // OrderItem thuộc về Order
        OrderItem.belongsTo(models.Orders, {
            foreignKey: "OrderID",
            targetKey: "id",
            as: "order"
        });

        // OrderItem tham chiếu đến Product
        OrderItem.belongsTo(models.Product, {
            foreignKey: "ProductID",
            targetKey: "id",
            as: "product"
        });
    };

    // Hook tự động tính subtotal
    OrderItem.beforeSave((item) => {
        item.subtotal = item.price * item.quantity;
    });

    return OrderItem;
};
