module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        PostID: {
            type: DataTypes.STRING,
            primaryKey: true
        },

        Title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        Content: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        ImagePath: {
            type: DataTypes.STRING,
            allowNull: true
        },

        Status: {
            type: DataTypes.ENUM("DRAFT", "PUBLISHED", "HIDDEN"),
            defaultValue: "DRAFT"
        },

        UserID: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        tableName: "posts",
        timestamps: true
    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, {
            foreignKey: "UserID",
            as: "author",
            onDelete: "CASCADE"
        });
        Post.hasMany(models.Comment, {
            foreignKey: "PostID",
            as: "comments"
        });
    };

    return Post;
};
