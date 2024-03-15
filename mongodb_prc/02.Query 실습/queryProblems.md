```javascript
//1.sample_mflix database의 movies collection 전체를 조회한다.
db.movies.find();

//2. movies collection의 Document 수를 구한다.
db.movies.countDocuments();

//3. movies collection 전체를 조회하는데, title, year, genres, runtime, rated 필드를 출력하고 _id 필드는 출력하지 않는다.
db.movies.find(
  {},
  {
    title: 1,
    year: 1,
    genres: 1,
    runtime: 1,
    rated: 1,
    _id: 0, // 0은 값을 제외시킨다.
  }
);

//4. movies collection에서 runtime이 100분 이하인 Document를 조회한다.
db.movies.find({ runtime: { $lte: 100 } });

//5. movies collection에서 runtime이 100분 이하이고 genres에 Drama가 포함되는 Document를 조회한다.
db.movies.find({
  // 알반적으로 ,는 and 이다.
  runtime: { $lte: 100 },
  genres: "Drama",
});

//6. movies collection에서 runtime이 100분 이하이고 genres가 유일하게 Drama인 Document를 조회한다.
db.movies.find(
  {
    $and: [
      // and를 주지 않으면 중간 조건을 무시하며 작동하게 된다.
      { runtime: { $lte: 100 } },
      { genres: "Drama" },
      { genres: { $size: 1 } },
    ],
  },
  { genres: 1 } // 장르만 보이도록 설정함
);

//7. moveies collection에서 runtime이 100분이하이고 type이 series가 아니고 개봉년도가 2015년 이상이거나 1925년 이하 영화를 찾는다.
db.movies
  .find(
    {
      $and: [
        { runtime: { $lte: 100 } },
        { type: { $ne: "series" } },
        {
          $or: [{ year: { $lte: 1925 } }, { year: { $gte: 2015 } }],
        },
      ],
    },
    {
      runtime: 1,
      type: 1,
      year: 1,
    }
  )
  .sort({ year: -1 });

//8. movies collection에서 viewer 평가가 4.5 이상이거나 critic 평가가 9.5 이상인 영화를 찾고 runtime이 가장 긴 순서대로 5개 document를 출력한다.
//필드는 title, runtime, tomatoes, _id 필드를 출력한다.
db.movies
  .find(
    {
      $or: [
        { "tomatoes.viewer.rating": { $gte: 4.5 } },
        { "tomatoes.critic.rating": { $gte: 9.5 } },
      ],
    },
    { title: 1, runtime: 1, tomatoes: 1 }
  )
  .sort({ runtime: -1 })
  .limit(5); // 5개만 보여준다.

//9. sample_restuarants database의 restaurants collection에서 Queens에 있는 음식점 중에, A grade가 없는 음식점을 찾는다.
db.restaurants.find(
  {
    borough: "Queens",
    "grades.grade": { $ne: "A" },
    grades: { $size: 3 }, // grades에 대한 값이 배열요소로 3개있는 것들도 출력 됨
  },
  {
    grades: 1,
    _id: 0,
  }
);

//10. restaurants collection에서 Queens에 있는 음식점 중에, A와 Z가 같이 있는 음식점을 찾는다.
db.restaurants.find({
  $and: [
    { borough: "Queens" },
    // 배열안의 데이터 중 a랑 z는 꼭 들어가 있어야 함
    // 아래의 도큐먼트는 grads 배열 안에 값 중 geade가 A와 Z둘다 포함하는 데이터가 존재하기 때문에 출력됨
    /**
	  borough: 'Queens',
	  cuisine: 'korea'
	  grades: [
		{date: ??, geade:'Z', score:3},{date: ??, geade:'A', score:3},{date: ??, geade:'D', score:3}
	  ] 
	 */
    { grades: { $elemMatch: { grade: "A" } } },
    { grades: { $elemMatch: { grade: "Z" } } },
  ],
});

//11. restaurants collection에서 Queens에 있는 음식점 중에, grades의 score가 하나라도 70 이상인 document를 조회하고 grades 배열에는 70이 넘는 document 하나만 출력한다.(나머지 필드는 그대로 출력한다.)
db.restaurants.find(
  {
    borough: "Queens",
    "grades.score": { $gte: 70 },
  },
  {
    address: 1,
    borough: 1,
    cuisine: 1,
    "grades.$": 1, // 하나만 보여준다.
    name: 1,
    restaurant_id: 1,
  }
);
```
