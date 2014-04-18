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
        loadingStart('content');
        $('#audioMenu li.active').removeClass('active');
        $('#myAudio').parent().addClass('active');

        VK.api('audio.get', {count: luxury.config.count}, function(data) {
            $.ajax({
                url: '/ui/audio',
                type: 'POST',
                data: data,
                success: function(data) {
					$('#content #audioTab').fadeOut('fast', function() {
	                    $('#content #audioTab .contentPlace').html(data);
	                    $('#menu ul li.active').removeClass('active');
	                    $('#menu #audio').parent().addClass('active');
	                    $('#content .tab').hide();

						$('#content #audioTab').fadeIn('fast');

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

		                $('#myAudio').data('page', 1);
	                });
                },
                complete: function() {
                	loadingStop('content');
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }); 

        return false;      
    });

	$('#myAudio').click(function() {
        loadingStart('content');
        $('#audioMenu li.active').removeClass('active');
        $('#myAudio').parent().addClass('active');

		VK.api('audio.get', {count: luxury.config.count}, function(data) {
            $.ajax({
                url: '/ui/audio',
                type: 'POST',
                data: data,
                success: function(data) {

					$('#content #audioTab .contentPlace').fadeOut('fast', function() {
	                    $('#content #audioTab .contentPlace').html(data);
						$('#content #audioTab .contentPlace').fadeIn('fast');

	                    $('html, body').animate({scrollTop:0}, 'normal');

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

		                $('#myAudio').data('page', 1);

	                });
                },
                complete: function() {
                	loadingStop('content');
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }); 

		return false;
	});

	$('#recommendationsAudio').click(function() {
		loadingStart('content');
        $('#audioMenu li.active').removeClass('active');
        $('#recommendationsAudio').parent().addClass('active');

		VK.api('audio.getRecommendations', {count: luxury.config.count}, function(data) {
			$.ajax({
                url: '/ui/audio',
                type: 'POST',
                data: data,
                success: function(data) {
					$('#content #audioTab .contentPlace').fadeOut('fast', function() {
	                    $('#content #audioTab .contentPlace').html(data);

						$('#content #audioTab .contentPlace').fadeIn('fast');

	                    $('html, body').animate({scrollTop:0}, 'normal');

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

		                $('#recommendationsAudio').data('page', 1);
	                });
                },
                complete: function() {
		            loadingStop('content');
		        },
                error: function(error) {
                    console.log(error);
                }
            });
		});

		return false;
	});

	$('#wallAudio').click(function() {
        loadingStart('content');

        $('#audioMenu li.active').removeClass('active');
        $('#wallAudio').parent().addClass('active');

		VK.api('wall.get', {count: luxury.config.count}, function(data) {
			$.ajax({
				url: '/ui/wall',
				type: 'POST',
				data: data,
				success: function(data) {
					$('#content #audioTab .contentPlace').fadeOut('fast', function() {
						$('#content #audioTab .contentPlace').html(data);

						$('#content #audioTab .contentPlace').fadeIn('fast');

	                    $('html, body').animate({scrollTop:0}, 'normal');

		                $('#wallAudio').data('page', 1);

		                loadingStop('content');
	                });
				},
                complete: function() {
                	loadingStop('content');
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
		    loadingStart('content');
			VK.api('audio.search', {q: query, performer_only: byartist}, function(data) {
				if (data.response.length > 1) {
					delete data.response[0];
					loadingStart('infoContent');

					$.ajax({
		                url: '/ui/audio',
		                type: 'POST',
		                data: data,
		                beforeSend: function(data) {
		                	if (byartist == 1) {
		                		$.ajax({
						    		url: '/ui/artist',
						    		type: 'POST',
						    		data: {artist: query},
						    		success: function(data) {
						    			$('#infoContent').fadeOut('fast', function() {
						    				$('#infoContent').html(data);
						    				$('#infoContent').fadeIn();

						    				loadingStop('infoContent');
						    			});
						    		},
						    		error: function(error) {
						    			console.log(error);
						    		}
						    	});
		                	}
		                },
		                success: function(data) {
							$('#content #audioTab .contentPlace').fadeOut('fast', function() {
			                    $('#content #audioTab .contentPlace').html(data);
			                    $('#audioMenu li.active').removeClass('active');
		        				$('#searchAudio').parent().addClass('active');

								$('#content #audioTab .contentPlace').fadeIn('fast');

	                   			$('html, body').animate({scrollTop:0}, 'normal');

			               		$('#searchAudio').data('page', 1);
		               		});
		                },
		                complete: function() {
	               			loadingStop('content');
		                },
		                error: function(error) {
		                    console.log(error);
		                }
		            });
		        } else {
		        	$('#content #audioTab .contentPlace').fadeOut('fast', function() {
		        		$('#content #audioTab .contentPlace').html('<h3 class="text-center text-muted">Ничего не найдено</h3>');
		        		$('#content #audioTab .contentPlace').fadeIn('fast');
		        	});
		        }
			});
		} else {
			$('#searchQuery').focus();
		}

		return false;
	});

	$('#searchAudio').click(function() {
		$('#content #audioTab .contentPlace').fadeOut('fast', function() {
			$('#searchQuery').focus();
       		$('#content #audioTab .contentPlace').html('<h3 class="text-center text-muted">Начните поиск аудиозаписей</h3>');
	        $('#audioMenu li.active').removeClass('active');
	        $('#searchAudio').parent().addClass('active');
			$('#content #audioTab .contentPlace').fadeIn('fast');
		});

		return false;
	});

	$(document).ready(function() {
		$("#searchQuery").keyup(function(event) {
			if(event.keyCode==13) {
				$('#searchIt').click();
			}
		});

		$(window).scroll(function() {
			if ($(window).scrollTop() == $(document).height() - $(window).height()){
				if ($('#audio').parent().hasClass('active')) {
					if ($('#myAudio').parent().hasClass('active')) {
						var page = $('#myAudio').data('page');

						if (page != 'end') {
							VK.api('audio.get', {count: luxury.config.count, offset: luxury.config.count * page}, function(data) {
								if (data.response.length) {
						            $.ajax({
						                url: '/ui/audio?append=1',
						                type: 'POST',
						                data: data,
						                success: function(data) {
						                    $('#content #audioTab .contentPlace ul.tracks').append(data);
						                    $('#myAudio').data('page', page + 1);
						                },
						                error: function(error) {
						                    console.log(error);
						                }
						            });
						        } else {
						        	$('#myAudio').data('page', 'end');
						        }
					        });
					    }
					} else if ($('#wallAudio').parent().hasClass('active')) {
						var page = $('#wallAudio').data('page');

						if (page != 'end') {
							VK.api('wall.get', {count: luxury.config.count, offset: luxury.config.count * page}, function(data) {
								if (data.response.length) {
						            $.ajax({
						                url: '/ui/wall?append=1',
						                type: 'POST',
						                data: data,
						                success: function(data) {
						                    $('#content #audioTab .contentPlace ul.tracks').append(data);
						                    $('#wallAudio').data('page', page + 1);
						                },
						                error: function(error) {
						                    console.log(error);
						                }
						            });
						        } else {
						        	$('#wallAudio').data('page', 'end');
						        }
					        });
					    }
					} else if ($('#recommendationsAudio').parent().hasClass('active')) {
						var page = $('#recommendationsAudio').data('page');

						if (page != 'end') {
							VK.api('audio.getRecommendations', {count: luxury.config.count, offset: luxury.config.count * page}, function(data) {
								if (data.response.length) {
						            $.ajax({
						                url: '/ui/audio?append=1',
						                type: 'POST',
						                data: data,
						                success: function(data) {
						                    $('#content #audioTab .contentPlace ul.tracks').append(data);
						                    $('#recommendationsAudio').data('page', page + 1);
						                },
						                error: function(error) {
						                    console.log(error);
						                }
						            });
						        } else {
						        	$('#recommendationsAudio').data('page', 'end');
						        }
					        });
					    }
					}
				}
			}

			return false;
		});
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
				$('#infoContent').fadeOut('fast', function() {
					$('#infoContent').html(data);
					$('#infoContent').fadeIn();
				});
    		},
    		error: function(error) {
    			console.log(error);
    		}
    	});

    	return false;
    }).on('click', '.expander', function() {
    	$(this).tooltip('destroy');
    	$(this).parent().find('.content:first').css('max-height', '');
    	$(this).remove();
    	return false;
    });

/**
 * Клик по ссылке новостей
 * Запрашивает данные у API VK и передает на сервер
 * для обработки данных и вывода HTML
 */
    $('#newsfeed').click(function() {
    	loadingStart('content');
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

                    /**
                     * Скрытие части новости, более 300 пикселей в высоту
                     */
                    $('#content #newsfeedTab > .contentPlace > .newsitem').each(function() {
                    	var self 	= $(this);
                    	var content = self.children('.content');
                    	var imgs 	= content.find('img');

                    	var count = 0;
                    	imgs.each(function() {
                    		count++;
                    		$(this).load(function() {
								if (count == imgs.length && content.height() > 299) {
									content.css('max-height', 300);
									self.find('.expander').show().tooltip({container: 'body'});
								}
							});
						});
					});

					$('#content #newsfeedTab a.fancybox').fancybox({
						openEffect	: 'none',
    					closeEffect	: 'none',
    					autoHeight: true,
    					autoWidth: true,
						helpers: {
							title : {
								type : 'float'
							},
							thumbs	: {
								width	: 100,
								height	: 100
							}
						}
					});

                    $('html, body').animate({scrollTop:0}, 'normal');
                },
                complete: function() {
                	loadingStop('content');
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });

        return false;
    });

    function loadingStart(id) {
    	$('#' + id).addClass('loading');
    	//$('body').css('overflow-y', 'hidden');
    }

    function loadingStop(id) {
    	$('#' + id).removeClass('loading');
    	//$('body').css('overflow-y', 'scroll');
    }
})