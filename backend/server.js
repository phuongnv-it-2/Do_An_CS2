const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// Routers
app.use('/products', require('./routes/Product'));
app.use('/user', require('./routes/User'));
app.use('/uploads', express.static('uploads'));
app.use('/air', require('./routes/Air'));
app.use('/review', require('./routes/Review')(db));
app.use('/cart', require('./routes/Cart'));
app.use('/orders', require('./routes/Orders'));
app.use('/post', require('./routes/Post'));
app.use('/comment', require('./routes/Comment'));

const PORT = process.env.PORT || 3000;

db.sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
