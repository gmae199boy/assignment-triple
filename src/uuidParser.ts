import { v4, parse as uuidParse, stringify as uuidStringify, validate, version } from "uuid";
import { errors } from "./errors";

/**
 * uuid를 buffer로 변환
 * @param str buffer로 변환할 uuid string
 * @returns buffer
 */
export function toBuffer(str: string): Buffer {
	// uuid 유효성 && uuid v4 버전 체크
	if (!validate(str) && version(str)) throw new Error(errors.WRONG_UUID);
	return _parse(str);
}

/**
 * buffer를 uuid string 으로 변환
 * @param buf uuid string으로 변환할 buffer
 * @returns string
 */
export function toString(buf: Buffer): string {
	return _stringify(buf);
}

/**
 * uuid array를 Buffer로 변환
 * @param arr buffer로 변환할 uuis string array
 * @returns buffer
 */
export function arrayToBuffer(arr: string[]): Buffer | null {
	if (!Array.isArray(arr)) throw new Error(errors.IS_NOT_ARRAY);
	if (arr.length === 0) return null;
	return _arrayToBuffer(arr);
}

function _parse(str: string): Buffer {
	return Buffer.from(<Uint8Array>uuidParse(str));
}

function _stringify(buf: Buffer): string {
	return uuidStringify(buf);
}

function _arrayToBuffer(arr: string[]): Buffer {
	const array: Buffer[] = [];
	for (let i = 0; i < arr.length; ++i) {
		array.push(_parse(arr[i]));
	}
	return Buffer.concat(array);
}
