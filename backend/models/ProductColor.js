module.exports = (sequelize, DataTypes) => {
    const ProductColor = sequelize.define(
        "ProductColor",
        {
            ColorName: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            freezeTableName: true,
            underscored: false,
        }
    );

    ProductColor.associate = (models) => {
        ProductColor.belongsTo(models.Product, {
            foreignKey: "ProductID",
            as: "product",
        });
    };

    return ProductColor;
};
