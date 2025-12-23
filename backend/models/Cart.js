module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define(
        "Cart",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            UserID: {
                type: DataTypes.STRING,        // ✅ STRING vì User.UserID là "CUS00001"
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'UserID'
                }
            },
            TotalPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            freezeTableName: true,
            underscored: false,
            timestamps: true               // createdAt, updatedAt
        }
    );

    Cart.associate = (models) => {
        // Cart thuộc về 1 User
        Cart.belongsTo(models.User, {
            foreignKey: "UserID",
            targetKey: "UserID",           // ✅ Trỏ đến User.UserID (không phải id)
            as: "user"
        });

        // Cart có nhiều CartItem
        Cart.hasMany(models.CartItem, {
            foreignKey: "CartID",
            sourceKey: "id",               // ✅ Cart.id
            as: "items",
            onDelete: "CASCADE"
        });
    };

    return Cart;
};