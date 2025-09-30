import {
  Body,
  Controller,
  Delete,
  FormField,
  Get,
  Header,
  Middlewares,
  Path,
  Post,
  Put,
  Query,
  Request,
  Route,
  Tags,
  UploadedFile,
  Response,
  Security
} from 'tsoa'

import express from 'express' // Assurez-vous d'importer ExpressResponse
import LoginDTO, { mfaDTO } from '../../data/dto/login.dto'
import { PartialUserDTO, UserDTO } from '../../data/dto/user.dto'
import { ApiError } from '../../data/exception/api.exception'
import { CustomRequest } from '../../data/extension/request.extension'
import userSA from '../../service/applicative/user.sa'
import { CommonMiddleware } from '../middleware/common.middleware'
import { TokenMiddleware } from '../middleware/token.middleware'

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
  @Post('mfa-login')
  @Response(200, 'Connexion MFA réussie')
  @Response(400, 'Données invalides ou jeton MFA expiré')
  @Response(401, 'Authentification MFA échouée')
  public async mfaLogin(@Body() body: mfaDTO) {
    return userSA.loginOrRegister(body)
  }

  /**
   * Récupère les informations d'un utilisateur spécifique.
   * 
   * Cet endpoint permet d'obtenir les détails complets d'un utilisateur
   * identifié par son ID unique. Cette information est généralement réservée
   * aux administrateurs ou à l'utilisateur lui-même.
   * 
   * @param id Identifiant unique de l'utilisateur à récupérer
   * @returns Les détails de l'utilisateur demandé
   * @example {
   *   "success": true,
   *   "data": {
   *     "uuid": "123e4567-e89b-12d3-a456-426614174000",
   *     "email": "utilisateur@example.com",
   *     "firstName": "Jean",
   *     "lastName": "Dupont",
   *     "phoneNumber": "+33123456789",
   *     "role": "utilisateur",
   *     "isActive": true,
   *     "lastLogin": "2023-05-20T09:15:00Z",
   *     "createdAt": "2023-04-10T14:30:00Z",
   *     "updatedAt": "2023-05-20T09:15:00Z"
   *   }
   * }
   */
  @Get('find/:id')
  @Response(200, 'Utilisateur récupéré avec succès')
  @Response(404, 'Utilisateur non trouvé')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  public async find(@Path('id') id: string) {
    return userSA.findUser(id)
  }

  /**
   * Récupère une liste paginée d'utilisateurs avec options de filtrage et de tri.
   * 
   * Cet endpoint permet d'obtenir une liste d'utilisateurs du système avec
   * diverses options pour filtrer, trier et paginer les résultats. Cette
   * fonctionnalité est généralement réservée aux administrateurs pour
   * la gestion des utilisateurs.
   * 
   * @param orderBy Champ sur lequel trier les résultats
   * @param page Numéro de la page à récupérer (pagination)
   * @param dataPerPage Nombre d'utilisateurs par page
   * @param order Direction du tri (ascendant ou descendant)
   * @param queryField Champ sur lequel effectuer une recherche
   * @param queryValue Valeur à rechercher dans le champ spécifié
   * @param archived Inclure les utilisateurs archivés
   * @param filterByEntity Filtrer par entité
   * @param entityId Identifiant de l'entité pour le filtrage
   * @returns Liste paginée des utilisateurs correspondant aux critères
   * @example {
   *   "success": true,
   *   "data": {
   *     "users": [
   *       {
   *         "uuid": "123e4567-e89b-12d3-a456-426614174000",
   *         "email": "utilisateur1@example.com",
   *         "firstName": "Jean",
   *         "lastName": "Dupont",
   *         "role": "utilisateur",
   *         "isActive": true,
   *         "createdAt": "2023-04-10T14:30:00Z"
   *       },
   *       {
   *         "uuid": "223e4567-e89b-12d3-a456-426614174001",
   *         "email": "utilisateur2@example.com",
   *         "firstName": "Marie",
   *         "lastName": "Martin",
   *         "role": "administrateur",
   *         "isActive": true,
   *         "createdAt": "2023-03-15T11:20:00Z"
   *       }
   *     ],
   *     "total": 42,
   *     "page": 1,
   *     "perPage": 10,
   *     "pages": 5
   *   }
   * }
   */
  @Get('find-all')
  @Response(200, 'Liste des utilisateurs récupérée avec succès')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  public async findAll(
    @Query('orderBy') orderBy?: string,
    @Query('page') page?: string,
    @Query('dataPerPage') dataPerPage?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('queryField') queryField?: string,
    @Query('queryValue') queryValue?: string,
    @Query('archived') archived?: boolean,
    @Query('filterByEntity') filterByEntity?: boolean,
    @Header('entity-id') entityId?: string
  ) {
    return userSA.findAllUsers(
      orderBy,
      page,
      dataPerPage,
      order,
      queryField,
      queryValue,
      archived,
      filterByEntity ? entityId : undefined
    )
  }

  /**
   * Supprime logiquement plusieurs utilisateurs.
   * 
   * Cet endpoint permet de désactiver (archiver) plusieurs utilisateurs
   * identifiés par leurs IDs en une seule opération. Les utilisateurs ne sont
   * pas effacés définitivement mais marqués comme archivés, ce qui les empêche
   * de se connecter au système.
   * 
   * @param ids Tableau des identifiants des utilisateurs à supprimer
   * @returns Confirmation de la suppression des utilisateurs
   * @example body ["123e4567-e89b-12d3-a456-426614174000", "223e4567-e89b-12d3-a456-426614174001"]
   * @example {
   *   "success": true,
   *   "message": "Utilisateurs supprimés avec succès",
   *   "data": {
   *     "count": 2,
   *     "deletedAt": "2023-06-15T09:45:00Z"
   *   }
   * }
   */
  @Post('delete')
  @Response(200, 'Utilisateurs supprimés avec succès')
  @Response(400, 'Données invalides')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  @Response(403, 'Accès refusé - Droits insuffisants')
  @Middlewares([TokenMiddleware])
  @Security('jwt')
  public async deleteUsers(@Body() ids: string[]) {
    return userSA.softDeleteUsers(ids)
  }

  /**
   * Restaure plusieurs utilisateurs précédemment supprimés.
   * 
   * Cet endpoint permet de réactiver plusieurs utilisateurs qui ont été
   * archivés auparavant. Les utilisateurs sont identifiés par leurs IDs
   * et pourront à nouveau se connecter au système après restauration.
   * 
   * @param ids Tableau des identifiants des utilisateurs à restaurer
   * @returns Confirmation de la restauration des utilisateurs
   * @example body ["123e4567-e89b-12d3-a456-426614174000", "223e4567-e89b-12d3-a456-426614174001"]
   * @example {
   *   "success": true,
   *   "message": "Utilisateurs restaurés avec succès",
   *   "data": {
   *     "count": 2,
   *     "restoredAt": "2023-07-05T14:20:00Z"
   *   }
   * }
   */
  @Post('restore')
  @Response(200, 'Utilisateurs restaurés avec succès')
  @Response(400, 'Données invalides')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  @Response(403, 'Accès refusé - Droits insuffisants')
  @Middlewares([TokenMiddleware])
  @Security('jwt')
  public async restoreUsers(@Body() ids: string[]) {
    return userSA.restoreUsers(ids)
  }

  /**
   * Met à jour les informations d'un utilisateur existant.
   * 
   * Cet endpoint permet de modifier les propriétés d'un utilisateur identifié
   * par son ID, y compris son nom, prénom, mot de passe, rôle, etc.
   * 
   * @param id Identifiant unique de l'utilisateur à mettre à jour
   * @param body Nouvelles données de l'utilisateur
   * @returns L'utilisateur mis à jour
   * @example body {
   *   "firstName": "Jean-Pierre",
   *   "lastName": "Dupont",
   *   "phoneNumber": "+33612345678",
   *   "role": "manager"
   * }
   * @example {
   *   "success": true,
   *   "message": "Utilisateur mis à jour avec succès",
   *   "data": {
   *     "uuid": "123e4567-e89b-12d3-a456-426614174000",
   *     "email": "utilisateur@example.com",
   *     "firstName": "Jean-Pierre",
   *     "lastName": "Dupont",
   *     "phoneNumber": "+33612345678",
   *     "role": "manager",
   *     "updatedAt": "2023-06-25T11:20:00Z"
   *   }
   * }
   */
  @Put('update/:id')
  @Response(200, 'Utilisateur mis à jour avec succès')
  @Response(400, 'Données invalides')
  @Response(404, 'Utilisateur non trouvé')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  @Response(403, 'Accès refusé - Droits insuffisants')
  @Middlewares([TokenMiddleware])
  @Security('jwt')
  public async updateUser(@Body() body: Partial<UserDTO>, @Path('id') id: string) {
    return userSA.updateUser(id, body)
  }

  /**
   * Demande un lien de réinitialisation de mot de passe.
   * 
   * Cet endpoint permet à un utilisateur qui a oublié son mot de passe
   * de demander un lien de réinitialisation. Un email contenant ce lien
   * sera envoyé à l'adresse email spécifiée, si elle correspond à un compte existant.
   * 
   * @param body L'email de l'utilisateur qui demande la réinitialisation
   * @param request Requête HTTP contenant les informations d'origine
   * @returns Confirmation de l'envoi du lien de réinitialisation
   * @example body {
   *   "email": "utilisateur@example.com"
   * }
   * @example {
   *   "success": true,
   *   "message": "Si cette adresse email est associée à un compte, un lien de réinitialisation a été envoyé"
   * }
   */
  @Post('request-reset-link')
  @Response(200, 'Demande de réinitialisation traitée')
  @Response(400, 'Données invalides')
  public async requestResetLink(@Body() body: { email: string }, @Request() request: any) {
    // const protocol = request.protocol
    // const baseUrl = `${protocol}://${request.header('host')}`
    const baseUrl = request.header('origin')

    return userSA.resetLink(body.email, baseUrl)
  }

  /**
   * Réinitialise le mot de passe d'un utilisateur.
   * 
   * Cet endpoint permet à un utilisateur de définir un nouveau mot de passe
   * après avoir cliqué sur le lien de réinitialisation reçu par email.
   * L'UUID fourni doit correspondre à un jeton de réinitialisation valide.
   * 
   * @param body L'UUID du jeton de réinitialisation et le nouveau mot de passe
   * @returns Confirmation de la réinitialisation du mot de passe
   * @example body {
   *   "uuid": "5678abcd-ef90-12gh-i345-426614174000",
   *   "newPassword": "NouveauMotDePasse123!"
   * }
   * @example {
   *   "success": true,
   *   "message": "Mot de passe réinitialisé avec succès"
   * }
   */
  @Post('reset-password')
  @Response(200, 'Mot de passe réinitialisé avec succès')
  @Response(400, 'Données invalides')
  @Response(404, 'Jeton de réinitialisation invalide ou expiré')
  public async resetPassword(@Body() body: { uuid: string; newPassword: string }) {
    return userSA.resetPassword(body.uuid, body.newPassword)
  }

  /**
   * Met à jour les informations de plusieurs utilisateurs simultanément.
   * 
   * Cet endpoint permet de modifier les mêmes propriétés pour plusieurs
   * utilisateurs identifiés par leurs IDs en une seule opération.
   * 
   * @param body Contient les IDs des utilisateurs et les données à mettre à jour
   * @returns Confirmation de la mise à jour des utilisateurs
   * @example body {
   *   "ids": ["123e4567-e89b-12d3-a456-426614174000", "223e4567-e89b-12d3-a456-426614174001"],
   *   "data": {
   *     "role": "standard",
   *     "isActive": true
   *   }
   * }
   * @example {
   *   "success": true,
   *   "message": "Utilisateurs mis à jour avec succès",
   *   "data": {
   *     "count": 2,
   *     "updatedAt": "2023-07-10T15:45:00Z"
   *   }
   * }
   */
  @Put('update')
  @Response(200, 'Utilisateurs mis à jour avec succès')
  @Response(400, 'Données invalides')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  @Response(403, 'Accès refusé - Droits insuffisants')
  @Middlewares([TokenMiddleware])
  @Security('jwt')
  public async updateMultipleUser(@Body() body: { ids: string[]; data: PartialUserDTO }) {
    return userSA.updateMultipleUser(body.ids, body.data as UserDTO)
  }

  /**
   * Rafraîchit le jeton d'authentification de l'utilisateur.
   * 
   * Cet endpoint permet de générer un nouveau jeton d'authentification
   * sans que l'utilisateur ait à se reconnecter, tant que son jeton actuel
   * est encore valide.
   * 
   * @param req Requête contenant les informations de l'utilisateur authentifié
   * @returns Un nouveau jeton d'authentification
   * @example {
   *   "success": true,
   *   "data": {
   *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   *     "expiresIn": 3600
   *   }
   * }
   */
  @Middlewares([TokenMiddleware])
  @Get('refresh-token')
  @Response(200, 'Jeton rafraîchi avec succès')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  @Security('jwt')
  public async refreshToken(@Request() req: CustomRequest) {
    return userSA.refreshToken(req.user.token ? req.user.token : '')
  }

  /**
   * Lie un compte externe à un compte utilisateur existant.
   * 
   * Cet endpoint permet à un utilisateur d'associer un compte provenant
   * d'un fournisseur d'identité externe (Google, Facebook, etc.) à son
   * compte existant dans le système.
   * 
   * @param body Les données du compte externe à lier
   * @param req Requête contenant les informations de l'utilisateur authentifié
   * @returns Confirmation de la liaison du compte externe
   * @example body {
   *   "provider": "google",
   *   "token": "ya29.a0AfH6SMC9X...",
   *   "email": "utilisateur@gmail.com"
   * }
   * @example {
   *   "success": true,
   *   "message": "Compte externe lié avec succès",
   *   "data": {
   *     "provider": "google",
   *     "email": "utilisateur@gmail.com",
   *     "linkedAt": "2023-08-05T16:20:00Z"
   *   }
   * }
   */
  @Middlewares([TokenMiddleware])
  @Post('link-account')
  @Response(200, 'Compte externe lié avec succès')
  @Response(400, 'Données invalides ou jeton externe expiré')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  @Response(409, 'Ce compte externe est déjà lié à un autre utilisateur')
  @Security('jwt')
  public async linkExternalAccount(@Body() body: mfaDTO, @Request() req: CustomRequest) {
    return userSA.linkExternalAccount(body, req.user.uuid && req.user.uuid ? req.user.uuid : '')
  }

  /**
   * Récupère la liste des comptes externes liés à un utilisateur.
   * 
   * Cet endpoint permet à un utilisateur de voir tous les comptes externes
   * (Google, Facebook, etc.) qu'il a associés à son compte principal.
   * 
   * @param req Requête contenant les informations de l'utilisateur authentifié
   * @returns Liste des comptes externes liés
   * @example {
   *   "success": true,
   *   "data": [
   *     {
   *       "provider": "google",
   *       "email": "utilisateur@gmail.com",
   *       "linkedAt": "2023-08-05T16:20:00Z"
   *     },
   *     {
   *       "provider": "facebook",
   *       "email": "utilisateur@facebook.com",
   *       "linkedAt": "2023-09-10T11:45:00Z"
   *     }
   *   ]
   * }
   */
  @Middlewares([TokenMiddleware])
  @Get('get-linked-accounts')
  @Response(200, 'Liste des comptes liés récupérée avec succès')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  @Security('jwt')
  public async getLinkedAccounts(@Request() req: CustomRequest) {
    return userSA.getExternalAccounts(req.user.uuid && req.user.uuid ? req.user.uuid : '')
  }

  /**
   * Délie un compte externe du compte utilisateur.
   * 
   * Cet endpoint permet à un utilisateur de supprimer l'association
   * entre son compte principal et un compte provenant d'un fournisseur
   * d'identité externe spécifique.
   * 
   * @param provider Le nom du fournisseur d'identité externe (ex: google, facebook)
   * @param req Requête contenant les informations de l'utilisateur authentifié
   * @returns Confirmation de la suppression du lien
   * @example {
   *   "success": true,
   *   "message": "Compte externe délié avec succès",
   *   "data": {
   *     "provider": "google",
   *     "unlinkedAt": "2023-10-15T14:30:00Z"
   *   }
   * }
   */
  @Middlewares([TokenMiddleware])
  @Delete('unlink-account/:provider')
  @Response(200, 'Compte externe délié avec succès')
  @Response(404, 'Compte externe non trouvé')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  @Security('jwt')
  public async unlinkExternalAccount(@Path('provider') provider: string, @Request() req: CustomRequest) {
    return userSA.unlinkExternalAccount(provider, req.user.uuid && req.user.uuid ? req.user.uuid : '')
  }

  /**
   * Récupère l'URL d'authentification pour un service externe.
   * 
   * Cet endpoint génère une URL que l'utilisateur peut utiliser pour
   * s'authentifier auprès d'un service externe (comme Google Drive)
   * afin d'autoriser l'application à accéder à ses ressources.
   * 
   * @param req Requête contenant les informations de l'utilisateur authentifié
   * @returns L'URL d'authentification pour le service externe
   * @example {
   *   "success": true,
   *   "data": {
   *     "authUrl": "https://accounts.google.com/o/oauth2/auth?client_id=..."
   *   }
   * }
   */
  @Middlewares([TokenMiddleware, CommonMiddleware])
  @Get('auth-url')
  @Response(200, 'URL d\'authentification générée avec succès')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  @Security('jwt')
  public async getAuthUrl(@Request() req: CustomRequest) {
    const userId = req.user.uuid || ''

    return userSA.getAuthUrl(userId)
  }

  /**
   * Point de retour pour le processus d'authentification OAuth2.
   * 
   * Cet endpoint est appelé par le fournisseur d'identité externe après
   * que l'utilisateur a autorisé l'application. Il traite le code d'autorisation
   * et finalise le processus d'authentification.
   * 
   * @param code Code d'autorisation fourni par le service externe
   * @param state État de la demande pour la vérification de sécurité
   * @param request Requête HTTP complète
   * @returns Une page HTML de confirmation ou d'erreur
   */
  @Get('oauth2callback')
  @Response(200, 'Authentification OAuth2 réussie')
  @Response(500, 'Erreur lors de l\'authentification')
  public async oauth2callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Request() request: express.Request
  ) {
    const response = request.res as express.Response
    try {
      const htmlResponse = await userSA.oauth2callback(code, state)

      response.setHeader('Content-Type', 'text/html')
      response.status(200).send(htmlResponse)
    } catch (error) {
      console.log('error', error)
      response.status(500).send("Erreur lors de l'authentification")
    }
  }

  /**
   * Liste les fichiers associés à un utilisateur.
   * 
   * Cet endpoint permet à un utilisateur de consulter tous les fichiers
   * qu'il a téléchargés ou qui lui sont associés dans le système.
   * 
   * @param req Requête contenant les informations de l'utilisateur authentifié
   * @returns Liste des fichiers de l'utilisateur
   * @example {
   *   "success": true,
   *   "data": [
   *     {
   *       "id": "file123",
   *       "name": "Rapport-2023.pdf",
   *       "type": "application/pdf",
   *       "size": 1024567,
   *       "uploadedAt": "2023-05-20T09:15:00Z",
   *       "url": "https://example.com/files/Rapport-2023.pdf"
   *     },
   *     {
   *       "id": "file456",
   *       "name": "Presentation.pptx",
   *       "type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
   *       "size": 2048567,
   *       "uploadedAt": "2023-06-10T11:30:00Z",
   *       "url": "https://example.com/files/Presentation.pptx"
   *     }
   *   ]
   * }
   */
  @Middlewares([TokenMiddleware])
  @Get('list-files')
  @Response(200, 'Liste des fichiers récupérée avec succès')
  @Response(400, 'ID utilisateur manquant')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  @Security('jwt')
  public async listFiles(@Request() req: CustomRequest) {
    const userId = req.user.uuid
    if (!userId) {
      throw new ApiError(400, 'User ID is required')
    }

    return userSA.listUserFiles(userId)
  }

  /**
   * Télécharge un fichier associé à un utilisateur.
   * 
   * Cet endpoint permet à un utilisateur d'envoyer un fichier sur le serveur
   * pour le stocker et l'associer à son compte. Le fichier peut être de différents
   * types et tailles, selon les limites définies par le système.
   * 
   * @param req Requête contenant les informations de l'utilisateur authentifié
   * @param fileName Nom du fichier à télécharger
   * @param mimeType Type MIME du fichier
   * @param file Contenu du fichier à télécharger
   * @returns Information sur le fichier téléchargé
   * @example {
   *   "success": true,
   *   "message": "Fichier téléchargé avec succès",
   *   "data": {
   *     "id": "file789",
   *     "name": "Document.pdf",
   *     "type": "application/pdf",
   *     "size": 1536789,
   *     "uploadedAt": "2023-07-15T16:45:00Z",
   *     "url": "https://example.com/files/Document.pdf"
   *   }
   * }
   */
  @Middlewares([TokenMiddleware])
  @Post('upload-files')
  @Response(200, 'Fichier téléchargé avec succès')
  @Response(400, 'Données invalides ou ID utilisateur manquant')
  @Response(401, 'Non autorisé - Token manquant ou invalide')
  @Response(413, 'Fichier trop volumineux')
  @Response(415, 'Type de fichier non pris en charge')
  @Security('jwt')
  public async uploadFiles(
    @Request() req: CustomRequest,
    @FormField() fileName: string,
    @FormField() mimeType: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const userId = req.user.uuid
    if (!userId) {
      throw new ApiError(400, 'User ID is required')
    }

    return await userSA.uploadFiles(userId, fileName, file, mimeType ? mimeType : 'application/pdf')
  }
}
