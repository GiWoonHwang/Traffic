// 배달 어플 주문 리뷰 서비스

use delivery

db.shops.insertOne({
	_id: 1,
	name: "Tommy Steak House",
	desc: "Greatest Steak House Ever.",
	phone: "000-0000-1234",
	reviews: [
		{
			review_id: 1,
			user: "James",
			review: "So Good!!",
			date: new Date(),
			rating: 10
		},
		{
			review_id: 2,
			user: "Tommy",
			review: "Not Bad.",
			date: new Date(),
			rating: 7
		},
		{
			review_id: 3,
			user: "Kevin",
			review: "Yummy!!",
			date: new Date(),
			rating: 5
		},
	]
})


// 임의의 랜덤 데이터 생성
const generateRandomString = (num) => {
	const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < num; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
  
	return result;
}





// 800개 정도의 리뷰데이터 삽입
db.shops.insertOne({
	_id: 2,
	name: "Kevin's Pizza",
	desc: "Italian Style Pizza",
	phone: "000-0000-1111",
	reviews: []
})

for (i = 0; i < 800; i++){
	review = {
		review_id: i,
		user: generateRandomString(5),
		review: generateRandomString(10),
		date: new Date(),
		rating: Math.floor(Math.random() * 10)
	}
	// 하나씩 들어간다고 가정 (유저가 리뷰를 하나씩 적는 것 처럼)
	db.shops.updateOne(
		{
			_id: 2
		},
		{
			$push: {
				reviews: review
			}
		}
	)
}


db.shops.findOne({ _id: 2 })

/**
 * 문제점
 * 여러 음식점을 클릭해서 본다는 것 == 일반적인 사용자의 패턴이 컬렉션의 모든 도큐먼트를 읽는다
 * 음식점 클릭 -> find -> 내부적으로 캐시에 있는지 확인 -> 캐시에 없다면 캐시에 올린 후 도큐먼트를 읽는다
 * -> working set -> shop collections -> cache eviction
 * working set이 캐쉬의 크기보다 크면, 어떤 음식점은 캐시에서 읽어오고 어떤 음식점은 디스크에서 읽어오게 된다.
 */
Object.bsonsize(db.shops.findOne({ _id: 2 }))
Object.bsonsize(db.shops.findOne({ _id: 1 }))


db.shops.drop()



/**
 * 해결방안
 * working set을 줄여 데이터를 전부 캐쉬에 적재한다 ??
 * 도큐먼트의 사이즈를 줄인다 -> 사용자의 패턴을 분석해서
 * 예시: 음식점을 클릭하고 리뷰를 확인할 때 모든 리뷰를 보는 것이 아닌 최신 5개 정보만 확인한다. 
 * 설계: 리뷰 데이터의 일부(최신)만 샵 컬렉션에 저장하고, 나머지는 리뷰 컬렉션에 저장한다.
 */
db.shops.insertOne({
	_id: 2,
	name: "Kevin's Pizza",
	desc: "Italian Style Pizza",
	phone: "000-0000-1111",
	reviews: []
})

for (i = 0; i < 800; i++){
	review = {
		review_id: i,
		user: generateRandomString(5),
		review: generateRandomString(10),
		date: new Date(),
		rating: Math.floor(Math.random() * 10)
	}
	db.reviews.insertOne(review) // 리뷰 컬렉션 추가
	db.shops.updateOne(
		{
			_id: 2
		},
		{
			$push: {
				reviews: review
			}
		}
	)
}

db.reviews.find()
db.shops.find()



review = {
	review_id: 800,
	user: generateRandomString(5),
	review: generateRandomString(10),
	date: new Date(),
	rating: Math.floor(Math.random() * 10)
}
db.reviews.insertOne(review)
db.shops.updateOne(
	{
		_id: 2
	},
	{
		$push: {
			reviews: {
				$each: [review],
				$slice: -10 // 새로운 리뷰가 들어왔을 때, 최신 10개만 남긴다.
			}
		}
	}
)

db.reviews.find()
db.shops.find()



for (i = 801; i < 1600; i++){
	review = {
		review_id: i,
		user: generateRandomString(5),
		review: generateRandomString(10),
		date: new Date(),
		rating: Math.floor(Math.random() * 10)
	}
	db.reviews.insertOne(review)
	db.shops.updateOne(
		{
			_id: 2
		},
		{
			$push: {
				reviews: {
					$each: [review],
					$slice: -10
				}
			}
		}
	)
}


db.reviews.countDocuments() // 1600개
/**
 * 
 * delivery> db.shops.find()
[
  {
    _id: 2,
    name: "Kevin's Pizza",
    desc: 'Italian Style Pizza',
    phone: '000-0000-1111',
    reviews: [
      {
        review_id: 1590,
        user: 'rPRnM',
        review: 'dXAmhNsLFW',
        date: ISODate('2024-03-31T11:58:51.645Z'),
        rating: 4
      },
      {
        review_id: 1591,
        user: 'QGNAs',
        review: 'MgJwmfmXgG',
        date: ISODate('2024-03-31T11:58:51.646Z'),
        rating: 1
      },
      {
        review_id: 1592,
        user: 'KtUtV',
        review: 'CKCOFDBvcH',
        date: ISODate('2024-03-31T11:58:51.647Z'),
        rating: 6
      },
      {
        review_id: 1593,
        user: 'IXWKZ',
        review: 'ISbOlRZtwe',
        date: ISODate('2024-03-31T11:58:51.648Z'),
        rating: 2
      },
      {
        review_id: 1594,
        user: 'Uyjwy',
        review: 'AnPwIDVOlk',
        date: ISODate('2024-03-31T11:58:51.648Z'),
        rating: 3
      },
      {
        review_id: 1595,
        user: 'ENpfl',
        review: 'bTlQxvOOSW',
        date: ISODate('2024-03-31T11:58:51.649Z'),
        rating: 1
      },
      {
        review_id: 1596,
        user: 'OLUSO',
        review: 'VUzHWmynBE',
        date: ISODate('2024-03-31T11:58:51.650Z'),
        rating: 0
      },
      {
        review_id: 1597,
        user: 'OvwHv',
        review: 'hgInYKkhxD',
        date: ISODate('2024-03-31T11:58:51.651Z'),
        rating: 7
      },
      {
        review_id: 1598,
        user: 'aDBGa',
        review: 'xdqJkVqlyA',
        date: ISODate('2024-03-31T11:58:51.652Z'),
        rating: 7
      },
      {
        review_id: 1599,
        user: 'ThdIz',
        review: 'cffGfMfvOK',
        date: ISODate('2024-03-31T11:58:51.652Z'),
        rating: 8
      }
    ]
  }
]

 */
db.shops.find() 
Object.bsonsize(db.shops.findOne({_id: 2})) // 987바이트
