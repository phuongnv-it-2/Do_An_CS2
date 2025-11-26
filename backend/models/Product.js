module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define(
        "Product",
        {
            Name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            Price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            ImgPath: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            freezeTableName: true,
            underscored: false,
        }
    );

    // GỘP THÀNH 1 ASSOCIATION DUY NHẤT
    Product.associate = (models) => {
        Product.belongsTo(models.User, {
            foreignKey: "UserID",
            as: "creator"
        });
        Product.hasMany(models.ProductColor, {
            foreignKey: "ProductID",
            as: "colors",
            onDelete: "CASCADE",
        });
        Product.hasMany(models.ProductReview, {
            foreignKey: "ProductID",
            as: "reviews",
            onDelete: "CASCADE",
        });
    };

    return Product;
};
