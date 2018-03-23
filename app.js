var request = require('request');
var CronJob = require('cron').CronJob;
var mongojs = require('mongojs')
var db = mongojs('127.0.0.1/Environment', ['ThingStation','ThingTelemetry'])

function saveData() {
    var options = {
        method: 'POST',
        url: 'https://www.smartcitystructure.com/api/v1/oauth/access-token'
    }
    return new Promise((resolve) => {
        request(options, (err, response, body) => {
            if (err) { console.log("err " + err); return; }
            db.collection.insert(JSON.parse(body))
            resolve(body)
        })
    })
}

function cronJob(){
    new CronJob('*/5 * * * *', function () {
        saveData()
    }, null, true, "Asia/Bangkok");
}
cronJob()