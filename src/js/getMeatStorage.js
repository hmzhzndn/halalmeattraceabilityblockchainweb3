$('button').click(function (e) {
    $(this).toggleClass('submit');
    $('body').toggleClass('hue');
    $('form').toggleClass('rotate');
    $('input').toggleClass('grow');
  
    e.preventDefault();
  });
  