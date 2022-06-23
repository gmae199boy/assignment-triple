import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyMysql from "@fastify/mysql";

export async function dbPlugin(fastify: FastifyInstance, opts: FastifyPluginOptions) {
	await fastify.register(fastifyMysql, {
		promise: true,
		connectionString: opts.url,
	});

	/**
	 * DDL
	 */

	// 이벤트 관련 테이블 생성
	await fastify.mysql.query(
		`CREATE TABLE IF NOT EXISTS events(
		id int(11) NOT NULL AUTO_INCREMENT,
		type varchar(20) NOT NULL,
		reviewId BINARY(16) NOT NULL,
		content TEXT,
		attachedPhotoIds BLOB,
		userId BINARY(16) NOT NULL,
		placeId BINARY(16) NOT NULL,
		createdBy DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updatedBy DATETIME,
		PRIMARY KEY (id),
		INDEX idx_placeId (placeId)
	) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;`
	);

	// 포인트 관련 테이블 생성
	await fastify.mysql.query(
		`CREATE TABLE IF NOT EXISTS points(
		id int(11) NOT NULL AUTO_INCREMENT,
		userId BINARY(16) NOT NULL,
		placeId BINARY(16) NOT NULL,
		reviewId BINARY(16) NOT NULL,
		action varchar(20) NOT NULL,
		getPoint INT,
		createdBy DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (id),
		INDEX idx_userId(userId)
	) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;`
	);

	/**
	 * Stored Function
	 */
	await fastify.mysql.query(`DROP FUNCTION IF EXISTS ADD_EVENT;`);
	await fastify.mysql.query(`DROP FUNCTION IF EXISTS MOD_EVENT;`);
	await fastify.mysql.query(`DROP FUNCTION IF EXISTS DEL_EVENT;`);

	// 리뷰 추가
	await fastify.mysql.query(`
	CREATE FUNCTION ADD_EVENT (
		_type varchar(20),
		_reviewId BINARY(16),
		_content TEXT,
		_photoIds BLOB,
		_userId BINARY(16),
		_placeId BINARY(16)
		) RETURNS INT
			BEGIN
				DECLARE done BOOL DEFAULT FALSE;
				DECLARE placeNum INT DEFAULT 0;
				DECLARE isExistUser BOOL DEFAULT FALSE;
				DECLARE user BINARY(16) DEFAULT NULL;
				DECLARE points INT DEFAULT 3;
			
				DECLARE eventCursor CURSOR FOR
				SELECT userId from events WHERE placeId=_placeId;
				DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

				OPEN eventCursor;
				event_loop: LOOP
					FETCH eventCursor INTO user;
					IF done THEN
						LEAVE event_loop;
					END IF;

					SET placeNum = placeNum + 1;
					IF user = _userId THEN
						RETURN 0;
					END IF;
				END LOOP;
			
				IF _content = "" || _content IS NULL THEN
					SET points = points - 1;
				END IF;
				IF _photoIds IS NULL THEN
					SET points = points - 1;
				END IF;
				IF placeNum > 0 THEN
					SET points = points - 1;
				END IF;

				INSERT INTO events (
					type,
					reviewId, 
					content,
					attachedPhotoIds,
					userId,
					placeId,
					createdBy
				) VALUES (
					_type,
					_reviewId,
					_content,
					_photoIds,
					_userId,
					_placeId,
					NOW()
				);
				INSERT INTO points (
					userId,
					placeId,
					reviewId,
					action,
					getPoint,
					createdBy
				) VALUES (
					_userId,
					_placeId,
					_reviewId,
					"ADD",
					points,
					NOW()
				);
		
			RETURN points;
		END;`);

	// 리뷰 수정
	await fastify.mysql.query(`
	CREATE FUNCTION MOD_EVENT (
		_type varchar(20),
		_reviewId BINARY(16),
		_content TEXT,
		_photoIds BLOB,
		_userId BINARY(16),
		_placeId BINARY(16)
		) RETURNS INT
			BEGIN
				DECLARE rowId INT DEFAULT -1;
				DECLARE points INT DEFAULT 0;
				DECLARE isContent TEXT;
				DECLARE photoIds BLOB DEFAULT NULL;

				SELECT id, attachedPhotoIds, content INTO rowId, photoIds, isContent 
				FROM (SELECT id, attachedPhotoIds, content, userId FROM events WHERE placeId=_placeId) U
				WHERE U.userId=_userId;

				IF (isContent IS NULL || isContent="") || (_content IS NULL || _content="") THEN
					return 0;
				END IF;

				IF photoIds IS NULL && _photoIds IS NOT NULL THEN
					SET points = points + 1;
				END IF;
				IF photoIds IS NOT NULL && _photoIds IS NULL THEN
					SET points = points - 1;
				END IF;

				UPDATE events SET
					type=_type,
					content=_content,
					attachedPhotoIds=_photoIds,
					updatedBy=NOW()
				WHERE id=rowId;
				INSERT INTO points (
					userId,
					placeId,
					reviewId,
					action,
					getPoint,
					createdBy
				) VALUES (
					_userId,
					_placeId,
					_reviewId,
					"MOD",
					points,
					NOW()
				);

			RETURN points;
		END;`);

	// 리뷰 삭제
	await fastify.mysql.query(`
	CREATE FUNCTION DEL_EVENT (
		_reviewId BINARY(16),
		_userId BINARY(16),
		_placeId BINARY(16)
		) RETURNS INT
			BEGIN
				DECLARE points INT DEFAULT 0;

				DELETE FROM events
				WHERE id=(SELECT id 
					FROM (SELECT id, userId FROM events WHERE placeId=_placeId) U 
					WHERE U.userId=_userId); 
				
				SELECT SUM(getPoint) INTO points 
				FROM (SELECT placeId, getPoint FROM points WHERE userId=_userId) U
				WHERE U.placeId=_placeId;

				SET points = -points;

				INSERT INTO points (
					userId,
					placeId,
					reviewId,
					action,
					getPoint,
					createdBy
				) VALUES (
					_userId,
					_placeId,
					_reviewId,
					"DELETE",
					points,
					NOW()
				);

			RETURN points;
		END;`);
}
