// 각 층별로 온도에 대한 데이터를 센서를 이용하여 mongodb에 저장한다.

// 1분마다 증가하는 함수
// addMinutes(1, new Date())
const addMinutes = (min, date) => {
  date.setMinutes(date.getMinutes() + min);
  return new Date(date.getTime());
};

// 온도에 대한 수치를 특정 범위 내에서 가져온다.
// getRandomNumber(10,30)
const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * iot> arr[0]
{
  sensor_id: 1,
  timestamp: ISODate('2022-01-01T00:01:00.000Z'),
  temparature: 21
}
 */
arr = [];
date = new Date("2022-01-01T00:00:00.000Z");
// 30일에 해당하는 1분단위의 데이터: 864000개
for (range = 0; range < 60 * 24 * 30; range++) {
  time = addMinutes(1, date);
  for (floor = 1; floor < 21; floor++) {
    arr.push({
      sensor_id: floor,
      timestamp: time,
      temparature: getRandomNumber(17, 30),
    });
  }
}

db.sensor1.insertMany(arr);

// 60.150146484375 메가바이트
db.sensor1.stats().size / 1024 / 1024;

/**
 * 버켓패턴
 * 데이터를 잘라서 저장함 -> 여기서는 한시간을 기준으로 데이터를 나누어 저장
 * 데이터가 14400로 감소
 * {
  sensor_id: 1,
  start_date: ISODate('2022-01-01T00:00:00.000Z'),
  end_date: ISODate('2022-01-01T01:00:00.000Z'),
  measurements: [
    { timestamp: ISODate('2022-01-01T00:01:00.000Z'), temparature: 19 },
    { timestamp: ISODate('2022-01-01T00:02:00.000Z'), temparature: 24 },
    { timestamp: ISODate('2022-01-01T00:03:00.000Z'), temparature: 18 },
    { timestamp: ISODate('2022-01-01T00:04:00.000Z'), temparature: 30 },
    { timestamp: ISODate('2022-01-01T00:05:00.000Z'), temparature: 26 },
    { timestamp: ISODate('2022-01-01T00:06:00.000Z'), temparature: 30 },
    { timestamp: ISODate('2022-01-01T00:07:00.000Z'), temparature: 20 },
    { timestamp: ISODate('2022-01-01T00:08:00.000Z'), temparature: 28 },
    { timestamp: ISODate('2022-01-01T00:09:00.000Z'), temparature: 20 },
    { timestamp: ISODate('2022-01-01T00:10:00.000Z'), temparature: 24 },
    { timestamp: ISODate('2022-01-01T00:11:00.000Z'), temparature: 17 },
    { timestamp: ISODate('2022-01-01T00:12:00.000Z'), temparature: 18 },
    { timestamp: ISODate('2022-01-01T00:13:00.000Z'), temparature: 27 },
    { timestamp: ISODate('2022-01-01T00:14:00.000Z'), temparature: 24 },
    { timestamp: ISODate('2022-01-01T00:15:00.000Z'), temparature: 20 },
    { timestamp: ISODate('2022-01-01T00:16:00.000Z'), temparature: 27 },
    { timestamp: ISODate('2022-01-01T00:17:00.000Z'), temparature: 19 },
    { timestamp: ISODate('2022-01-01T00:18:00.000Z'), temparature: 18 },
    { timestamp: ISODate('2022-01-01T00:19:00.000Z'), temparature: 27 },
    { timestamp: ISODate('2022-01-01T00:20:00.000Z'), temparature: 27 },
    { timestamp: ISODate('2022-01-01T00:21:00.000Z'), temparature: 17 },
    { timestamp: ISODate('2022-01-01T00:22:00.000Z'), temparature: 20 },
    { timestamp: ISODate('2022-01-01T00:23:00.000Z'), temparature: 19 },
    { timestamp: ISODate('2022-01-01T00:24:00.000Z'), temparature: 27 },
    { timestamp: ISODate('2022-01-01T00:25:00.000Z'), temparature: 17 },
    { timestamp: ISODate('2022-01-01T00:26:00.000Z'), temparature: 24 },
    { timestamp: ISODate('2022-01-01T00:27:00.000Z'), temparature: 28 },
    { timestamp: ISODate('2022-01-01T00:28:00.000Z'), temparature: 19 },
    { timestamp: ISODate('2022-01-01T00:29:00.000Z'), temparature: 29 },
    { timestamp: ISODate('2022-01-01T00:30:00.000Z'), temparature: 29 },
    { timestamp: ISODate('2022-01-01T00:31:00.000Z'), temparature: 28 },
    { timestamp: ISODate('2022-01-01T00:32:00.000Z'), temparature: 18 },
    { timestamp: ISODate('2022-01-01T00:33:00.000Z'), temparature: 17 },
    { timestamp: ISODate('2022-01-01T00:34:00.000Z'), temparature: 19 },
    { timestamp: ISODate('2022-01-01T00:35:00.000Z'), temparature: 23 },
    { timestamp: ISODate('2022-01-01T00:36:00.000Z'), temparature: 19 },
    { timestamp: ISODate('2022-01-01T00:37:00.000Z'), temparature: 19 },
    { timestamp: ISODate('2022-01-01T00:38:00.000Z'), temparature: 26 },
    { timestamp: ISODate('2022-01-01T00:39:00.000Z'), temparature: 22 },
    { timestamp: ISODate('2022-01-01T00:40:00.000Z'), temparature: 22 },
    { timestamp: ISODate('2022-01-01T00:41:00.000Z'), temparature: 30 },
    { timestamp: ISODate('2022-01-01T00:42:00.000Z'), temparature: 22 },
    { timestamp: ISODate('2022-01-01T00:43:00.000Z'), temparature: 29 },
    { timestamp: ISODate('2022-01-01T00:44:00.000Z'), temparature: 25 },
    { timestamp: ISODate('2022-01-01T00:45:00.000Z'), temparature: 24 },
    { timestamp: ISODate('2022-01-01T00:46:00.000Z'), temparature: 28 },
    { timestamp: ISODate('2022-01-01T00:47:00.000Z'), temparature: 23 },
    { timestamp: ISODate('2022-01-01T00:48:00.000Z'), temparature: 27 },
    { timestamp: ISODate('2022-01-01T00:49:00.000Z'), temparature: 29 },
    { timestamp: ISODate('2022-01-01T00:50:00.000Z'), temparature: 25 },
    { timestamp: ISODate('2022-01-01T00:51:00.000Z'), temparature: 29 },
    { timestamp: ISODate('2022-01-01T00:52:00.000Z'), temparature: 17 },
    { timestamp: ISODate('2022-01-01T00:53:00.000Z'), temparature: 23 },
    { timestamp: ISODate('2022-01-01T00:54:00.000Z'), temparature: 29 },
    { timestamp: ISODate('2022-01-01T00:55:00.000Z'), temparature: 27 },
    { timestamp: ISODate('2022-01-01T00:56:00.000Z'), temparature: 22 },
    { timestamp: ISODate('2022-01-01T00:57:00.000Z'), temparature: 30 },
    { timestamp: ISODate('2022-01-01T00:58:00.000Z'), temparature: 23 },
    { timestamp: ISODate('2022-01-01T00:59:00.000Z'), temparature: 22 },
    { timestamp: ISODate('2022-01-01T01:00:00.000Z'), temparature: 29 }
  ]
}

 */
arr = [];
date = new Date("2022-01-01T00:00:00.000Z");
for (hour = 0; hour < 24 * 30; hour++) {
  start_date = addMinutes(0, date);
  measurement = [];
  for (sec = 0; sec < 60; sec++) {
    time = addMinutes(1, date);
    measurement.push({
      timestamp: time,
      temparature: 0,
    });
  }
  for (floor = 1; floor < 21; floor++) {
    for (i = 0; i < 60; i++) {
      measurement[i].temparature = getRandomNumber(17, 30);
    }
    arr.push({
      sensor_id: floor,
      start_date: start_date,
      end_date: addMinutes(0, date),
      measurements: measurement,
    });
  }
}

db.sensor2.insertMany(arr);

db.sensor1.stats().size / 1024 / 1024; // 데이터크기: 60.150146484375
db.sensor2.stats().size / 1024 / 1024; // 데이터크기: 38.232421875

/**
 * 현재 모델링(한시간 단위로 데이터를 묶으면) 문제점: 데이터 커스텀 문제, ex) 25도 이상 데이터를 30분 단위로 알고싶다면 ??
 * 해결방안: 몽고디비5.0 timeseries 컬렉션(시계열 데이터에 대한 효율적인 저장이 가능, 내부적으로 클러스터드 인덱스를 사용하여 빠른 속도의 검색이 가능)
 * iot> show collections
	sensor1
	sensor2
	sensor3                     [time-series]
	system.buckets.sensor3
	system.views
 */
db.createCollection("sensor3", {
  timeseries: {
    timeField: "timestamp",
    metaField: "metadata", // 타임 필드 컬렉션 외에 자주사용되는 데이터에 대한 인덱스 생성을 위해 metaField가 필요하다
    granularity: "minutes",
  },
});

// 864000개의 데이터 생성
/**
 * {
  timestamp: ISODate('2022-01-01T00:01:00.000Z'),
  metadata: { sensor_id: 1, temparature: 21 }
}
 */
arr = [];
date = new Date("2022-01-01T00:00:00.000Z");
for (range = 0; range < 60 * 24 * 30; range++) {
  time = addMinutes(1, date);
  for (floor = 1; floor < 21; floor++) {
    arr.push({
      timestamp: time,
      metadata: {
        sensor_id: floor,
        temparature: getRandomNumber(17, 30),
      },
    });
  }
}

db.sensor3.insertMany(arr);

db.sensor1.stats().size / 1024 / 1024;
db.sensor2.stats().size / 1024 / 1024;
db.sensor3.stats().size / 1024 / 1024; // 24.772201538085938
