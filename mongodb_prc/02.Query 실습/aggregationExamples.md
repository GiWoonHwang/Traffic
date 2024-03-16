```javascript
db.orders.insertMany([
  {
    _id: 0,
    name: "Pepperoni",
    size: "small",
    price: 19,
    quantity: 10,
    date: ISODate("2021-03-13T08:14:30Z"),
  },
  {
    _id: 1,
    name: "Pepperoni",
    size: "medium",
    price: 20,
    quantity: 20,
    date: ISODate("2021-03-13T09:13:24Z"),
  },
  {
    _id: 2,
    name: "Pepperoni",
    size: "large",
    price: 21,
    quantity: 30,
    date: ISODate("2021-03-17T09:22:12Z"),
  },
  {
    _id: 3,
    name: "Cheese",
    size: "small",
    price: 12,
    quantity: 15,
    date: ISODate("2021-03-13T11:21:39.736Z"),
  },
  {
    _id: 4,
    name: "Cheese",
    size: "medium",
    price: 13,
    quantity: 50,
    date: ISODate("2022-01-12T21:23:13.331Z"),
  },
  {
    _id: 5,
    name: "Cheese",
    size: "large",
    price: 14,
    quantity: 10,
    date: ISODate("2022-01-12T05:08:13Z"),
  },
  {
    _id: 6,
    name: "Vegan",
    size: "small",
    price: 17,
    quantity: 10,
    date: ISODate("2021-01-13T05:08:13Z"),
  },
  {
    _id: 7,
    name: "Vegan",
    size: "medium",
    price: 18,
    quantity: 10,
    date: ISODate("2021-01-13T05:10:13Z"),
  },
]);

// 사이즈:미디움 이고, name을 기준으로 그룹화 하여 quantity의 수량의 합을 보여주자.
db.orders.aggregate([
  {
    $match: {
      size: "medium",
    },
  },
  {
    $group: {
      _id: { $getField: "name" },
      totalQuantity: {
        $sum: { $getField: "quantity" },
      },
    },
  },
]);

// 위의 예제를 축약해서 적음
db.orders.aggregate([
  {
    $match: {
      size: "medium",
    },
  },
  {
    $group: {
      _id: "$name",
      totalQuantity: {
        $sum: "$quantity",
      },
    },
  },
]);

// 날짜가 2020-01-30부터 2년간 데이터 중에서, 날짜별 매출과 평균 판매수량을 출력하고 매출을 기준으로 내림차순 하라
db.orders.aggregate([
  {
    $match: {
      date: {
        $gte: new ISODate("2020-01-30"),
        $lt: new ISODate("2022-01-30"),
      },
    },
  },
  {
    $group: {
      _id: {
        $dateToString: {
          // 데아터 타입을 스트링으로 변경
          format: "%Y-%m-%d",
          date: "$date",
        },
      },
      totalOrderVaule: {
        $sum: {
          $multiply: ["$price", "$quantity"], // 두개 이상의 데이터를 받는다.
        },
      },
      averageOrderQuantity: {
        $avg: "$quantity",
      },
    },
  },
  {
    $sort: {
      totalOrderVaule: -1,
    },
  },
]);

db.books.insertMany([
  { _id: 8751, title: "The Banquet", author: "Dante", copies: 2 },
  { _id: 8752, title: "Divine Comedy", author: "Dante", copies: 1 },
  { _id: 8645, title: "Eclogues", author: "Dante", copies: 2 },
  { _id: 7000, title: "The Odyssey", author: "Homer", copies: 10 },
  { _id: 7020, title: "Iliad", author: "Homer", copies: 10 },
]);

// 저자를 기준으로 그룹화 하고, 저자가 지은 책의 재목들을 books 필드에 배열로 넣어라
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      books: {
        $push: "$title",
      },
    },
  },
]);

db.books.aggregate([
  {
    $group: {
      _id: "$author",
      books: {
        $push: "$$ROOT", // 도큐먼트 자체가 들어간다.
      },
      totalCopies: {
        // 총 판매량
        $sum: "$copies",
      },
    },
  },
]);

db.books.aggregate([
  {
    $group: {
      _id: "$author",
      books: {
        $push: "$$ROOT",
      },
    },
  },
  {
    // 따로 스테이지로 빼서 사용한다.
    $addFields: {
      totalCopies: { $sum: "$books.copies" },
    },
  },
]);

db.orders.drop();

db.orders.insertMany([
  { productId: 1, price: 12 },
  { productId: 2, price: 20 },
  { productId: 3, price: 80 },
]);

db.products.insertMany([
  { id: 1, instock: 120 },
  { id: 2, instock: 80 },
  { id: 3, instock: 60 },
  { id: 4, instock: 70 },
]);

db.orders.aggregate([
  {
    $lookup: {
      // left 조인을 의미한다.
      from: "products", // products 컬렉션과 조인한다.
      localField: "productId", // productId를 기준으로
      foreignField: "id",
      as: "data", // 데이터 필드에 조인된 결과들을 보여줌 출력값 [{ id: 1, instock: 120 }]
    },
  },
  {
    $match: {
      $expr: {
        // expr 오퍼레이터는 배열에 사용하면 정확한 데이터를 출력하지 못함
        $lt: ["$data.instock", "$price"],
      },
    },
  },
]);

db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "id",
      as: "data",
    },
  },
  {
    $match: {
      $expr: {
        $lt: ["$data.instock", "$price"],
      },
    },
  },
]);

db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "id",
      as: "data",
    },
  },
  {
    $unwind: "$data", // expr 오퍼레이터는 배열에 사용하면 정확한 데이터를 출력하지 못함 따라서 unwind 사용
  },
  {
    $match: {
      $expr: {
        $lt: ["$data.instock", "$price"],
      },
    },
  },
]);

db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "id",
      as: "data",
    },
  },
  {
    $unwind: "$data", // 배열에 대한 부분을 오브젝트 형태로 풀어서 처리한 뒤 match를 실행한다.
  },
  {
    $match: {
      $expr: {
        $gt: ["$data.instock", "$price"],
      },
    },
  },
]);

db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "id",
      as: "data",
    },
  },
  {
    $unwind: "$data",
  },
]);

db.books.aggregate([
  {
    $group: {
      _id: "$author",
      books: {
        $push: "$$ROOT",
      },
    },
  },
  {
    $addFields: {
      totalCopies: { $sum: "$books.copies" },
    },
  },
  {
    $unwind: "$books",
  },
]);

db.listingsAndReviews.aggregate([
  {
    $sample: { size: 3 },
  },
  {
    $project: {
      name: 1,
      summary: 1,
    },
  },
]);

db.listingsAndReviews.aggregate([
  {
    $match: {
      property_type: "Apartment",
    },
  },
  {
    $sort: {
      number_of_reviews: -1,
    },
  },
  {
    $skip: 0, // 페이징
  },
  {
    $limit: 5, // 5개만 보여줌
  },
  {
    $project: {
      name: 1,
      number_of_reviews: 1,
    },
  },
]);

db.listingsAndReviews.aggregate([
  {
    $match: {
      property_type: "Apartment",
    },
  },
  {
    $sort: {
      number_of_reviews: -1,
    },
  },
  {
    $skip: 5,
  },
  {
    $limit: 5,
  },
  {
    $project: {
      name: 1,
      number_of_reviews: 1,
    },
  },
]);

db.books.aggregate([
  {
    $group: {
      _id: "$author",
      books: { $push: "$title" },
    },
  },
  {
    $out: "authors", // 위의 결과가 컬렉션으로 저장된다.
  },
]);
```
