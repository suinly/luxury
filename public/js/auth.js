$(function() {
    VK.init({
        apiId: window.vk_app_id
    });

    $('#loginModal').modal({
        backdrop: 'static',
        keyboard: false,
        show: false
    });

    var authInfo = function (response) {
        if (response.session) {
            window.vk_user_id = response.session.mid;

            $('#wallAudio').data('uid', window.vk_user_id);
            
            VK.api('users.get', {user_id: response.session.mid, fields: 'first_name,last_name,photo_50'}, function(data) {
                $.ajax({
                    url: '/user/update',
                    type: 'POST',
                    dataType: 'json',
                    data: data.response[0],
                    success: function(data) {
                        if (data.status == 'done') {
                            $.ajax({
                                url: '/ui/user',
                                type: 'POST',
                                success: function(data) {
                                    $('#userBlock').fadeOut('fast', function() {
                                        $('#userBlock').html(data);
                                        $('#userBlock').fadeIn('fast');

                                        $('.logout').fadeIn();
                                        $('#loginModal').modal('hide');
                                    });
                                },
                                error: function(error) {
                                    console.log(error);
                                }
                            });
                        }
                    }
                });
            });
        } else {
            console.log('no auth');
            $('.logout').fadeOut();
            $('#loginModal').modal('show');
        }
    }

    VK.Auth.getLoginStatus(authInfo);

    $('.logout').click(function() {
        VK.Auth.logout(function() {
            VK.Auth.getLoginStatus(authInfo);
        });        
    });

    $('.login').click(function() {
        VK.Auth.login(function() { 
            VK.Auth.getLoginStatus(authInfo);
        }, 2+8+16+8192); 
    });
});