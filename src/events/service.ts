import { MySQLPromiseConnection } from "@fastify/mysql";
import { RowDataPacket, FieldPacket } from "mysql2/promise";

declare module "fastify" {
	interface FastifyInstance {
		mysql: MySQLPromiseConnection;
	}
}

/**
 * Type Interface
 */
export interface Events {
	type: string;
	action: string;
	reviewId: Buffer;
	content?: string | null;
	attachedPhotoIds?: Buffer | null;
	userId: Buffer;
	placeId: Buffer;
}
export interface EventResult extends RowDataPacket {
	value: number;
}
export interface PointResult extends RowDataPacket {
	point: number;
}

/**
 * Service
 */
export class EventService {
	collection: MySQLPromiseConnection;

	constructor(eventCollection: MySQLPromiseConnection) {
		this.collection = eventCollection;
	}

	async addEvent(model: Events): Promise<number> {
		const [result, _]: [EventResult[], FieldPacket[]] = await this.collection.query(
			`SELECT ADD_Event(?,?,?,?,?,?) as value;`,
			[
				model.type,
				model.reviewId,
				model.content,
				model.attachedPhotoIds,
				model.userId,
				model.placeId,
			]
		);
		return result[0].value;
	}

	async modEvent(model: Events): Promise<number> {
		const [result, _]: [EventResult[], FieldPacket[]] = await this.collection.query(
			`SELECT MOD_Event(?,?,?,?,?,?) as value;`,
			[
				model.type,
				model.reviewId,
				model.content,
				model.attachedPhotoIds,
				model.userId,
				model.placeId,
			]
		);
		return result[0].value;
	}

	async delEvent(model: Events): Promise<number> {
		const [result, _]: [EventResult[], FieldPacket[]] = await this.collection.query(
			`SELECT DEL_Event(?,?,?) as value;`,
			[model.reviewId, model.userId, model.placeId]
		);
		return result[0].value;
	}

	async getPoint(userId: Buffer): Promise<number> {
		const [result, _]: [PointResult[], FieldPacket[]] = await this.collection.query(
			`SELECT SUM(getPoint) as point FROM points WHERE userId=?;`,
			[userId]
		);
		return result[0].point;
	}
}
