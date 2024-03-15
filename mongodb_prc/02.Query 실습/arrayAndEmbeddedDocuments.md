```javascript
db.sales.findOne({
	customer: {
		gender: 'M',
		age: 50,
		email: 'keecade@hem.uy',
		satisfaction: 5
	}
})

# 데이터 위치만 바뀌어도 출력되지 않는다.
db.sales.findOne({
	customer: {
		satisfaction: 5,
		gender: 'M',
		age: 50,
		email: 'keecade@hem.uy',
	}
})

# 내장 도큐먼트 안에 있는 필드로 조회한다.
db.sales.findOne({
	"customer.email": "keecade@hem.uy"
})
db.sales.findOne({
	"customer.age": {$lt: 20}
})


db.inventory.insertMany([
	{ item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [ 14, 21 ] },
	{ item: "notebook", qty: 50, tags: ["red", "blank"], dim_cm: [ 14, 21 ] },
	{ item: "paper", qty: 100, tags: ["red", "blank", "plain"], dim_cm: [ 14, 21 ] },
	{ item: "planner", qty: 75, tags: ["blank", "red"], dim_cm: [ 22.85, 30 ] },
	{ item: "postcard", qty: 45, tags: ["blue"], dim_cm: [ 10, 15.25 ] },
	{ item: "postcard", qty: 45, tags: ["blue", "red"], dim_cm: [ 13, 14 ] }
]);

# 배열도 마찬가지로 필드 순서가 일치해야 한다.
db.inventory.find({
	tags: ['red', 'blank']
})


db.inventory.find({
	tags: { $all: ['red', 'blank'] }
})

# or 조건
db.inventory.find({
	tags: { $in: ['red', 'blank'] }
})


# 배열중에 하나라도 쿼리필터 조건에 만족하는 데이터
db.inventory.find({
	tags: 'blue'
})

db.inventory.find({
	dim_cm: {$gt: 15}
})

# 모든 조건에 만족되는 데이터가 하나라도 있으면. 따라서 14나 20도 출력됨
db.inventory.find({
	dim_cm: {$gt: 15, $lt: 20}
})

# 15와 20사이의 값을 하나라도 가진 데이터
db.inventory.find({
	dim_cm: {$elemMatch: {$gt: 15, $lt: 20}}
})

# 배열에 특정 위치(1번인데스)에 있는 요소가 20보다 작은 경우
db.inventory.find({
	"dim_cm.1": {$lt: 20}
})

# 배열 크기에 대한 조회
db.inventory.find({
	tags: {$size: 3}
})

# 하나라도 만족하면 데이터 출력
db.sales.find({
	"items.name": 'binder',
	"items.quantity": {$lte: 6}
})

db.sales.find({
	items: {
		$elemMatch: {
			name: "binder",
			quantity: {$lte: 6}
		}
	}
})

# 조건에 만족하는 첫 번쨰 배열만 출력
db.sales.find(
	{
		items: {
			$elemMatch: {
				name: "binder",
				quantity: {$lte: 6}
			}
		}
	},
	{
		saleDate: 1,
		"items.$": 1,
		storeLocation: 1,
		customer: 1
	}
)



db.students.insertMany([
	{_id: 1, grades: [85, 80, 80]},
	{_id: 2, grades: [88, 90, 92]},
	{_id: 3, grades: [85, 100, 90]}
])

// 아이디가 1 이고, grades가 80인데 이터를 82로 변경
db.students.updateOne(
	{ _id: 1, grades: 80 },
	{$set: {"grades.$": 82}}
)

// 조건에 맞는 데이터 전체 변경
db.students.updateMany(
	// 전체 데이터를 10 올려준다
	{},

	{$inc: {"grades.$[]": 10}}
)


db.students.insertMany([
	{
		_id: 4,
		grades: [
			{ grade: 80, mean: 75, std: 8 },
			{ grade: 85, mean: 90, std: 5 },
			{ grade: 85, mean: 85, std: 8 },
		]
	}
])


// 처음만나는 grade가 85인 테이터의 std를 6으로 변경
db.students.updateOne(
	{ _id: 4, "grades.grade": 85 },
	{$set: {"grades.$.std": 6}}
)

// 85인 데이터 전체 변경
db.students.updateOne(
	{ _id: 4, grades: {$elemMatch: {grade: {$gte: 85}}} },
	{$set: {"grades.$[].grade": 100}}
)


db.students.insertMany([
	{
		_id: 6,
		grades: [
			{ grade: 90, mean: 75, std: 8 },
			{ grade: 87, mean: 90, std: 6 },
			{ grade: 85, mean: 85, std: 8 },
		]
	}
])

// grade가 87인 이상의 데이터만 grade를 100으로 변경
db.students.updateMany(
	{ _id: 6 },
	{ $set: {"grades.$[element].grade": 100}},
	{ arrayFilters: [{"element.grade": {$gte: 87}}] }
)



db.students.insertOne(
	{
		_id: 7,
	grades : [
		{ type: "quiz", questions: [ 10, 8, 5 ] },
		{ type: "quiz", questions: [ 8, 9, 6 ] },
		{ type: "hw", questions: [ 5, 4, 3 ] },
		{ type: "exam", questions: [ 25, 10, 23, 0 ] },
	]
	}
)

// 배열 안의 값을 2씩 증가시킨다. (8보다 크거나 같은 경우)
db.students.updateOne(
	{ _id: 7 },
	{ $inc: { "grades.$[].questions.$[score]": 2 } },
	{arrayFilters: [{score: {$gte: 8}}]}
)


db.shopping.insertMany([
	{
		_id: 1,
		cart: ['bannana', 'cheeze', 'milk'],
		coupons: ['10%', '20%', '30%']
	},
	{
		_id: 2,
		cart: [],
		coupons: []
	}
])


// 배열에 데이터가 없는 경우, 이미 존재하면 삽입되지 않는다.
db.shopping.updateOne(
	{ _id: 1 },
	{$addToSet: {cart: 'beer'}}
)

// 배열 자체가 들어간다.
db.shopping.updateOne(
	{ _id: 1 },
	{$addToSet: {cart: ['beer', 'candy']}}
)

// 배열 데이터가 각각 들어간다. (이미 데이터가 있으면 안들어감)
db.shopping.updateOne(
	{ _id: 1 },
	{ $addToSet: { cart: { $each: ['beer', 'candy'] } } }
)

// 삭제
db.shopping.updateOne(
	{ _id: 1 },
	{$pull: {cart: 'beer'}}
)

// 여러개의 데이터를 삭제하는 방법
db.shopping.updateOne(
	{ _id: 1 },
	{$pull: {cart: {$in: [['beer', 'candy'], 'milk']}}}
)


// 배열 맨 끝 데이터 제거
db.shopping.updateOne(
	{ _id: 1 },
	{$pop: {cart: -1}}
)


// 카트에서는 맨앞, 쿠폰에서는 맨 뒤를 제거한다.
db.shopping.updateOne(
	{ _id: 1 },
	{$pop: {cart: 1, coupons: -1}}
)


// 맨 뒤에 값을 추가함
db.shopping.updateOne(
	{ _id: 1 },
	{$push: {cart: 'popcorn'}}
)

// 맨 뒤에 값을 여러개 추가함
db.shopping.updateOne(
	{ _id: 1 },
	{ $push: { coupons: { $each: ['25%', '35%'] } } }
)


// 포지션 위치에 따라 들어감
db.shopping.updateMany(
	{},
	{
		$push: {
			coupons: {
				$each: ['90%', '70%'],
				$position: 0 // 0번이니까 맨 앞에 들어감
			}
		}
	}
)

db.shopping.updateMany(
	{},
	{
		$push: {
			coupons: {
				$each: ['15%', '20%'],
				$position: 0,
				$slice: 5 // 배열의 크기를 5로 지정한다.
			}
		}
	}
)

db.shopping.updateMany(
	{},
	{
		$push: {
			coupons: {
				$each: ['90%', '99%'],
				$position: -1,
				$sort: -1, // 배열크기 정렬 -1을 내림차순
				$slice: 5
			}
		}
	}
)
```

배열이 클 수록 addTOse이나 pull을 사용하게 되면 배열을 전체 탐색하기 때문에 시간복잡도가 커진다.
