import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport'

//Import routes
import adminRoutes from './routes/admin_route.js';
import managerRoutes from './routes/manager_route.js';

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());
app.use(passport.initialize());

// require("./middlewares/passport")(passport);
import middlepassport from './middleware/passport.js';
middlepassport(passport);


//Routes
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);



//mongo connection
const CONNECTION_URL = 'mongodb+srv://gamiflexwebapp:webapp1gamiflex@gamiflex.um0jy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);