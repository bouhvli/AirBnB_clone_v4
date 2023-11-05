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
        function (data, textStatus) {
            if (data.status === 'OK' && textStatus === 'success')
                $('div#api_status').addClass('available');
            else
                $('div#api_status').removeClass('available');
        }
    );
    $.ajax({
        type: "POST",
        url: "http://0.0.0.0:5001/api/v1/places_search/",
        data: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
        success: function (response) {
            for (const place of response) {
                const articleTag = [
                    '<article>',
                        '<div class="title_box">',
                        `<h2>${place.name}</h2>`,
                        `<div class="price_by_night">$${place.price_by_night}</div>`,
                        '</div>',
                        '<div class="information">',
                        `<div class="max_guest">${place.max_guest}</div>`,
                        `<div class="number_rooms">${place.number_rooms}</div>`,
                        `<div class="number_bathrooms">${place.number_bathrooms}</div>`,
                        '</div>',
                        '<div class="description">',
                        `${place.description}`,
                        '</div>',
                    '</article>'
                ];
                $('SECTION.places').append(articleTag.join(''));
            }
        },
        error: function (e) {
            console.log(e)
        }
    });
});
