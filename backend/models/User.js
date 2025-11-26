module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
            type: DataTypes.ENUM("CUSTOMER", "SELLER"),
            allowNull: false
        }
    });

    User.beforeCreate(async (user, options) => {
        const prefix = user.Role === "SELLER" ? "SEL" : "CUS";
        const count = await User.count({ where: { Role: user.Role } });
        const number = String(count + 1).padStart(4, "0");

        // Timestamp: yyyymmddhhmmss + mili giây => luôn unique
        const timestamp = new Date()
            .toISOString()
            .replace(/[-:TZ.]/g, "") // xoá ký tự đặc biệt
            .slice(0, 17); // lấy đến mili giây

        user.UserID = `${prefix}${number}-${timestamp}`;
    });
    User.associate = (models) => {
        User.hasMany(models.Product, { foreignKey: 'UserID', as: 'products' });
    };
    return User;
};
