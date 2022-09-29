const jwt = require("jsonwebtoken");
const redis = require("redis");

// Setup redis
const redisClient = redis.createClient({ host: "redis" });

const handleSignin = (db, bcrypt, req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject("incorrect form submission");
    }
    return db
        .select("email", "hash")
        .from("login")
        .then((data) => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db
                    .select("*")
                    .from("users")
                    .where("email", "=", email)
                    .then((user) => user[0])
                    .catch(() => Promise.reject("unable to get user"));
            } else {
                return Promise.reject("wrong credentials");
            }
        })
        .catch((err) => err);
};

const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;
    return new Promise((resolve, reject) => {
        redisClient.get(authorization, (err, reply) => {
            return err || !reply
                ? reject("Unauthorized")
                : resolve({ id: reply });
        });
    });
};

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, "JWT_SECRET", { expiresIn: "2 days" });
};

const setToken = (key, value) => {
    return Promise.resolve(redisClient.set(key, value));
};

const createSessions = (user) => {
    // JWT token, return user data
    const { id, email } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => {
            return { success: "true", userId: id, token };
        })
        .catch(console.log);
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization
        ? getAuthTokenId(req, res)
              .then((data) => res.json(data))
              .catch((err) => res.status(400).json(err))
        : handleSignin(db, bcrypt, req, res)
              .then((data) => {
                  return data.id && data.email
                      ? createSessions(data)
                      : Promise.reject(data);
              })
              .then((session) => res.json(session))
              .catch((err) => res.status(400).json(err));
};

module.exports = {
    signinAuthentication,
    redisClient,
};
