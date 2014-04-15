var VK 		= require('../vksdk.js');
var config	= require('nconf');

var vk = new VK({
    'appID'     : config.get('vk:app_id'),
    'appSecret' : config.get('vk:app_secret'),
    'mode'      : 'oauth'
});

module.exports = function(app) {
	app.get('/logout', function(req, res) {
		req.session = null;
		res.send('Logout success');
	});

	app.get('/auth', function(req, res) {
		var self_res = res;

		/**
		 * Если получили авторизационный код, то делаем запрос
		 * чтобы получить access_token
		 */
		if (req.query.code) {
			var url = 'https://oauth.vk.com/access_token?client_id=' + config.get('vk:app_id')
					+ '&client_secret='	+ config.get('vk:app_secret')
					+ '&code=' + req.query.code 
					+ '&redirect_uri=' + config.get('vk:redirect_uri');

			/**
			 * Запрос на получение access_token
			 */
			https.get(url, function(res) {
				var body = '';

				res.on('data', function(chunk) {
				    body += chunk;
				});

				res.on('end', function() {
					req.session.user = JSON.parse(body);

					/**
					 * Когда токен получен, запрашиваем информацию о пользователе
					 */
					vk.setToken({token: req.session.user.access_token});
					vk.request('users.get', {
						user_id: req.session.user.user_id,
						fields: 'first_name,last_name,photo_100'
					});

					vk.on('done:users.get', function(data) {
					    req.session.user.profile = data.response[0];
						self_res.redirect('/');
					});
				});
			});

		/**
		 * Если код мы не получили, то делаем запрос на него
		 */
		} else {
			/**
			 * Если еще не авторизован
			 */
			if (!req.session.user) {
				var url = 'https://oauth.vk.com/authorize?client_id=' + config.get('vk:app_id')
						+ '&scope=' + config.get('vk:scope')
						+ '&redirect_uri=https://oauth.vk.com/blank.html'
						+ '&response_type=token';

				res.render('auth', {
					url: url
				});

			/**
			 * В противном случае, отправляем пользователя на главную
			 * Ему тут нечего делать - он уже авторизован
			 */
			} else {
				res.redirect('/');
			}
		}
	});
}