function requireRole(role) {
    return function(req, res, next) {
        if (req.role && req.role === role) {
            next();
        } else {
            res.status(403).json({message: "Forbidden"});
        }
    }
}

const requireAdmin = requireRole('admin');
const requireUser = requireRole('user');

module.exports = {
    requireAdmin,
    requireUser
};