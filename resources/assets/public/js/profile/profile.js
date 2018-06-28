var profile = {
	ACTION: {
		reloadEdu:1,
		reloadExp:2,
		deleteEdu:3,
		deleteExp:4,
		openDialogEdu:5,
		openDialogExp:6,
		updateEdu:7,
		updateExp:8,
		updateTeacherProfile: 9,
		updateStudentProfile: 10,
		checkStudentPhone:11
	},
	URL: {
		action:'',
		fileUploadService: ''
	},
	init: function(URL){
		this.URL = URL;
		var base = this;
		//list Exp action
		$('#listExp').on('click','.editExperience', function(){
			var expId = parseInt($(this).data('exp-id'));
			base.openDialogExp(expId);
		});
		$('#listExp').on('click','.deleteExperience', function(){
			var expId = parseInt($(this).data('exp-id'));
			base.deleteExp(expId);
		});
		
		$('#listExp').on('click','#btnShowDialogAddExperience', function(){
			base.openDialogExp(0);
		});		
		
		$('#wrapDialogExperience').on('click','#btnUpdateExperience',function(){
			base.updateExp();
		});
		//listEdu action
		
		$('#listEdu').on('click','.editEducation', function(){
			var eduId = parseInt($(this).data('edu-id'));
			base.openDialogEdu(eduId);
		});
		$('#listEdu').on('click','.deleteEducation', function(){
			var eduId = parseInt($(this).data('edu-id'));
			base.deleteEdu(eduId);
		});
		
		$('#listEdu').on('click','#btnShowDialogAddEducation', function(){
			base.openDialogEdu(0);
		});		
		
		$('#wrapDialogEducation').on('click','#btnUpdateEducation',function(){
			base.updateEdu();
		});
		
		$('#btnUpdateProfile').on('click', function(){
			base.updateTeacherProfile();
		});
		
		$('#btnUpdateStudentProfile').on('click', function(){
			base.updateStudentProfile();
		});

		$('#profile_phone').on('change', function(){
			var phone = $(this).val();
			base.checkStudentPhone(phone);
		});
		
		$('.date-time').datepicker({autoclose: true, dateFormat: 'mm/dd/yyyy'});
	},
	checkStudentPhone: function(phone){
		var base = this;
		$.ajax({
			type: 'POST',
			url: base.URL.action,
			data: {phone:phone,action: base.ACTION.checkStudentPhone},
			success: function (data) {
					var objData = JSON.parse(data);
					if(objData.status === 'error'){
						base.showError(objData.error);
					}
			}
		});
	},
	timezoneDetect: function(){
		var selectedTimezone = $('#timezone_id').data('timezone');
		if(selectedTimezone !== undefined || selectedTimezone === ''){
			var date = new Date();
			var offset = date.getTimezoneOffset();
			offset = (offset/60) * (-1);			
		}
		
	},
	updateTeacherProfile: function(){
		var base = this;
		var data = $('#frmTeacherProfile').serializeArray();
		data.push({name:'action', value: base.ACTION.updateTeacherProfile});
		$.ajax({
			type: 'POST',
			url: base.URL.action,
			data: data,
			success: function (data) {
				var objData = JSON.parse(data);
				if(objData.status === 'error'){
					base.showError(objData.error);
				}else{
					alert('Update success!');
				}
			}
		});
	},
	updateStudentProfile: function(){
		var base = this;
		var data = $('#frmStudentProfile').serializeArray();
		data.push({name:'action', value: base.ACTION.updateStudentProfile});
		$('.show-error').removeClass('show-error');
		$.ajax({
			type: 'POST',
			url: base.URL.action,
			data: data,
			success: function (data) {
				var objJson = JSON.parse(data);
				if(objJson.status === 'error'){
					base.showError(objJson.error);
				}else{
					alert('Update success!');
				}
			}
		});
	},
	changeAvatar:function(evt){
		var files = evt.target.files;
        var base = this;
        if(files.length !== 0 && window.FormData !== undefined){
            var data = new FormData();
            data.append('action',5);
			var profileMode = $("#profileMode");
			if(profileMode != undefined && profileMode != null){
				if(parseInt($(profileMode).val()) === 2){
					data.append('child',true);
				}
			}
            for(var i = 0; i < files.length; i++){
                data.append('avatar',files[i]);
            }
            $.ajax({
                type: 'POST',
                url: base.URL.fileUploadService,
                data: data,
                contentType: false,
                processData: false,
                success: function (data) {
					var objJson = JSON.parse(data);
					$('#srcAvatar').attr('src',objJson.file_path);
                }
            });
        }
		$(evt.target).val('');
	},
	showError: function(arrayErr){
		var len = arrayErr.length;
		for( var i = 0; i < len; i++){
			$('.' + arrayErr[i].key + '-control .error').html(arrayErr[i].value);
			$('.' + arrayErr[i].key + '-control').addClass('show-error');
		}
	},
	openDialogExp: function(expId){
		var base = this;
		$.ajax({
			type: 'POST',
			url: base.URL.action,
			data: {expId:expId,action: base.ACTION.openDialogExp},
			success: function (data) {
				$('#wrapDialogExperience').html(data);
				base.showDialogExperience();
				$('#experience-from, #experience-to').datepicker({autoclose: true, dateFormat: 'mm/dd/yyyy'});
			}
		});
	},
	deleteExp: function(expId){
		var base = this;
		$.ajax({
			type: 'POST',
			url: base.URL.action,
			data:{action: base.ACTION.deleteExp,expId:expId},
			success: function (data) {
				base.reloadExp();
			}
		});
	},
	updateExp: function(){
		var base = this;
		var data = $('#frmEditExperience').serializeArray();
		data.push({name:'action',value: base.ACTION.updateExp});
		$.ajax({
			type: 'POST',
			url: base.URL.action,
			data: data,
			success: function (data) {
				var objJson = JSON.parse(data);
				if(objJson.status === 'error'){
					base.showError(objJson.errors);
				}else{
					base.reloadExp();
					base.hideDialogExperience();
				}
			}
		});
	},	
	openDialogEdu: function(eduId){
		var base = this;
		$.ajax({
			type: 'POST',
			url: base.URL.action,
			data: {eduId:eduId,action: base.ACTION.openDialogEdu},
			success: function (data) {
				$('#wrapDialogEducation').html(data);
				base.showDialogEducation();
				$('#education-from, #education-to').datepicker({autoclose: true, dateFormat: 'mm/dd/yyyy'});
			}
		});
	},
	deleteEdu: function(eduId){
		var base = this;
		$.ajax({
			type: 'POST',
			url: base.URL.action,
			data:{action: base.ACTION.deleteEdu,eduId:eduId},
			success: function (data) {
				base.reloadEdu();
			}
		});
	},
	updateEdu: function(){
		var base = this;
		var data = $('#frmEditEducation').serializeArray();
		data.push({name:'action',value: base.ACTION.updateEdu});
		$.ajax({
			type: 'POST',
			url: base.URL.action,
			data: data,
			success: function (data) {
				var objJson = JSON.parse(data);
				if(objJson.status === 'error'){
					base.showError(objJson.errors);
				}else{
					base.reloadEdu();
					base.hideDialogEducation();
				}
			}
		});
	},	
	
	reloadExp: function(){
		var base = this;
		$.ajax({
			type: 'POST',
			url: base.URL.action,
			data: {action: base.ACTION.reloadExp},
			success: function (data) {
				$('#listExp').html(data);
			}
		});
	},
	reloadEdu: function(){
		var base = this;
		$.ajax({
			type: 'POST',
			url: base.URL.action,
			data: {action:base.ACTION.reloadEdu},
			success: function (data) {
				$('#listEdu').html(data);
			}
		});
	},
	showDialogEducation: function () {
		$('#dialogEducation').modal('show');
	},
	hideDialogEducation: function () {
		$('#dialogEducation').modal('hide');
	},            
	showDialogExperience: function () {
		$('#dialogExperience').modal('show');
    },
	hideDialogExperience: function () {
		$('#dialogExperience').modal('hide');
    }
};
