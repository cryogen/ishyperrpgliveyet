'use strict';

function padNumber(number) {
  if(number.length <= 1) {
    return '0' + number;
  }

  return number;
}

$(document).ready(function() {
  var timeOfShow = moment(showTime, 'dddd HH:mm:ss');
  var timeOfNow = moment(currentTime, 'dddd HH:mm:ss');

  var diff = timeOfShow - timeOfNow;
  var duration = moment.duration(timeOfShow.diff(timeOfNow));

  if(diff < 0) {
    return;
  }

  var interval = 1000;

  setInterval(function() {
    duration = moment.duration(duration - interval, 'milliseconds');
    if(duration.days() > 0) {
      $('#days').text(duration.days());
    }

    var hours = padNumber('' + duration.hours());
    var minutes = padNumber('' + duration.minutes());
    var seconds = padNumber('' + duration.seconds());

    $('#hours').text(hours);
    $('#minutes').text(minutes);
    $('#seconds').text(seconds);

    if(hours <= 0 && minutes <= 0 && seconds <= 0) {
      location.href = '/';
    }
  }, interval);
});
