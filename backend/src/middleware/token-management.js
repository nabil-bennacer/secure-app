"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = createAccessToken;
exports.createRefreshToken = createRefreshToken;
exports.verifyToken = verifyToken;
var jwt = require("jsonwebtoken");
var env_js_1 = require("../config/env.js");
// --- Fonctions de création et de vérification des tokens ---
function createAccessToken(user) {
    return jwt.sign(user, env_js_1.JWT_SECRET, { expiresIn: env_js_1.JWT_EXPIRATION });
}
function createRefreshToken(user) {
    return jwt.sign(user, env_js_1.JWT_SECRET, { expiresIn: env_js_1.REFRESH_EXPIRATION });
}
function verifyToken(req, res, next) {
    var _a;
    var token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }
    try {
        var decoded = jwt.verify(token, env_js_1.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (_b) {
        res.status(403).json({ error: 'Token invalide ou expiré' });
    }
}
