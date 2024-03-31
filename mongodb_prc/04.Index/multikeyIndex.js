use sample_weatherdata

show collections

db.data.getIndexes()

db.data.findOne()

// 내림차순으로 인덱스 생성
db.data.createIndex({sections: -1})

db.data.getIndexes()

// stage: 'IXSCAN', isMultiKey: true 
db.data.find({ sections: 'AG1' }).explain('executionStats')


use sample_training
show collections

db.grades.findOne()

// 배열안 내장 도큐먼트에 대해 인덱스 설정
db.grades.createIndex({"scores.type":1})

db.grades.getIndexes()

// stage: 'IXSCAN', isMultiKey: true 
db.grades.find(
	{"scores.type": "exam"}
).explain('executionStats')


db.grades.dropIndex({"scores.type":1})

db.grades.getIndexes()

// 멀티키인덱스 + 복합인덱스 
db.grades.createIndex(
	{class_id: 1, "scores.type": 1}
)

db.grades.find(
	{
		"scores.type": "exam",
		class_id: {
			$gte: 350
		}
	}
).explain("executionStats")
