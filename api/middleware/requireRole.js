function requireRole(role) {
    return function(req, res, next) {
        // If req.role is not even defined
        if (typeof req.role === 'undefined') {
            res.status(400).json({message: "Role not provided"});
            return;
        }
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