// cleeroute.js
function checkAuth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Accès refusé" });
    }

    req.user = token === "admin"
        ? { role: "admin" }
        : { role: "user" };

    next();
}

function checkRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Permission refusée" });
        }
        next();
    };
}

module.exports = { checkAuth, checkRole };