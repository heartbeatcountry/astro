import Mongoose, { Schema, model, ObjectId } from "mongoose";

export const SessionSchema = new Schema({
	/**
	 * L'usager à qui appartient la session.
	 * Il est possible d'utiliser Session.populate("usager") pour obtenir les détails de l'usager
	 */
	usager: {
		type: ObjectId,
		ref: 'Usager',
		null: [false, "L'usager ne doit pas être nul"],
		required: [true, "L'usager est requis"],
		unique: true,
		validate: [
			{
				async validator(id) {
					return await model("Usager").exists({ _id: id });
				},
				message: "L'usager n'existe pas",
			}
		],
	},

	/**
	 * Clé publique de la session
	 */
	cle: {
		type: String,
		required: [true, "La clé publique est requise"],
		unique: true,
		null: [false, "La clé publique ne doit pas être nulle"],
		validate: [
			{
				async validator(cle) {
					return !(await model("Session").exists({ cle }));
				},
				message: "La clé publique est déjà utilisée",
			}
		],
	},

	/**
	 * Date d'expiration de la session
	 */
	dateExpiration: Date,
}, {
	virtuals: {
		/**
		 * Vrai si la session est expirée
		 */
		estExpiree: {
			get() {
				return (new Date()) >= this.dateExpiration
			}
		},
	},
	timestamps: true,
});

export const Session = Mongoose.models.Session ?? model("Session", SessionSchema);
export default Session;
