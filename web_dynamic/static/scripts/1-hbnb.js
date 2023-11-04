$(document).ready(function () {
    var idsOfAmenitiesSelected = {};
    $('.amenities .popover input').change(function (e) { 
        var amenityId = $(this).attr('data-id');
        var amenityName = $(this).attr('data-name');
        if ($(this).is(':checked')) {
            idsOfAmenitiesSelected[amenityName] = amenityId;
        } else {
            delete idsOfAmenitiesSelected[amenityName];
        }
        var selectedNames = Object.keys(idsOfAmenitiesSelected);
        $('.amenities h4').text(selectedNames.sort().join(', '));
    });
});