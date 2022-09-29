const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");

const register = require("./controller/register");
const signin = require("./controller/signin");
const profile = require("./controller/profile");
const image = require("./controller/image");
const auth = require("./controller/authorization");

const db = knex({
    client: "pg",
    connection: {
        host: process.env.POSTGRES_HOST,
        port: 5432,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
    },
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

app.get("/", (req, res) => res.send("it is working!"));

app.post("/signin", signin.signinAuthentication(db, bcrypt));

app.post("/register", (req, res) =>
    register.handleRegister(req, res, db, bcrypt)
);

app.get("/profile/:id", auth.requireAuth, (req, res) =>
    profile.handleProfileGet(req, res, db)
);

app.post("/profile/:id", auth.requireAuth, (req, res) =>
    profile.handleProfileUpdate(req, res, db)
);

app.put("/image", auth.requireAuth, (req, res) =>
    image.handleImage(req, res, db)
);

app.post("/imageurl", auth.requireAuth, (req, res) =>
    image.handleApiCall(req, res)
);

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});
