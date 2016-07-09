$(function() {


    initCamera($(window).width(), $(window).height());

    $.ajax('http://mmm.serp.yandex.ru:8081/').then(function(data) {
        $('.back').attr('src', data['mosaic-url'])
    });

    $('.picture__figure').click(function() {

        $('.camera__capture').css({
            width: $(window).width(),
            height: $(window).height()
        });

        var figure = $(this);

        window.sport = figure.data('sport');

        $('.picture').addClass('picture_disabled');
        figure.parents('.picture').removeClass('picture_disabled');

        scrollToPage(2);

    });

    function snap() {
        Webcam.snap( function(data_uri) {
            var thumb = $('<img src="' + data_uri + '" class="camera__thumb" />');

            var capture = $('.camera__capture');
            var video = capture.find('video');
            thumb.css({
                top: window.captureTop,
                left: window.captureLeft + ((1024-768) / 2),
                width: 768,
                // width: 'auto',
                height: video.height()
                // transform: capture[0].style.transform
            });


            $('.camera__captures').append(thumb);

            capture.hide();

            uploadPicture(data_uri, function(data) {
                console.info('success', data, data.saved_img_url);
                putImage(thumb, data.new_image_x, data.new_image_y);

            }, function() {
                console.info('error');
            });
        } );
    }

    window.interval = null;
    $('.camera__take').on('click', function() {

        if (window.interval === null) {
            snap();
            window.interval = false;
        }

        if (window.interval) {
            clearInterval(window.interval);
            window.interval = false;
        } else {
            window.interval = setInterval(function() {
                snap();
            }, 2000)
        }
    });

});


function uploadPicture(base64, fn, fnErr) {
    var formdata = new FormData();
    formdata.append('file', getBlobData(base64), 'image.jpg');

    $.ajax({
        url: 'http://mmm.serp.yandex.ru:8081/upload',
        type: 'POST',
        data: formdata,
        dataType: 'json',
        processData: false,
        contentType: false
    }).done(function(data) {
        fn(data);
    }).fail(function(data) {
        fnErr(data);
    });
}

function getBlobData(blobBin) {
    // var blobBin = atob($('#sketch__canvas')[0].toDataURL('image/jpeg').split(',')[1]);

    blobBin = blobBin.split(',')[1];
    var array = [];

    for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}

function putImage(thumb, x, y) {

    var back = $('.back'),
        w = back.width(),
        h = back.height(),
        cellW = w / 60,
        cellH = h / 60,
        offsetLeft = back.offset().left;

    setTimeout(function() {
        thumb.addClass('camera__thumb_animation');
        thumb.css({
            top: cellH * y,
            left: offsetLeft + cellW * x,
            width: cellW,
            height: cellH
        });
    }, 42)
}

function initCamera(w, h) {
    w || (w = 320);
    h || (h = 240);

    Webcam.set( 'constraints', {
        width: 1280,
        height: 720
    } );

    Webcam.set({
        // live preview size
        width: 1024,
        height: 768,

        // device capture size
        dest_width: 1024,
        dest_height: 768,

        // final cropped size
        crop_width: 768,
        crop_height: 768,

        // format and quality
        image_format: 'jpeg',
        jpeg_quality: 90
    });

    Webcam.attach( '.camera__capture' );

    var capture = $('.camera__capture');

    window.captureLeft = ($(window).width() - capture.width()) / 2;
    window.captureTop = ($(window).height() - capture.height()) / 2;

    capture.css({
        left: window.captureLeft,
        top: window.captureTop
    })

}

function scrollToPage(pageIndex) {
    var page = $('.page_pos_' + pageIndex);
    page.show();

    $('html, body').animate({
        scrollTop: page.offset().top
    }, 1000);
}
