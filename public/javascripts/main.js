$(document).ready( function() {

    // Resive video
    scaleVideoContainer();

    initBannerVideoSize('.video-container .poster img');
    initBannerVideoSize('.video-container .filter');
    initBannerVideoSize('.video-container video');
        
    $(window).on('resize', function() {
        scaleVideoContainer();
        scaleBannerVideoSize('.video-container .poster img');
        scaleBannerVideoSize('.video-container .filter');
        scaleBannerVideoSize('.video-container video');
    });

	
	var clickEvent = false;
	$('#myCarousel').on('click', '.nav a', function() {
			clickEvent = true;
			$('.nav li').removeClass('active');
			$(this).parent().addClass('active');		
	}).on('slid.bs.carousel', function(e) {
		if(!clickEvent) {
			var count = $('.nav').children().length -1;
			var current = $('.nav li.active');
			current.removeClass('active').next().addClass('active');
			var id = parseInt(current.data('slide-to'));
			if(count == id) {
				$('.nav li').first().addClass('active');	
			}
		}
		clickEvent = false;
	});
	
		poolGallery = function (e) {
			var ev = e || window.event;
			var target = ev.target || ev.srcElement,
				link = target.src ? target.parentNode : target,
				options = {index: link, event: ev},
				links = document.getElementsByName('poolGallery');
			blueimp.Gallery(links, options);
		};
		
		landscapeGallery = function (e) {
			var ev = e || window.event;
			var target = ev.target || ev.srcElement,
				link = target.src ? target.parentNode : target,
				options = {index: link, event: ev},
				links = document.getElementsByName('landscapeGallery');
			blueimp.Gallery(links, options);
		};
		
		commercialGallery = function (event) {
			event = event || window.event;
			var target = event.target || event.srcElement,
				link = target.src ? target.parentNode : target,
				options = {index: link, event: event},
				links = document.getElementsByName('commercialGallery');
			blueimp.Gallery(links, options);
		};
		
		interiorGallery = function (event) {
			event = event || window.event;
			var target = event.target || event.srcElement,
				link = target.src ? target.parentNode : target,
				options = {index: link, event: event},
				links = document.getElementsByName('interiorGallery');
			blueimp.Gallery(links, options);
		};
		
			blueimp.Gallery([
				{
					title: 'Landscape Design House on the golf course by Marita Zweifler',
					href: 'https://youtu.be/KqeY5WutpL8',
					type: 'text/html',
					youtube: 'KqeY5WutpL8',
				},
				
				{
					title: 'Pool and Landscape Design',
					href: 'https://youtu.be/CQYbZkFmmtQ',
					type: 'text/html',
					youtube: 'CQYbZkFmmtQ'
				}
				
			], {
    container: '#blueimp-video-carousel',
    carousel: true
  });
	
	$(window).scroll( function() {
		var videoDivHeight = $('#homepage-hero').height();
	     console.log("Video div height: " + videoDivHeight);
		if($(window).scrollTop() >= (videoDivHeight - 20)) {
			$('#myNavbar').addClass('one-edge-shadow');
			$('#myNavbar').addClass('gradient');
			$('#myNavbar').removeClass('transparent');
			$('.navbar-inverse .navbar-nav>li>a').css('color','black');
			$('.navbar-inverse .navbar-brand').css('color','black');
			$('.navbar-inverse .navbar-toggle .icon-bar').css('background-color', 'black');
			$('.navbar-collapse.in').css('background-color', '');
			
		} else {
			$('.navbar-collapse.in').css('background-color','black');
			$('.navbar-inverse .navbar-toggle .icon-bar').css('background-color', 'white');
			$('#myNavbar').removeClass('one-edge-shadow');			
			$('#myNavbar').addClass('transparent');
			$('#myNavbar').removeClass('gradient');
			$('.navbar-inverse .navbar-nav>li>a').css('color','white');
			$('.navbar-inverse .navbar-brand').css('color','white');
		}
		
	});
	
	$('.navbar-collapse.in').css('background-color', 'black');
	$('.navbar-inverse .navbar-nav>li').removeClass('active');
	
	var vid = document.getElementById("video");
	vid.playbackRate = 0.8;
	
	$(function () {
	  if (!navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
		$("video").prop('muted', false);
	  }
	});
	
	$("#emailUs").click(function() {
          $("#emailModal").modal('toggle');
    });
	
});


function scaleVideoContainer() {

    var height = $(window).height();
    var unitHeight = parseInt(height) + 'px';
    $('.homepage-hero-module').css('height',unitHeight);

}

function initBannerVideoSize(element){
    
    $(element).each(function(){
        $(this).data('height', $(this).height());
        $(this).data('width', $(this).width());
    });

    scaleBannerVideoSize(element);

}

function scaleBannerVideoSize(element) {

    var windowWidth = $(window).width(),
        windowHeight = $(window).height(),fvideo
    var videoWidth = windowWidth;
    var videoHeight = windowHeight;
    
    console.log(windowHeight);

    $(element).each(function(){
        var videoAspectRatio = $(this).data('height')/$(this).data('width'),
            windowAspectRatio = windowHeight/windowWidth;

        if (videoAspectRatio > windowAspectRatio) {
            videoWidth = windowWidth;
            videoHeight = videoWidth * videoAspectRatio;
            $(this).css({'top' : -(videoHeight - windowHeight) / 2 + 'px', 'margin-left' : 0});
        } else {
            videoHeight = windowHeight;
            videoWidth = videoHeight / videoAspectRatio;
            $(this).css({'margin-top' : 0, 'margin-left' : -(videoWidth - windowWidth) / 2 + 'px'});
        }

        $(this).width(videoWidth).height(videoHeight);

             

    });
}