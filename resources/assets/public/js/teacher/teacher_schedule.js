var schedule = {
	scheduleRange: 0,
    URL :{
        scheduleAction: '',
		classroom:'',
		mailService:'',
		classDetail:''
    },
    data :{
        timeKey:"",
        userid:"",
        timeStamp:"",
    },
    init: function (url){
        var base = this;
        base.URL = url;
        $('#nextWeek').on('click',function(){
            base.nextWeek();
        });
        $('#preWeek').on('click',function(){
            base.preWeek();
        });

        $('#thisWeek').on('click',function(){
            base.thisWeek();
        });

        $('#scheduleGridContent').on('click','.schedule-time-item:not(.disable-time, .student-booked)', function(){
            base.updateSchedule(this);
        });

        base.addEventTooltip();
    },
    nextWeek: function (){
		if(this.scheduleRange === 4){
			return;
		}
        var year = parseInt($('#schola_current_year').val());
        var week = parseInt($('#schola_current_week').val());
        week = week + 1;
		if(week > 52){
			week = 1;
			year = year + 1;
		}
        this.getWeek(week, year);
		this.scheduleRange ++;
    },
    preWeek: function (){
		if(this.scheduleRange === -4){
			return;
		}
        var year = parseInt($('#schola_current_year').val());
        var week = parseInt($('#schola_current_week').val());
        week = week - 1;
		if(week === 0){
			week = 52;
			year = year - 1;
		}
        this.getWeek(week, year);
		this.scheduleRange --;
    },
    thisWeek: function (){
        this.getWeek(0, 0);
		this.scheduleRange = 0;
    },
    getWeek: function (week, year){
        var base = this;
        $.ajax({
            type: 'POST',
            url: this.URL.scheduleAction,
            data: {week:week, year:year, action:1},
            success: function (html) {
                $('#scheduleGridContent').html(html);
                base.addEventTooltip();
				if(base.scheduleRange === 4){
					//Disable next button
					$('#nextWeek').addClass('disabled');
				}else if(base.scheduleRange === -4){
					//Disable pre button
					$('#preWeek').addClass('disabled');
				}else{
					//Enable all
					$('#nextWeek').removeClass('disabled');
					$('#preWeek').removeClass('disabled');
				}
            }
        });
    },
    updateSchedule: function (target){
        var timeStamp	=  $(target).data('timestamp');
        var timeKey		=  $(target).data('time');
        var baseTime		=  $(target).data('basetime');
		var base = this;
        $.ajax({
            type: 'POST',
            url: this.URL.scheduleAction,
            data: {timestamp:timeStamp, timekey:timeKey, basetime:baseTime, action:2},
            success: function (data) {
                if(data.status === '0'){
                    //Do nothing
                }else if(data.status === '1'){
                    $(target).removeClass('active-time');
                    $(target).addClass('scheduled');
					base.sendMailScheduled();
                }else if(data.status === '2'){
                    $(target).removeClass('scheduled');
                    $(target).addClass('active-time');
                }else if(data.status === '4'){
					$(target).addClass('student-booked');
					$('#dialogAlert').modal('show');
				}
				base.updateCountOpenSlot();
            }
        });
    },
    updateCountOpenSlot: function() {
        var openSlots = $('.schedule-time-item.scheduled, .schedule-time-item.student-booked').length;
        $('#slotsOpened').text(openSlots);
    },
	sendMailScheduled: function(){
		var base = this;
		$.ajax({
			type: 'POST',
			url: base.URL.mailService,
			data: {type:'TEACHER_SCHEDULED'},
			success: function (data) {
				//alert(data);
			}
		});
	},
    addEventTooltip: function () {
        var base = this;
        $('.schedule-time-item.student-booked').qtip('destroy', true);
        $('.schedule-time-item.student-booked').each(function(){
            $(this).qtip({
                content: {
                    text: 'Loading...',
                    title: 'Lesson information',
                    ajax: {
                        url: base.URL.scheduleAction,
                        type: 'POST',
                        data: {
                            timekey: $(this).attr('data-time'),
							timestamp: $(this).data('timestamp'),
                            action: 3
                        },
                        success: function(data, status) {
                            this.set('content.text', data);
                        }
                    }
                },
                position: {
                    my: 'left center',
                    at: 'right center',
                    adjust: {
                        method: 'flip'
                    },
                    viewport: $(window)
                },
                hide: {
                    //event: false,
                    delay: 200,
                    fixed: true
                },
                style: {
                    classes: 'qtip-light qtip-bootstrap schola-tip'
                }
            });
        });

    },
	gotoClassroom: function(target){
		var scheduleId = $(target).data("schedule-id");
		var url = this.URL.classroom + "?id=" + scheduleId;
		window.location = url;
	},
	classDetail: function(target){
		var scheduleId = $(target).data("schedule-id");
		var url = this.URL.classDetail + "?id=" + scheduleId;
		window.location = url;
	},
	cancelClassRoom: function (target){
        var timeStamp	=  $(target).data('timestamp');
		var userid =  $(target).data('userid');
        var timeKey		=  $(target).data('time');
		var base = this;
        base.URL.timeKey = timeKey;
        base.URL.userid = userid;
        base.URL.timeStamp = timeStamp;

        $('#cancelConfirmModal').modal('show');
        return;
    },
    cancleClassConfirmation: function (){
        var base = this;
        $.ajax({
            type: 'POST',
            url: base.URL.scheduleAction,
            data: {timekey:base.URL.timeKey, action:4,userid:base.URL.userid},
            success: function (data) {
                var timeSlot = $('.scheduled-'+base.URL.timeStamp);
                $(timeSlot).removeClass('student-booked');
                $(timeSlot).removeClass('scheduled');
                $(timeSlot).removeClass('disable-time');
                $(".qtip").remove();
            }
        });
        $('#cancelConfirmModal').modal('hide');
    }
};