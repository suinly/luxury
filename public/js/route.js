$(function() {

	/** $(document).on('ajaxStart', function() {
		NProgress.start();
	}).on('ajaxComplete', function() {
		NProgress.done();
	});*/

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

/**
 * Вкладка рекомендованных аудиозаписей
 */
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

/**
 * Вкладка аудиозаписей со стены
 */
	$('#wallAudio').click(function() {
        loadingStart('content');

        $('#audioMenu li.active').removeClass('active');
        $('#wallAudio').parent().addClass('active');
        $('#wallAudio').data('uid', window.vk_user_id);

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

		                VK.api('friends.get', {fields: 'photo_50'}, function(data) {
		                	var html = '<a href="#" class="showFriends">Показать друзей</a><div class="friends hide">';

		                	if (data.response.length > 0) {
		                		for (k in data.response) {
		                			html += '<a href="#" class="friendWall" data-uid="'+data.response[k]['uid']+'"><img src="'+data.response[k]['photo_50']+'"></img></a>';
		                		}
		                	}

		                	html += '</div>';

		                	$('#content #audioTab .contentPlace').prepend(html);
		                });

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

/**
 * Поиск по аудизаписям
 */
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

/**
 * Инициализация поиска
 */
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
		/**
		 * Инициализация поиска по Enter в поле поиска
		 */
		$("#searchQuery").keyup(function(event) {
			if(event.keyCode==13) {
				$('#searchIt').click();
			}
		});

		/**
		 * Обработка загрузки по скроллу
		 */
		var busy = false;	// разблокировка загрузки контента
							// true, если идет загрузка в данный момент
							// соответственно заблокировано

		$(window).scroll(function() {
			if ($(window).scrollTop() + $(window).height() + 2000 > $('#content').height()) {

				if (busy) {
					return false;
				}
				/**
				 * Если открыта вкладка аудизаписей, то обрабатываем
				 * вкладки, который внутри нее
				 */
				if ($('#audio').parent().hasClass('active')) {
					/**
					 * Если открыта вкладки аудизаписей пользователя
					 */
					if ($('#myAudio').parent().hasClass('active')) {
						busy = true; // блокируем загрузку

						// узнаем текущую страницу для расчета offset
						var page = $('#myAudio').data('page');

						// если страница не последняя, то выполняем загрузку контента
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
						                },
						                complete: function() {
						                	busy = false;
						                }
						            });
						        } else {
						        	$('#myAudio').data('page', 'end');
						        }
					        });
					    }

					/**
					 * Если открыта вкладка аудизаписей со стены
					 */
					} else if ($('#wallAudio').parent().hasClass('active')) {
						busy = true;
						var page = $('#wallAudio').data('page');

						if (page != 'end') {
							var params = {count: luxury.config.count, offset: luxury.config.count * page};

							var owner_id = parseInt($('#wallAudio').data('uid'));
							if (owner_id) {
								params.owner_id = owner_id;
							}

							VK.api('wall.get', params, function(data) {
								if ('response' in data && data.response.length) {
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
						                },
						                complete: function() {
						                	busy = false;
											loadingStop();
						                }
						            });
						        } else {
						        	$('#wallAudio').data('page', 'end');
						        }
					        });
					    } else {
					    	busy = false;
					    }

					/**
					 * Если открыта вкладка рекоммендованных аудизаписей
					 */
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
						                },
						                complete: function() {
						                	busy = false;
											loadingStop();
						                }
						            });
						        } else {
						        	$('#recommendationsAudio').data('page', 'end');
						        }
					        });
					    }
					}

				/**
				 * Если открыта вкладка новостей пользователя
				 */
				} else if ($('#newsfeed').parent().hasClass('active')) {
					loadingStart();
					busy = true;

					var next_from = $('#newsfeed').data('next_from');

					$('#content #newsfeedTab .contentPlace').append('<div class="loadingMessage">Идет загрузка...</div>');

					setTimeout(function() {
						console.log(next_from);
						VK.api('newsfeed.get', {filters: luxury.config.newsfilters, from: next_from}, function(data) {
							console.log('Получили данные от VK');

							if (data.response.items.length > 0) {
								console.log('Их больше нуля');
								$('#newsfeed').data('next_from', data.response.new_from);

					            $.ajax({
					                url: '/ui/newsfeed',
					                type: 'POST',
					                data: data,
					                success: function(data) {
					                	console.log('Получили данные с сервера');

					                    $('#content #newsfeedTab .contentPlace').append(data);

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

					                    /**
					                     * Fancybox на картинки
					                     */
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
					                },
					                error: function(error) {
					                    console.log(error);
					                },
					                complete: function() {
										loadingStop();
					                	$('#content #newsfeedTab .contentPlace .loadingMessage').remove();
					                	busy = false;
					                }
					            });
							} else {
								loadingStop();
								console.log('Данных нет');
								setTimeout(function() { busy = false; }, 10000);
					            $('#content #newsfeedTab .contentPlace .loadingMessage').remove();
							}
				        });
					}, 500);
				}
			}
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
    }).on('click', '.friendWall', function() {
    	loadingStart('content');

        var self = $(this);

		VK.api('wall.get', {count: luxury.config.count, owner_id: parseInt(self.data('uid'))}, function(data) {
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
		                $('#wallAudio').data('uid', self.data('uid'));

		                if ($('.friends').length == 0) {
		                	VK.api('friends.get', {fields: 'photo_50'}, function(data) {
			                	var html = '<a href="#" class="showFriends">Показать друзей</a><div class="friends hide">';

			                	if (data.response.length > 0) {
			                		for (k in data.response) {
			                			html += '<a href="#" class="friendWall" data-uid="'+data.response[k]['uid']+'"><img src="'+data.response[k]['photo_50']+'"></img></a>';
			                		}
			                	}

			                	html += '</div>';

			                	$('#content #audioTab .contentPlace').prepend(html);
		                	});
			            }

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
    }).on('click', '.showFriends', function() {
    	var self = $(this);
    	if ($('.friends').hasClass('hide')) {
    		self.text('Скрыть список друзей');
    		$('.friends').removeClass('hide');
    	} else {
    		self.text('Показать друзей');
    		$('.friends').addClass('hide');
    	}
    	return false;
    });

/**
 * Клик по ссылке новостей
 * Запрашивает данные у API VK и передает на сервер
 * для обработки данных и вывода HTML
 */
    $('#newsfeed').click(function() {
    	loadingStart('content');
        VK.api('newsfeed.get', {filters: luxury.config.newsfilters, count: luxury.config.news}, function(data) {
        	console.log(data);
			$('#newsfeed').data('next_from', data.response.new_from);
			$('#newsfeed').data('append', 1);

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
    	NProgress.start();
    	//$('#' + id).addClass('loading');
    	//$('body').css('overflow-y', 'hidden');
    }

    function loadingStop(id) {
    	NProgress.done();
    	//$('#' + id).removeClass('loading');
    	//$('body').css('overflow-y', 'scroll');
    }
})