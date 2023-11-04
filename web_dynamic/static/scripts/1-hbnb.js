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
        if (selectedNames.length < 3) {
            for (let i = 0; i < 3 && i < selectedNames.length; i++) {
                $('.amenities h4').text(selectedNames.join(', '));
            }
        } else if (selectedNames.length == 3) {
            $('.amenities h4').text(selectedNames.concat(' ...'));
        }
        
    });
});