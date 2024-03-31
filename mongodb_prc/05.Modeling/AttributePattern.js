// 예측할 수 없는 행동로그 분석하기: 게임과 같은 서비스에서 사용자들의 패턴을 분석하고, 모든 행동을 기록한다.

db.users.insertOne({
  _id: "tom",
  joinDate: new Date(),
  server: "Sevilla",
  job: "merchant",
  logInfo: [],
});

log = {
  loginTime: new Date(),
  visits: [],
  sails: [],
  trades: [],
  battles: [],
  quests: [],
  fishings: [],
  gambles: [],
  castings: [],
  farmings: [],
};

log.visits.push({
  location: "Barcelona",
  time: new Date(),
});
log.visits.push({
  location: "Sevilla",
  time: new Date(),
});
log.visits.push({
  location: "London",
  time: new Date(),
});

log.trades.push({
  item: "Musket",
  qty: 50,
  price: 1800,
});
log.trades.push({
  item: "Musket",
  qty: -50,
  price: 2300,
});

log.quests.push({
  name: "Cave Invenstigation",
  reward: 50000,
});

db.users.updateOne(
  { _id: "tom" },
  {
    $addToSet: {
      logInfo: log,
    },
  }
);

/**
 * 하나의 컬렉션에 너무 큰 데이터가 들어가게됨
 * db.users.find();
[
  {
    _id: 'tom',
    joinDate: ISODate('2024-03-31T10:23:12.852Z'),
    server: 'Sevilla',
    job: 'merchant',
    logInfo: [
      {
        loginTime: ISODate('2024-03-31T10:28:09.402Z'),
        visits: [
          {
            location: 'Barcelona',
            time: ISODate('2024-03-31T10:29:49.362Z')
          },
          {
            location: 'Sevilla',
            time: ISODate('2024-03-31T10:29:49.376Z')
          },
          {
            location: 'London',
            time: ISODate('2024-03-31T10:29:49.387Z')
          }
        ],
        sails: [],
        trades: [
          { item: 'Musket', qty: 50, price: 1800 },
          { item: 'Musket', qty: -50, price: 2300 }
        ],
        battles: [],
        quests: [ { name: 'Cave Invenstigation', reward: 50000 } ],
        fishings: [],
        gambles: [],
        castings: [],
        farmings: []
      }
    ]
  }
]
 */
db.users.find();
db.users.drop();

// 데이터 분리
log.user = "tom";
log.logoutTime = new Date();
db.logs.insertOne(log);

/**
 * 배열의 크기가 커지는 문제는 해결되었지만, 게임사용자가 많아지거나 로그값이 추가되면 인덱스를 여러개 생성해야 하는 문제가 발생된다.
 * game> db.logs.find();
[
  {
    _id: ObjectId('66093b86d44cb6c4a10a24b9'),
    loginTime: ISODate('2024-03-31T10:28:09.402Z'),
    visits: [
      {
        location: 'Barcelona',
        time: ISODate('2024-03-31T10:29:49.362Z')
      },
      {
        location: 'Sevilla',
        time: ISODate('2024-03-31T10:29:49.376Z')
      },
      { location: 'London', time: ISODate('2024-03-31T10:29:49.387Z') }
    ],
    sails: [],
    trades: [
      { item: 'Musket', qty: 50, price: 1800 },
      { item: 'Musket', qty: -50, price: 2300 }
    ],
    battles: [],
    quests: [ { name: 'Cave Invenstigation', reward: 50000 } ],
    fishings: [],
    gambles: [],
    castings: [],
    farmings: [],
    user: 'tom',
    logoutTime: ISODate('2024-03-31T10:31:27.322Z')
  }
]
 */
db.logs.find();
db.logs.drop();

// 키-밸류 형태로 데이터를 묶고, 하나의 인덱스만 생성하여 데이터를 관리한다.
/**
 * game> db.logs.find();
[
  {
    _id: ObjectId('66093c55d44cb6c4a10a24ba'),
    user: 'tom',
    loginTime: ISODate('2024-03-31T10:35:01.124Z'),
    logoutTime: ISODate('2024-03-31T10:35:01.179Z'),
    actions: [
      {
        action: 'visit',
        value: 'Barcelona',
        time: ISODate('2024-03-31T10:35:01.124Z')
      },
      {
        action: 'visit',
        value: 'Sevilla',
        time: ISODate('2024-03-31T10:35:01.124Z')
      },
      {
        action: 'visit',
        value: 'London',
        time: ISODate('2024-03-31T10:35:01.124Z')
      },
      {
        action: 'trade',
        value: 'Musket',
        type: 'buy',
        qty: 50,
        price: 1800
      },
      {
        action: 'trade',
        value: 'Musket',
        type: 'sell',
        qty: 50,
        price: 2300
      },
      {
        action: 'quest',
        value: 'Cave Investigation',
        reward: 50000,
        status: 'In Progress'
      }
    ]
  }
]

 */
date = new Date();
log = {
  user: "tom",
  loginTime: date,
  logoutTime: new Date(),
  actions: [
    // 액션에 대한 형태를 키밸류로 정의함
    { action: "visit", value: "Barcelona", time: date },
    { action: "visit", value: "Sevilla", time: date },
    { action: "visit", value: "London", time: date },
    { action: "trade", value: "Musket", type: "buy", qty: 50, price: 1800 },
    { action: "trade", value: "Musket", type: "sell", qty: 50, price: 2300 },
    {
      action: "quest",
      value: "Cave Investigation",
      reward: 50000,
      status: "In Progress",
    },
  ],
};

db.logs.insertOne(log);
db.logs.find();

// 복합인덱스 형태로 인덱스의 개수가 한개로 줄어든다.
// 특정할 수 있는 필드가 다 제각각(필드가 다양함)인 경우 action이라는 키로 행동을 정의하고 밸류에 데이터를 넣는다.
db.logs.createIndex({ "actions.action": 1, "actions.value": 1 });
