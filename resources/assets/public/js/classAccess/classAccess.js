var classView = {
    URL: {
        checkPin: '',
        studentRedirect :'',
        checkClassTime: '',
        classroomUrl:'',
    },
    MESSAGE:{
        checkPinBefore: "",
        checkPinAfter: "",
        checkPinInvalid : "",
    },
    
   
    init: function(url,msg) {
        var base = this;
        base.URL = url;
        base.MESSAGE = msg;
       
        $('#btn-classcode').click(function () {
            var access_code = $('#schedulecode').val();
            var profile_country_code = $('#profile_country_code').val();
            var profile_phone_number = $('#profile_phone_number').val();
            base._checkPin(access_code,profile_country_code,profile_phone_number);
        });

        $('.btnAccessEnterClass').click(function () {
            var scheduleId   =  $(this).data('id');
            base.checkClassTime(scheduleId); 
            
       });

    },
    _checkPin: function (access_code, profile_country_code,profile_phone_number) {
        var base = this;
       
        $('.access_error').remove();
        if (access_code) {
            $.ajax({
                type: 'POST',
                url: base.URL.checkPin,
                data: {
                    access_code: access_code,profile_country_code: profile_country_code,profile_phone_number: profile_phone_number
                },
                success: function (data) {
                  
                    var res = JSON.parse(data);
                    if (res.status == 'invalid') {
                        $('.user_access_error').text(base.MESSAGE.checkPinInvalid).show();
                    }
                    else if (res.status == 'after') {
                        $('.user_access_error').text(base.MESSAGE.checkPinAfter).show();
                       
                    } else if (res.status == 'before') {
                        $('.user_access_error').text(base.MESSAGE.checkPinBefore).show();
                      
                    }else{
                        $('.user_access_error').hide();
                        window.location.href = base.URL.studentRedirect;
                    }
                }
            });
        }
    },
    checkClassTime: function (id) {
        var base = this;
        $.ajax({
            type: 'GET',
            url: base.URL.checkClassTime,
            data: {'id': id},
            success: function (data) {
                    var res = JSON.parse(data);
                    if (res.status == 'invalid') {
                        $('.user_access_error').text(base.MESSAGE.checkPinInvalid).show();
                    }
                    else if (res.status == 'after') {
                        $('.user_access_error').text(base.MESSAGE.checkPinAfter).show();
                       
                    } else if (res.status == 'before') {
                        $('.user_access_error').text(base.MESSAGE.checkPinBefore).show();
                      
                    }else{
                        window.location.href = res.classUrl;
                    }
                }
        });
    }
    
}

setTimeout(function(){
  $('.access_error').remove();
  $('.user_access_error').hide();
}, 5000);