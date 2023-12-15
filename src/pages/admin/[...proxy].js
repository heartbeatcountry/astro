import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Resource, Database } from "@adminjs/mongoose";
import express from "express";
import { NIVEAU_STR } from "../../lib/enums.mjs";
import traductionFr from "../../admin/i18n/fr.json" assert { type: "json" };
import { Appreciation, Session, Usager, Danse, Cours } from "../../lib/bd.mjs";
import { chaineAleatoire } from "../../lib/cryptographie.mjs";

const env = import.meta.env ?? process.env;

const SECRET_HTTP = chaineAleatoire(128);
const PORT = 9043;

if (!globalThis.adminExpress) {
	globalThis.adminExpress = express();

	AdminJS.registerAdapter({
		Resource,
		Database,
	});

	const valeursCoeurs = [
		{ value: 1, label: "1 cœur" },
		{ value: 2, label: "2 cœurs" },
		{ value: 3, label: "3 cœurs" },
		{ value: 4, label: "4 cœurs" },
		{ value: 5, label: "5 cœurs" },
	];
	const valeursCoeurs2 = [
		{ value: 0, label: "Non évalué" },
		...valeursCoeurs,
	];

	const valeursNiveaux = Object.entries(NIVEAU_STR).map(([value, label]) => ({
		value: +value,
		label,
	}));
	valeursNiveaux.unshift({ value: 0, label: "Veuillez choisir" });

	const desactiverDates = {
		createdAt: {
			isDisabled: true,
		},
		updatedAt: {
			isDisabled: true,
		},
	};

	const componentLoader = new ComponentLoader();
	const cheminModules =
		env.NODE_ENV === "production" ? "../../../../src/admin" : "../../admin";

	const admin = new AdminJS({
		rootPath: "/admin",
		branding: {
			companyName: "Heartbeat Country",
			withMadeWithLove: false,
			favicon: "/favicon.svg",
			logo: "/images/logonoirtransparent.png",
		},
		bundler: {
			babelConfig: {},
		},
		dashboard: {
			component: componentLoader.add(
				"Dashboard",
				`${cheminModules}/dashboard.jsx`
			),
		},
		topBar: {
			component: componentLoader.override(
				"TopBar",
				`${cheminModules}/top-bar.jsx`
			),
		},
		sidebarBranding: {
			component: componentLoader.override(
				"SidebarBranding",
				`${cheminModules}/sidebar-branding.jsx`
			),
		},
		componentLoader,
		locale: {
			language: "fr",
			availableLanguages: ["fr"],
			localeDetection: false,
			// Bogue dans AdminJS: on ne peut pas localiser les Yes/No:
			// https://github.com/SoftwareBrothers/adminjs/issues/1473#issuecomment-1815948740
			translations: { fr: traductionFr },
		},
		resources: [
			{
				resource: Appreciation,
				options: {
					properties: {
						_id: {
							isVisible: {
								show: true,
								edit: false,
								filter: false,
								list: false,
							},
						},
						note: {
							availableValues: valeursCoeurs,
						},
						...desactiverDates,
					},
				},
			},
			{
				resource: Usager,
				options: {
					properties: {
						estAdmin: {
							isDisabled: true,
						},
						mdp: {
							isVisible: false,
						},
						dansesSouhaitees: {
							isVisible: {
								show: true,
								edit: true,
								filter: false,
								list: false,
							},
						},
						...desactiverDates,
					},
				},
			},
			{
				resource: Danse,
				options: {
					properties: {
						niveau: {
							availableValues: valeursNiveaux,
						},
						noteMoyenne: {
							isDisabled: true,
							isVisible: {
								show: true,
								edit: false,
								filter: true,
								list: true,
							},
							availableValues: valeursCoeurs2,
						},
						lienFeuille: {
							isVisible: {
								show: true,
								edit: true,
								filter: false,
								list: false,
							},
						},
						lienVideoAcademie: {
							isVisible: {
								show: true,
								edit: true,
								filter: false,
								list: false,
							},
						},
						lienVideoDanse: {
							isVisible: {
								show: true,
								edit: true,
								filter: false,
								list: false,
							},
						},
						lienVideoMusique: {
							isVisible: {
								show: true,
								edit: true,
								filter: false,
								list: false,
							},
						},
						...desactiverDates,
					},
				},
			},
			{
				resource: Cours,
				options: {
					properties: {
						niveau: {
							availableValues: valeursNiveaux,
						},
						...desactiverDates,
					},
				},
			},
		],
	});

	const adminRouter = AdminJSExpress.buildRouter(admin);

	// Si le port express est accédé directement sans passer par le proxy, on
	// bloque la requête:
	adminExpress.use((req, res, next) => {
		if (req.headers["x-cle-secrete"] !== SECRET_HTTP) {
			return res.sendStatus(401);
		}
		next();
	});

	adminExpress.use(admin.options.rootPath, adminRouter);
	adminExpress.listen(PORT);
}

const redirigerVersExpress = async (ctx, methode = "GET") => {
	if (!ctx.locals["usager"]?.estAdmin) {
		return ctx.redirect("/compte/connexion");
	}

	const chemin = ctx.url.pathname + ctx.url.search;
	const enTetes = new Headers(ctx.request.headers);
	enTetes.set("x-cle-secrete", SECRET_HTTP);

	const nouvReq = new Request(
		`http://127.0.0.1:${PORT}${chemin}`,
		new Request(ctx.request, {
			headers: enTetes,
		})
	);

	return await fetch(nouvReq, { method: methode });
};

export async function GET(ctx) {
	return await redirigerVersExpress(ctx, "GET");
}
export async function POST(ctx) {
	return await redirigerVersExpress(ctx, "POST");
}
export async function PUT(ctx) {
	return await redirigerVersExpress(ctx, "PUT");
}
export async function PATCH(ctx) {
	return await redirigerVersExpress(ctx, "PATCH");
}
export async function DELETE(ctx) {
	return await redirigerVersExpress(ctx, "DELETE");
}
