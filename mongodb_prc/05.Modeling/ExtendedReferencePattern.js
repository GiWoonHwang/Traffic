// 회원이 많은 OLTP성 카페 서비스 (너무 큰 배열 문제)

db.cafe.insertMany([
  {
    _id: 1,
    name: "IT Community",
    desc: "A Cafe where developer's share information.",
    created_at: ISODate("2018-08-09"),
    last_article: ISODate("2022-06-01T10:56:32.000Z"),
    level: 5,
    members: [
      {
        id: "tom93",
        first_name: "Tom",
        last_name: "Park",
        phone: "000-0000-1234",
        joined_at: ISODate("2018-09-12"),
        job: "DBA",
      },
      {
        id: "asddwd12",
        first_name: "Jenny",
        last_name: "Kim",
        phone: "000-0000-1111",
        joined_at: ISODate("2018-10-02"),
        job: "Frontend Dev",
      },
      {
        id: "candy12",
        first_name: "Zen",
        last_name: "Ko",
        phone: "000-0000-1233",
        joined_at: ISODate("2019-01-01"),
        job: "DA",
      },
    ],
  },
  {
    _id: 2,
    name: "Game Community",
    desc: "Share information about games.",
    created_at: ISODate("2020-01-23"),
    last_article: ISODate("2022-06-02T10:56:32.000Z"),
    level: 4,
    members: [
      {
        id: "tom93",
        first_name: "Tom",
        last_name: "Park",
        phone: "000-0000-1234",
        joined_at: ISODate("2020-09-12"),
        job: "DBA",
      },
      {
        id: "asddwd12",
        first_name: "Jenny",
        last_name: "Kim",
        phone: "000-0000-1111",
        joined_at: ISODate("2021-10-01"),
        job: "Frontend Dev",
      },
      {
        id: "java1",
        first_name: "Kevin",
        last_name: "Shin",
        phone: "000-0000-1133",
        joined_at: ISODate("2022-08-10"),
        job: "Game Dev",
      },
    ],
  },
]);

// 임의의 값을 주어 이용자수를 늘린다.
const generateRandomString = (num) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// 임의의 날짜와 직업을 생성
jobs = ["DBA", "SE", "DA", "FE", "BE"];
jobs[Math.floor(Math.random() * jobs.length)];

date = new Date();
new Date(date - Math.floor(Math.random() * 10000000000));

// 10만명 추가
arr = [];
for (i = 0; i < 100000; i++) {
  document = {
    id: generateRandomString(5),
    first_name: generateRandomString(10),
    last_name: generateRandomString(15),
    phone: "000-0000-1234",
    joined_at: new Date(date - Math.floor(Math.random() * 10000000000)),
    job: jobs[Math.floor(Math.random() * jobs.length)],
  };
  arr.push(document);
}

db.cafe.updateOne(
  { _id: 2 },
  {
    $addToSet: {
      members: { $each: arr },
    },
  }
);

// 바이트이기 때문에 값을 나누어 mb어 출력, 약 13.361040115356445
db.cafe.stats().size / 1024 / 1024;

/**
 * 최초의 모델링 방법: 카페이 멤버를 임베딩(하나의 도큐먼트에 다 밀어넣는다)
 * 몽고디비 하나의 도큐먼트 최대 크기는 16바이트이다.
 * 카페서비스처럼 회원수가 계속 늘어나는 요구사항에서 배열로 모델링하는 것은 적합하지 않다. (현재 유저정보는 배열로 저장되고 있음)
 * 현재 모델링으로는 13만명 정도가 최대일 것으로 예상된다. (10만명에 13.36바이트를 차지했다)
 */
db.cafe.aggregate([
  {
    $project: {
      arrSize: {
        $size: "$members",
      },
    },
  },
]);

/**
 * members라는 컬렉션을 만들어 멤버에 대한 정보를 기준으로 넣는다.
 * 유저 도큐먼트에 가입한 카페 목록을 배열로 저장한다.
 */
db.members.insertMany([
  {
    id: "tom93",
    first_name: "Tom",
    last_name: "Park",
    phone: "000-0000-1234",
    job: "DBA",
    joined_cafes: [
      {
        _id: 1,
        name: "IT Community",
        desc: "A Cafe where developer's share information.",
        created_at: ISODate("2018-08-09"),
        last_article: ISODate("2022-06-01T10:56:32.000Z"),
        level: 5,
        joined_at: ISODate("2018-09-12"),
      },
      {
        _id: 2,
        name: "Game Community",
        desc: "Share information about games.",
        created_at: ISODate("2020-01-23"),
        last_article: ISODate("2022-06-02T10:56:32.000Z"),
        level: 4,
        joined_at: ISODate("2020-09-12"),
      },
    ],
  },
  {
    id: "asddwd12",
    first_name: "Jenny",
    last_name: "Kim",
    phone: "000-0000-1111",
    job: "Frontend Dev",
    joined_cafes: [
      {
        _id: 1,
        name: "IT Community",
        desc: "A Cafe where developer's share information.",
        created_at: ISODate("2018-08-09"),
        last_article: ISODate("2022-06-01T10:56:32.000Z"),
        level: 5,
        joined_at: ISODate("2018-10-02"),
      },
      {
        _id: 2,
        name: "Game Community",
        desc: "Share information about games.",
        created_at: ISODate("2020-01-23"),
        last_article: ISODate("2022-06-02T10:56:32.000Z"),
        level: 4,
        joined_at: ISODate("2021-10-01"),
      },
    ],
  },
  {
    id: "candy12",
    first_name: "Zen",
    last_name: "Ko",
    phone: "000-0000-1233",
    job: "DA",
    joined_cafes: [
      {
        _id: 1,
        name: "IT Community",
        desc: "A Cafe where developer's share information.",
        created_at: ISODate("2018-08-09"),
        last_article: ISODate("2022-06-01T10:56:32.000Z"),
        level: 5,
        joined_at: ISODate("2019-01-01"),
      },
    ],
  },
  {
    id: "java1",
    first_name: "Kevin",
    last_name: "Shin",
    phone: "000-0000-1133",
    job: "Game Dev",
    joined_cafes: [
      {
        _id: 2,
        name: "Game Community",
        desc: "Share information about games.",
        created_at: ISODate("2020-01-23"),
        last_article: ISODate("2022-06-02T10:56:32.000Z"),
        level: 4,
        joined_at: ISODate("2022-08-10"),
      },
    ],
  },
]);

// 회원수 증가시키기 (30만명 추가)
arr = [];
for (i = 0; i < 300000; i++) {
  document = {
    id: generateRandomString(5),
    first_name: generateRandomString(10),
    last_name: generateRandomString(15),
    phone: "000-0000-1234",
    job: jobs[Math.floor(Math.random() * jobs.length)],
    joined_cafes: [
      {
        _id: 2,
        name: "Game Community",
        desc: "Share information about games.",
        created_at: ISODate("2020-01-23T00:00:00.000Z"),
        last_article: ISODate("2022-06-02T10:56:32.000Z"),
        level: 4,
        joined_at: new Date(date - Math.floor(Math.random() * 10000000000)),
      },
    ],
  };
  arr.push(document);
}

db.members.insertMany(arr);

date = new Date();

// 처음만든 카페 컬렉션 수정 (last_article: 새로운 글 작성)
db.cafe.updateOne({ _id: 1 }, { $set: { last_article: date } });

db.cafe.updateOne({ _id: 2 }, { $set: { last_article: date } });

/**
 * 문제점
 * members 컬렉션에서 카페에 대한 정보 업데이트
 * 카페에 대한 정보를 수정할 때 엄청난 시간이 든다 -> 각 멤버가 가입한 카페를 일일이 확인해야 하기 때문
 * {
  acknowledged: true,
  insertedId: null,
  matchedCount: 300003,
  modifiedCount: 300003,
  upsertedCount: 0
}
글이 작성될 때마다 선형적으로 작업이 증가되는 문제가 발생
 */
db.members.updateMany(
  {
    "joined_cafes._id": 1,
  },
  {
    $set: {
      "joined_cafes.$.last_article": date,
    },
  }
);

db.members.updateMany(
  {
    "joined_cafes._id": 2,
  },
  {
    $set: {
      "joined_cafes.$.last_article": date,
    },
  }
);

db.cafe.deleteMany({});
db.members.deleteMany({});

// 도큐먼트가 16메가바이트를 넘는 문제 + 카페에 대한 데이터가 수정될 때, 작업시간이 선형적으로 증가하는 문제 해결 해보기
// 컬렉션을 분리한다.
db.cafe.insertMany([
  {
    _id: 1,
    name: "IT Community",
    desc: "A Cafe where developer's share information.",
    created_at: ISODate("2018-08-09"),
    last_article: ISODate("2022-06-01T10:56:32.000Z"),
    level: 5,
  },
  {
    _id: 2,
    name: "Game Community",
    desc: "Share information about games.",
    created_at: ISODate("2020-01-23"),
    last_article: ISODate("2022-06-02T10:56:32.000Z"),
    level: 4,
  },
]);

db.members.insertMany([
  {
    id: "tom93",
    first_name: "Tom",
    last_name: "Park",
    phone: "000-0000-1234",
    job: "DBA",
    joined_cafes: [1, 2],
  },
  {
    id: "asddwd12",
    first_name: "Jenny",
    last_name: "Kim",
    phone: "000-0000-1111",
    job: "Frontend Dev",
    joined_cafes: [1, 2],
  },
  {
    id: "candy12",
    first_name: "Zen",
    last_name: "Ko",
    phone: "000-0000-1233",
    job: "DA",
    joined_cafes: [1],
  },
  {
    id: "java1",
    first_name: "Kevin",
    last_name: "Shin",
    phone: "000-0000-1133",
    job: "Game Dev",
    joined_cafes: [2],
  },
]);

// 두가지의 문제는 해결했지만 조회시 조인이 발생한다.
/**
 * [
  {
    _id: 1,
    name: 'IT Community',
    desc: "A Cafe where developer's share information.",
    created_at: ISODate('2018-08-09T00:00:00.000Z'),
    joinedMemberJob: 'DBA',
    cnt: 1
  },
  {
    _id: 2,
    name: 'Game Community',
    desc: 'Share information about games.',
    created_at: ISODate('2020-01-23T00:00:00.000Z'),
    joinedMemberJob: 'DBA',
    cnt: 1
  }
]
 */
db.cafe.aggregate([
  {
    $lookup: {
      from: "members",
      localField: "_id",
      foreignField: "joined_cafes",
      as: "members",
      pipeline: [
        {
          $match: {
            job: "DBA",
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            job: 1,
          },
        },
      ],
    },
  },
  {
    $project: {
      name: 1,
      desc: 1,
      created_at: 1,
      joinedMemberJob: {
        $first: "$members.job",
      },
      cnt: {
        $size: "$members",
      },
    },
  },
]);

// 회원 수 30만명 추가
arr = [];
for (i = 0; i < 300000; i++) {
  document = {
    id: generateRandomString(5),
    first_name: generateRandomString(10),
    last_name: generateRandomString(15),
    phone: "000-0000-1234",
    job: jobs[Math.floor(Math.random() * jobs.length)],
    joined_cafes: [2],
  };
  arr.push(document);
}

db.members.insertMany(arr);

// 30만명 추가 후
/**
 * 331ms 중 조인에 대한 시간이 대부분 차지한다.
 */
db.cafe
  .aggregate([
    {
      $lookup: {
        from: "members",
        localField: "_id",
        foreignField: "joined_cafes",
        as: "members",
        pipeline: [
          {
            $match: {
              job: "DBA",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              job: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        name: 1,
        desc: 1,
        created_at: 1,
        joinedMemberJob: {
          $first: "$members.job",
        },
        cnt: {
          $size: "$members",
        },
      },
    },
  ])
  .explain("executionStats");

// 인덱스 추가
db.members.createIndex({ joined_cafes: 1 });

// 조인단계에서 인덱스를 사용했지만 오히려 시간이 더 소요됨 442ms
db.cafe
  .aggregate([
    {
      $lookup: {
        from: "members",
        localField: "_id",
        foreignField: "joined_cafes",
        as: "members",
        pipeline: [
          {
            $match: {
              job: "DBA",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              job: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        name: 1,
        desc: 1,
        created_at: 1,
        joinedMemberJob: {
          $first: "$members.job",
        },
        cnt: {
          $size: "$members",
        },
      },
    },
  ])
  .explain("executionStats");

db.cafe.deleteMany({});
db.members.deleteMany({});

// extendReference pattern: 컬렉션을 분리 후 내장시킬 수 있는 필드를 일부 내장시킨다. (변경되지 않거나 꼭 함께 조회해야 하는 필드)
db.cafe.insertMany([
  {
    _id: 1,
    name: "IT Community",
    desc: "A Cafe where developer's share information.",
    created_at: ISODate("2018-08-09"),
    last_article: ISODate("2022-06-01T10:56:32.000Z"),
    level: 5,
  },
  {
    _id: 2,
    name: "Game Community",
    desc: "Share information about games.",
    created_at: ISODate("2020-01-23"),
    last_article: ISODate("2022-06-02T10:56:32.000Z"),
    level: 4,
  },
]);

// name, created_at, desc등 잘 변하지 않는 필드를 내장시켜준다.
// 조인없이 멤버가 가입한 카페를 가져올 수 있다.
db.members.insertMany([
  {
    id: "tom93",
    first_name: "Tom",
    last_name: "Park",
    phone: "000-0000-1234",
    job: "DBA",
    joined_cafes: [
      {
        _id: 1,
        name: "IT Community",
        desc: "A Cafe where developer's share information.",
        created_at: ISODate("2018-08-09"),
      },
      {
        _id: 2,
        name: "Game Community",
        desc: "Share information about games.",
        created_at: ISODate("2020-01-23"),
      },
    ],
  },
  {
    id: "asddwd12",
    first_name: "Jenny",
    last_name: "Kim",
    phone: "000-0000-1111",
    job: "Frontend Dev",
    joined_cafes: [
      {
        _id: 1,
        name: "IT Community",
        desc: "A Cafe where developer's share information.",
        created_at: ISODate("2018-08-09"),
      },
      {
        _id: 2,
        name: "Game Community",
        desc: "Share information about games.",
        created_at: ISODate("2020-01-23"),
      },
    ],
  },
  {
    id: "candy12",
    first_name: "Zen",
    last_name: "Ko",
    phone: "000-0000-1233",
    job: "DA",
    joined_cafes: [
      {
        _id: 1,
        name: "IT Community",
        desc: "A Cafe where developer's share information.",
        created_at: ISODate("2018-08-09"),
      },
    ],
  },
  {
    id: "java1",
    first_name: "Kevin",
    last_name: "Shin",
    phone: "000-0000-1133",
    job: "Game Dev",
    joined_cafes: [
      {
        _id: 2,
        name: "Game Community",
        desc: "Share information about games.",
        created_at: ISODate("2020-01-23"),
      },
    ],
  },
]);

// 유저 30만명 추가
arr = [];
for (i = 0; i < 300000; i++) {
  document = {
    id: generateRandomString(5),
    first_name: generateRandomString(10),
    last_name: generateRandomString(15),
    phone: "000-0000-1234",
    job: jobs[Math.floor(Math.random() * jobs.length)],
    joined_cafes: [
      {
        _id: 2,
        name: "Game Community",
        desc: "Share information about games.",
        created_at: ISODate("2020-01-23T00:00:00.000Z"),
      },
    ],
  };
  arr.push(document);
}

db.members.insertMany(arr);

// 220ms 소모, 컬렉션스캔을 하기 때문에 인덱스를 설정해 준다.
// 인덱스 설정 후: 115ms 소모
db.members
  .aggregate([
    {
      $match: {
        job: "DBA",
      },
    },
    {
      $unwind: "$joined_cafes",
    },
    {
      $group: {
        _id: "$joined_cafes._id",
        joined_cafes: {
          $first: "$joined_cafes",
        },
        joinedMemberJob: {
          $first: "$job",
        },
        cnt: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$joined_cafes.name",
        desc: "$joined_cafes.desc",
        create_at: "$joined_cafes.created_at",
        joinedMemberJob: 1,
        cnt: 1,
      },
    },
  ])
  .explain("executionStats");

db.members.createIndex({ job: 1 });
