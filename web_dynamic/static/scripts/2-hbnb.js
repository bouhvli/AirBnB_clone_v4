$(document).ready(function () {
    let idsOfAmenitiesSelected = {};
    $('.amenities .popover input').change(function (e) { 
        let amenityId = $(this).attr('data-id');
        let amenityName = $(this).attr('data-name');
        if ($(this).is(':checked')) {
            idsOfAmenitiesSelected[amenityName] = amenityId;
        } else {
            delete idsOfAmenitiesSelected[amenityName];
        }
        let selectedNames = Object.keys(idsOfAmenitiesSelected);
        if (selectedNames.length < 3) {
            for (let i = 0; i < 3 && i < selectedNames.length; i++) {
                $('.amenities h4').text(selectedNames.join(', '));
            }
        } else if (selectedNames.length == 3) {
            $('.amenities h4').text(selectedNames.concat(' ...'));
        }
    });
    $.get("http://0.0.0.0:5001/api/v1/status/",
        function (data) {
            if (data.status === 'OK')
                $('div#api_status').addClass('available');
            else
                $('div#api_status').removeClass('available');
        }
    );
});