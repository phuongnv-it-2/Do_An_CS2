const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const db = require('./models');
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

//Routers
const productRouter = require('./routes/Product');
app.use('/products', productRouter);
const userRouter = require('./routes/User');
app.use('/user', userRouter);
app.use('/uploads', express.static('uploads'));
const airRouter = require('./routes/Air');
app.use('/air', airRouter);
const reviewRouter = require("./routes/Review")(db);
app.use("/review", reviewRouter);
const cartRoutes = require('./routes/Cart');
app.use('/cart', cartRoutes);
const orderRoutes = require("./routes/Orders");
app.use("/orders", orderRoutes);
const postRoutes = require("./routes/Post");
app.use("/post", postRoutes);
const commentRoutes = require("./routes/Comment");
app.use("/comment", commentRoutes);






db.sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});