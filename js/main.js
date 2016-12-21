$(window).load(function() {

    fillHeader();
    var headerHeight = $(window).height()
    var scrollProgress = 5;
    var headerScrollMagicController = new ScrollMagic({
        globalSceneOptions: {
            triggerHook: 'onLeave'
        }
    });
    function getHeaderHeight() {
        return headerHeight / 1.5;
    }
    $(window).resize(function() {
        headerHeight = $(window).height();
        $('#header').height($(window).height());

        // Force better DOM repainting hack. Helps on mobile
        $('html').addClass('force-gpu').removeClass('force-gpu');
    });
    var headerTextTween = TweenMax.staggerFromTo('#header h1 span', 0.5,
        {
            y: 25,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1
        },
        0.075
    );
    var starScene = new ScrollScene({
        triggerElement: '#header',
        duration: getHeaderHeight,
        offset: 0
    })
    .addTo(headerScrollMagicController)
    .setTween(headerTextTween)
    //.setPin('#header')
    .on('progress', function(e) {
        scrollProgress = e.progress * 100 * 2;
        if (scrollProgress <= 5) {
            scrollProgress = 5;
        }
    })
    .on('start', function(e) {
        $('body').addClass('hide-those-particles');
    });
    var camera, scene, renderer, mouseX = 0, mouseY = 0, particles = [];
    initStars();
    function initStars() {
        camera = new THREE.PerspectiveCamera(80, $('#header').width() / $('#header').height(), 1, 4000 );
        camera.position.z = 1000;
        scene = new THREE.Scene();
        scene.add(camera);
        renderer = new THREE.CanvasRenderer();
        renderer.setSize( $('#header').width(), $('#header').height() );
        document.getElementById('header').appendChild( renderer.domElement );
        makeParticles();
        document.addEventListener( 'mousemove', onMouseMove, false );
        setInterval(update,1000/30);
    }
    function update() {
        updateParticles();
        renderer.render( scene, camera );
    }
    function makeParticles() {
        var particle, material;
        for ( var zpos= -1000; zpos < 1000; zpos+=5 ) {
            material = new THREE.ParticleCanvasMaterial( { color: 0x4FF3CE, program: particleRender } );
            particle = new THREE.Particle(material);
            particle.position.x = Math.random() * 1000 - 500;
            particle.position.y = Math.random() * 1000 - 500;
            particle.position.z = zpos;
            particle.scale.x = particle.scale.y = 1;
            scene.add( particle );
            particles.push(particle);
        }
    }
    function particleRender( context ) {
        context.beginPath();
        context.arc( 0, 0, 1, 0,  Math.PI * 2, true );
        context.fill();
    };
    function updateParticles() {
        for(var i=0; i<particles.length; i++) {
            particle = particles[i];
            particle.position.z += 2 + (scrollProgress * 0.1)/1.5;
            if(particle.position.z>1000) particle.position.z-=2000;
        }
    }
    function onMouseMove( event ) {
        // Do nothing, based on scroll
    }
    $('.hover-block').hover(
        function() {
            explodeLetter($(this).parents('section').attr('id'), $(this).data('letter'), $(this).data('color'));
        }, function() {
            implodeLetter($(this).parents('section').attr('id'), $(this).data('letter'), $(this).data('color'));
        }
    );
    introStuff();




    // BLURB STUFF
    var scrollMagicController = new ScrollMagic();
    var blurbTween = TweenMax.staggerFromTo('#blurb .item', 0.5,
        {
            y: 50,
            x: -50,
            opacity: 0
        },
        {
            y: 0,
            x: 0,
            opacity: 1
        },
        0.2
    );
    var blurbScene = new ScrollScene({
        triggerElement: '#blurb .item',
        duration: 500,
        offset: -200
    })
    .setTween(blurbTween)
    .addTo(scrollMagicController);





    // OUR PROCESS STUFF
    $('#our-process span.icon').hover(function() {

        $('#our-process span.icon').removeClass('active');
        $(this).addClass('active');

        var match = $(this).data('match');

        $('#our-process h4').removeClass('active');
        $('h4.'+match).addClass('active');

        return false;
    });
    var processIconsTween = TweenMax.staggerFromTo('#our-process .step', 0.5,
        {
            opacity: 0.4
        },
        {
            opacity: 1
        },
        0.1
    );


    // CONTACT STUFF
    $('#contact .input').click(function() {
        if ($(this).is(':focus')) {
            $('body').addClass('show-form-overlay');
        }
    });
    $('.form-overlay').click(function() {
        $('body').removeClass('show-form-overlay');
        return false;
    });
    $('#contact .input-wrap.checkbox input').change(function() {
        $('#contact .input-wrap.checkbox').toggleClass('nopeee');
    });
    var contactTween = TweenMax.staggerFromTo('#contact .input-wrap', 0.5,
        {
            y: 50
        },
        {
            y: 0
        },
        0.01
    );
    var contactScene = new ScrollScene({
        triggerElement: '#contact',
        duration: 800,
        offset: 100
    })
    .setTween(contactTween)
    .addTo(scrollMagicController);
    var contactTween2 = TweenMax.staggerFromTo('#contact h2 span', 0.5,
        {
            y: 75
        },
        {
            y: 0
        },
        0.075
    );
    var contactScene2 = new ScrollScene({
        triggerElement: '#contact',
        duration: 650,
        offset: 100
    })
    .setTween(contactTween2)
    .addTo(scrollMagicController);
    var canvasTween = TweenMax.fromTo('#contact canvas', 0.5,
        {
            opacity: 0
        },
        {
            opacity: 0.5
        }
    );
    var canvasScene = new ScrollScene({
        triggerElement: '#contact',
        duration: 700,
        offset: 0
    })
    .setTween(canvasTween)
    .addTo(scrollMagicController);

    var latestScene = new ScrollScene({
        triggerElement: '#latest',
        duration: 8000
    })
    .addTo(scrollMagicController)
    .on('enter', function(e) {
        $('body').removeClass('hide-those-particles');
    })
    .on('leave', function(e) {
        $('body').addClass('hide-those-particles');
    });


    $('form').submit(function() {
        var form = $(this);
        form.find('.input').parent('.input-wrap').removeClass('has-error');

        var hasError = false;
        form.find('.input').each(function() {
            if ($(this).val() == '') {
                $(this).parent('.input-wrap').addClass('has-error');
                $(this).select();
                hasError = true;
                return false;
            }
            
            if ($(this).hasClass('email') && !isEmailValid($(this).val())) {
	            $(this).parent('.input-wrap').addClass('has-error');
	            $(this).select();
	            hasError = true;
	            return false;
            }
            
        });

        var formData = {};
        formData.email = $('input.email').val();
        formData.name = $('input.name').val();
        formData.inquiry = $('select.inquiry').val();
        formData.message = $('textarea.message').val();
        formData.subscribe = $('input.subscribe').prop('checked');
        formData = $.param(formData);

        if (!hasError) {
            $.getJSON(window.location.protocol + '//' + window.location.hostname + '/meowmeowmeow.php?'+formData, function(data) {
                // if (data.status == 'sent') {
                    $('.form-overlay').click();
                    $('input[type=text], textarea').val('');
                    $('#contact h2 span.lets').text('Thank');
                    $('#contact h2 span.chat').text('You!');
                    $('#contact').addClass('success');
                // }
            });
       }

        return false;
    });



    // FOOTER STUFF
    var footerScene = new ScrollScene({
        triggerElement: '#footer',
        offset: -200
    })
    .on('enter', function(e) {

        $('.hover-block.d').trigger("mouseover");

        setTimeout(function() {
            $('.hover-block.d').trigger("mouseout");
        }, 700);


        $('.hover-block.i-1').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.i-1').trigger("mouseout");
        }, 700);

        $('.hover-block.g').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.g').trigger("mouseout");
        }, 700);


        $('.hover-block.i-2').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.i-2').trigger("mouseout");
        }, 700);

        $('.hover-block.t').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.t').trigger("mouseout");
        }, 700);

        $('.hover-block.a').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.a').trigger("mouseout");
        }, 700);

        $('.hover-block.l').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.l').trigger("mouseout");
        }, 700);

    })
    .addTo(scrollMagicController);






    var optimizerScene1 = new ScrollScene({
        triggerElement: '#our-process',
        duration: 5000
    })
    .addTo(scrollMagicController)
    .on('leave', function(e) {
        $('body').removeClass('hide-those-stars');
    })
    .on('start', function(e) {
        $('body').addClass('hide-those-stars');
    });


    initParticles();

});












/*========================================
=            CUSTOM FUNCTIONS            =
========================================*/
function explodeLetter(parentID, letter, fillColor) {
    $('#'+parentID+' .word-digital .letter.'+letter).find('rect').each(function() {
        $(this).css({
            'fill': fillColor,
            '-webkit-transform': 'translate3d('+randomIntFromInterval(-69, 69)+'px, '+randomIntFromInterval(-69, 69)+'px, 0)',
            '-moz-transform': 'translate3d('+randomIntFromInterval(-69, 69)+'px, '+randomIntFromInterval(-69, 69)+'px, 0)',
            '-ms-transform': 'translate3d('+randomIntFromInterval(-69, 69)+'px, '+randomIntFromInterval(-69, 69)+'px, 0)',
            '-o-transform': 'translate3d('+randomIntFromInterval(-69, 69)+'px, '+randomIntFromInterval(-69, 69)+'px, 0)',
            'transform': 'translate3d('+randomIntFromInterval(-69, 69)+'px, '+randomIntFromInterval(-69, 69)+'px, 0)'
        });
    });
}
function implodeLetter(parentID, letter) {
    $('#'+parentID+' .word-digital .letter.'+letter).find('rect').css({
        'fill': '#fff',
        '-webkit-transform': 'translate3d(0, 0, 0)',
        '-moz-transform': 'translate3d(0, 0, 0)',
        '-ms-transform': 'translate3d(0, 0, 0)',
        '-o-transform': 'translate3d(0, 0, 0)',
        'transform': 'translate3d(0, 0, 0)'
    });
}
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
function introStuff() {
    $('body').addClass('show-background');
    setTimeout(function() {
        $('body').addClass('show-stars');

        $('.hover-block.d').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.d').trigger("mouseout");
        }, 700);


        $('.hover-block.i-1').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.i-1').trigger("mouseout");
        }, 700);

        $('.hover-block.g').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.g').trigger("mouseout");
        }, 700);


        $('.hover-block.i-2').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.i-2').trigger("mouseout");
        }, 700);

        $('.hover-block.t').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.t').trigger("mouseout");
        }, 700);

        $('.hover-block.a').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.a').trigger("mouseout");
        }, 700);

        $('.hover-block.l').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.l').trigger("mouseout");
        }, 700);

    }, 500);
}
function fillHeader() {
    $('#header').height($(window).height());
}
function isEmailValid(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function initParticles() {
    particlesJS('contact', {
        particles: {
            color: '#fff',
            shape: 'circle',
            opacity: 1,
            size: 3.5,
            size_random: true,
            nb: 175,
            line_linked: {
                enable_auto: true,
                distance: 350,
                color: '#fff',
                opacity: 0.5,
                width: 1,
                condensed_mode: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 600
                }
            },
            anim: {
                enable: true,
                speed: 5.5
            }
        },
        interactivity: {
            enable: true,
            mouse: {
                distance: 250
            },
            detect_on: 'canvas',
            mode: 'grab',
            line_linked: {
                opacity: 0.5
            },
            events: {
                onclick: {
                    push_particles: {
                        enable: true,
                        nb: 4
                    }
                }
            }
        },
        retina_detect: true
    });
}
