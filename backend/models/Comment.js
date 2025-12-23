module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        CommentID: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        Content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        UserID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PostID: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: "comments",
        timestamps: true
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.User, {
            foreignKey: "UserID",
            as: "user"
        });

        Comment.belongsTo(models.Post, {
            foreignKey: "PostID",
            as: "post",
            onDelete: "CASCADE"
        });
    };

    return Comment;
};
