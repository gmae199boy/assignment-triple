import app from "../src/app";
import { test } from "tap";

import { mock } from "../src/mock";

const uuidArr = mock().uuid;

test("Events Test(ADD)", async (t) => {
	t.test("POST '/events' action: 'ADD' test", async (t) => {
		try {
			let res = await app.inject({
				method: "POST",
				url: "/events",
				headers: {
					"Content-Type": "application/json",
					"accept": "application/json",
				},
				payload: {
					type: "REVIEW",
					action: "ADD",
					reviewId: uuidArr[2],
					content: "test",
					attachedPhotoIds: [uuidArr[3]],
					placeId: uuidArr[1],
					userId: uuidArr[0],
				},
			});
			t.same(res.json().result.getPoint, 3);

			res = await app.inject({
				method: "POST",
				url: "/events",
				headers: {
					"Content-Type": "application/json",
					"accept": "application/json",
				},
				payload: {
					type: "REVIEW",
					action: "ADD",
					reviewId: uuidArr[6],
					content: "test",
					attachedPhotoIds: [],
					placeId: uuidArr[5],
					userId: uuidArr[0],
				},
			});
			t.same(res.json().result.getPoint, 2);

			res = await app.inject({
				method: "POST",
				url: "/events",
				headers: {
					"Content-Type": "application/json",
					"accept": "application/json",
				},
				payload: {
					type: "REVIEW",
					action: "ADD",
					reviewId: uuidArr[9],
					content: "",
					attachedPhotoIds: [],
					placeId: uuidArr[8],
					userId: uuidArr[0],
				},
			});
			t.same(res.json().result.getPoint, 1);

			res = await app.inject({
				method: "POST",
				url: "/events",
				headers: {
					"Content-Type": "application/json",
					"accept": "application/json",
				},
				payload: {
					type: "REVIEW",
					action: "ADD",
					reviewId: uuidArr[10],
					placeId: uuidArr[8],
					userId: uuidArr[0],
				},
			});
			t.same(res.json().result.getPoint, 0);
		} catch (err) {
			t.error(err);
		}
	});
});

test("Events Test(MOD)", async (t) => {
	t.test("POST '/events' action: 'MOD' test", async (t) => {
		try {
			let res = await app.inject({
				method: "POST",
				url: "/events",
				headers: {
					"Content-Type": "application/json",
					"accept": "application/json",
				},
				payload: {
					type: "REVIEW",
					action: "MOD",
					reviewId: uuidArr[6],
					content: "test",
					attachedPhotoIds: [uuidArr[20], uuidArr[21], uuidArr[22]],
					placeId: uuidArr[5],
					userId: uuidArr[0],
				},
			});
			t.same(res.json().result.getPoint, 1);

			res = await app.inject({
				method: "POST",
				url: "/events",
				headers: {
					"Content-Type": "application/json",
					"accept": "application/json",
				},
				payload: {
					type: "REVIEW",
					action: "MOD",
					reviewId: uuidArr[6],
					content: "test",
					attachedPhotoIds: [],
					placeId: uuidArr[5],
					userId: uuidArr[0],
				},
			});
			t.same(res.json().result.getPoint, -1);
		} catch (err) {
			t.error(err);
		}
	});
});

test("Events Test(DELETE)", async (t) => {
	t.test("POST '/events' action: 'DELETE' test", async (t) => {
		try {
			let res = await app.inject({
				method: "POST",
				url: "/events",
				headers: {
					"Content-Type": "application/json",
					"accept": "application/json",
				},
				payload: {
					type: "REVIEW",
					action: "DELETE",
					reviewId: uuidArr[2],
					content: "test",
					attachedPhotoIds: [uuidArr[3]],
					placeId: uuidArr[1],
					userId: uuidArr[0],
				},
			});
			t.same(res.json().result.getPoint, -3);

			res = await app.inject({
				method: "POST",
				url: "/events",
				headers: {
					"Content-Type": "application/json",
					"accept": "application/json",
				},
				payload: {
					type: "REVIEW",
					action: "DELETE",
					reviewId: uuidArr[6],
					content: "test",
					attachedPhotoIds: [],
					placeId: uuidArr[5],
					userId: uuidArr[0],
				},
			});
			t.same(res.json().result.getPoint, -2);

			res = await app.inject({
				method: "POST",
				url: "/events",
				headers: {
					"Content-Type": "application/json",
					"accept": "application/json",
				},
				payload: {
					type: "REVIEW",
					action: "DELETE",
					reviewId: uuidArr[9],
					content: "",
					attachedPhotoIds: [],
					placeId: uuidArr[8],
					userId: uuidArr[0],
				},
			});
			t.same(res.json().result.getPoint, -1);
		} catch (err) {
			t.error(err);
		}
	});
});

test("Events Test(GetPoints)", async (t) => {
	t.teardown(() => app.close());

	t.test("GET /events?userId Get Point", async (t) => {
		try {
			const res = await app.inject({
				method: "GET",
				url: "/events",
				query: {
					userId: uuidArr[0],
				},
			});
			t.same(res.json().points, 0);
		} catch (err) {
			t.error(err);
		}
	});
});
