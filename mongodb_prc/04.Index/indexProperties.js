use test

// 타임 투 리프, 시간을 기준으로 생성된 도큐먼트를 삭제시킴, 싱글필드인덱스에서만 생성 가능
// 날짜를 기준으로하는 혹은 날짜를 가지고 있는 배열로 
db.ttl.insertMany([
	{
		msg: "Hello!",
		time: new ISODate()
	},
	{
		msg: "HelloWorld!",
		time: new ISODate()
	},
])

db.ttl.find()

// 1분이 지나 면 삭제
db.ttl.createIndex(
	{time: 1},
	{expireAfterSeconds: 60}
)

db.ttl.getIndexes()

db.ttl.find()


// 유니크인덱스  기본적으로 _id에 걸림
db.unique.createIndex(
	{name: 1},
	{unique: true}
)


db.unique.insertMany([
	{name: "tom"},
	{name: "john"},
])

// 중복키 에러 발생
db.unique.insertOne(
	{name: "tom"}
)

db.unique.dropIndex(
	{name: 1}
)

// 유니크 컴파운드인덱스 
db.unique.createIndex(
	{
		name: 1,
		age: 1
	},
	{unique: true}
)

db.unique.insertOne({
	name: "james",
	age: 23
})

// age가 다르기 때문에 정상적으로 삽입 가능
db.unique.insertOne({
	name: "james",
	age: 24
})

// 필드가 존재한 경우에만 인덱스에 포함시킨다.
db.sparse.insertOne({ x: 1 })
db.sparse.insertOne({ x: 2 })
db.sparse.insertOne({ y: 1 })

db.sparse.createIndex(
	{ x: 1 },
	{sparse: true}
)

// 삽입한 3개 출력
db.sparse.find()

// 필드가 존재하는 도큐먼트에서만 인덱싱
db.sparse.find().hint({x: 1})

db.sparse.dropIndex({ x: 1 })

// 몽고디비 공식문서에서 권장하는 방법
db.sparse.createIndex(
	{ x: 1 },
	{
		// 조건에 부합하는 도큐먼트만 인덱싱
		partialFilterExpression: {
			x: {$exists: true}
		}
	}
)


db.sparse.find().hint({x: 1})

db.sparse.dropIndex({ x: 1 })

// 조건을 줄 수 있다.
db.sparse.createIndex(
	{ x: 1 },
	{
		partialFilterExpression: {
			x: { $exists: true },
			x: {$gte: 2}
		}
	}
)

// x:2인 것만 출력
db.sparse.find().hint({x: 1})


// 쿼리플랜으로 해당인덱스를 사용하지 못하도록 숨김
// 운영중인 서비스에서 특정 인덱스를 드랍하고 싶다 -> 예상치못한 이슈 발생할 수 있음 -> 히든으로 처리 한 후 테스트 진행 -> 삭제
// 삭제하기전 테스트하기 용이함
db.hidden.insertOne({ a: 1 })
db.hidden.insertOne({ a: 2 })

db.hidden.createIndex(
	{ a: 1 },
	{hidden: true}
)

/**
 *  executionStages: {
      stage: 'COLLSCAN',
      filter: { a: { '$eq': 1 } },
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 3,
      advanced: 1,
      needTime: 1,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      direction: 'forward',
      docsExamined: 2
    }
  },
  command: { find: 'hidden', filter: { a: 1 }, '$db': 'test' },
 */
db.hidden.find(
	{a: 1}
).explain('executionStats')


// 권한이 없으면 해제할 수 없다는 오류
// MongoServerError[AtlasError]: user is not allowed to do action [collMod] on [test.hidden] 
// 아틀라스에서 유저에게 권한을 부여해야 함
db.hidden.unhideIndex({ a: 1 })


/**
 *  executionStages: {
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { a: 1 },
        indexName: 'a_1',
        isMultiKey: false,
        multiKeyPaths: { a: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { a: [ '[1, 1]' ] },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  command: { find: 'hidden', filter: { a: 1 }, '$db': 'test' },
 */
db.hidden.find(
	{a: 1}
).explain('executionStats')
