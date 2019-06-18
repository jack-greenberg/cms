import axios from 'axios';

$('.js-submit').on('click', function(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('username', $('.js-username').val())
    formData.append('password', $('.js-password').val())
    formData.append('remember', $('.js-remember').val())
    formData.append('redirect', $('.js-redirect').val())
    axios.post('/login/', {
        username: $('.js-username').val(),
        password: $('.js-password').val(),
        remember: $('.js-remember').val(),
        redirect: $('.js-redirect').val(),
    })
    .then(response => {
        localStorage.setItem('access_token', response.data['access_token'])
        localStorage.setItem('refresh_token', response.data['refresh_token'])
        window.location.href = '/admin/'
    })
    .catch(error => {
        if (error.response.status != 200) {
            $('.js-username').css("box-shadow", "0 0 0 1px #f7484e");
            $('.js-password').css("box-shadow", "0 0 0 1px #f7484e");
            // $('.js-message-flash').html("<span class=\"message-flash__title\">"+error.response.statusText+": </span><span class=\"message-flash__message\">"+error.response.data+"</span>");
        }
    })
})
