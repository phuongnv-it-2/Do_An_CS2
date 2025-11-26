module.exports = (sequelize, DataTypes) => {
    const ProductReview = sequelize.define(
        "ProductReview",
        {
            Rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: { min: 1, max: 5 }
            },
            Comment: {
                type: DataTypes.TEXT,
                allowNull: true,
            }
        }
    );

    ProductReview.associate = (models) => {
        // Review thuộc về 1 sản phẩm
        ProductReview.belongsTo(models.Product, {
            foreignKey: "ProductID",
            as: "product",
        });

        // Review thuộc về 1 user
        ProductReview.belongsTo(models.User, {
            foreignKey: "UserID",
            as: "user",
        });
    };

    return ProductReview;
};
