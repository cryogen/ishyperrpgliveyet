'use strict';

(function(i,s,o,g,r,a,m) {
  i['GoogleAnalyticsObject']=r;
  i[r]=i[r] || function() {
    (i[r].q=i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a=s.createElement(o),
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

function getDuration(timeOfShow, timeOfNow) {
  var duration = moment.duration(timeOfShow.diff(timeOfNow));

  if(duration.days() < 0) {
    diff = -diff;
    duration = moment.duration(timeOfShow.add(1, 'week').diff(timeOfNow));
  }

  return duration;
}

function adjustDivHeight() {
  setTimeout(function() {
    var width = $('#overlay-container').width();
    var height = width * 9 / 16;

    $('#overlay-container').height(height);
  }, 300);
}

$(document).ready(function() {
  var timeOfShow = moment(showTime, 'dddd HH:mm:ss');
  var timeOfNow = moment(currentTime, 'dddd HH:mm:ss z');
  var timeReached = false;

  adjustDivHeight();
  $(window).resize(function() {
    adjustDivHeight();
  });

  var diff = timeOfShow - timeOfNow;
  if(diff < 0) {
    diff = -diff;
    timeReached = true;
  }

  var duration = getDuration(timeOfShow, timeOfNow);

  var localTime = moment().add(duration);
  var localNow = moment();

  duration = getDuration(localTime, localNow);

  if(localTime.minutes() !== 0) {
    localTime.add(1, 'minute');
  }

  $('#localTime').text(localTime.format('dddd HH:mm'));

  if(duration < 0) {
    return;
  }

  var interval = 1000;

  setInterval(function() {
    duration = getDuration(localTime, moment());
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
      clearInterval();
      location.href = '/';
    }
  }, interval);
});
