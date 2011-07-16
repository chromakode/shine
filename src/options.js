$(document).ready(function() {
  if (localStorage['showTooltips'] == 'true') { $('#showTooltips').prop('checked', true) }
  if (localStorage['ignoreSelfPosts'] == 'true') { $('#ignoreSelfPosts').prop('checked', true) }
  $('input[type=checkbox]').click(function() {
    localStorage[$(this).attr('id')] = $(this).is(':checked')
  })
})
