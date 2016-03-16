'use strict';

var express = require('express');
var moment = require('moment-timezone');
var http = require('https');

var router = express.Router();

function getTime(time) {
  return moment(time, 'dddd HH:mm');
}

moment.tz.add('America/Los_Angeles|PST PDT|80 70|01010101010|1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0');
moment.tz.link('America/Los_Angeles|US/Pacific');

var shows = [
  { name: 'Rabbit Stew', time: getTime('Monday 13:00') },
  { name: 'WTF Is This?', time: getTime('Monday 15:00') },
  { name: 'Trvia Hops', time: getTime('Monday 19:00') },
  { name: 'Rabbit Stew', time: getTime('Tuesday 13:00') },
  { name: 'Future/Retro', time: getTime('Tuesday 15:00') },
  { name: 'Colony News', time: getTime('Tuesday 17:30') },
  { name: 'Death From Above', time: getTime('Tuesday 18:00') },
  { name: 'Easter Eggs', time: getTime('Wednesday 12:00') },
  { name: 'Rabbit Stew', time: getTime('Wednesday 13:00') },
  { name: 'Watching Paint Dry', time: getTime('Wednesday 15:00') },
  { name: 'Corporate News', time: getTime('Wednesday 17:30') },
  { name: 'Shadowrun Corporate Sins', time: getTime('Wednesday 18:00') },
  { name: 'Rabbit Stew', time: getTime('Thursday 13:00') },
  { name: 'Too Many Guilds', time: getTime('Thursday 15:00') },
  { name: 'Grab Bag', time: getTime('Thursday 18:00') },
  { name: 'Rabbit Stew', time: getTime('Friday 13:00') },
  { name: 'Weekly Affirmations', time: getTime('Friday 15:00') },
  { name: 'Death From Above', time: getTime('Friday 18:00') }
];

function isAfter(first, second) {
  return (second.hour() > first.hour()) || (first.hour() === second.hour() && second.minute() > first.minute());
}

function findShow() {
  var time = moment(moment(), 'dddd HH:mm:ss').tz('America/Los_angeles');
  var timeString = time.format('dddd') + ' ' + time.hour() + ':' + time.minute() + ':' + time.second();
  var currentTime = moment(timeString, 'dddd HH:mm:ss');

  for(var i = 0; i < shows.length; i++) {
    var currentShow = shows[i];
    var nextShow = i < shows.length - 1 ? shows[i + 1] : undefined;

    if(!currentTime.isSame(currentShow.time, 'day')) {
      continue;
    }

    if(currentTime.isBefore(currentShow.time)) {
      return { live: false, show: currentShow };
    }

    if(currentTime.isAfter(currentShow.time) && currentTime.isBefore(nextShow.time)) {
      return { live: true, show: currentShow };
    }

    return { live: true, show: nextShow };
  }

  // No more shows left, the first must be next
  return { live: false, show: shows[0] };
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var momentTime = moment();
  var time = momentTime.tz('America/Los_Angeles');
  var date = time.format('HH:mm');

  var show = findShow(time);

  var data = '';

  http.get('https://api.twitch.tv/kraken/streams/hyperrpg', function(res) {
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function() {
//      console.info(data);
    });
  });

  res.render('index', {
    title: 'Is HyperRPG Live Yet?',
    live: show.live,
    name: show.show.name,
    startTime: show.show.time.format('dddd HH:mm:ss'),
    currentTime: moment().tz('America/Los_angeles').format('dddd HH:mm:ss z'),
    timeZone: moment().tz('America/Los_angeles').format('z'),
    offset: moment().tz('America/Los_Angeles').utcOffset()
  });
});

module.exports = router;
