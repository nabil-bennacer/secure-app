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
var fs = require("fs");
var https = require("https");
var express = require("express");
var cors = require("cors");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
require("./types/express");
var public_js_1 = require("./routes/public.js");
var initAdmin_js_1 = require("./db/initAdmin.js");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, initAdmin_js_1.ensureAdmin)()];
            case 1:
                _a.sent(); // Vérification ou création du compte admin
                return [2 /*return*/];
        }
    });
}); })();
var users_js_1 = require("./routes/users.js");
require("dotenv/config");
var auth_js_1 = require("./routes/auth.js");
var token_management_js_1 = require("./middleware/token-management.js");
var auth_admin_js_1 = require("./middleware/auth-admin.js");
// Création de l'application Express
var app = express();
// Ajout manuel des principaux en-têtes HTTP de sécurité
app.use(function (req, res, next) {
    // Empêche le navigateur d'interpréter un fichier d'un autre type MIME -> attaque : XSS via upload malveillant
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Interdit l'intégration du site dans des iframes externes -> attaque : Clickjacking
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    // Évite que les URL avec paramètres sensibles apparaissent dans les en-têtes "Referer" -> attaque : Token ou paramètres dans l'URL
    res.setHeader('Referrer-Policy', 'no-referrer');
    // Politique de ressources : seules les ressources du même site peuvent être chargées -> attaque : Fuite de données statiques
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    // Politique d'ouverture inter-origine (Empêche le partage de contexte entre onglets) -> attaque : de type Spectre - isolation des fenêtres
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    // Politique d'intégration inter-origine (empêche les inclusions non sûres : force l'isolation complète des ressources intégrées) -> Attaques par chargement de scripts
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});
app.use(morgan('dev')); // Log des requêtes : Visualiser le flux de requêtes entre Angular et Express
app.use(express.json());
app.use(cookieParser());
// Configuration CORS : autoriser le front Angular en HTTPS local
app.use(cors({
    origin: 'https://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Routes publiques
app.use('/api/public', public_js_1.default);
app.use('/api/users', users_js_1.default);
app.use('/api/auth', auth_js_1.default);
app.use('/api/users', token_management_js_1.verifyToken, users_js_1.default); // protégé
app.use('/api/admin', token_management_js_1.verifyToken, auth_admin_js_1.requireAdmin, function (req, res) {
    res.json({ message: 'Bienvenue admin' });
});
// Chargement du certificat et clé générés par mkcert (étape 0)
var key = fs.readFileSync('./certs/localhost-key.pem');
var cert = fs.readFileSync('./certs/localhost.pem');
// Lancement du serveur HTTPS
https.createServer({ key: key, cert: cert }, app).listen(4000, function () {
    console.log('👍 Serveur API démarré sur https://localhost:4000');
});
