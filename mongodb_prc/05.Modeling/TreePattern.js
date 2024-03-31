// graph: 관계, 연계가 필요한 데이터
// ex) 회사의 결제선, 카테고리, sns

use tree

// 회사 결재선 작성
db.employees.insertMany([
	{
		_id: 1,
		name: "Eliot",
		position: "CEO"
	},
	{
		_id: 2,
		name: "Ron",
		position: "Center Lead",
		reportsTo: "Eliot"
	},
	{
		_id: 3,
		name: "Tom",
		position: "Team Lead",
		reportsTo: "Ron"
	},
	{
		_id: 4,
		name: "Bred",
		position: "Team Member",
		reportsTo: "Tom"
	},
	{
		_id: 5,
		name: "Don",
		position: "Team Member",
		reportsTo: "Tom"
	},
	{
		_id: 6,
		name: "Carl",
		position: "Team Member",
		reportsTo: "Tom"
	}
])

/**
 * tree> db.employees.aggregate([
... 	{
... 		$graphLookup: {
... 			from: "employees", // 직원
... 			startWith: "$reportsTo", 
... 			connectFromField: "reportsTo",
... 			connectToField: "name",
... 			depthField: "depth",
... 			as: "reportingHierarchy"
... 		}
... 	}
... ])
[
  { _id: 1, name: 'Eliot', position: 'CEO', reportingHierarchy: [] },
  {
    _id: 2,
    name: 'Ron',
    position: 'Center Lead',
    reportsTo: 'Eliot',
    reportingHierarchy: [ { _id: 1, name: 'Eliot', position: 'CEO', depth: Long('0') } ]
  },
  {
    _id: 3,
    name: 'Tom',
    position: 'Team Lead',
    reportsTo: 'Ron',
    reportingHierarchy: [
      {
        _id: 2,
        name: 'Ron',
        position: 'Center Lead',
        reportsTo: 'Eliot',
        depth: Long('0')
      },
      { _id: 1, name: 'Eliot', position: 'CEO', depth: Long('1') }
    ]
  },
  {
    _id: 4,
    name: 'Bred',
    position: 'Team Member',
    reportsTo: 'Tom',
    reportingHierarchy: [
      {
        _id: 3,
        name: 'Tom',
        position: 'Team Lead',
        reportsTo: 'Ron',
        depth: Long('0')
      },
      {
        _id: 2,
        name: 'Ron',
        position: 'Center Lead',
        reportsTo: 'Eliot',
        depth: Long('1')
      },
      { _id: 1, name: 'Eliot', position: 'CEO', depth: Long('2') }
    ]
  },
  {
    _id: 5,
    name: 'Don',
    position: 'Team Member',
    reportsTo: 'Tom',
    reportingHierarchy: [
      {
        _id: 3,
        name: 'Tom',
        position: 'Team Lead',
        reportsTo: 'Ron',
        depth: Long('0')
      },
      {
        _id: 2,
        name: 'Ron',
        position: 'Center Lead',
        reportsTo: 'Eliot',
        depth: Long('1')
      },
      { _id: 1, name: 'Eliot', position: 'CEO', depth: Long('2') }
    ]
  },
  {
    _id: 6,
    name: 'Carl',
    position: 'Team Member',
    reportsTo: 'Tom',
    reportingHierarchy: [
      {
        _id: 3,
        name: 'Tom',
        position: 'Team Lead',
        reportsTo: 'Ron',
        depth: Long('0')
      },
      {
        _id: 2,
        name: 'Ron',
        position: 'Center Lead',
        reportsTo: 'Eliot',
        depth: Long('1')
      },
      { _id: 1, name: 'Eliot', position: 'CEO', depth: Long('2') }
    ]
  }
]
 */
db.employees.aggregate([
	{
		$graphLookup: {
			from: "employees", // 어떤 컬렉션을 참조할 것이냐
			startWith: "$reportsTo", // 어디서부터 시작
			connectFromField: "reportsTo", // 어떤 필드를 
			connectToField: "name", // 어떤 필드까지 연결할 것인지
			depthField: "depth",
			as: "reportingHierarchy"
		}
	}
])


// 상품 컬렉션
db.products.insertMany([
	{
		_id: 0,
		name: "Yonex ezone",
		price: 300000,
		category: "Tenis Racket"
	},
	{
		_id: 1,
		name: "Samsung Gaming 24",
		price: 260000,
		category: "Gaming Monitor"
	},
])

// 가장 하위에 카테고리를 정의함
db.categories.insertMany([
	{
		category_name: "Tenis Racket",
		ancestor_categories: [ // 상위 카테고리
			"Tenis",
			"Sports",
			"Outdoor"
		]
	},
	{
		category_name: "Gaming Monitor",
		ancestor_categories: [
			"Monitor",
			"Computer",
			"Electronics",
			"Home"
		]
	},
])


db.products.aggregate([
	{
		$graphLookup: {
			from: "categories", // categories 컬렉션으로 부터
			startWith: "$category", // products 의 카테고리에서 시작한다.
			connectFromField: "ancestor_categories", // ancestor_categories
			connectToField: "category_name", // category_name
			as: "categories"
		}
	}
])



db.categories.insertMany([
	{
		category_name: "Tenis",
		ancestor_categories: [
			"Sports",
			"Outdoor"
		]
	},
	{
		category_name: "Sports",
		ancestor_categories: [
			"Sports",
		]
	},
	{
		category_name: "Outdoor",
		ancestor_categories: [
		]
	},
])


db.products.aggregate([
	{
		$graphLookup: {
			from: "categories",
			startWith: "$category",
			connectFromField: "ancestor_categories",
			connectToField: "category_name",
			as: "categories"
		}
	}
])
