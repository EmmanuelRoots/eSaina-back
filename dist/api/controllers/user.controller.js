"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tsoa_1 = require("tsoa");
const user_sa_1 = __importDefault(require("../../service/applicative/user.sa"));
//import { TokenMiddleware } from '../middleware/token.middleware'
/**
 * Contrôleur pour la gestion des utilisateurs dans le système.
 *
 * Ce contrôleur permet de créer, authentifier, récupérer, mettre à jour et supprimer
 * des utilisateurs. Il gère également les fonctionnalités liées aux comptes utilisateurs
 * comme la réinitialisation de mot de passe, l'authentification multifacteur, la liaison
 * avec des comptes externes, et la gestion des fichiers utilisateur.
 */
let UserController = class UserController extends tsoa_1.Controller {
    /**
     * Inscrit un nouvel utilisateur dans le système.
     *
     * Cet endpoint permet de créer un nouveau compte utilisateur avec
     * les informations fournies. Une fois inscrit, l'utilisateur pourra
     * se connecter au système et accéder aux fonctionnalités correspondant
     * à son niveau d'autorisation.
     *
     * @param body Les données de l'utilisateur à inscrire
     * @returns Les informations de l'utilisateur créé et un jeton d'authentification
     * @example body {
     *   "email": "utilisateur@example.com",
     *   "firstName": "Jean",
     *   "lastName": "Dupont",
     *   "password": "MotDePasse123!",
     *   "phoneNumber": "+33123456789",
     *   "role": "utilisateur"
     * }
     * @example {
     *   "success": true,
     *   "message": "Utilisateur inscrit avec succès",
     *   "data": {
     *     "user": {
     *       "uuid": "123e4567-e89b-12d3-a456-426614174000",
     *       "email": "utilisateur@example.com",
     *       "firstName": "Jean",
     *       "lastName": "Dupont",
     *       "phoneNumber": "+33123456789",
     *       "role": "utilisateur",
     *       "createdAt": "2023-04-10T14:30:00Z"
     *     },
     *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *   }
     * }
     */
    async subscribe(body) {
        return user_sa_1.default.addUser(body);
    }
    /**
     * Authentifie un utilisateur existant.
     *
     * Cet endpoint permet à un utilisateur de se connecter au système en
     * fournissant ses identifiants (email et mot de passe). En cas de succès,
     * un jeton d'authentification est généré et retourné pour les requêtes
     * ultérieures.
     *
     * @param body Les identifiants de connexion de l'utilisateur
     * @returns Les informations de l'utilisateur et un jeton d'authentification
     * @example body {
     *   "email": "utilisateur@example.com",
     *   "password": "MotDePasse123!"
     * }
     * @example {
     *   "success": true,
     *   "message": "Connexion réussie",
     *   "data": {
     *     "user": {
     *       "uuid": "123e4567-e89b-12d3-a456-426614174000",
     *       "email": "utilisateur@example.com",
     *       "firstName": "Jean",
     *       "lastName": "Dupont",
     *       "role": "utilisateur"
     *     },
     *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *   }
     * }
     */
    async login(body) {
        return user_sa_1.default.logUser(body);
    }
    /**
     * Génère un nouveau jeton d'accès à l'aide d'un refresh token valide.
     *
     * Cet endpoint permet de prolonger la session d'un utilisateur sans
     * avoir à se reconnecter. Le refresh token fourni doit être valide
     * et non expiré. Une fois utilisé, il est révoqué (rotation du token).
     *
     * @param body Le refresh token actuel
     * @returns Un nouveau access token et un nouveau refresh token
     * @example body {
     *   "refreshToken": "ancien_refresh_token_12345"
     * }
     * @example {
     *   "success": true,
     *   "message": "Tokens renouvelés avec succès",
     *   "data": {
     *     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *     "refreshToken": "nouveau_refresh_token_67890"
     *   }
     * }
     */
    async refresh(body) {
        return user_sa_1.default.refreshToken(body.refresToken);
    }
};
exports.UserController = UserController;
__decorate([
    (0, tsoa_1.Post)('subscribe'),
    (0, tsoa_1.Response)(201, 'Utilisateur inscrit avec succès'),
    (0, tsoa_1.Response)(400, 'Données invalides'),
    (0, tsoa_1.Response)(409, 'L\'utilisateur existe déjà'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "subscribe", null);
__decorate([
    (0, tsoa_1.Post)('login'),
    (0, tsoa_1.Response)(200, 'Connexion réussie'),
    (0, tsoa_1.Response)(401, 'Identifiants invalides'),
    (0, tsoa_1.Response)(403, 'Compte désactivé'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Post)('refresh'),
    (0, tsoa_1.Response)(200, 'Tokens renouvelés avec succès'),
    (0, tsoa_1.Response)(401, 'Refresh token invalide ou expiré', { success: false, message: 'Invalid or expired refresh token', data: null }),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refresh", null);
exports.UserController = UserController = __decorate([
    (0, tsoa_1.Route)('user'),
    (0, tsoa_1.Tags)('user')
], UserController);
