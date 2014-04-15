var config	= require('nconf');

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('home', {
            title: 	'Luxury WP',
            vk: config.get('vk'),
            lfm: config.get('lastfm')
        });
	});

	app.post('/user/:action', function(req, res) {
		switch (req.params.action) {
			case 'update':
				req.session.user = req.body;
				res.json({status: 'done'});
				break;

			default:
				res.json({status: 'fail'});
		}
	});

	app.post('/ui/:view', function(req, res) {
		switch (req.params.view) {
			case 'user':
				res.render('element_user', {
					layout: false,
					user: req.session.user
				});
				break;
			case 'audio':
				res.render('element_audio', {
					layout: false,
					audio: req.body.response
				});
				break;
			case 'newsfeed':
				var items = [];
				var data = req.body.response;

				for (var k in data['items']) {
					items[k] = data['items'][k];

					/**
					 * Добавление фото на стену не показываем
					 */
					if (items[k]['type'] == 'wall_photo') {
						items[k]['wall_photo'] = 1;
					}

					if (items[k]['source_id'] > 0) {
						for (var i in data['profiles']) {
							if (data['profiles'][i]['uid'] == items[k]['source_id']) {
								items[k]['source'] = data['profiles'][i];
								continue;
							}
						}
					} else {
						for (var i in data['groups']) {
							if (data['groups'][i]['gid'] == Math.abs(items[k]['source_id'])) {
								items[k]['source'] = data['groups'][i];
								continue;
							}
						}
					}

					if (items[k]['copy_owner_id']) {
						if (items[k]['copy_owner_id'] > 0) {
							for (var i in data['profiles']) {
								if (data['profiles'][i]['uid'] == items[k]['copy_owner_id']) {
									items[k]['copy_source'] = data['profiles'][i];
									continue;
								}
							}
						} else {
							for (var i in data['groups']) {
								if (data['groups'][i]['gid'] == Math.abs(items[k]['copy_owner_id'])) {
									items[k]['copy_source'] = data['groups'][i];
									continue;
								}
							}
						}
					}
				}

				res.render('element_newsfeed', {
					layout: false,
					newsfeed: items
				});
				break;
			default:
				res.send('fail');
		}
	});
}