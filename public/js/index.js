'use strict';

function padNumber(number) {
  if(number.length <= 1) {
    return '0' + number;
  }

  return number;
}

$(document).ready(function() {
  var timeOfShow = moment(showTime, 'dddd HH:mm:ss');
  var timeOfNow = moment(currentTime, 'dddd HH:mm:ss z');

  var diff = timeOfShow - timeOfNow;
  var duration = moment.duration(timeOfShow.diff(timeOfNow));

  if(duration.days() < 0) {
    diff = -diff;
    duration = moment.duration(timeOfShow.add(1, 'week').diff(timeOfNow));
  }

  var localTime = moment().add(duration);

  if(localTime.minutes() !== 0) {
    localTime.add(1, 'minute');
  }

  $('#localTime').text(localTime.format('dddd HH:mm'));

  if(diff < 0) {
    var options = {
        width: 854,
        height: 480,
        channel: 'hyperrpg',
    };
    var player = new Twitch.Player('player', options);

    return;
  }

  var interval = 1000;

  setInterval(function() {
    duration = moment.duration(duration - interval, 'milliseconds');
    if(duration.days() <= 0) {
      $('#daysContainer').hide();
    } else {
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
