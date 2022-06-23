# triple 클럽 마일리지 서비스

- [실행 환경](./README.md#실행-환경)
- [실행 방법](./README.md#빠른-실행)
- [API 사양](./README.md#api-사양)

## 실행 환경

- Nodejs 16.13.0
- mysql 5.7 (애플 M1의 경우 docker pull mysql:5.7 --platform linux/amd64)
- docker 20.10.14
- docker compose 2.5.1

## 빠른 실행

connect url - http://localhost:8080

```sh
# 서버 & db서버 실행
docker-compose -f docker/docker-compose.yml up -d --build
```

for testing

```sh
# db 서버 실행
docker-compose -f docker/docker-compose.yml up -d db

# test 실행
DB_ADDRESS="mysql://1:1@localhost:3306/triple" npm test
```

## API 사양

모든 uuid는 v4로 진행

- POST /events -> 리뷰 작성 이벤트 포인트 적립
  - required:
    - Headers - Accept: application/json, Content-Type: application/json
    - Body - type: "REVIEW"(CONST), action: "ADD", "MOD", "DELETE"(ENUM), reviewId: String, userID: String, placeId: String
  - nullable:
    - body - content: String, attachedIds: Array[String]
  - response: Object({result:{getPoint:number}})

EX:
request

```sh
curl -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' "http://localhost:8080/events" -d '{ "type": "REVIEW", "action": "ADD", "reviewId": "bd1bc230-7800-451d-beb6-5771669119f7", "userId": "1864b98d-b918-41b8-81f8-3761a5d01ece", "placeId": "3749c3d7-d965-4552-82ac-991235be49a8" }' | jq
```

response

```json
{
	"result": {
		"getPoint": 1
	}
}
```

---

- GET /events?userId -> 해당 유저의 포인트 조회
  - required: Querystring(userId)
  - response: Object({points: String})

EX:
request

```sh
curl GET "http://localhost:8080/events?userId=1864b98d-b918-41b8-81f8-3761a5d01ece" | jq
```

response

```json
{
	"points": "1"
}
```
