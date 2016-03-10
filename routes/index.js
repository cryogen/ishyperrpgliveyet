'use strict';

var express = require('express');
var moment = require('moment-timezone');

var router = express.Router();

function getTime(time) {
  return moment(time, 'HH:mm')
}

var shows = [
  { day: 1, name: 'Rabbit Stew', time: getTime('13:00') },
  { day: 1, name: 'WTF Is This?', time: getTime('15:00') },
  { day: 1, name: 'Trvia Hops', time: getTime('19:00') },
  { day: 2, name: 'Rabbit Stew', time: getTime('13:00') },
  { day: 2, name: 'Future/Retro', time: getTime('15:00') },
  { day: 2, name: 'Colony News', time: getTime('17:30') },
  { day: 2, name: 'Death From Above', time: getTime('18:00') },
  //{ day: 3, name: 'Easter Eggs', time: getTime('12:00') },
  //{ day: 3, name: 'Rabbit Stew', time: getTime('13:00') },
  { day: 3, name: 'Watching Paint Dry', time: getTime('15:00') },
  { day: 3, name: 'Corporate News', time: getTime('17:30') },
  { day: 3, name: 'Shadowrun Corporate Sins', time: getTime('18:00') },
  { day: 4, name: 'Rabbit Stew', time: getTime('13:00') },
  { day: 4, name: 'Too Many Guilds', time: getTime('15:00') },
  { day: 4, name: 'Grab Bag', time: getTime('18:00') },
  { day: 5, name: 'Rabbit Stew', time: getTime('13:00') },
  { day: 5, name: 'Weekly Affirmations', time: getTime('15:00') },
  { day: 5, name: 'Death From Above', time: getTime('18:00') }
];

moment.tz.add('America/Los_Angeles|PST PDT|80 70|01010101010|1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0');
moment.tz.link('America/Los_Angeles|US/Pacific');

function isAfter(first, second) {
  return (second.hour() > first.hour()) || (first.hour() === second.hour() && second.minute() > first.minute());
}

function findShow(time) {
  var firstMatch, lastMatch;

  shows.forEach(function(show) {
    if(time.day() !== show.day) {
      return;
    }

    if(!firstMatch || isAfter(show.time, time)) {
      firstMatch = show;
    }

    lastMatch = show;
  });

  if(time.hour() < firstMatch.time.hour()) {
    return { live: false, show: firstMatch };
  }

  if(time.hour() < lastMatch.time.hour()) {
    return { live: true, show: firstMatch };
  }

  return { live: true, show: lastMatch };
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var momentTime = moment();
  var time = momentTime.tz('America/Los_Angeles');
  var date = time.format('HH:mm');

  var show = findShow(time);

  res.render('index', {
    title: 'Is HyperRPG Live Yet?',
    live: show.live,
    name: show.show.name,
    startTime: show.show.time.format('dddd HH:mm')
  });
});

module.exports = router;
