var report = {
	URL: {
		reportAction:'',
		classtimeAction:'',
        classtimeZoomAction:'',
        rateClassByTeacher:''
	},
    manageData: {
        dataTables: [],
        timezoneOffset: 7,
        currentTableIndex: {
            _index: null,
            indexListener: function(val) {},
            set index(val) {
                this._index = val;
                this.indexListener(val);
            },
            get index() {
                return this._index;
            },
            registerListener: function(listener) {
                this.indexListener = listener;
            }
        }
    },
	init: function(URL, manageData){
		this.URL = URL;
        this.manageData.timezoneOffset = manageData['timezoneOffset'];
		var base = this;
		$("#preMonth").on("click",function(){
			base.preMonth();
		});
		$("#nextMonth").on("click",function(){
			base.nextMonth();
		});
		$("#thisMonth").on("click",function(){
			base.thisMonth();
		});
        $(".linkEnterClass").on("click",function(){
            schedule_id = $(this).data('id');
            base.updateClassEnterTime(schedule_id);
        });
		$(".linkReview").on("click",function(){
			is_trial = $(this).data('istrial');
            booking_id = $(this).data('booking-id');
            base.classReview(is_trial, booking_id);
		});

        $(".linkEnterClassToZoom").on("click",function(){
            schedule_id = $(this).data('id');
            zoom_class = $(this).data('zoom-id');
            isGroupClass = 0;
            if($(this).data('isgroup')){
                isGroupClass = $(this).data('isgroup');
            }
            base.updateClassEnterTimeToZoom(schedule_id,zoom_class,isGroupClass);
        });

        base.initDataTableList();
	},
    initDataTableList: function() {
        var base = this;
        $('.classes-data-table-panel').each(function() {
            base.manageData.dataTables.push(this);
            if (+$(this).find('table').first().data('id') !== 0) {
                $(this).hide();
            } else {
                base.manageData.currentTableIndex.index = base.manageData.dataTables.indexOf(this);
            }
        });
        base.manageData.dataTables.sort(
            function(x, y)
            {
                return (+$(x).find('table').first().data('id')) - (+$(y).find('table').first().data('id'));
            }
        );
        $('.classes-data-table-panel select.classes-filter-select').each(function() {
            $(this).change(function() {
                base.applyFilter($(this).val());
            })
        });
        base.manageData.currentTableIndex.registerListener(base.switchMonth);
    },
    switchMonth: function(index) {
        if (index < 0 || index > 7) {
            return;
        }
        $('.classes-data-table-panel').each(function() {
            $(this).hide();
        });
        $($('.classes-data-table-panel').get(index)).show();
    },
	nextMonth: function(){
        var base = this;
        if (base.manageData.currentTableIndex.index === 7) {
            return;
        } else if (base.manageData.currentTableIndex.index === 6) {
            $(".choice-week #nextMonth").addClass('disabled');
        } else if ($(".choice-week #nextMonth")[0].classList.contains('disabled')) {
            $(".choice-week #nextMonth").removeClass('disabled');
        }
        base.manageData.currentTableIndex.index = base.manageData.currentTableIndex.index + 1;
        base.resetFilter();
	},
	preMonth: function(){
        var base = this;
        if (base.manageData.currentTableIndex.index === 0) {
            return;
        } else if (base.manageData.currentTableIndex.index === 1) {
            $(".choice-week #preMonth").addClass('disabled');
        } else if ($(".choice-week #preMonth")[0].classList.contains('disabled')) {
            $(".choice-week #preMonth").removeClass('disabled');
        }

        base.manageData.currentTableIndex.index = base.manageData.currentTableIndex.index - 1;
        base.resetFilter();
	},
	thisMonth: function(){
        var base = this;
        $(".choice-week #nextMonth").removeClass('disabled');
        $(".choice-week #preMonth").removeClass('disabled');
        base.manageData.currentTableIndex.index = 6;
        base.resetFilter();
	},
    applyFilter: function (type) {
        var base = this;
        switch(type) {
            case 'today':
                base.filterClassesForToday();
                break;
            case 'tomorrow':
                base.filterClassesForTomorrow();
                break;
            case 'this-week':
                base.filterClassesForThisWeek();
                break;
            case 'this-month':
                base.filterDefault();
                break;
            case 'upcoming':
                base.filterUpcomingClasses();
                break;
            case 'completed':
                base.filterCompletedClasses();
                break;
            default:
                base.resetFilter();
                break;
        }
    },
    resetFilter: function() {
        var base = this;
        var currentTablePanel = base.manageData.dataTables[base.manageData.currentTableIndex.index];
        var currentTable = $(currentTablePanel).find('table[data-empty-flag="false"]').first().DataTable();
        currentTable.draw();

        base.resetFilterSelect();
    },
    resetFilterSelect: function() {
        var base = this;
        var currentTablePanel = base.manageData.dataTables[base.manageData.currentTableIndex.index];
        $(currentTablePanel).find('.classes-filter-select option').each(function () {
            if (this.defaultSelected) {
                this.selected = true;
                return;
            }
        });
    },
    filterDefault: function () {
        var base = this;
        var currentTablePanel = base.manageData.dataTables[base.manageData.currentTableIndex.index];
        var currentTable = $(currentTablePanel).find('table[data-empty-flag="false"]').first().DataTable();
        currentTable.draw();
    },
    filterClassesForToday: function() {
        var base = this;
        var currentTablePanel = base.manageData.dataTables[base.manageData.currentTableIndex.index];
        var currentTable = $(currentTablePanel).find('table[data-empty-flag="false"]').first().DataTable();
        $.fn.dataTableExt.afnFiltering.push(
            function (oSettings, aData, iDataIndex) {
                var dateTimeRawText = aData[4];
                var match = dateTimeRawText.match(/([A-Za-z]{3,4} \d\d? 20\d\d?) (\d\d?:\d\d?) - (\d\d?:\d\d?)/);
                var dateString = match[1] + ' ' + match[3];
                var currentDate = moment(new Date(dateString));

                var startTime = moment().utcOffset(+base.manageData.timezoneOffset).startOf('day');
                var endTime = moment().utcOffset(+base.manageData.timezoneOffset).endOf('day');

                return currentDate >= startTime && currentDate <= endTime;
            }
        );
        currentTable.draw();
        $.fn.dataTableExt.afnFiltering.pop();
    },
    filterClassesForTomorrow: function() {
        var base = this;
        var currentTablePanel = base.manageData.dataTables[base.manageData.currentTableIndex.index];
        var currentTable = $(currentTablePanel).find('table[data-empty-flag="false"]').first().DataTable();
        $.fn.dataTableExt.afnFiltering.push(
            function (oSettings, aData, iDataIndex) {
                var dateTimeRawText = aData[4];
                var match = dateTimeRawText.match(/([A-Za-z]{3,4} \d\d? 20\d\d?) (\d\d?:\d\d?) - (\d\d?:\d\d?)/);
                var dateString = match[1] + ' ' + match[3];
                var currentDate = moment(new Date(dateString));

                var startTime = moment().utcOffset(+base.manageData.timezoneOffset).add(1, 'd').startOf('day');
                var endTime = moment().utcOffset(+base.manageData.timezoneOffset).add(1, 'd').endOf('day');

                return currentDate >= startTime && currentDate <= endTime;
            }
        );
        currentTable.draw();
        $.fn.dataTableExt.afnFiltering.pop();
    },
    filterClassesForThisWeek: function() {
        var base = this;
        var currentTablePanel = base.manageData.dataTables[base.manageData.currentTableIndex.index];
        var currentTable = $(currentTablePanel).find('table[data-empty-flag="false"]').first().DataTable();
        $.fn.dataTableExt.afnFiltering.push(
            function (oSettings, aData, iDataIndex) {
                var dateTimeRawText = aData[4];
                var match = dateTimeRawText.match(/([A-Za-z]{3,4} \d\d? 20\d\d?) (\d\d?:\d\d?) - (\d\d?:\d\d?)/);
                var dateString = match[1] + ' ' + match[3];
                var currentDate = moment(new Date(dateString));

                var startDate = moment().utcOffset(+base.manageData.timezoneOffset).startOf('isoWeek');
                var endDate = moment().utcOffset(+base.manageData.timezoneOffset).endOf('isoWeek');

                return currentDate >= startDate && currentDate <= endDate;
            }
        );
        currentTable.draw();
        $.fn.dataTableExt.afnFiltering.pop();
    },
    filterUpcomingClasses: function() {
        var base = this;
        var currentTablePanel = base.manageData.dataTables[base.manageData.currentTableIndex.index];
        var currentTable = $(currentTablePanel).find('table[data-empty-flag="false"]').first().DataTable();
        $.fn.dataTableExt.afnFiltering.push(
            function (oSettings, aData, iDataIndex) {
                var dateTimeRawText = aData[4];
                var match = dateTimeRawText.match(/([A-Za-z]{3,4} \d\d? 20\d\d?) (\d\d?:\d\d?) - (\d\d?:\d\d?)/);
                var dateString = match[1] + ' ' + match[3];
                var currentDate = moment(new Date(dateString));

                var today = moment().utcOffset(+base.manageData.timezoneOffset);

                return currentDate >= today;
            }
        );
        currentTable.draw();
        $.fn.dataTableExt.afnFiltering.pop();
    },
    filterCompletedClasses: function() {
        var base = this;
        var currentTablePanel = base.manageData.dataTables[base.manageData.currentTableIndex.index];
        var currentTable = $(currentTablePanel).find('table[data-empty-flag="false"]').first().DataTable();
        $.fn.dataTableExt.afnFiltering.push(
            function (oSettings, aData, iDataIndex) {
                var dateTimeRawText = aData[4];
                var match = dateTimeRawText.match(/([A-Za-z]{3,4} \d\d? 20\d\d?) (\d\d?:\d\d?) - (\d\d?:\d\d?)/);
                var dateString = match[1] + ' ' + match[3];
                var currentDate = moment(new Date(dateString));

                var now = moment().utcOffset(+base.manageData.timezoneOffset);

                return currentDate <= now;
            }
        );
        currentTable.draw();
        $.fn.dataTableExt.afnFiltering.pop();
    },
	updateClassEnterTime: function(schedule_id){
	
		$.ajax({
			type: 'POST',
			url: this.URL.classtimeAction,
			data:{schedule_id:schedule_id},
			success: function (data) {
				return true;
			}
		});
	},
    classReview: function (is_trial, booking_id) {
        // alert(this.URL.rateClassByTeacher);
        $.ajax({
            type: 'POST',
            async: false,
            url: this.URL.rateClassByTeacher,
            data: {
                is_trial:is_trial,
                booking_id:booking_id
            },
            success: function (data) {
                $($('#rateClassReviewDialog')[0]).html(data);
                // $('#rateClassReviewDialog').html(data);
                $('#rateConfirmDialog').modal('show');
            }
        });
        
    },
    updateClassEnterTimeToZoom: function(schedule_id,zoom_class,isGroupClass){
    
        $.ajax({
            type: 'POST',
            url: this.URL.classtimeZoomAction,
            data:{schedule_id:schedule_id,zoom_class:zoom_class,isGroupClass:isGroupClass},
            success: function (data) {
                    var res = JSON.parse(data);
                    window.location.href = res.classUrl;                    
                }
        });
    }
    
};