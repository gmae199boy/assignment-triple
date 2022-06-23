export const postEvents = {
	headers: {
		type: "object",
		required: ["Accept", "Content-Type"],
		properties: {
			"Accept": { type: "string", const: "application/json" },
			"Content-Type": { type: "string", const: "application/json" },
		},
	},
	body: {
		type: "object",
		required: ["type", "action", "reviewId", "userId", "placeId"],
		properties: {
			type: { type: "string", const: "REVIEW" },
			action: { type: "string", enum: ["ADD", "MOD", "DELETE"] },
			reviewId: { type: "string" },
			content: { type: "string", nullable: true },
			attachedPhotoIds: { type: "array", items: { type: "string" }, nullable: true },
			userId: { type: "string" },
			placeId: { type: "string" },
		},
	},
};
