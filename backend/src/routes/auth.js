"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var database_js_1 = require("../db/database.js");
var token_management_js_1 = require("../middleware/token-management.js");
var env_js_1 = require("../config/env.js");
var router = (0, express_1.Router)();
router.get('/whoami', token_management_js_1.verifyToken, function (req, res) {
    res.json({ user: req.user });
});
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, login, password, rows, user, match, accessToken, refreshToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, login = _a.login, password = _a.password;
                if (!login || !password) { // si pas de login ou password dans la requête => ERREUR : fin du login
                    return [2 /*return*/, res.status(400).json({ error: 'Identifiants manquants' })];
                }
                return [4 /*yield*/, database_js_1.default.query('SELECT * FROM users WHERE login=$1', [login])]; // on récupère le user dans la BD
            case 1:
                rows = (_b.sent()) // on récupère le user dans la BD
                .rows;
                user = rows[0];
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ error: 'Utilisateur inconnu' })]; // pas dans la base => ERREUR : fin du login
                }
                return [4 /*yield*/, bcrypt.compare(password, user.password_hash)]; // on vérifie le password
            case 2:
                match = _b.sent() // on vérifie le password
                ;
                if (!match) {
                    return [2 /*return*/, res.status(401).json({ error: 'Mot de passe incorrect' })]; // si pas de match => ERREUR : fin du login
                }
                accessToken = (0, token_management_js_1.createAccessToken)({ id: user.id, role: user.role }) // création du token d'accès
                ;
                refreshToken = (0, token_management_js_1.createRefreshToken)({ id: user.id, role: user.role }) // création du refresh token
                ;
                res.cookie('access_token', accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000,
                });
                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.json({
                    message: 'Authentification réussie',
                    user: { login: user.login, role: user.role }
                }); // connexion successful
                return [2 /*return*/];
        }
    });
}); });
router.post('/logout', function (_req, res) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({ message: 'Déconnexion réussie' });
});
router.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, login, password, hashed, rows, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, login = _a.login, password = _a.password;
                if (!login || !password) {
                    return [2 /*return*/, res.status(400).json({ error: 'Champs manquants' })];
                }
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 1:
                hashed = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, database_js_1.default.query("INSERT INTO users (login, password_hash, role)\n       VALUES ($1, $2, 'user')\n       RETURNING id, login, role", [login, hashed])];
            case 3:
                rows = (_b.sent()).rows;
                res.status(201).json({ message: 'Utilisateur créé', user: rows[0] });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                if (err_1.code === '23505') { // doublon PostgreSQL
                    return [2 /*return*/, res.status(409).json({ error: 'Login déjà utilisé' })];
                }
                console.error(err_1);
                res.status(500).json({ error: 'Erreur serveur' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/refresh', function (req, res) {
    var _a;
    var refresh = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
    if (!refresh) {
        return res.status(401).json({ error: 'Refresh token manquant' });
    }
    try {
        var decoded = jwt.verify(refresh, env_js_1.JWT_SECRET);
        var newAccess = (0, token_management_js_1.createAccessToken)({ id: decoded.id, role: decoded.role });
        res.cookie('access_token', newAccess, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        res.json({ message: 'Token renouvelé' });
    }
    catch (_b) {
        res.status(403).json({ error: 'Refresh token invalide ou expiré' });
    }
});
exports.default = router;
