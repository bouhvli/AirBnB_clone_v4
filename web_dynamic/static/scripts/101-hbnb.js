$(document).ready(function () {
    let idsOfAmenitiesSelected = {};
    let cityIDs = {};
    let stateIDs = {};
    $('.amenities .popover input').change(function (e) { 
        let amenityId = $(this).attr('data-id');
        let amenityName = $(this).attr('data-name');
        if ($(this).is(':checked')) {
            idsOfAmenitiesSelected[amenityName] = amenityId;
        } else {
            delete idsOfAmenitiesSelected[amenityName];
        }
        let selectedNames = Object.keys(idsOfAmenitiesSelected);
        checkedData(selectedNames, '.amenities h4');
    });
    $.get("http://localhost:5001/api/v1/status/",
        function (data, textStatus) {
            if (data.status === 'OK' && textStatus === 'success')
                $('div#api_status').addClass('available');
            else
                $('div#api_status').removeClass('available');
        }
    );
    $.ajax({
        type: "POST",
        url: "http://localhost:5001/api/v1/places_search/",
        data: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
        success: function (response) {
            for (const place of response) {
                const articleTag = articleHtml(place);
                $('SECTION.places').append(articleTag.join(''));
            }
        },
        error: function (e) {
            console.log(e)
        }
    });
    $('.filters button').click(function () { 
        $('article').remove();
        $.ajax({
            type: "POST",
            url: "http://localhost:5001/api/v1/places_search/",
            data: JSON.stringify({ 'amenities': Object.values(idsOfAmenitiesSelected),
                                   'states': Object.values(stateIDs),
                                   'cities': Object.values(cityIDs) }),
            headers: { 'Content-Type': 'application/json' },
            success: function (response) {
                for (const place of response) {
                    const articleTag = articleHtml(place);
                    $('SECTION.places').append(articleTag.join(''));
                }
            }
        });
        
    });
    $('div.locations div.popover > ul > li h2 input').change(function (e) { 
        let stateId = $(this).attr('data-id');
        let stateName = $(this).attr('data-name');
        if ($(this).prop('checked'))
            stateIDs[stateName] = stateId;
        else
            delete stateIDs[stateName];
        let selected = Object.keys(stateIDs).concat(...Object.keys(cityIDs));
        checkedData(selected, '.locations h4');
    });
    $('div.locations div.popover > ul > li ul li input').change(function (e) { 
        let cityId = $(this).attr('data-id');
        let cityName = $(this).attr('data-name');
        if ($(this).prop('checked'))
            cityIDs[cityName] = cityId;
        else
            delete cityIDs[cityName];
        let selected = Object.keys(stateIDs).concat(...Object.keys(cityIDs));
        checkedData(selected, '.locations h4');
    });
    $('section.places').on('click', 'div.reviews h2 span', function () {
        const span = $(this);
        if (span.text() === 'show') {
            $(span).text('hide');
            const placeID = $(span).attr('data-id');
            $.ajax({
                type: "GET",
                url: `http://localhost:5001/api/v1/places/${placeID}/reviews`,
                success: function (response) {
                    revs = response.length;
                    if (revs > 0)
                    {
                        const reviews = ['<ul>',];
                        for (const rev of response) {
                            $.get(`http://localhost:5001/api/v1//users/${rev.user_id}`,
                                function (data) {
                                    reviews.push(
                                        `<li data-id=${rev.id}>
                                            <h3>From ${data.first_name} ${data.last_name} the 27th January 2017</h3>
                                            <p>${rev.text}</p>
                                        </li>`);
                                }
                            );
                        }
                        reviews.push('</ul>');
                        $(span).parent().parent().append(...reviews);
                    }
                }
            });
        } else {
            $(span).text('show');
        }
  });
});

function checkedData(list, selector){
        if (list.length < 3) {
            for (let i = 0; i < 3 && i < list.length; i++) {
                $(selector).text(list.join(', '));
            }
        } else if (list.length == 3) {
            $(selector).text(list.concat(' ...'));
        }
}
function articleHtml(place){
    const articleTag = [
                        `<article>`,
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
                            '<div class="reviews">',
                            `<h2>Reviews <span data-id=${place.id}>show</span></h2>`,
                            '</div>',
                        '</article>'
                    ];
    return articleTag;
}
