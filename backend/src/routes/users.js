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
var database_js_1 = require("../db/database.js");
var bcrypt = require("bcryptjs");
var token_management_js_1 = require("../middleware/token-management.js");
var auth_admin_js_1 = require("../middleware/auth-admin.js");
var router = (0, express_1.Router)();
// Récupération du profil utilisateur (authentifié)
router.get('/me', token_management_js_1.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, rows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                return [4 /*yield*/, database_js_1.default.query('SELECT id, login, role FROM users WHERE id=$1', [user === null || user === void 0 ? void 0 : user.id])];
            case 1:
                rows = (_a.sent()).rows;
                res.json(rows[0]);
                return [2 /*return*/];
        }
    });
}); });
// Liste de tous les utilisateurs (réservée aux admins)
router.get('/', [token_management_js_1.verifyToken, auth_admin_js_1.requireAdmin], function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_js_1.default.query('SELECT id, login, role FROM users ORDER BY id')];
            case 1:
                rows = (_a.sent()).rows;
                res.json(rows);
                return [2 /*return*/];
        }
    });
}); });
// Obtenir un utilisateur par son ID
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, rows, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params // Récupération de l'ID depuis les paramètres de l'URL
                .id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, database_js_1.default.query('SELECT id, login, role FROM users WHERE id = $1', [id])];
            case 2:
                rows = (_a.sent()).rows;
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: 'Utilisateur non trouvé' })];
                }
                res.json(rows[0]);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                res.status(500).json({ error: 'Erreur serveur' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Création d'un utilisateur
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, login, password, hash, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, login = _a.login, password = _a.password;
                if (!login || !password) {
                    return [2 /*return*/, res.status(400).json({ error: 'Login et mot de passe requis' })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 2:
                hash = _b.sent();
                return [4 /*yield*/, database_js_1.default.query('INSERT INTO users (login, password_hash) VALUES ($1, $2)', [login, hash])];
            case 3:
                _b.sent();
                res.status(201).json({ message: 'Utilisateur créé' });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _b.sent();
                if (err_2.code === '23505') {
                    res.status(409).json({ error: 'Login déjà existant' });
                }
                else {
                    console.error(err_2);
                    res.status(500).json({ error: 'Erreur serveur' });
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
