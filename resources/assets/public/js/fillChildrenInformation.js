var fillChildrenInformationView = {
    URL: {
        updateInformation: '',
        studentDashboard: ''
    },
    init: function (url) {
        var base = this;
        base.URL = url;
        $('#btnUpdateInformation').click(function () {
            base._updateInformation();
        });
        base._pressEnterSubmitData();
        $('#month, #day, #year').on('change',function (e) {
            base._changeBirthDate();
        });
    },
    _updateInformation: function() {
        var base = this;
        $.ajax({
            type: "POST",
            url: base.URL.updateInformation,
            data: $("#frmChildren").serializeArray(),
            beforeSend: function () {
                $('#btnUpdateInformation').attr('disabled', 'disabled');
                $('.show-error').removeClass('show-error');
                $('.error').text('');
            },
            success: function (value) {
                var res = JSON.parse(value);
                if (res.status === 'success') {
                     $('#dialogReffralCode').modal('show');
                    window.location.href = base.URL.studentDashboard;
                } else {
                    $.each(res.errors, function (index, item) {
                        $('.' + item.key + '-control .error').text(item.value);
                        $('.' + item.key + '-control').addClass('show-error');
                    });
                    if (res.errorMetch === 'false') {
                         $('#profile_trial_code').val("");
                    }

                }
            },
            complete: function () {
                $('#btnUpdateInformation').removeAttr('disabled');
            }
        });
    },
    _pressEnterSubmitData: function () {
        $('#frmChildren').keypress(function (e) {
            if (e.which === 13) {
                $('#btnUpdateInformation').click();
                return false;
            }
        });
    },
    _changeBirthDate: function() {
        var base = this;
        var month = $('#month').val();
        month = month < 10 ? '0'+month : month;
        var day = $('#day').val();
        day = day < 10 ? '0'+day : day;
        var year = $('#year').val();
        var date = month + '/' + day + '/' + year;
        if (base._checkValidDate(date)) {
            $('#profile_birthday').val(date);
        } else {
            $('#profile_birthday').val('');
        }
    },
    _checkValidDate: function(date) {
        var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
        if(!(date_regex.test(date)))
        {
            return false;
        }
        return true;
    }
};