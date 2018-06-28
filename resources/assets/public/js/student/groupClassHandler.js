var scheduleView = {
    URL: {
        groupClassConfirmDialog: '',
        checkGroupClassBookingsBalance: '',
        bookGroupClass: '',
        cancelReservedGroupClass: '',
        cancelGroupClassConfirmDialog: ''
    },
    init: function(url) {
        var base = this;
        base.URL = url;

        $('.reserve-a-seat-btn').on('click', function() {
            base.reserveASeat($(this));
        });

        $('.cancel-reserved-class-btn').on('click', function() {
            base.cancelReservedClass($(this));
        });
    },
    reserveASeat: function (groupClassElement) {
        var base = this;
        var groupClassId = $(groupClassElement).data("group-class-id");

        if (groupClassId && groupClassId != 0) {
            base.initReservedConfirmDialog(groupClassId);
            $('#reservedConfirmDialog').modal('show');
            $('#confirm-reserve-a-seat-btn').unbind().click(function () {
                if(base.checkGroupClassBookingsBalance()){
                    base.bookGroupClass(groupClassId, function() {
                        $('#reservedConfirmDialog').modal('hide');
                        location.reload();
                    });
                }else{
                    $('.remainingClassMessage').show();
                }
            });
        }
    },
    initReservedConfirmDialog: function(groupClassId){
        var base = this;
        $.ajax({
            type: 'POST',
            async: false,
            url: base.URL.groupClassConfirmDialog,
            data: {
                groupClassId: groupClassId
            },
            success: function (data) {
                $($('#reservedConfirmDialogContaier')[0]).html(data);
            }
        });
    },
    checkGroupClassBookingsBalance: function(){
        var res = false;
        var base = this;
        $.ajax({
            type:"POST",
            url:base.URL.checkGroupClassBookingsBalance,
            async:false,
            success: function(data){
                var json = JSON.parse(data);
                if(json.result == true){
                    res = true;
                }
            }
        });
        return res;
    },
    bookGroupClass: function(groupClassId, callback) {
        var base = this;
        $.ajax({
            type:"POST",
            url:base.URL.bookGroupClass,
            data: {
                groupClassId: groupClassId
            },
            success: function(data){
                var json = JSON.parse(data);
                if(json.result == true){
                    callback();
                } else {
                    alert('You cannot book this class now.');
                }
            }
        });
    },
    
    cancelReservedClass: function(cancelBtnElement) {
        var base = this;
        var groupClassId = $(cancelBtnElement).data("group-class-id");

        if (groupClassId && groupClassId != 0) {
            base.initCancelConfirmDialog(groupClassId);
            $('#cancelConfirmDialog').modal('show');

            $('#confirm-cancel-group-class-btn').unbind().click(function () {
                base.cancelGroupClass(groupClassId);
            });
        }
    },
    initCancelConfirmDialog: function(groupClassId){
        var base = this;
        $.ajax({
            type: 'POST',
            async: false,
            url: base.URL.cancelGroupClassConfirmDialog,
            data: {
                groupClassId: groupClassId
            },
            success: function (data) {
                $($('#cancelConfirmDialogContaier')[0]).html(data);
            }
        });
    },
    cancelGroupClass: function(groupClassId) {
        var base = this;
        $.ajax({
            type:"POST",
            url:base.URL.cancelReservedGroupClass,
            async:false,
            data: {
                groupClassId: groupClassId
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