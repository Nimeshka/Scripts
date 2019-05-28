#!/usr/bin/env node

const redis = require('ioredis');
const crypto = require('crypto');

const key = '';
const iv = '';
const cipher = crypto.createCipheriv('aes-128-ctr', key, iv);

let redisConf =  {
    mode: "instance",//instance, cluster, sentinel
    ip: "",
    port: 6389,
    user: "",
    password: "",
    sentinels:{
        hosts: "",
        port: '',
        name: "redis-cluster"
    }
};

let redisSetting =  {
    port: redisConf.port,
    host: redisConf.ip,
    family: 4,
    password: redisConf.password,
    db: 0,
    retryStrategy: function (times) {
        return Math.min(times * 50, 2000);;
    },
    reconnectOnError: function (err) {
        return true;
    }
};

if(redisConf.mode == 'sentinel'){
    if(redisConf.sentinels && redisConf.sentinels.hosts && redisConf.sentinels.port && redisConf.sentinels.name){
        let sentinelHosts = redisConf.sentinels.hosts.split(',');
        if(Array.isArray(sentinelHosts) && sentinelHosts.length > 2){
            let sentinelConnections = [];

            sentinelHosts.forEach(function(item){
                sentinelConnections.push({host: item, port:redisConf.sentinels.port})
            })

            redisSetting = {
                sentinels:sentinelConnections,
                name: redisConf.sentinels.name,
                password: redispass
            }
        }else{
            console.log("No enough sentinel servers found .........");
        }
    }
}

let redisClient;

if(redisConf.mode != "cluster") {
    redisClient = new redis(redisSetting);
}else{
    let redisHosts = redisip.split(",");
    if(Array.isArray(redisHosts)){
        redisSetting = [];
        redisHosts.forEach(function(item){
            redisSetting.push({
                host: item,
                port: redisport,
                family: 4,
                password: redispass});
        });

        redisClient = new redis.Cluster([redisSetting]);
    }else{
        redisClient = new redis(redisSetting);
    }
}

redisClient.on('error', function (err) {
    console.log('Error '.red, err);
});


(async () => {
    
    let token;

    try {    
        token = await redisClient.get("1_BILL_HASH_TOKEN");

        if (!token)
            throw new Error("Error retrieving hash token!");

        let billToken = cipher.update(token, 'utf8', 'hex');

        billToken += cipher.final('hex');
        
        console.log("BillToken: ", billToken);

        // set the bill token
        let status = await redisClient.set("1_BILL_TOKEN", billToken);

        console.log(status);
        return true;

    } catch(e) {
        console.log("Error", e);
        return false;
        
    } finally {
        redisClient.disconnect();
    }   

})();