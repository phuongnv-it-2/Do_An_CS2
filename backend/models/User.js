// models/User.js - Thêm association Cart
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            UserID: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            UserName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Email: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            ImgPath: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            Password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Role: {
                type: DataTypes.ENUM("CUSTOMER", "SELLER", "ADMIN"),
                allowNull: false
            }
        },
        {
            tableName: "User",        // ✅ BẮT BUỘC
            freezeTableName: true     // ✅ BẮT BUỘC
        }
    );


    User.beforeCreate(async (user, options) => {
        const prefix = user.Role === "SELLER" ? "SEL" : "CUS";
        const count = await User.count({ where: { Role: user.Role } });
        const number = String(count + 1).padStart(4, "0");

        const timestamp = new Date()
            .toISOString()
            .replace(/[-:TZ.]/g, "")
            .slice(0, 17);

        user.UserID = `${prefix}${number}-${timestamp}`;
    });

    User.associate = (models) => {
        // User có nhiều Products
        User.hasMany(models.Product, {
            foreignKey: 'UserID',
            as: 'products'
        });
        User.hasMany(models.ProductReview, {
            foreignKey: 'UserID',
            as: 'reviews'
        });
        User.hasOne(models.Cart, {
            foreignKey: 'UserID',
            as: 'cart',
            onDelete: 'CASCADE'
        });
        User.hasMany(models.Comment, {
            foreignKey: "UserID",
            as: "comments"
        });

    };


    return User;
};