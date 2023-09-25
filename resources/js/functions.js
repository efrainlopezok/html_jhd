/* JQuery extension for checking existing attributes */
$.fn.hasAttr = function(attr){
    return this.filter("[" + attr + "]").length > 0;
}
jQuery(document).ready(function() {
	/*jQuery('body').on('click', function(){
		if (jQuery('nav.hnav-ruled .dropdown-mega').hasClass('open')) {
			jQuery('.full-body-container').removeClass('hide-cnt');
		}else{
			jQuery('.full-body-container').addClass('hide-cnt');
		}
	});*/
	jQuery('.back-to-blog a').on('click', function(e){
		e.preventDefault();
		window.location.replace(document.referrer);
	});	
	jQuery('.popup-with-zoom-anim').magnificPopup({
		type: 'inline',
		fixedContentPos: true,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,		
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in',
	});
	jQuery(function () {
        jQuery('#datetimepicker12').datepicker({
            inline: true,
            sideBySide: true
        });
    });
	jQuery('.second-section a').mouseover(function() {
		jQuery(this).addClass('active-section');
		jQuery('.second-section').addClass(jQuery(this).attr('bg-section'));
	})
	.mouseout(function() {
		jQuery(this).removeClass('active-section');	
		jQuery('.second-section').removeClass('ss-bg-1');
		jQuery('.second-section').removeClass('ss-bg-2');
		jQuery('.second-section').removeClass('ss-bg-3');
		jQuery('.second-section').removeClass('ss-bg-4');
		jQuery('.second-section').removeClass('ss-bg-5');
	});
	jQuery('.navbar-right .btn-wrapper a').on('click', function(){
		jQuery('.nav-bottom.hnav.hnav-ruled.black-bg').toggleClass('cart-open');
		if (jQuery('.nav-bottom.hnav.hnav-ruled.black-bg').hasClass('cart-open')) {
			jQuery('.full-body-container').addClass('darker');	
		}else{
			jQuery('.full-body-container').removeClass('darker');
		}
		
		jQuery('.search-menu form').removeClass('open-search');
		jQuery('a.search-header').css('opacity',1);
		jQuery('.search-menu form input[type="text"]').blur();
	});
	/*************************
	*	Search Header
	*************************/
	jQuery('a.search-header').on('click', function(e){
		e.preventDefault();
		jQuery(this).css('opacity',0);
		jQuery(this).parent().find('form').addClass('open-search');
		jQuery(this).parent().find('form input[type="text"]').focus();
		jQuery('.full-body-container').addClass('darker');
		jQuery('.hnav.nav-bottom.hnav-ruled').removeClass('cart-open');

		/* fix search bar width*/
		var navWidth = jQuery(this).closest('ul').width();
		if ($(window).width() > 991) {
			navWidth -= 65;
		}
		else {
			navWidth -= 28;
		}
		$(this).parent().find('form').css('max-width', navWidth + 'px');
	});

	// Change form search width when resized
	var windowWidth = $(window).width();
	jQuery(window).resize(function() {
		var currentWidth = $(window).width();
		if(windowWidth != currentWidth && currentWidth >= 768) {
			windowWidth = currentWidth;

			/* fix search bar width*/
			var navWidth = $('.header-block .navbar-nav').width();
			if (currentWidth > 991) {
				navWidth = navWidth - 65;
			}
			else {
				navWidth = navWidth - 28;
			}
			$('.header-block .search-menu form').css('max-width', navWidth + 'px');
		}
	});
	jQuery('a.close-search').on('click', function(e){
		e.preventDefault();
		jQuery('.search-menu form').removeClass('open-search');
		jQuery('a.search-header').css('opacity',1);
		jQuery('.search-menu form input[type="text"]').blur();
		jQuery('.full-body-container').removeClass('darker');
		jQuery('.hnav.nav-bottom.hnav-ruled').removeClass('cart-open');
	});
	jQuery('.navbar-center .dropdown-mega').on('click','a.dropdown-toggle', function(){
		jQuery('.hnav.nav-bottom.hnav-ruled').removeClass('cart-open');
	    if (jQuery(this).parent().hasClass('open')) {
			jQuery('.full-body-container').removeClass('darker');
		}else{
			jQuery('.full-body-container').addClass('darker');			
		}	
	});
	jQuery('.full-body-container,.main-header').on('click', function(){
		jQuery('.full-body-container').removeClass('darker');
		jQuery('.search-menu form').removeClass('open-search');
		jQuery('a.search-header').css('opacity',1);
		jQuery('.search-menu form input[type="text"]').blur();
		jQuery('.hnav.nav-bottom.hnav-ruled').removeClass('cart-open');
	});
	/************************
	*	Faq Accordion
	************************/
	jQuery('.ac-title').on('click', function(){
		var parent = jQuery(this).parent();
		/*Close openned accordions inside data-parent selector*/
		if( parent.hasAttr('data-parent') ) {
			$(parent.attr('data-parent') + ' .custom-accordion').not(parent).find('.ac-content:visible').toggle(500);
		}

		parent.find('.ac-content').toggle(500);
	});
	/***********************
	*	Tabs Single Product
	***********************/
	var tabs_counter = 0;
	jQuery('.navigators-tabs li').each(function(){
		tabs_counter++;
	});
	var final_tab_size = 100/tabs_counter;
	jQuery('.navigators-tabs li').css('width',final_tab_size+'%');
	jQuery('.navigators-tabs li a').on('click', function(e){
		e.preventDefault();
		jQuery('.navigators-tabs li').removeClass('active');
		jQuery(this).parent().addClass('active');
		var div_show = jQuery(this).attr('href');
		jQuery('.content-tabs-ind-content .container-tab-item').removeClass('current-item');
		jQuery(div_show).addClass('current-item');
	});
	jQuery('.navigators-p.nav-next').on('click', function(e){
		e.preventDefault();
		var link_to = jQuery('.navigators-tabs li.active').next().find('a').trigger('click');
	});
	jQuery('.navigators-p.nav-prev').on('click', function(e){
		e.preventDefault();
		var link_to = jQuery('.navigators-tabs li.active').prev().find('a').trigger('click');
	});
	/*********************
	*	Images to show
	*********************/
	jQuery('.img-navs a').on('click', function(e){
		e.preventDefault();
		var src_img = jQuery(this).attr('href');
		jQuery('.image-current img').attr('src', src_img);
	});
	jQuery('.carousel-stationery').bxSlider({
	  pagerCustom: '#bx-pager'
	});

	/*Another image preview type*/
	$('.preview-grid[data-preview] .preview-thumbs a').click(function(e) {
		e.preventDefault();
		$(this).closest('.preview-grid').find('.img-preview img').attr('src', $(this).attr('href'));
	});

	/********************
	*	Filters Btn
	********************/
	jQuery('a.filters-btn-p').on('click', function(e){
		e.preventDefault();
		jQuery('.filters-container').toggle();
	});
	jQuery('a.checkbox-c').on('click', function(e){
		e.preventDefault();
		jQuery('.filters-container').hide();
	});
	jQuery(document).on('click', '.filters-selected span', function(){ 
	    var check_diselect = jQuery(this).attr('c-f');	  	
	  	jQuery('#options input[type="checkbox"]').each(function(){
	  		if (jQuery(this).attr("id") == check_diselect) {
	  			jQuery(this).attr('checked', false);
	  		}
	  	});
	  	jQuery('#options').trigger('change');
	  	jQuery('.checkbox-f').trigger('click');
	  	jQuery(this).remove();
	});
});
jQuery(window).on('load', function(){
	/**************************/
	jQuery('.navbar-collapse').attr('aria-expanded', false);
	jQuery('.full-body-container').removeClass('darker');
	var $container;
	var filters = {};

	  $container = jQuery('#filters-cat');

	  //createContent();

	  var $filterDisplay = jQuery('#filter-display');

	  $container.isotope({
	  	masonry: {
		    gutter: 30
		}
	  });
	  var comboFilter = '';
	  // do stuff when checkbox change
	  jQuery('#options').on( 'change', function( jQEvent ) {
	    var $checkbox = jQuery( jQEvent.target );
	    manageCheckbox( $checkbox );

	    comboFilter = getComboFilter( filters );

	    $filterDisplay.text( comboFilter );
	  });

	  jQuery('.checkbox-f').on('click', function(e){
	  	e.preventDefault();
	  	$container.isotope({
	    	filter: comboFilter,
	    	masonry: {
			    gutter: 30
			}
	    });
	    jQuery('.filters-container').hide();
	    jQuery('.filters-selected').html('');
	    jQuery('.filters-container input[type="checkbox"]:checked').each(function(){
	    	jQuery('.filters-selected').append('<span c-f="'+jQuery(this).next().attr('for')+'">'+jQuery(this).next().text()+'</span>');
	    });
	  });

	/*Product category filters-cat content*/
	var data = {
	  brands: 'brand1 brand2 brand3 brand4'.split(' '),
	  productTypes: 'type1 type2 type3 type4'.split(' '),
	  colors: 'red blue yellow green'.split(' '),
	  sizes: 'uk-size8 uk-size9 uk-size10 uk-size11'.split(' ')
	};

	function createContent() {
	  var brand, productType, color, size;
	  var items = '';
	  // dynamically create content
	  for (var i=0, len1 = data.brands.length; i < len1; i++) {
	    brand = data.brands[i];
	    for (var j=0, len2 = data.productTypes.length; j < len2; j++) {
	      productType = data.productTypes[j];
	        for (var l=0, len3 = data.colors.length; l < len3; l++) {
	        color = data.colors[l];
	        for (var k=0, len4 = data.sizes.length; k < len4; k++) {
	          size = data.sizes[k];
	          var itemHtml = '<div class="item ' + brand + ' ' +
	            productType + ' ' + color + ' ' + size + '">' +
	            '<p>' + brand + '</p>' +
	            '<p>' + productType + '</p>' +
	            '<p>' + size + '</p>' +
	            '</div>';
	            items += itemHtml;
	        }
	      }
	    }
	  }

	  //$container.append( items );
	}


	function getComboFilter( filters ) {
	  var i = 0;
	  var comboFilters = [];
	  var message = [];

	  for ( var prop in filters ) {
	    message.push( filters[ prop ].join(' ') );
	    var filterGroup = filters[ prop ];
	    // skip to next filter group if it doesn't have any values
	    if ( !filterGroup.length ) {
	      continue;
	    }
	    if ( i === 0 ) {
	      // copy to new array
	      comboFilters = filterGroup.slice(0);
	    } else {
	      var filterSelectors = [];
	      // copy to fresh array
	      var groupCombo = comboFilters.slice(0); // [ A, B ]
	      // merge filter Groups
	      for (var k=0, len3 = filterGroup.length; k < len3; k++) {
	        for (var j=0, len2 = groupCombo.length; j < len2; j++) {
	          filterSelectors.push( groupCombo[j] + filterGroup[k] ); // [ 1, 2 ]
	        }

	      }
	      // apply filter selectors to combo filters for next group
	      comboFilters = filterSelectors;
	    }
	    i++;
	  }

	  var comboFilter = comboFilters.join(', ');
	  return comboFilter;
	}

	function manageCheckbox( $checkbox ) {
	  var checkbox = $checkbox[0];

	  var group = $checkbox.parents('.option-set').attr('data-group');
	  // create array for filter group, if not there yet
	  var filterGroup = filters[ group ];
	  if ( !filterGroup ) {
	    filterGroup = filters[ group ] = [];
	  }

	  var isAll = $checkbox.hasClass('all');
	  // reset filter group if the all box was checked
	  if ( isAll ) {
	    delete filters[ group ];
	    if ( !checkbox.checked ) {
	      checkbox.checked = 'checked';
	    }
	  }
	  // index of
	  var index = $.inArray( checkbox.value, filterGroup );

	  if ( checkbox.checked ) {
	    var selector = isAll ? 'input' : 'input.all';
	    $checkbox.siblings( selector ).removeAttr('checked');


	    if ( !isAll && index === -1 ) {
	      // add filter to group
	      filters[ group ].push( checkbox.value );
	    }

	  } else if ( !isAll ) {
	    // remove filter from group
	    filters[ group ].splice( index, 1 );
	    // if unchecked the last box, check the all
	    if ( !$checkbox.siblings('[checked]').length ) {
	      $checkbox.siblings('input.all').attr('checked', 'checked');
	    }
	  }

	}

	/**************************/
});

jQuery(document).ready(function() {
	/* Revealing content and hide trigger element
	----*/
	$('[data-reveal]').each(function(idx, el) {
		$(el).click(function(e) {
			e.preventDefault();
			$(this).closest($(this).data('reveal')).addClass('show');
			$(this).fadeOut();
		});
	});

	/* Auto open popup after page load
	--------------*/
	jQuery('[data-onload-popup]').each(function(idx, el) {
		var randTime = 1000 + Math.floor( Math.random() * 1000 );
		setTimeout(function() {
			
			jQuery.magnificPopup.open({
				items: {
					type: 'inline',
					src: '#' + $(el).attr('id')
				},
				fixedContentPos: true,
				fixedBgPos: true,
				overflowY: 'auto',
				closeBtnInside: true,
				preloader: false,
				midClick: true,
				removalDelay: 300,
				mainClass: 'my-mfp-zoom-in'
			});
		}, randTime);
	});

	img1 = new Image();
    img2 = new Image();
    img3 = new Image();
    img4 = new Image();
    img5 = new Image();

    img1.src = "./resources/images/second-section-1.png";
    img2.src = "./resources/images/second-section-2.png";
    img3.src = "./resources/images/second-section-3.png";
    img4.src = "./resources/images/second-section-4.png";
    img5.src = "./resources/images/second-section-5.png";
});
jQuery(window).on('load', function(){
	var $grid = jQuery('.grid').isotope({
		itemSelector: '.grid-item',
		masonry: {
		    gutter: 30
		}
	});
	jQuery('.filter-button-group').on( 'click', 'button', function() {
	  var filterValue = jQuery(this).attr('data-filter');
	  $grid.isotope({ filter: filterValue });
	});
});
