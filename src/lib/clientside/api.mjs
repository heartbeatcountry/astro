/**
 * Ce fichier contient tout le code nécessaire pour communiquer avec l'API.
 *
 * CETTE CLASSE ES6 A ORIGINALEMENT ÉTÉ ÉCRITE DANS LE CADRE DU TP3 DE WEB DE LA
 * SESSION 3 EN TYPESCRIPT. LE PRÉSENT CODE EST UNE RÉIMPLÉMENTATION COMPLÈTE EN
 * ES6 VANILLE ET N'EST PAS UNE COPIE 1:1.
 *
 * DE PLUS, LE PRÉSENT CODE NE FAIT PAS PARTIE DES FONCTIONNALITÉS À DÉVELOPPER;
 * IL S'AGIT UNIQUEMENT D'UN BOUT DE COLLE. J'AURAIS TRÈS BIEN PU UTILISER AXIOS
 * OU LE "WRAPPER" envoyerRequeteAjax DÉVELOPPÉ PAR NICOLAS RICHARD ET ÇA
 * N'AURAIT FONDAMENTALLEMENT RIEN CHANGÉ AU CODE DU PROJET.
 *
 * @author Pascal Breton <pabre001@edu.cegepgarneau.ca>
 */


/**
 * Classe représentant une requête REST sur l'API du site.
 *
 * @example
 *   const req = Api.POST("route/sous-route").corps({ foo: "bar" });
 *   const reponse1 = await req.envoyer();
 *   const reponse2 = await req.corps({ foo: "baz" }).envoyer();
 *   const reponse3 = await req.envoyer();
 *
 * @author Pascal Breton <pabre001@edu.cegepgarneau.ca>
 */
export class Api {
	/**
	 * Paramètres de la requête REST
	 *
	 * @type {RequestInit}
	 */
	#optionsReq = {};

	/**
	 * Annuleur. Permet d'annuler une requête en cours.
	 *
	 * @type {AbortController}
	 */
	#annuleur = new AbortController();

	/**
	 * Instance de la requête Fetch
	 *
	 * @type {Promise<Response>?}
	 */
	#fetch = null;

	/**
	 * Chemin complet vers le endpoint
	 *
	 * @type {URL}
	 */
	#chemin;

	/**
	 * Chemin relatif ou absolu vers l'API
	 *
	 * @type {String}
	 */
	urlBase = "/api";

	/**
	 * Constructeur interne de la requête.
	 *
	 * @param {String} pChemin - Chemin relatif de la route (le "endpoint")
	 * @param {{}?} pOptions - Paramètres de la requête
	 */
	constructor(pChemin, pOptions = {}) {
		this.#chemin = new URL(
			`${this.urlBase}/${pChemin}`,
			document.location.origin
		);

		this.#optionsReq = Api.#unionDictionnaires(
			{
				headers: {},
			},
			pOptions,
			{
				mode: "same-origin",
				redirect: "follow",
				referrerPolicy: "no-referrer",
				signal: this.#annuleur.signal,
			}
		);
	}

	/**
	 * Vrai si une requête est en cours d'envoi
	 */
	get estEnCours() {
		return this.#fetch !== null;
	}

	/**
	 * Constructeur d'une requête de type GET.
	 *
	 * @param {String} pChemin - Chemin relatif de la route (le "endpoint")
	 * @returns {Api} Une nouvelle instance de la classe
	 */
	static GET(pChemin) {
		return new this(pChemin, {
			method: "GET",
		});
	}

	/**
	 * Constructeur d'une requête de type POST.
	 *
	 * @param {String} pChemin - Chemin relatif de la route (le "endpoint")
	 * @returns {Api} Une nouvelle instance de la classe
	 */
	static POST(pChemin) {
		return new this(pChemin, {
			method: "POST",
		});
	}

	/**
	 * Constructeur d'une requête de type PUT.
	 *
	 * @param {String} pChemin - Chemin relatif de la route (le "endpoint")
	 * @returns {Api} Une nouvelle instance de la classe
	 */
	static PUT(pChemin) {
		return new this(pChemin, {
			method: "PUT",
		});
	}

	/**
	 * Constructeur d'une requête de type DELETE.
	 *
	 * @param {String} pChemin - Chemin relatif de la route (le "endpoint")
	 * @returns {Api} Une nouvelle instance de la classe
	 */
	static DELETE(pChemin) {
		return new this(pChemin, {
			method: "DELETE",
		});
	}

	/**
	 * Méthode utilitaire permettant de combiner des dictionnaires et d'éliminer
	 * les valeurs nulles.
	 *
	 * @param {{}?} pDictBase - Dictionnaire de base
	 * @param {{}[]} pLstNouvDict - Liste des nouveaux dictionnaires
	 * @returns {{}} une copie du dictionnaire d'origine qui intègre les
	 *               éléments des nouveaux dictionnaires.
	 */
	static #unionDictionnaires(pDictBase, ...pLstNouvDict) {
		return Object.fromEntries(
			Object.entries(
				pLstNouvDict.reduce(
					(acc, dict) => ({ ...acc, ...(dict ?? {}) }),
					pDictBase ?? {}
				)
			).filter(([, val]) => val !== null)
		);
	}

	/**
	 * Permet d'ajouter un corps à la requête.
	 *
	 * @param {{}} pCorps - Corps de la requête (objet), sera sérialisé en JSON
	 * @returns {Api} Une référence à la classe Api (pour chaîner)
	 */
	corps(pCorps) {
		this.#optionsReq.body = JSON.stringify(pCorps);
		this.#optionsReq.headers = Api.#unionDictionnaires(
			this.#optionsReq.headers,
			{
				"Content-Type": "application/json",
			}
		);
		return this;
	}

	/**
	 * Permet d'ajouter des paramètres dans l'URL de la requête.
	 *
	 * @param {{}} pArguments - Paramètres à ajouter (objet)
	 * @returns {Api} Une référence à la classe Api (pour chaîner)
	 */
	params(pArguments) {
		for (const [cle, valeur] of Object.entries(pArguments)) {
			if (valeur == null) {
				this.#chemin.searchParams.delete(cle);
			} else {
				this.#chemin.searchParams.set(cle, valeur.toString());
			}
		}
		return this;
	}

	/**
	 * Permet d'envoyer la requête à l'API et d'en extraire la réponse.
	 *
	 * @throws {ErrRequeteAnnulee} lorsque la requête se fait annuler.
	 * @throws {ErrParametreManquant} lorsqu'un paramètre obligatoire est absent.
	 * @throws {ErrConnexionRequise} lorsque l'utilisateur doit se connecter.
	 * @throws {ErrRouteInterdite} lorsque l'utilisateur n'a pas accès à la route demandée.
	 * @throws {ErrRouteInexistante} lorsque la route demandée n'existe pas.
	 *
	 * @returns {Promise<{}>} Une promesse qui résout vers une réponse json
	 */
	async envoyer() {
		this.annuler();
		this.#fetch = fetch(this.#chemin, this.#optionsReq);
		let reponse;
		try {
			reponse = await this.#fetch;
		} catch (err) {
			this.#genererErrRequeteAnnuleeLorsqueReqAnnulee(err);
		} finally {
			this.#fetch = null;
		}
		this.#gererCodeHttpEtLancerErrAuBesoin(reponse.status);
		return await reponse.json();
	}

	/**
	 * Permet de créer un nouvel annuleur
	 */
	#nouvAnnuleur() {
		this.#annuleur = new AbortController();
		this.#optionsReq.signal = this.#annuleur.signal;
	}

	/**
	 * Permet d'annuler une requête en cours.
	 *
	 * @returns {Api} Une référence à la classe Api (pour chaîner)
	 */
	annuler() {
		if (this.estEnCours) {
			this.#annuleur.abort();
			this.#nouvAnnuleur();
		}
		this.#fetch = null;
		return this;
	}

	/**
	 * Génère une ErrRequeteAnnulee lorsque la requête est annulée.
	 *
	 * @param {Error} pErr l'erreur d'origine
	 * @throws {ErrRequeteAnnulee} lorsque la requête est annulée
	 */
	#genererErrRequeteAnnuleeLorsqueReqAnnulee(pErr) {
		switch (pErr.name) {
			case "AbortError":
			case "DOMError":
			case "DOMException":
				throw new this.ErrRequeteAnnulee(pErr.message);
			default:
				throw pErr;
		}
	}

	/**
	 * Génère l'erreur appropriée lorsque le serveur retourne un code 4XX.
	 *
	 * @param pCodeHttp le code http de la réponse.
	 * @throws {ErrParametreManquant} lorsqu'un paramètre obligatoire est absent.
	 * @throws {ErrConnexionRequise} lorsque l'utilisateur doit se connecter.
	 * @throws {ErrRouteInterdite} lorsque l'utilisateur n'a pas accès à la route demandée.
	 * @throws {ErrRouteInexistante} lorsque la route demandée n'existe pas.
	 * @throws {ErrConflit} lorsque l'état du serveur est différent de celui du client
	 */
	#gererCodeHttpEtLancerErrAuBesoin(pCodeHttp) {
		switch (pCodeHttp) {
			case 400:
				throw new this.ErrParametreManquant();
			case 401:
				throw new this.ErrConnexionRequise();
			case 403:
				throw new this.ErrRouteInterdite();
			case 404:
				throw new this.ErrRouteInexistante();
			case 409:
				throw new this.ErrConflit();
		}
	}

	/**
	 * Erreur émise par l'API lorsqu'un paramètre obligatoire est absent
	 */
	ErrParametreManquant = class ErrParametreManquant extends Error {
		/**
		 * Crée une nouvelle instance
		 * @param pMessage - raison de l'erreur
		 */
		constructor(pMessage) {
			super(pMessage);
			this.name = this.constructor.name;
			this.code = 400;
			this.message = "Un paramètre obligatoire est manquant";
		}
	}

	/**
	 * Erreur émise par l'API lorsque l'utilisateur doit se connecter pour poursuivre
	 */
	ErrConnexionRequise = class ErrConnexionRequise extends Error {
		/**
		 * Crée une nouvelle instance
		 * @param pMessage - raison de l'erreur
		 */
		constructor(pMessage) {
			super(pMessage);
			this.name = this.constructor.name;
			this.code = 401;
			this.message = "La connexion est requise pour effectuer cette action";
		}
	}

	/**
	 * Erreur émise par l'API lorsque l'utilisateur n'a pas accès à la route demandée
	 */
	ErrRouteInterdite = class ErrRouteInterdite extends Error {
		/**
		 * Crée une nouvelle instance
		 * @param pMessage - raison de l'erreur
		 */
		constructor(pMessage) {
			super(pMessage);
			this.name = this.constructor.name;
			this.code = 403;
			this.message = "L'utilisateur n'a pas accès à cette ressource";
		}
	}

	/**
	 * Erreur émise par l'API lorsque l'utilisateur tente d'accéder à une route qui n'existe pas
	 */
	ErrRouteInexistante = class ErrRouteInexistante extends Error {
		/**
		 * Crée une nouvelle instance
		 * @param pMessage - raison de l'erreur
		 */
		constructor(pMessage) {
			super(pMessage);
			this.name = this.constructor.name;
			this.code = 404;
			this.message = "La ressource n'existe pas";
		}
	}

	/**
	 * Erreur émise lorsqu'une requête à l'API est annulée pendant le traitement
	 */
	ErrRequeteAnnulee = class ErrRequeteAnnulee extends Error {
		/**
		 * Crée une nouvelle instance
		 * @param pMessage - raison de l'erreur
		 */
		constructor(pMessage) {
			super(pMessage);
			this.name = this.constructor.name;
			this.code = 408;
			this.message = "La requête a été annulée";
		}
	}

	/**
	 * Erreur émise lorsque le client est désynchronisé d'avec l'API
	 */
	ErrConflit = class ErrConflit extends Error {
		/**
		 * Crée une nouvelle instance
		 * @param pMessage - raison de l'erreur
		 */
		constructor(pMessage) {
			super(pMessage);
			this.name = this.constructor.name;
			this.code = 409;
			this.message = "Les données sont en conflit";
		}
	}
}

export default Api;
