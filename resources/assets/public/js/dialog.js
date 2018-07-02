$(document).ready(function() {
    $('.select-single-dialog').select2({width: '100%'});
    resizeDialog();
    window.onresize = function(event) {
        resizeDialog();
    }
    var radio_learning_path_is_checked = $('#radio4').attr("checked") != "undefined" &&  $('#radio4').attr("checked") == "checked";
    if(radio_learning_path_is_checked){
        showHideBox('.next-lesson-level-wrapper','show');
    }else{
        showHideBox('.next-lesson-level-wrapper','hide');
    }
    $('.star-rating').each(function (index, element) {
        var rating_id = $(element).data('rating-id');
        $(element).addRating({
            max : 5,
            half : true,
            fieldName : rating_id,
            fieldId : rating_id,
            icon : 'star',
            callback : ratingById
        });
    });
    ratingById($('#star-rating-'),0);



});



function resizeDialog() {
    height = $(window).height() - 90;
    $('#pnlDialogSelectLesson  .modal-dialog').css({'max-height': height + 'px'});
    height_modal_body = height - 50 - 70;
    $('#pnlDialogSelectLesson .modal-body').css({'max-height': height_modal_body + 'px'});
}

function showHideBox(domElement, showHide){
    if(showHide == 'show'){
        $(domElement).show();
    }
    if(showHide == 'hide'){
        $(domElement).hide();
    }
}

function ratingById (ratingElement, rate) {
    var scheduleId = $(ratingElement).data("rating-id");
    if (scheduleId && scheduleId != 0) {
        ratingRequest(scheduleId, rate);
    }
}

function ratingRequest (ratingId, rate) {
    console.log("rating ID " + ratingId);
    console.log("rate value " + rate);
}