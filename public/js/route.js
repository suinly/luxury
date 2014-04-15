$(function() {

	$(document).on('ajaxStart', function() {
		NProgress.start();
	}).on('ajaxComplete', function() {
		NProgress.done();
	});

/**
 * Клик по ссылке аудиозаписей
 * Запрашивает данные у API VK и передает на сервер
 * для обработки данных и вывода HTML
 */
    $('#audio').click(function() {
        VK.api('audio.get', {count: 100}, function(data) {
            $.ajax({
                url: '/ui/audio',
                type: 'POST',
                data: data,
                success: function(data) {
                    $('#content #audioTab .contentPlace').html(data);
                    $('#menu ul li.active').removeClass('active');
                    $('#menu #audio').parent().addClass('active');
                    $('#audioMenu li.active').removeClass('active');
                    $('#myAudio').parent().addClass('active');
                    $('#content .tab').hide();
                    $('#content #audioTab').show();

                    $('html, body').animate({scrollTop:0}, 'normal');

                    if (luxury.currTrack && $('#audio_'+luxury.currTrack.data('aid')).length) {
	                    luxury.currTrack = $('#audio_'+luxury.currTrack.data('aid'));
	                    if (luxury.currTrack.length) {
	                    	if (!luxury.audio.paused) {
	                    		luxury.currTrack.addClass('active');
	                    		luxury.currTrack.find('i.fa').removeClass('fa-pause').addClass('fa-pause');
	                    	}
	                    	$('html, body').animate({
					            scrollTop: luxury.currTrack.offset().top - 10
					        }, 200);
	                    }

	                    if (luxury.prevTrack) {
	                    	luxury.prevTrack = $('#audio_'+luxury.prevTrack.data('aid'));
	                    }
	                }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }); 

        return false;      
    });

	$('#myAudio').click(function() {
		VK.api('audio.get', {}, function(data) {
            $.ajax({
                url: '/ui/audio',
                type: 'POST',
                data: data,
                success: function(data) {
                    $('#content #audioTab .contentPlace').html(data);
                    $('#audioMenu li.active').removeClass('active');
                    $('#myAudio').parent().addClass('active');

                    if (luxury.currTrack && $('#audio_'+luxury.currTrack.data('aid')).length) {
	                    luxury.currTrack = $('#audio_'+luxury.currTrack.data('aid'));
	                    if (luxury.currTrack.length) {
	                    	if (!luxury.audio.paused) {
	                    		luxury.currTrack.addClass('active');
	                    		luxury.currTrack.find('i.fa').removeClass('fa-pause').addClass('fa-pause');
	                    	}
	                    }

	                    if (luxury.prevTrack) {
	                    	luxury.prevTrack = $('#audio_'+luxury.prevTrack.data('aid'));
	                    }
	                }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }); 

		return false;
	});

	$('#recommendationsAudio').click(function() {
		VK.api('audio.getRecommendations', {}, function(data) {
			$.ajax({
                url: '/ui/audio',
                type: 'POST',
                data: data,
                success: function(data) {
                    $('#content #audioTab .contentPlace').html(data);
                    $('#audioMenu li.active').removeClass('active');
                    $('#recommendationsAudio').parent().addClass('active');

                    if (luxury.currTrack && $('#audio_'+luxury.currTrack.data('aid')).length) {
	                    luxury.currTrack = $('#audio_'+luxury.currTrack.data('aid'));
	                    if (luxury.currTrack.length) {
	                    	if (!luxury.audio.paused) {
	                    		luxury.currTrack.addClass('active');
	                    		luxury.currTrack.find('i.fa').removeClass('fa-pause').addClass('fa-pause');
	                    	}
	                    }

	                    if (luxury.prevTrack) {
	                    	luxury.prevTrack = $('#audio_'+luxury.prevTrack.data('aid'));
	                    }
	                }
                },
                error: function(error) {
                    console.log(error);
                }
            });
		});

		return false;
	});

	$('#searchIt').click(function() {
		var query = $('#searchQuery').val();
		
		var byartist = 0;
		$('#byArtist').prop('checked') ? byartist = 1 : byartist = 0;

		if (query != '') {
			VK.api('audio.search', {q: query, performer_only: byartist}, function(data) {
				delete data.response[0];
				$.ajax({
	                url: '/ui/audio',
	                type: 'POST',
	                data: data,
	                success: function(data) {
	                    $('#content #audioTab .contentPlace').html(data);
	                    $('#audioMenu li.active').removeClass('active');
	                },
	                error: function(error) {
	                    console.log(error);
	                }
	            });
			});
		} else {
			$('#searchQuery').focus();
		}

		return false;
	});

	$(document).on('click', '.addAudio', function() {
		var self = $(this);
		var track = self.closest('.track');

		VK.api('audio.add', {audio_id: track.data('aid'), owner_id: track.data('owner')}, function(data) {
			if (data.response) {
				self.tooltip('destroy');
				self.parent().remove();
			}
		});

		return false;
    }).on('click', '.deleteAudio', function() {
    	var self = $(this);
		var track = self.closest('.track');

		VK.api('audio.delete', {audio_id: track.data('aid'), owner_id: track.data('owner')}, function(data) {
			if (data.response) {
				self.parent().after('<li><a href="#" rel="tooltip" title="Восстановить" class="restoreAudio"><span class="fa fa-plus"></span></a></li>');
            	$('.trackMenu [rel="tooltip"]').tooltip({container: 'body'});

				self.tooltip('destroy');				
				self.parent().remove();
			}
		});

		return false;
    }).on('click', '.restoreAudio', function() {
    	var self = $(this);
    	var track = self.closest('.track');

    	VK.api('audio.restore', {audio_id: track.data('aid'), owner_id: track.data('owner')}, function(data) {
			if (data.response) {
				self.parent().after('<li><a href="#" rel="tooltip" title="Удалить" class="deleteAudio"><span class="fa fa-times"></span></a></li>');
            	$('.trackMenu [rel="tooltip"]').tooltip({container: 'body'});

				self.tooltip('destroy');	
				self.parent().remove();
			}
		});

    	return false;
    }).on('click', '.searchByArtist', function() {
    	var self = $(this);
    	var track = self.closest('.track');

    	if (track.length == 0) {
    		track = self.parent();
    	}

    	$('#searchQuery').val(track.data('artist'));
    	$('#byArtist').prop('checked', true);
    	$('#searchIt').click();

    	return false;
    }).on('click', '.artistInfo', function() {
    	var self = $(this);
    	var track = self.closest('.track');

    	$.ajax({
    		url: '/ui/artist',
    		type: 'POST',
    		data: {artist: track.data('artist')},
    		success: function(data) {
    			$('#infoContent').html(data);
    		},
    		error: function(error) {
    			console.log(error);
    		}
    	});

    	return false;
    });

/**
 * Клик по ссылке новостей
 * Запрашивает данные у API VK и передает на сервер
 * для обработки данных и вывода HTML
 */
    $('#newsfeed').click(function() {
        VK.api('newsfeed.get', {count: 50}, function(data) {
            console.log(data);
            $.ajax({
                url: '/ui/newsfeed',
                type: 'POST',
                data: data,
                success: function(data) {
                    $('#content #newsfeedTab .contentPlace').html(data);
                    $('#menu ul li.active').removeClass('active');
                    $('#menu #newsfeed').parent().addClass('active');
                    $('#content .tab').hide();                   
                    $('#content #newsfeedTab').show();

                    $('html, body').animate({scrollTop:0}, 'normal');
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });

        return false;
    });
})