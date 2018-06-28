$(document).ready(function () {
    if(jQuery().select2) {
        $('.select-single').select2({
            language: 'en'
        });
        $('.select-multi').select2({
            language: 'en',
            multiple: 'true'
        });

        // drop down select timezone in dashboard
        $('#selectTimezones').select2({
            language: 'en',
            dropdownCssClass: 'custom-select-dropdown'
        });
    }

    $.ajaxSetup({
        beforeSend: function(xhr) {
            $('#spinner').addClass('show');
        },
        error: function(xhr,status,error){
            $('#spinner').removeClass('show');
        },
        complete: function(xhr,status){
            $('#spinner').removeClass('show');
        }
    });

    $(document).scroll(function() {
        Schola.common.showHideGetTrialBar();
    });
    $(document).bind('touchmove', function() {
        Schola.common.showHideGetTrialBar();
    });

    $('.avatar-img, .upload-avatar, .schedule-item .avatar, .list-teacher .teacher-item .img-box').nailthumb({
        replaceAnimation: null,
        fitDirection: 'center center'
    });
	
	//Select timezone in planing page
	$('#selectTimezone').on('click','a', function(){
		var timezoneId = $(this).data('timezone-id');
		var timezoneUrl = $('#tmpTimezoneUrl').val();
		if(timezoneId !== ''){
			$.ajax({
				type: 'POST',
				url: timezoneUrl,
				data: {timezone_id: timezoneId, action: 1},
				success: function (data) {
					var objJson = JSON.parse(data);
                    $('#clockAndLock').html(objJson.time);
                    $('#hiddenClockAndLock').val(objJson.currentTimeWithSecond);
                    basicClock.init();
				}
			});
		}
	});
	$('#selectTimezones').change(function () {
        var timezoneId = $(this).val();
        var timezoneUrl = $('#tmpTimezoneUrl').val();
        if(timezoneId){
            $.ajax({
                type: 'POST',
                url: timezoneUrl,
                data: {timezone_id: timezoneId, action: 1},
                success: function (data) {
                    var objJson = JSON.parse(data);
                    $('#clockAndLock').html(objJson.time);
                    $('#hiddenClockAndLock').val(objJson.currentTimeWithSecond);
                    //basicClock.init();
                    setTimeout('location.reload();', 1000);
                }
            });
        }
    });
});

var timeData = {
    hour: 0,
    min: 0,
    sec: 0,
    countDown: 5
};
var interval = null;
var basicClock = {
    init: function(){
        var selectedTime = $('#hiddenClockAndLock').val() + '';
        var timeArray = selectedTime.split(':');
        if(timeArray != null){
            timeData.hour = parseInt(timeArray[0]);
            timeData.min = parseInt(timeArray[1]);
            timeData.sec = parseInt(timeArray[2]);
        }
        if(interval != null){
            clearInterval(interval);
        }
        timeData.countDown = 2;
        this.setTime();
    },
    setTime: function(){
        if(timeData.sec === 59){
            timeData.sec = 0;
            if(timeData.min === 59){
                timeData.hour = (timeData.hour + 1) % 24;
                timeData.min = 0;    
            }else{
                timeData.min = timeData.min + 1;
                timeData.countDown = timeData.countDown - 1;
                if(timeData.countDown === 0){
                    var timezoneUrl = $('#tmpTimezoneUrl').val();
                    $.ajax({
                        type:'POST',
                        async:false,
                        url: timezoneUrl,
                        data:{action: 2},
                        success: function(data){
                            var objJson = JSON.parse(data);
                            $('#clockAndLock').html(objJson.time);
                            $('#hiddenClockAndLock').val(objJson.currentTimeWithSecond);
                            basicClock.init();
                        }
                    });
                }
            }            
            var strTime = '';
            var cHour = (timeData.hour % 12) == 0 ? 12 : (timeData.hour % 12);
            strTime = basicClock.formatNumber(cHour) + cHour;
            strTime = strTime + ':' + basicClock.formatNumber(timeData.min) + timeData.min
            strTime = strTime + ' ' + (timeData.hour < 12 ? 'AM':'PM');
            $('#clockAndLock').html(strTime);     
        }else{
            timeData.sec = timeData.sec + 1;
        }
        clearInterval(interval);
        interval = setTimeout(basicClock.setTime, 1000);
    },
    formatNumber: function(num){
        return num < 10 ? '0' : '';
    }
};

var Schola = {
    common: {
        showHideGetTrialBar: function() {
            //var height = $(document).height();
            //var windowsHeight = $(window).height();
            var top = $(document).scrollTop();
            var offsetTopTrialClass = $('#joinTrialCourse').offset();
            if(top > 300 && offsetTopTrialClass && top < offsetTopTrialClass.top - 200){
                $('#fixedGetTrial').addClass('show');
            }else{
                $('#fixedGetTrial').removeClass('show');
            }

        },
        toogleTawkChat: function () {
            if (Tawk_API) {
                Tawk_API.toggle();
            }
        }
    },
    scheduleGrid: {
        fixedGridHeader: function () {
            var top = $(document).scrollTop();
            var offsetTopTrialClass = $('.schedule-grid-content').offset();
            if (top > offsetTopTrialClass.top) {
                $('.schedule-grid.fixed-header').css('top', top - offsetTopTrialClass.top + 'px');
            } else {
                $('.schedule-grid.fixed-header').css('top', 0);
            }
        }
    }
}

$.fn.scholaTab = function () {
    var base = this;
    $(base).children('.tabs-bar').children('.tab').click(function () {
        if ($(this).hasClass('active')) {
            return;
        }
        var tabIndex = $(this).index();
        $(base).children('.tabs-bar').children('.tab').removeClass('active');
        $(base).children('.tabs-content').children('.tab-item').removeClass('active');
        $(this).addClass('active');
        $(base).children('.tabs-content').children('.tab-item.tab-' + tabIndex).addClass('active');
    });
};

var momentDetect = {
    init: function(){
        var isLogin = $('#hiddenIsUserLogin').size();
        if(isLogin != 0){
            var timezone = moment.tz.guess(); 
            timezone = this.replaceTimezone(timezone);
            var timezoneUrl = $('#tmpTimezoneUrl').val();
            if(timezoneUrl){
                $.ajax({
                    type:"POST",
                    async:false,
                    url: timezoneUrl,
                    data: {timezone:timezone, action: 3},
                    success: function(data){
                        if(data){
                            var objJson = JSON.parse(data);
                            $('#clockAndLock').html(objJson.time);
                            $('#hiddenClockAndLock').val(objJson.cTimeWithSecond);
                            var message = $("#detectTimezoneMessage").html();
                            message = message.replace('[timezone]', timezone);
                            $.toast({
                                heading: '',
                                text: message,
                                hideAfter: false,
                                position: 'top-right',
                                icon: 'info'
                            });
                            setTimeout('location.reload();', 7000);
                        }
                    }
                });
            }
        }

    },
    replaceTimezone: function(timezone){
        var replaced = timezone;
        switch(timezone){
            case 'Asia/Saigon':
                replaced = 'Asia/Ho_Chi_Minh';
                break;
            default:
                break;
        }
        return replaced;
    }
};

setTimeout('momentDetect.init()', 2000);
