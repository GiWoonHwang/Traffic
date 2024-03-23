

use sample_training

show collections

// 스키마 구조 확인
db.zips.findOne()

// 인덱스 조회 -> _id는 기본으로 잡혀있다.
db.zips.getIndexes()

db.zips.find(
	{
		state: "LA",
		pop: {
			$gte: 40000
		}
	}
).sort({city: 1})


// 실행계획 확인 약 13개를 찾는데, 3만개를 스캔하여 20ms 정도의 시간이 걸림
db.zips.find(
	{
		state: "LA",
		pop: {
			$gte: 40000
		}
	}
).sort({city: 1}).explain('executionStats')

// 오름차순
db.zips.createIndex({ state: 1 })

db.zips.getIndexes()

// 실행계획 확인 약 13개를 찾는데, 469만개를 스캔하여 2ms 정도의 시간이 걸림
db.zips.find(
	{
		state: "LA",
		pop: {
			$gte: 40000
		}
	}
).sort({ city: 1 }).explain('executionStats')

// e-s-r 룰 적용
db.zips.createIndex({ state: 1, city: 1, pop: 1 })

db.zips.getIndexes()


db.zips.find(
	{
		state: "LA",
		pop: {
			$gte: 40000
		}
	}
).sort({ city: 1 }).explain('executionStats')


db.zips.find(
	{
		state: "LA",
		pop: {
			$gte: 40000
		}
	},
	{
		_id: 0,
		state: 1,
		pop: 1,
		city: 1
	}
).sort({ city: 1 }).explain('executionStats')
