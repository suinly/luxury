$(function() {
    function Luxury() {
        this.config = {
            volume: 0.1,
            repeat: 1,
            repeatOne: 0,
            random: 0,
            count: 100 // количетво аудиозаписей за один запрос
        };

        this.audio = new Audio;

        this.currTrack = null;
        this.prevTrack = null;

        this.play = function(track) {
            if (track && track.length) {
                this.prevTrack = this.currTrack;
                this.currTrack = track;
                this.audio.src = this.currTrack.data('url');
            }

            if (this.audio.src) {
                this.audio.play();
            }
        }

        this.pause = function() {
            this.audio.pause();
        }

        this.next = function() {
            if (this.currTrack) {
                if (this.config.random) {
                    var nextTrack = this.getRandomTrack();
                } else {
                    if (this.currTrack.next() && this.currTrack.next().length) {
                        var nextTrack = this.currTrack.next();
                    } else {
                        var nextTrack = $('.tracks .track').first();
                    }
                }

                this.play(nextTrack);
            } else {
                return false;
            }
        }

        this.prev = function() {
            if (this.currTrack) {
                if (this.config.random) {
                    var prevTrack = this.prevTrack;
                } else {
                    if (this.currTrack.prev() && this.currTrack.prev().length) {
                        var prevTrack = this.currTrack.prev();
                    } else {
                        var prevTrack = $('.tracks .track').last();
                    }
                }

                this.play(prevTrack);
            } else {
                return false;
            }
        }

        this.getRandomTrack = function() {
            var max = $('.tracks .track').length;
            var min = 0;
            var random = Math.round(Math.random() * (max - min + 1)) + min;

            var nextTrack = $('.tracks .track').eq(random);

            if (nextTrack.data('aid') != luxury.currTrack.data('aid')) {
                return $('.tracks .track').eq(random);
            } else {
                return this.getRandomTrack();
            }
        }

        this.duration = function(seconds) {
            seconds = Number(seconds);
            var h = Math.floor(seconds / 3600);
            var m = Math.floor(seconds % 3600 / 60);
            var s = Math.floor(seconds % 3600 % 60);
            return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
        }
    }

    var luxury = new Luxury;

    luxury.config.volume = getCookie('volume') ? getCookie('volume') : luxury.config.volume;
    luxury.config.repeat = getCookie('repeat') ? +getCookie('repeat') : luxury.config.repeat;
    luxury.config.random = getCookie('random') ? +getCookie('random') : luxury.config.random;
    luxury.audio.volume  = luxury.config.volume;

    $('.volume-control .range').width(luxury.config.volume * 100);

    window.luxury = luxury;

/**
 * События плеера
 */
    luxury.audio.addEventListener('pause', function() {
        var icon = $('#playerPlayPause').find('i.fa');   
        icon.removeClass('fa-pause').addClass('fa-play');

        luxury.currTrack.find('i.fa')
                        .removeClass('fa-pause')
                        .addClass('fa-play');     
    });

    luxury.audio.addEventListener('play', function() {
        var icon = $('#playerPlayPause').find('i.fa');
        icon.removeClass('fa-play').addClass('fa-pause');

        luxury.currTrack.find('i.fa')
                        .removeClass('fa-play')
                        .addClass('fa-pause');

        if (luxury.prevTrack) {
            luxury.prevTrack.removeClass('active');
        }

        luxury.currTrack.addClass('active');

        $('.track-info .title').text(luxury.currTrack.data('title'));
        $('.track-info .artist').text(luxury.currTrack.data('artist'));

        $('.time-control').fadeIn();

        /**
         * Получение обложки альбома из LastFM
         */
        $.get('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=' + window.lfm_api_key 
              + '&artist=' + luxury.currTrack.data('artist') 
              + '&track=' + luxury.currTrack.data('title') 
              + '&format=json', function(data) {

            if ('track' in data) {
                if ('album' in data.track) {
                    if ('image' in data.track.album) {
                        $('.album-image').css('background', 'url(' + data.track.album.image[1]['#text'] + ')');
                    } else {
                        $('.album-image').css('background', '#ddd');
                    }
                } else {
                    $('.album-image').css('background', '#ddd');
                }
            } else {
                $('.album-image').css('background', '#ddd');
            }
        });
    });

    luxury.audio.addEventListener('ended', function() {
        if (luxury.config.repeatOne) {
            luxury.audio.currentTime = 0;
            luxury.play();
        } else if (!luxury.config.repeat) {
            if (luxury.currTrack.next().length) {
                luxury.next();
            }
        } else {
            luxury.next();
        }

        $('html, body').animate({
            scrollTop: luxury.currTrack.offset().top - 10
        }, 200);
    });

    luxury.audio.addEventListener('timeupdate', function() {
        $('.track-info .duration').text(luxury.duration(luxury.audio.currentTime) + ' / ' + luxury.duration(luxury.audio.duration));

        var value = (100 / luxury.audio.duration) * luxury.audio.currentTime;
        $('.time-control .range').width(value + '%');
    });

    luxury.audio.addEventListener('volumechange', function() {
        luxury.config.volume = luxury.audio.volume;
        setCookie('volume', luxury.config.volume);
        $('.volume-control .range').width(luxury.config.volume * 100 + '%');
    });

    luxury.audio.addEventListener('progress', function() {
        if ((luxury.audio.buffered != undefined) && (luxury.audio.buffered.length != 0)) {
            var loaded = (luxury.audio.buffered.end(0) / luxury.audio.duration) * 100;

            $('.time-control .buffer').width(loaded + '%');
        }
    });

/**
 * Обработка кнопок основного плеера
 */
    $('#playerPlayPause').click(function() {
        // запускаем или останавливаем аудио, 
        // в зависимости от статуса
        luxury.audio.paused
            ? luxury.play()
            : luxury.pause();

        return false;
    });

    $('#playerNext').click(function() {
        luxury.next();

        if (luxury.prevTrack) {
            luxury.prevTrack.removeClass('active')
                            .find('i.fa').removeClass('fa-pause')
                                         .addClass('fa-play');
        }

        if (luxury.currTrack) {
            luxury.currTrack.addClass('active');

            $('html, body').animate({
                scrollTop: luxury.currTrack.offset().top - 10
            }, 200);
        }

        return false;
    });

    $('#playerPrev').click(function() {
        luxury.prev();

        if (luxury.prevTrack) {
            luxury.prevTrack.removeClass('active')
                            .find('i.fa').removeClass('fa-pause')
                                         .addClass('fa-play');
        }

        if (luxury.currTrack) {
            luxury.currTrack.addClass('active');

            $('html, body').animate({
                scrollTop: luxury.currTrack.offset().top - 10
            }, 200);
        }

        return false;
    });

    luxury.config.random ? $('#playerRandom i.fa').addClass('text-info') : null;
    $('#playerRandom').click(function() {
        $(this).find('i.fa').toggleClass('text-info');
        luxury.config.random = luxury.config.random ? 0 : 1;

        setCookie('random', luxury.config.random);
        return false;
    });

    luxury.config.repeat ? $('#playerRepeat i.fa').addClass('text-info') : null;
    $('#playerRepeat').click(function() {
        $(this).find('i.fa').toggleClass('text-info');
        luxury.config.repeat = luxury.config.repeat ? 0 : 1;

        setCookie('repeat', luxury.config.repeat);

        return false;
    });

    $('#playerMute').click(function() {
        if (luxury.audio.volume) {
            $(this).find('i.fa').removeClass('fa-volume-up').addClass('fa-volume-off');

            $(this).data('volume', luxury.audio.volume);
            luxury.audio.volume = 0;
        } else {
            $(this).find('i.fa').removeClass('fa-volume-off').addClass('fa-volume-up');
            luxury.audio.volume = $(this).data('volume');
        }

        return false;
    });

    $('.time-control').on('mousemove', function(e) {
        if(e.which==1) {
            if (luxury.currTrack) {
                var parentOffset = $(this).parent().offset();      
                var relX = e.pageX - parentOffset.left;
                var value = (100 / $(this).width()) * relX;

                var time = luxury.audio.duration * (value / 100);
                luxury.audio.currentTime = time;
            }
        }
    });

    $('.time-control').on('click', function(e) {
        if (luxury.currTrack) {
            var parentOffset = $(this).parent().offset();      
            var relX = e.pageX - parentOffset.left;
            var value = (100 / $(this).width()) * relX;

            var time = luxury.audio.duration * (value / 100);
            luxury.audio.currentTime = time;
        }
    });

    $('.volume-control').on('mousemove', function(e) {
        if(e.which==1) {
            var parentOffset = $(this).parent().offset();      
            var relX = e.pageX - parentOffset.left;
            var value = (100 / $(this).width()) * relX;
            
            luxury.audio.volume = value / 100;
        }
    });

    $('.volume-control').on('click', function(e) {
        var parentOffset = $(this).parent().offset();      
        var relX = e.pageX - parentOffset.left;
        var value = (100 / $(this).width()) * relX;
        
        luxury.audio.volume = value / 100;
    });

/**
 * Обработка мини-плеера, который в элементе списка
 */
    $(document).on('click', '.track:not(.active)', function() {
        $('.track.active').removeClass('active')
                          .find('i.fa').removeClass('fa-pause')
                                       .addClass('fa-play');

        $(this).addClass('active');

        // запускаем воспроизведение выбранного трека
        luxury.play($(this));

        return false;
    })
    .on('click', '.track.active', function() {
        // запускаем или останавливаем аудио, 
        // в зависимости от статуса
        luxury.audio.paused 
            ? luxury.play() 
            : luxury.pause();

        return false;
    })
    .on('mouseover', '.track', function() {
        var self = $(this);

        if (self.find('.trackMenu').html() == '') {
            if (self.data('owner') == window.vk_user_id) {
                var menu = '<ul> \
                                <li><a href="#" rel="tooltip" title="Информация о исполнителе" class="artistInfo"><span class="fa fa-info"></span></a></li> \
                                <li><a href="#" rel="tooltip" title="Удалить" class="deleteAudio"><span class="fa fa-times"></span></a></li> \
                            </ul>';
            } else {
                var menu = '<ul> \
                                <li><a href="#" rel="tooltip" title="Информация о исполнителе" class="artistInfo"><span class="fa fa-info"></span></a></li> \
                                <li><a href="#" rel="tooltip" title="Добавить" class="addAudio"><span class="fa fa-plus"></span></a></li> \
                            </ul>';
            }
              
            self.find('.trackMenu').html(menu);
            $('.trackMenu [rel="tooltip"]').tooltip({container: 'body'});
        }
    });

    $('[rel="tooltip"]').tooltip({
        container: 'body'
    });

/**
 * Вспомогательные функции
 */
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : false;
    }

    function setCookie(name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires*1000);
            expires = options.expires = d;
        }

        if (expires && expires.toUTCString) { 
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for(var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];    
            if (propValue !== true) { 
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }


});