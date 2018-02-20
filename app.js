var request = require('request');
var CronJob = require('cron').CronJob;
var mongojs = require('mongojs')
var db = mongojs('127.0.0.1/Environment', ['ThingStation','ThingTelemetry'])

var user = "psu-environment-connector"
var apiKey = "PSUEnvironmentConnector#123"
var collectionId = "5c2fdbcb7961321b157d875a2f29862308df0837aedb450754894ae9f74480fb"

var access_token = 'lDzl1qr0n4KUcUlR6sC4fKcj07lMM0KvN4GniUkl'

var options = {
    method: 'POST',
    url: 'https://www.smartcitystructure.com/api/v1/oauth/access-token',   
    formData : {
        'client_id': 'iot_infos_01',
        'client_secret': 'H7ORruoFACSwJF74YVicM0d3n4X9blDE',
        'grant_type': 'client_credentials'
    }
}

function saveThingStation() {
    

    var options2 = {
        method: 'GET',
        url: 'https://www.smartcitystructure.com/api/v1/environment/things?access_token=' + access_token
    }

    return new Promise((resolve) => {
        request(options2, (err, response, body) => {
            if (err) { console.log("err " + err); return; }
            db.ThingStation.insert(JSON.parse(body))
            resolve(body)
        })
    })
}

function getThingStation(){
    return new Promise ( function (resolve,reject){
        db.ThingStation.find({}, { 'id': 1, '_id': 0 }, (err, document) => {
            console.log('success')
            resolve(document)
        })
    })
}

function saveEnviromentByThingId(thing_id){
    // Option for local database

    const checkCollectionId = () => {
        db.psuEnvironmentCollectionId.find({ thingId: thing_id }, { _id: 0, collectionId: 1 }).toArray((err, doc) => {
            if (doc['collectionId'] == undefined) {
                
            }
        })
    }

    var options3 = {
        method: 'GET',
        url: 'https://www.smartcitystructure.com/api/v1/environment/things/' + thing_id + '/telemetries?access_token=' + access_token + '&sort=id,-createdAt&page=0&perpage=1'
    }    

    return new Promise((resolve) => {
        request(options3,(err, response, body) => {
            if(err) { console.log("err " + err); return; }
            if(response){
                try {
                    var result = JSON.parse(body)
                    result[0]['thingId'] = thing_id
                    db.ThingTelemetry.insert(result[0])
                    // POST data to ticket system
                    // Option for Ticket system
                    var options = {
                        method: 'POST',
                        url: 'http://localhost:8080/api/v1/data',
                        headers:
                            {
                                'Content-Type': 'application/json',
                                'user': user,
                                'password': pass,
                                'collectionId': collectionId

                            },
                        body: result[0] ,
                        json: true
                    };

                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);

                        console.log(body);
                    });

                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);
                        
                        console.log(body);
                    });
                    // Done

                    resolve(result)
                } catch(e) {
                    console.log('error' + e)
                }
            }	
        })
    })
}

function cronSaveEnviroment(){
    new CronJob('*/5 * * * *', function () {
        getThingStation().then(result => result.forEach(doc => {
            saveEnviromentByThingId(doc['id'])//.then(result => console.log("Success add " + doc['id'] ))
        }))
    }, null, true, "Asia/Bangkok");
}
cronSaveEnviroment()