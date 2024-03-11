### bulkWrite

```javascript
db.bulk.bulkWrite(
	[
		{insertOne: {doc: 1, order: 1}},
		{insertOne: {doc: 2, order: 2}},
		{insertOne: {doc: 3, order: 3}},
		{insertOne: {doc: 4, order: 4}},
		{insertOne: {doc: 4, order: 5}},
		{insertOne: {doc: 5, order: 6}},
		{
			deleteOne: {
				filter: {doc: 3}
			}
		},
		{
			updateOne: {
				filter: { doc: 2 },
				update: {
					$set: {doc: 12}
				}
			}
		}
	]
)

# 몽고디비는 도큐먼트 레벨에서 원자성을 보장한다.
# bulkWrite는 중간에 실행이 중지되면 원자성이 깨지게 된다.
db.bulk.bulkWrite(
	[
		{insertOne: {doc: 1, order: 1}},
		{insertOne: {doc: 2, order: 2}},
		{insertOne: {doc: 3, order: 3}},
		{insertOne: {doc: 4, order: 4}},
		{insertOne: {doc: 4, order: 5}},
		{insertOne: {doc: 5, order: 6}},
		{
			updateOne: {
				filter: { doc: 2 },
				update: {
					$set: {doc: 3}
				}
			}
		},
		{
			deleteMany: {
				filter: {doc: 3}
			}
		},
	],
	{ordered: false}
)
```

### Count Documents

```javascript
db.bulk.countDocuments();

# 대량의 도큐먼트가 있을 때 효율적이다.
db.bulk.estimatedDocumentCount();
```

### Distinct

```javascript
# 필드의 고유한 값을 배열로 받아온다. [1,4,5,12]
db.bulk.distinct("doc");
```

### Find And Modify

```javascript
# 도큐먼트를 먼저 반환 후, 수정을 진행함, 하나씩만 수정을 진행한다.
db.bulk.findAndModify({
  query: { doc: 4 },
  update: { $inc: { doc: 1 } },
});

db.bulk.findAndModify({
  query: { doc: 5 },
  sort: { order: -1 }, # 어떤 함수를 수정할지 sort를 통해 제어 가능
  update: { $inc: { doc: 1 } },
});

db.sequence.insertOne({ seq: 0 });

# autoincrement 같은 경우 씀 (동시성 문제 예방)
db.sequence.findAndModify({
  query: {},
  sort: { seq: -1 }, # 가장 마지막에 값을 받아온다.
  update: { $inc: { seq: 1 } },
});
```

### Get Index

```javascript
db.bulk.createIndex({ doc: 1 });

db.bulk.getIndexes();
```

### Replace One

```javascript
db.bulk.updateOne({ doc: 1 }, { $set: { _id: 1 } }); # 가장 최근 하나만 변경됨
db.bulk.replaceOne({ doc: 1 }, { _id: 1, doc: 13 }); # 도큐먼트 전체를 변경한다. _id: 1는 변경할 수 없다. 따라서 에러발생
db.bulk.replaceOne({ doc: 1 }, { doc: 13 });
```
