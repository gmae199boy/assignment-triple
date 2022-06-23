import { FastifyInstance, FastifyRequest } from "fastify";
import { EventService, Events } from "./service";
import { toBuffer, arrayToBuffer } from "../uuidParser";
import { postEvents } from "./schema";

import { errors } from "../errors";

/**
 * Type Interface
 */
interface IBody {
	readonly type: string;
	readonly action: string;
	readonly reviewId: string;
	readonly content?: string | undefined;
	readonly attachedPhotoIds?: string[];
	readonly userId: string;
	readonly placeId: string;
}
interface IQueryString {
	readonly userId: string;
}

/**
 * Router
 */
export default async function (fastify: FastifyInstance) {
	// /events Routes

	// POST /events -> 이벤트 추가, 수정, 삭제
	fastify.post("/", { schema: postEvents }, modifyEvent);

	// GET /event?userId -> 유저 포인트 조회
	fastify.get("/", getPoint);
}

/**
 * Controller
 */
async function modifyEvent(
	this: FastifyInstance,
	req: FastifyRequest<{
		Body: IBody;
	}>
) {
	const reviewData: Events = {
		type: req.body.type,
		action: req.body.action,
		reviewId: toBuffer(req.body.reviewId),
		content: req.body?.content ? req.body.content : null,
		attachedPhotoIds: req.body?.attachedPhotoIds ? arrayToBuffer(req.body.attachedPhotoIds) : null,
		userId: toBuffer(req.body.userId),
		placeId: toBuffer(req.body.placeId),
	};

	const service = new EventService(this.mysql);
	let result: number;

	switch (req.body.action) {
		case "ADD":
			{
				result = await service.addEvent(reviewData);
			}
			break;
		case "MOD":
			{
				result = await service.modEvent(reviewData);
			}
			break;
		case "DELETE":
			{
				result = await service.delEvent(reviewData);
			}
			break;
		default:
			throw new Error(errors.WRONG_TYPE);
	}
	return { result: { getPoint: result } };
}

async function getPoint(
	this: FastifyInstance,
	req: FastifyRequest<{
		Querystring: IQueryString;
	}>
) {
	const service = new EventService(this.mysql);
	return { points: await service.getPoint(toBuffer(req.query.userId)) };
}
