import {
  Body,
  Controller,
  Post,
  Route,
  Tags,
  Response,
} from 'tsoa'

import LoginDTO, { mfaDTO } from '../../data/dto/login.dto'
import { UserDTO } from '../../data/dto/user.dto'
import userSA from '../../service/applicative/user.sa'
//import { TokenMiddleware } from '../middleware/token.middleware'


/**
 * Contrôleur pour la gestion des utilisateurs dans le système.
 * 
 * Ce contrôleur permet de créer, authentifier, récupérer, mettre à jour et supprimer
 * des utilisateurs. Il gère également les fonctionnalités liées aux comptes utilisateurs
 * comme la réinitialisation de mot de passe, l'authentification multifacteur, la liaison
 * avec des comptes externes, et la gestion des fichiers utilisateur.
 */
@Route('user')
@Tags('user')
export class UserController extends Controller {
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
  @Post('subscribe')
  @Response(201, 'Utilisateur inscrit avec succès')
  @Response(400, 'Données invalides')
  @Response(409, 'L\'utilisateur existe déjà')
  public async subscribe(@Body() body: UserDTO) {
    return userSA.addUser(body)
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
  @Post('login')
  @Response(200, 'Connexion réussie')
  @Response(401, 'Identifiants invalides')
  @Response(403, 'Compte désactivé')
  public async login(@Body() body: LoginDTO) {
    return userSA.logUser(body)
  }

  /**
   * Authentifie un utilisateur via un système d'authentification multifacteur (MFA).
   * 
   * Cet endpoint permet la connexion d'un utilisateur via un système MFA externe
   * comme Google, Facebook, ou un autre fournisseur d'identité. Si l'utilisateur
   * n'existe pas encore, un nouveau compte peut être créé automatiquement.
   * 
   * @param body Les données d'authentification MFA
   * @returns Les informations de l'utilisateur et un jeton d'authentification
   * @example body {
   *   "provider": "google",
   *   "token": "ya29.a0AfH6SMC9X...",
   *   "email": "utilisateur@example.com"
   * }
   * @example {
   *   "success": true,
   *   "message": "Connexion MFA réussie",
   *   "data": {
   *     "user": {
   *       "uuid": "123e4567-e89b-12d3-a456-426614174000",
   *       "email": "utilisateur@example.com",
   *       "firstName": "Jean",
   *       "lastName": "Dupont",
   *       "role": "utilisateur"
   *     },
   *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   *     "isNewUser": false
   *   }
   * }
   */
  // @Post('mfa-login')
  // @Response(200, 'Connexion MFA réussie')
  // @Response(400, 'Données invalides ou jeton MFA expiré')
  // @Response(401, 'Authentification MFA échouée')
  // public async mfaLogin(@Body() body: mfaDTO) {
  //   return userSA.loginOrRegister(body)
  // }
}
