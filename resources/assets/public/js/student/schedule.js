var scheduleView = {
    URL: {
        getScheduleGrid: '',
        updateSchedule: '',
        deleteSchedule: '',
        classRoom:'',
        getLession:'',
        classDetail:'',
        action:'',
        studentLearningProgress: ''
    },
    data:{
        currentWeek: 0,
        selectedTeacher: [],
        strTeacherId: "",
        bookTeacher: 0,
        scheduleId:"",
        timestamp:""
    },
    init: function (url) {
        var base = this;
        this.data.currentWeek = parseInt($('#thisWeek').val());
        base.URL = url;
        $('input[name="choiceWeek"]').change(function() {
            var week = parseInt($(this).val());
            base.changeWeek(week);          
        });

        $('#filterWeek').on('click','a',function(){
            var week = parseInt($(this).data('week'));
            base.changeWeek(week);
        });

        $('input[name="choiceTeacherType"]').change(function() {
            // Implement later
             var type = parseInt($(this).val());
             base.choiceTeacherType(type);
             var label = $('#filterTeacher a[data-type="' + type + '"]').text();
             $('#filterTeacher .dropdown-label').text(label);
        });

        $('#filterTeacher').on('click','a',function(){
            // Implement later
             var type = parseInt($(this).data('type'));
             base.choiceTeacherType(type);
        });
        
        $('#scheduleGridContent').on('click', '.schedule-time-item:not(.scheduled, .disable-time)', function() {
            base.addScheduleLesson($(this));
        });
        $('#scheduleGridContent').on('click', '.schedule-time-item.scheduled', function() {
            //base.removeScheduleLesson($(this));
        });
        $("#btnPurchase").on('click', function(){
            base.purchaseClass();
        });
        /*
         * It may use in the future
        $('#selectTeacher').on('change', function(){
            base.changeWeek(base.data.currentWeek);
        });
        */
        
        $('#listSelectedTeacher').on('click', '.favoriteAction', function(){
            base.favoriteStatus(this);
        });
        $('#listSelectedTeacher').on('click', '.teacherAvatar', function(){
            base.showProfile(this);
        }); 

        $('.teacherAvatar').on('click', function(){
            base.showProfile(this);
        }); 

        $('#pnlDialogSelectLesson').on('click', '.teacherAvatar', function(){
            base.showProfile(this);
        });
        base.addEventTooltip();
        base.initCarouselTeacher();
    },
    initCarouselTeacher: function () {
        $('.carousel-teacher').owlCarousel({
            items : 7,
            itemsDesktop : [1199, 5],
            itemsDesktopSmall : [979, 5],
            itemsTablet : [768, 5],
            itemsMobile : [479, 3],
            pagination: false,
            navigation: true,
            autoPlay: false
        });
        $('[data-tooltip!=""]').qtip({
            content: {
                attr: 'data-tooltip'
            },
            position: {
                my: 'bottom center',
                at: 'top center',
                adjust: {
                    method: 'flip'
                },
                viewport: $(window)
            },
            hide: {
                //event: false,
                fixed: true
            },
            style: {
                classes: 'qtip-tipsy'
            }
        });
    },
    choiceTeacherType: function(type){
        var base = this;
        this.data.selectedTeacher = [];
        $.ajax({
            type: 'POST',
            url: base.URL.action,
            data: {action:13, type:type},
            success: function (data) {
                 $('#listSelectedTeacher').html(data);
                //$("#scheduleGridContent").html(data);
                base.initCarouselTeacher();
                var label = $('#filterTeacher a[data-type="' + type + '"]').text();
                $('#filterTeacher .dropdown-label').text(label);
                $('.filter-teacher input[value="' + type + '"]').prop('checked', true);
            }
        });

        var week = $("input[name='choiceWeek']:checked").val();

        $.ajax({
            type: 'POST',
            url: base.URL.action,
            data: {action:16, type:type, weekday:week },
            success: function (data) {
                 //$('#listSelectedTeacher').html(data);
                $("#scheduleGridContent").html(data);
                base.initCarouselTeacher();
                var label = $('#filterTeacher a[data-type="' + type + '"]').text();
                $('#filterTeacher .dropdown-label').text(label);
                $('.filter-teacher input[value="' + type + '"]').prop('checked', true);
            }
        });    
    },
    bookTeacher: function(target){
        var state = $(target).prop('checked');
        if(state === true){
            $('.bookTeacher').prop('checked', false);
            $(target).prop('checked', true);
            this.data.bookTeacher = parseInt($(target).data('teacher-id'));
        }else{
            this.data.bookTeacher = 0;
        }
    },
    selectTeacher: function(target){
        var state = $(target).prop('checked');
        var teacherId = parseInt($(target).data('teacher-id'));
        if(state === true){
            this.addSelectedTeacher(teacherId);
        }else{
            this.removeTeacherFromSelected(teacherId);
        }
        this.changeWeek(this.data.currentWeek);
    },
    addSelectedTeacher: function(teacherId){
        this.data.selectedTeacher.push(teacherId);
    },
    removeTeacherFromSelected: function(teacherId){
        var index = this.data.selectedTeacher.indexOf(teacherId);
        if(index > -1){
            this.data.selectedTeacher.splice(index, 1);
        }
        
    },
    showProfile: function(target){
        var teacherId = $(target).data('teacher-id');
        $.ajax({
            type: 'POST',
            url: URL.action,
            data:{teacherId:teacherId, action:10},
            success: function (data) {
                $("#pnlDialogTeacherProfile").html(data);
                $("#dialogTeacherProfile").modal("show");
            }
        });
    },
    favoriteStatus: function(target){
        var base = this;
        var teacherId = $(target).data('teacher-id');
        $.ajax({
            type: 'POST',
            url: base.URL.action,
            data: {teacherId: teacherId,action:12},
            success: function (data) {
               var objJson = JSON.parse(data);
               if(objJson.status === 1){
                   $(target).removeClass('not-favorite');
                   $(target).addClass('favorite');
               }else{
                   $(target).removeClass('favorite');
                   $(target).addClass('not-favorite');
               }
            }
        });
    },
    purchaseClass: function(){
        $('#dialogPurchase').modal('show');
    },
    changeWeek: function (week) {
        var teacherId = ""
        if(this.data.selectedTeacher.length !== 0){
            teacherId = this.data.selectedTeacher.join();
        }
        var base = this;
        this.data.currentWeek = week;
        $.ajax({
            type: 'POST',
            url: base.URL.getScheduleGrid,
            data: {weekNumber: week, teacherId: teacherId},
            success: function (data) {
                $("#scheduleGridContent").html(data);
                base.addEventTooltip();
                var label = $('#filterWeek a[data-week="' + week + '"]').text();
                $('#filterWeek .dropdown-label').text(label);
            }
        });
        
    },
    addScheduleLesson: function (scheduleItemElement) {
        var base = this;
        var timeSelected = $(scheduleItemElement).data("time");
        var timeStamp = $(scheduleItemElement).data("timestamp");
        var baseTime = $(scheduleItemElement).data('basetime');
        var selectedTeacherId = this.data.selectedTeacher.join();
        $('.show-error').removeClass('show-error');
        $('#topic').attr('data-time',timeSelected).attr('data-timestamp',timeStamp);

        var lessonId = $('#lesson_id').val();
        if(lessonId != 0) {
            base.addSchedule(baseTime,scheduleItemElement, timeSelected, timeStamp, lessonId);
            $('#lesson_id').val(0);
        } else {
            base.initLessionDropdown(baseTime, selectedTeacherId, timeSelected);
            $('#dialogScheduleLesson').modal('show');
            $('#btnUpdateSchedule').unbind().click(function () {
                $('.show-error').removeClass('show-error');
                if(base.checkRemainClass()){
                    var lessonId = $('#topic').val();
                    var next_lessonId = ($('.getNextLessonId option:selected').next().val());
                    if($.type(next_lessonId) === "undefined"){
                        next_lessonId = ($('.getNextLessonId option:first-child').first().val());
                    }
                    var listOfTeacherSize = parseInt($('#tmpHiddenTeacherSize').val());
                    if(listOfTeacherSize === 1){
                        base.data.bookTeacher = parseInt($('#dialogScheduleLesson .teacherAvatar').data('teacher-id'));
                    }                    
                    if(base.data.bookTeacher !== 0){
                        base.addSchedule(baseTime, scheduleItemElement, timeSelected, timeStamp, lessonId, base.data.bookTeacher,next_lessonId);
                    }else{
                        $('.pleaseChooseTeacherMessage').show();
                    }
                }else{
                    $('.remainingClassMessage').show();
                }
            });
        }
    },
    checkRemainClass: function(){
        var res = true;
        var base = this;
        $.ajax({
            type:"POST",
            url:base.URL.action,
            data:{action:14},
            async: false,
            success: function(data){
                var json = JSON.parse(data);
                if(parseInt(json.remain) === 0){
                    res = false;
                }
            }
        });
        return res;
    },
    initLessionDropdown: function(baseTime, teacherId, timeSelected){
        var base = this;
        $.ajax({
            type: 'POST',
            async: false,
            url: base.URL.getLession,
            data: {baseTime:baseTime, teacherId:teacherId, timeSelected:timeSelected},
            success: function (data) {
                $($('#pnlDialogSelectLesson')[0]).html(data);
                $('.select-single').select2({
                    language: 'en',
                    width: '100%' 
                });
                base.data.bookTeacher = 0;
            }
        });
    },
    addSchedule: function (baseKeyTime, scheduleItemElement, timeSelected, timeStamp, lessonId, teacherId,next_lessonId) {
        var base = this;
        $.ajax({
            type: 'POST',
            url: base.URL.updateSchedule,
            data: {             
                time_key: timeSelected,
                timestamp: timeStamp,
                course_id: 1,
                unit_id: 1,
                lesson_id: lessonId,
                base_time:baseKeyTime,
                teacherId: teacherId,
                next_lessonId:next_lessonId
            },
            success: function (data) {
                var res = JSON.parse(data);
                if (res.status === '1') {
                    $(scheduleItemElement).addClass('scheduled');
                    $('#dialogScheduleLesson').modal('hide');
                    base.addEventTooltip();
                    window.location.href = base.URL.studentLearningProgress;
                } else if (res.status === '2') {
                    alert('This time or lesson already scheduled');
                } else if (res.status === '3') {
                    alert('Can\'t remove this schedule');
                    $('#dialogScheduleLesson').modal('hide');
                } else {
                    $.each(res.errors, function (index, item) {
                        $('.' + item.key + '-control .error').text(item.value);
                        $('.' + item.key + '-control').addClass('show-error');
                    });
                }

            }
        });
    },
    addEventTooltip: function () {
        var base = this;
        $('.schedule-time-item.scheduled').qtip('destroy', true);
        $('.schedule-time-item.scheduled').each(function(){
            $(this).qtip({
                content: {
                    text: 'Loading...',
                    title: 'Lesson information',
                    ajax: {
                        url: base.URL.scheduleDetail,
                        type: 'POST',
                        data: {
                            timekey: $(this).attr('data-basetime'),
                            timestamp:$(this).data('timestamp')
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
    removeScheduleLesson: function(target) {
        var scheduleId = $(target).data('schedule-id');
        var timestamp = $(target).data('timestamp');
        var base = this;
        var checkCanceledTime = base.checkCanceledTime(scheduleId);
        base.data.scheduleId = scheduleId;
        base.data.timestamp = timestamp;
        if(checkCanceledTime === true){
            $('#cancelConfirmDialog').modal('show');
            return;
        }
        $('#cancelConfirmModal').modal('show');
        return;
    },
    confirmCancel: function(){
        var base = this;
        $.ajax({
            url: base.URL.deleteSchedule,
            type: 'POST',
            async:false,
            data: {scheduleId:base.data.scheduleId},
            success: function (data) {
                $('.item' + base.data.timestamp).removeClass('scheduled');
                $(".qtip").remove();
            }
        });
        $('#cancelConfirmModal').modal('hide');
    },
    removeScheduleLessonAfterConfirm: function(){
        var base = this;
        $.ajax({
            url: base.URL.deleteSchedule,
            type: 'POST',
            async:false,
            data: {scheduleId:base.data.scheduleId},
            success: function (data) {
                $('.item' + base.data.timestamp).removeClass('scheduled');
                $(".qtip").remove();
            }
        });
        $('#cancelConfirmDialog').modal('hide');
    },
    checkCanceledTime: function(scheduleId){
        var res = false;
        var base = this;
        $.ajax({
            url: base.URL.action,
            type: 'POST',
            async:false,
            data: {action:15, scheduleId:scheduleId},
            success: function (data) {
                var objJson = JSON.parse(data);
                if(parseInt(objJson.status) === 1){
                    res = true;
                }
            }
        });
        return res;
    }
    ,
    gotoClassRoom: function(target){
        var schedule_id = $(target).data('schedule-id');        
        url = this.URL.classRoom + '?id='+schedule_id;
        window.location = url;
    },
    classDetail:function(target){
        var scheduleId = $(target).data('schedule-id');
        url = this.URL.classDetail + '?id=' + scheduleId;
        window.location = url;
    }
};