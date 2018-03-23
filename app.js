var request = require('request');
var CronJob = require('cron').CronJob;
var mongojs = require('mongojs')
var db = mongojs('127.0.0.1/Environment', ['tmdWarningNews'])

function saveData() {
    var options = {
        method: 'GET',
        url: 'http://data.tmd.go.th/api/WeatherWarningNews/v1/?uid=u61parnmet&ukey=c18e1e846f18188a835a2321271c7f5f&format=json'
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
    new CronJob('* */3 * * *', function () {
        saveData()
    }, null, true, "Asia/Bangkok");
}
cronJob()
