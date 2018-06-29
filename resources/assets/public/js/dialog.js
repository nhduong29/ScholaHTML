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
    scheduleView.init(URL);
    scheduleHandler.init(URL);
    $('.star-rating').each(function (index, element) {
        $(element).addRating({
            max : 5,
            half : true,
            fieldName : 'rating',
            fieldId : 'rating',
            icon : 'star',
            callback : scheduleHandler.rate
        });
    });
    scheduleHandler.rate($('#star-rating-'),0);


});
var URL = {
    cancelClass:                'https://demo.schola.tv/student/learning-progress/cancel-class',
    cancelClassConfirmDialog:   'https://demo.schola.tv/student/learning-progress/cancel-class-confirm-dialog',
    rateClass:                  'https://demo.schola.tv/student/learning-progress/rate-class',
    rateClassConfirmDialog:     'https://demo.schola.tv/student/learning-progress/rate-class-confirm-dialog',
    checkCancelClassConfirmDialog:   'https://demo.schola.tv/student/learning-progress/check-cancel-class-confirm-dialog-time',
    action: 'https://demo.schola.tv/student/action',
};


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