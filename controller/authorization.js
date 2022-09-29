const redisClient = require("./signin").redisClient;

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json("Unauthorized");
    }
    return redisClient.get(authorization, (err, reply) => {
        return err || !reply ? res.status(401).json("Unathorized") : next();
    });
};

module.exports = {
    requireAuth,
};
