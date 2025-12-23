// models/Order.js
module.exports = (sequelize, DataTypes) => {
    const Orders = sequelize.define(
        "Orders", // ✅ Không đặt là Order
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            UserID: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "User",
                    key: "UserID"
                }
            },
            status: {
                type: DataTypes.ENUM("pending", "confirmed", "shipping", "completed", "canceled"),
                allowNull: false,
                defaultValue: "pending"
            },
            totalPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            paymentMethod: {
                type: DataTypes.STRING,
                allowNull: true
            },
            shippingAddress: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        },
        {
            freezeTableName: true, // ✅ Sequelize sẽ không tự thêm "s"
            underscored: false,
            timestamps: true
        }
    );

    Orders.associate = (models) => {
        Orders.belongsTo(models.User, {
            foreignKey: "UserID",
            targetKey: "UserID",
            as: "buyer"
        });
        Orders.hasMany(models.OrderItem, {
            foreignKey: "OrderID",
            sourceKey: "id",
            as: "items",
            onDelete: "CASCADE"
        });
    };

    return Orders;
};
