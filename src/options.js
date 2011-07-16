$(document).ready(function() {
  $('input[type=checkbox]').click(function() {
    localStorage[$(this).attr('id')] = $(this).is(':checked')
  })
})
