'use strict';

$(document).ready(function() {
  var time = moment(showTime, 'dddd HH:mm');

  var diff = time - moment('dddd HH:mm');
  var duration = moment.duration(diff * 1000, 'milliseconds');
  var interval = 1000;

  setInterval(function() {
    duration = moment.duration(duration - interval, 'milliseconds');
    //$('.countdown').text(duration.hours() + ':' + duration.minutes() + ':' + duration.seconds())
    console.info(duration.hours() + ':' + duration.minutes() + ':' + duration.seconds());
  }, interval);
});
