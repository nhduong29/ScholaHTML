var scheduleHandler = {
    URL: {
        cancelClass: '',
        cancelClassConfirmDialog: '',
        rateClass: '',
        rateClassConfirmDialog: '',
        checkCancelClassConfirmDialog:''
    },
    init: function(url) {
        var base = this;
        base.URL = url;

        $('.cancel-reserved-class-btn').on('click', function() {
            base.cancelReservedClass($(this));
        });
    },
    cancelReservedClass: function(cancelBtnElement) {
        var base = this;
        var scheduleId = $(cancelBtnElement).data("schedule-id");

        if (scheduleId && scheduleId != 0) {
            var val = base.checkCancelConfirmDialogTime(scheduleId);
            
            /*base.initCancelConfirmDialog(scheduleId);
            $('#cancelConfirmDialog').modal('show');

            $('#confirm-cancel-class-btn').unbind().click(function () {
                base.cancelClass(scheduleId);
            });*/
        }
    },
    initCancelConfirmDialog: function(scheduleId){
        var base = this;
        $.ajax({
            type: 'POST',
            async: false,
            url: base.URL.cancelClassConfirmDialog,
            data: {
                scheduleId: scheduleId
            },
            success: function (data) {
                $($('#cancelConfirmDialogContaier')[0]).html(data);
            }
        });
    },
    checkCancelConfirmDialogTime: function(scheduleId){
        var base = this;
        $.ajax({
            type: 'POST',
            async: false,
            url: base.URL.checkCancelClassConfirmDialog,
            data: {
                scheduleId: scheduleId
            },
            success: function (data) {
                if(data == "true"){
                    base.initCancelConfirmDialog(scheduleId);
                    $('#cancelConfirmDialog').modal('show');

                    $('#confirm-cancel-class-btn').unbind().click(function () {
                        base.cancelClass(scheduleId);
                    });
                }else{
                    $('#cancelConfirmModal').modal('show');

                    $('#cancel-class-confirm').unbind().click(function () {
                        base.cancelClass(scheduleId);
                    });
                }  
            }
        });
    },
    cancelClass: function(scheduleId) {
        var base = this;
        $.ajax({
            type:"POST",
            url:base.URL.cancelClass,
            async:false,
            data: {
                scheduleId: scheduleId
            },
            success: function(data){
                var json = JSON.parse(data);
                if(json.result == true){
                    location.reload();
                }
            }
        });
    },
    rate: function (ratingElement, rate) {
        var base = window.scheduleHandler;
        var scheduleId = $(ratingElement).data("schedule-id");
        rate = rate*2;
        if (scheduleId && scheduleId != 0) {
            base.initConfirmClassRatingDialog(scheduleId, rate);

            $('#rateConfirmDialog').modal('show');

            $('#confirm-rate-class-btn').unbind().click(function () {
                base.rateClass(scheduleId, rate);
            });
        }
    },
     modalrate: function (ratingElement, rate) {
        var base = window.scheduleHandler;
        var scheduleId = $('#modalScheduleId').val();
        rate = rate*2;
        if (scheduleId && scheduleId != 0) {
            $('#rateConfirmDialog').modal('show');

            $('#confirm-rate-class-btn').unbind().click(function () {
                base.rateClass(scheduleId, rate);
            });
        }
        
    },
    initConfirmClassRatingDialog: function(scheduleId, rate) {
        var base = window.scheduleHandler;
        $.ajax({
            type: 'POST',
            async: false,
            url: base.URL.rateClassConfirmDialog,
            data: {
                scheduleId: scheduleId,
                rate: rate
            },
            success: function (data) {
                $($('#rateConfirmDialogContaier')[0]).html(data);
            }
        });
    },
    rateClass: function(scheduleId, rate) {
        var base = window.scheduleHandler;
        var feedbackComment = $("textarea[id='feedback-comment-" + scheduleId + "']").val();
        $.ajax({
            type:"POST",
            url:base.URL.rateClass,
            async:false,
            data: {
                scheduleId: scheduleId,
                rate: rate,
                comment: feedbackComment
            },
            success: function(data){
                var json = JSON.parse(data);
                if(json.result == true){
                    location.reload();
                }
            }
        });
    }
}