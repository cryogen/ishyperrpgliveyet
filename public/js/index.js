'use strict';

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-75043688-1', 'auto');
ga('send', 'pageview');

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
