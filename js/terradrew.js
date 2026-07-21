const initWheel = () => {
  const config = {
    updateTimeRelaod: false, // refresh timer/roulet after page reload
    hours: 0,
    minutes: 15,
    seconds: 00,
  }
  // clean current url from special symbols
  let urlClean = window.location.href.replace(/[^a-zA-Z ]/g, "");

  if (localStorage.getItem(urlClean) === null) {
    localStorage.removeItem('date')
  }

  var resultWrapper = document.querySelector('.spin-result-wrapper');
  var wheel = document.querySelector('.wheel-img');
  var spin_wrapper = document.querySelector('.spin-wrapper')
  var order_wrapper = document.querySelector('.order-wrapper');
  var timer_wrapper = document.querySelector('.timer');
  var cursor_text = $('.cursor-text');

  localStorage.setItem(urlClean, urlClean);

  function setTimerTime() {
    if (localStorage.getItem('date') == null && localStorage.getItem(urlClean) == urlClean) {
      let date = new Date()
      date.setHours((date.getHours() + config.hours));
      date.setMinutes((date.getMinutes() + config.minutes));
      date.setSeconds((date.getSeconds() + config.seconds));
      localStorage.setItem('date', date)
    }
  }

  function Timer() {
    let timer;
    let compareDate;


    if (config.updateTimeRelaod) {
      compareDate = new Date();
      compareDate.setHours((compareDate.getHours() + config.hours));
      compareDate.setMinutes((compareDate.getMinutes() + config.minutes));
      compareDate.setSeconds((compareDate.getSeconds() + config.seconds));
    } else {
      compareDate = new Date(localStorage.getItem('date'));
    }

    if (timer_wrapper == null){
      localStorage.removeItem('date');
      return false
    }

    timer = setInterval(function () {
      timeBetweenDates(compareDate);
    }, 1000);

    function timeBetweenDates(toDate) {
      let dateEntered = toDate;
      let now = new Date()
      let difference = dateEntered.getTime() - now.getTime();
      if (difference <= 0) {
        // Timer done
        localStorage.removeItem('date');
        localStorage.removeItem('init');
        let date = new Date();
        date.setHours((compareDate.getHours() + config.hours));
        date.setMinutes((compareDate.getMinutes() + config.minutes));
        date.setSeconds((compareDate.getSeconds() + config.seconds));
        localStorage.setItem('date', date)
        compareDate = new Date(localStorage.getItem('date'));
      } else {
        var seconds = Math.floor(difference / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        hours %= 24; // set hours
        minutes %= 60; // set minutes
        seconds %= 60; // set seconds
        $(".hours").text(hours);
        if (hours < 10) {
          $(".hours").text('0' + hours);
        }
        $(".minutes").text(minutes);
        if (minutes < 10) {
          $(".minutes").text('0' + minutes);
        }
        $(".seconds").text(seconds);
        if (seconds < 10) {
          $(".seconds").text('0' + seconds);
        }
      }
    }
  }

  // if wheel disabled, display form
  function checkWheel() {
    if (!resultWrapper || !spin_wrapper) {
      order_wrapper.style.display = "block";
      localStorage.setItem('init', true);
      setTimerTime()
      Timer();
    }
    if ((!wheel || localStorage.getItem('init') &&
      localStorage.getItem(urlClean) == urlClean) &&
      !config.updateTimeRelaod) {
      localStorage.setItem('init', true);
      if (spin_wrapper != null) spin_wrapper.style.display = "none";
      order_wrapper.style.display = "block";
      Timer();
    }
  }
  // init check wheel
  checkWheel()


  // links scroll to form
    var $page = $('html, body');
    $('a[href*="#form"]').click(function () {
        $page.animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 400);
        return false;
    });

  // rotate wheel and start timer
  cursor_text.one('click', function () {
    localStorage.removeItem('date')
    if (wheel.classList.contains('rotated')) {
      resultWrapper.style.display = "block";
    } else {
      wheel.classList.add('super-rotation');
      setTimeout(function () {
        resultWrapper.style.display = "block";
      }, 6500);
      setTimeout(function () {
        $('.spin-wrapper').slideUp();
        $('.order-wrapper').slideDown();
        localStorage.setItem('init', true);
        setTimerTime()
        Timer();
      }, 7000);
      wheel.classList.add('rotated');
      $(this).find(cursor_text).attr('disabled', 'disabled');
    }
  });

  // popup btns scroll to form
  var closePopup = document.querySelector('.close-popup');
  $('.close-popup, .popup-button').click(function (e) {
    e.preventDefault();
    $('.spin-result-wrapper').fadeOut();
    var top = $('#terra-wrapper').offset().top;
    $('body,html').animate({
      scrollTop: top
    }, 800);
  });
}

//init
initWheel() 