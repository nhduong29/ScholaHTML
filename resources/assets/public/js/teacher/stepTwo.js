var MODE = {
    edit: 'EDIT',
    add: 'ADD'
};
var manageViewStep2 = {
    state: {
        modeEducation: '',
        modeExperience: ''
    },
    init: function () {
        var base = this;
        $('#btnShowDialogAddEducation').on('click', function () {
            base.state.modeEducation = MODE.add;
            base.getDialogEducation();
        });

        $('#tableEducation').on('click', '.deleteEducation', function () {
            var parentRow = $(this).closest('tr');
            var eduId = parentRow.data('education-id');
            if (eduId) {
                base.deleteEducation(eduId);
            }
        });

        $('#tableEducation').on('click', '.editEducation', function () {
            var parentRow = $(this).closest('tr');
            var eduId = parentRow.data('education-id');
            if (eduId) {
                base.state.modeEducation = MODE.edit;
                base.getDialogEducation(eduId);
            }
        });

        $('#btnShowDialogAddExperience').on('click', function () {
            base.state.modeExperience = MODE.add;
            base.getDialogExperience();
        });

        $('#tableExperience').on('click', '.deleteExperience', function () {
            var parentRow = $(this).closest('tr');
            var expId = parentRow.data('experience-id');
            if (expId) {
                base.deleteExperience(expId);
            }
        });

        $('#tableExperience').on('click', '.editExperience', function () {
            var parentRow = $(this).closest('tr');
            var expId = parentRow.data('experience-id');
            if (expId) {
                base.state.modeExperience = MODE.edit;
                base.getDialogExperience(expId);
            }
        });

        $("#nextStep").click(function (e) {
            e.preventDefault();
            $('.show-error').removeClass('show-error');
            var data = $("#frmStepTwo").serializeArray();
            $.ajax({
                type: "POST",
                url: URL.saveStepTwo,
                data: data,
                success: function (value) {
                    var res = JSON.parse(value);
                    if(res.status === 'error'){
                        var len = res.errors.length;
                        for( var i = 0; i < len; i++){
                            $('.' + res.errors[i].key + '-control .error').html(res.errors[i].value);
                            $('.' + res.errors[i].key + '-control').addClass('show-error');
                        }
                    }else{
                        window.location.href = URL.stepThree;
                    }
                }
            });
        });
        $("#backStep").click(function (e) {
            window.location.href = URL.stepOne;
        });
        $("#teach").select2({
            maximumSelectionLength: 4,
            multiple: true
        });
    },

    showDialogEducation: function () {
        $('#dialogEducation').modal('show');
    },

    hideDialogEducation: function () {
        $('#dialogEducation').modal('hide');
    },

    getDialogEducation: function (eduId) {
        eduId = eduId || 0;
        var base = this;
        $.ajax({
            type: "GET",
            url: URL.editEducation + '/' + eduId,
            success: function (value) {
                $("#wrapDialogEducation").html(value);
                $('#education-from, #education-to').datepicker({autoclose: true});
                $('#btnUpdateEducation').on('click', function () {
                    base.updateEducation();
                })
                base.showDialogEducation();
            }
        });
    },

    updateEducation: function () {
        var base = this;
        $('.show-error').removeClass('show-error');
        $.ajax({
            type: 'POST',
            url: URL.updateEducation,
            data: $('#frmEditEducation').serializeArray(),
            success: function (response) {
                var res = JSON.parse(response);
                if(res.status === 'error'){
                    var len = res.errors.length;
                    for( var i = 0; i < len; i++){
                        $('.' + res.errors[i].key + '-control .error').html(res.errors[i].value);
                        $('.' + res.errors[i].key + '-control').addClass('show-error');
                    }
                }else{
                    var cEduId = $('#education-id').val();
                    var objEdu  = res.data;
                    if (base.state.modeEducation === MODE.edit) {
                        var idRow = '#educationRow' + cEduId;
                        $(idRow + ' .education-school').text(objEdu.education_school);
                        $(idRow + ' .education-from').text(objEdu.education_from);
                        $(idRow + ' .education-to').text(objEdu.education_to);
                        $(idRow + ' .education-major').text(objEdu.education_major);
                        $(idRow + ' .education-level').text(objEdu.education_level === 1 ? "Master" : (objEdu.education_level === 2 ? "Bachelor":"Other"));
                    } else {
                        var row = base.templateRowEducation(objEdu);
                        $("#tableEducation tbody").append(row);
                    }
                    base.hideDialogEducation();
                }

            }
        });
    },

    templateRowEducation: function (objEdu) {
        var templateRow =
            '<tr id="educationRow' + objEdu.education_id + '" data-education-id="' + objEdu.education_id + '">' +
            '<td class="education-school">' + objEdu.education_school + '</td>' +
            '<td class="education-from">' + objEdu.education_from + '</td>' +
            '<td class="education-to">' + objEdu.education_to + '</td>' +
            '<td class="education-major">' + objEdu.education_major + '</td>' +
            '<td class="education-level">' + (objEdu.education_level === 1 ? "Master" : (objEdu.education_level === 2 ? "Bachelor":"Other")) + '</td>' +
            '<td>' +
            '<span class="editEducation fa fa-edit"></span>' +
            '<span class="deleteEducation fa fa-trash"></span>' +
            '</td>' +
            '</tr>';
        return templateRow;
    },

    deleteEducation: function (eduId) {
        $.ajax({
            type: "POST",
            url: URL.deleteEducation,
            data: {educationId: eduId},
            success: function (response) {
                var data = JSON.parse(response);
                if (data.result) {
                    $("#educationRow" + eduId).remove();
                }
            }
        });
    },

    showDialogExperience: function () {
        $('#dialogExperience').modal('show');
    },

    hideDialogExperience: function () {
        $('#dialogExperience').modal('hide');
    },

    getDialogExperience: function (expId) {
        var base = this;
        $.ajax({
            type: "GET",
            url: URL.editExperience + '/' + expId,
            success: function (value) {
                $("#wrapDialogExperience").html(value);
                $('#experience-from, #experience-to').datepicker({autoclose: true});
                $('#btnUpdateExperience').on('click', function () {
                    base.updateExperience();
                });
                base.showDialogExperience();
            }
        });
    },

    deleteExperience: function (expId) {
        $.ajax({
            type: "POST",
            url: URL.deleteExperience,
            data: {expId: expId},
            success: function (response) {
                var data = JSON.parse(response);
                console.log(data);
                if (data.result) {
                    $("#experienceRow" + expId).remove();
                }
            }
        });
    },

    templateRowExperience: function (objExp) {
        var templateRow =
            '<tr id="experienceRow' + objExp.experience_id + '" data-experience-id="' + objExp.experience_id + '">' +
            '<td class="experience-title">' + objExp.experience_title + '</td>' +
            '<td class="experience-from">' + objExp.experience_from + '</td>' +
            '<td class="experience-to">' + objExp.experience_to + '</td>' +
            '<td class="experience-location">' + objExp.experience_location + '</td>' +
            '<td class="experience-description">' + objExp.experience_description + '</td>' +
            '<td>' +
            '<span class="editExperience fa fa-edit"></span>' +
            '<span class="deleteExperience fa fa-trash"></span>' +
            '</td>' +
            '</tr>';
        return templateRow;
    },

    updateExperience: function () {
        var base = this;
        $('.show-error').removeClass('show-error');
        $.ajax({
            type: 'POST',
            url: URL.updateExperience,
            data: $('#frmEditExperience').serializeArray(),
            success: function (response) {
                var res = JSON.parse(response);
                if(res.status === 'error'){
                    var len = res.errors.length;
                    for( var i = 0; i < len; i++){
                        $('.' + res.errors[i].key + '-control .error').html(res.errors[i].value);
                        $('.' + res.errors[i].key + '-control').addClass('show-error');
                    }
                }else{
                    var objExp = res.data;
                    var cExpId = $('#experience-id').val();
                    if (base.state.modeExperience === MODE.edit) {
                        var idRow = '#experienceRow' + cExpId;
                        $(idRow + ' .experience-title').text(objExp.experience_title);
                        $(idRow + ' .experience-from').text(objExp.experience_from);
                        $(idRow + ' .experience-to').text(objExp.experience_to);
                        $(idRow + ' .experience-location').text(objExp.experience_location);
                        $(idRow + ' .experience-description').text(objExp.experience_description);
                    } else {
                        var row = base.templateRowExperience(objExp);
                        $("#tableExperience tbody").append(row);
                    }
                    base.hideDialogExperience();
                }
            }
        });
    },
};