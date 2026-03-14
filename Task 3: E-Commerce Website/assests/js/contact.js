document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('[data-contact-form]');
  var notice = document.querySelector('[data-contact-notice]');

  if (!form || !notice) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    notice.hidden = false;
    form.reset();
  });
});
