var express = require('express');
var request = require('request');
var moment = require('moment-timezone');

var port = process.env.PORT || 8080;
var app = express();
var config = require('./config');
app.post('/howlong', function(req, res) {
    console.log('request message body ', req);
    console.log('configuration ', config);
    sendMessage(res);
});

app.get('/health', function(req, res) {
    console.log('health check');
    res.status(200).send();
});

//TODO read zero moment from conf file
//TODO read request url from conf file
//TODO read chatId from conf file
var sendMessage = function(res) {
    var time = getTimeRemaining(config.dday);
    console.log(time);
    var message = time !== null ? "Stockholm craft cruise: " + time.days + "d " + time.hours + "h " + time.minutes + "m " + time.seconds + "s" : "Bottoms up!";
    //var message = "Olutristeily countdown: Risteily peruttu tennisottelun johdosta. Lisätiedustelut Heikki Wilen, +358 40 7763100";
    var options = { method: 'POST',
      url: config.requestUrl,
      headers:
       { 'content-type': 'application/json' },
      body: { chat_id: config.chatId, text: message},
      json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
    });
    res.status(200).send();
}

function daydiff(first, second) {
    console.log('daydiff', first, second);
    return Math.floor((second-first)/(60*60*24));
}

function getTimeRemaining(endtime) {
    var tz = "Europe/Helsinki";
    //var now = new Date();
    //var now = new time.Date();
    //now.setTimezone(tz);
    var now = moment.tz(new Date(), tz).format();
    var t = Date.parse(endtime) - Date.parse(now);
    if(t < 0) return null;
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
    };
}


app.listen(port);
console.log('Magic happens on port ' + port);
