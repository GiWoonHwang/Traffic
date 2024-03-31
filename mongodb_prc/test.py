MongoRunner.dataPath = "MongoRunner.dataPath = "/Users/dustin/Desktop/common/repltest/"

st = ShardingTest({
    name:"test-shard1",
    chunkSize:1,
    shards:3,
    rs:{
        nodes:3,
        oplogSize:10
    },
    other: {
        enableBalancer:true
    }

})