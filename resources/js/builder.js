 
jQuery(document).ready(function() {
	/****************************
	*	Popup for images preview
	****************************/
	jQuery('.popup-preview-trigger').magnificPopup({
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

	/* preload of images  */
	var imagesPreload = ['resources/images/assembley/b-popup-image.png'],
		imagesLength = imagesPreload.length,
		imgpre;
	for (i = 0; i < imagesLength; i++) {
		imgPre = new Image();
		imgPre.src = imagesPreload[i];
	}
});

/* Variables 
--------------------*/
var inv_size,
	inv_qty,
	inv_style,
	inv_style_detail = [],
	inv_ink_colors = [],
	inv_rsvp_style,
	inv_rsvp_replace,
	inv_rsvp_detail = [],
	inv_paper_style,
	inv_paper_detail = [],
	inv_addon_cards = [],
	inv_addon_counter = 0, /*additional insert card choosed*/
	inv_addon_max_cards = 3,
	inv_embellishment,
	inv_embellishment_color,
	inv_em_detail = [],
	inv_envelope_liner,
	inv_envelope_addressing,
	inv_env_options = [],
	inv_DIY_disccounts = [],
	inv_DIY_options = [],
	inv_addon_services = [],
	inv_turnaround = [];

/* Prices  */
var inv_prices = {
	'flat-no-accent': 2.75,
	'flat-accent': 3.50,
	'flat-2-accent': 4.25,
	'pocketfold-no-accent': 4.75,
	'pocketfold-accent': 5.50,
	/* INK colors */
	'custom_ink_color': 25.00,
	/* RSVP */
	'double-sided': 0.00,
	'blank-envelope': 0.50,
	'printed-address': 1.00,
	'r-single-sided': 0.00,
	'r-double-sided': 0.75,
	'r-sm-single-sided': 0,
	'r-sm-double-sided': 0.75,
	'r-md-single-sided': 0.25,
	'r-md-double-sided': 1.25,
	'r-lg-single-sided': 0.5,
	'r-lg-double-sided': 1.75,

	'alternate-rsvp': 20.00,
	'extra-rsvp': 1.00,
	/* paper selection */
	'cream-luxe': 0.75,
	'white-metallic': 1.00,
	/* Additional insert cards */
	'small-single-sided': 1.00,
	'small-double-sided': 1.75,
	'medium-single-sided': 1.25,
	'medium-double-sided': 2.25,
	'large-single-sided': 1.50,
	'large-double-sided': 2.75,
	/* emebellishments */
	'pocketfold':0.75,
	'pre-punched': 0.75,
	'printed-belly-band': 1.00,
	'ribbon-wrap': 1.25,
	'hanging': 1.5,
	'monogram-tag':1.5,
	/* mailing envelope */
	'env-no-liner': 0.00,
	'env-patterned': 1.25,
	'env-glitter': 1.5,
	'env-no-addressing': 0.00,
	'env-digital': {
		'digital-guest-return-address': 2.00,
		'digital-guest-address-only': 1.25,
		'digital-return-address-only': 0.75,
	},
	'env-address-wraps': {
		'wraps-guest-return-address': 2.25,
		'wraps-return-address-only': 1.5,
	},
};


/* utility functions 
----------------------*/
function isInt(value) {
  var x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

/* Close all color-popups (popovers) when clicking outside 
------------------------------------------------*/
jQuery("body").mousedown(function(e){
	var popup = $(e.target).closest('.builder-popover.in');
	if(popup.length > 0) {
		return;
	}
	$('.popover.builder-popover.in').removeClass('in');
});

/* Update steps nav status to 'active' or 'active completed' 
 * status: 0 active,  1 completed, -1 initial */
function updateStepsStatusNav(status, stepNum, subStepNum) {
	if(subStepNum === undefined) {
		subStepNum = false;
	}

	var subStepSuffix = '',
		statClass = 'active';

	if (subStepNum != false) {
		subStepSuffix = '_' + subStepNum;
	}
	if(status == -1) { 
		statClass = '';
	}
	if(status == 1) { 
		statClass = 'active completed';
	}

	if(status != -1) {
		/* Only current step sub navigation must be visible  */
		$('#sub_steps_nav_wrap ul').addClass('hidden');
		$('#sub_steps_nav_wrap #sub_step_nav_' + stepNum).removeClass('hidden');
	}

	/* Change nav status  */
	if(subStepNum != false) {

		if (status != -1) {
			$('#steps_nav_wrap #step_nav_' + stepNum).addClass('active'); 
			$('#sub_steps_nav_wrap #sub_step_nav_' + stepNum + subStepSuffix).addClass(statClass);

			/* if is teh last substep, mark stepnav as completed and hide substeps-nav */
			if(subStepNum == $('#sub_steps_nav_wrap #sub_step_nav_' + stepNum + ' > li').length) {
				$('#steps_nav_wrap #step_nav_' + stepNum).addClass(statClass);
			}
		}
		else {
			$('#steps_nav_wrap #step_nav_' + stepNum).removeClass();
			$('#sub_steps_nav_wrap #sub_step_nav_' + stepNum + subStepSuffix).removeClass();
		}
	}
	else {
		if (status != -1) {
			$('#steps_nav_wrap #step_nav_' + stepNum).addClass(statClass);
		}	
		else {
			$('#steps_nav_wrap #step_nav_' + stepNum).removeClass();
		}
	}
}

function showStep(stepNum, subStepNum=false, showStepSide) {

	if(showStepSide === undefined) {
		showStepSide = false;
	}

	var subStepSuffix = '';
	if (subStepNum != false) {
		subStepSuffix = '_' + subStepNum;
	}

	$('#steps_main_content #step_content_' + stepNum + subStepSuffix ).removeClass('hidden');

	if(showStepSide) {
		$('#steps_main_content #step_content_' + stepNum ).removeClass('hidden');
		$('#steps_main_content #step_content_' + stepNum + subStepSuffix ).removeClass('hidden');
	}
}

function gotoStep(stepNum, subStepNum) {

	if(subStepNum === undefined) {
		subStepNum = false;
	}

	var subStepSuffix = '';
	if (subStepNum != false) {
		subStepSuffix = '_' + subStepNum;
	}

	updateStepsStatusNav(0, stepNum, subStepNum);
	$('#steps_nav_wrap #step_nav_'+stepNum).removeClass('completed');
	if(subStepNum  !== false ) {
		$('#sub_steps_nav_wrap #sub_step_nav_'+subStepNum).removeClass('completed');
	}

	$('#steps_main_content > div').addClass('hidden');
	$('#steps_main_content > #step_content_' + stepNum + subStepSuffix).removeClass('hidden');

	/* Clear all next sub-steps navigation statuses of current step */
	if(subStepNum != false) {
		for (var j = subStepNum + 1; j <= 5; j++) {
			$('#sub_steps_nav_wrap  #sub_step_nav_' + stepNum + '_' + j).removeClass();
		}
	}

	/* Clear all next steps navigation statuses */
	for (var i = stepNum + 1; i <= 5; i++) {
		for (var j = 1; j <= 5; j++) {
			$('#sub_steps_nav_wrap  #sub_step_nav_' + i + '_' + j).removeClass();
		}

		$('#steps_nav_wrap #step_nav_' + i).removeClass();
	}
}

function changeInvitationPreview(unfoldSrc, foldSrc, size) {
	if(undefined === size) {
		size = false;
	}

	/* unknow size, unfoldSrc & foldSrc is full src */
	if(!size) { 

		if(unfoldSrc != '') {
			$('.builder-preview #preview_col_1 picture > img').attr('src', unfoldSrc);
			$('.builder-preview #first_img_popup img').attr('src', unfoldSrc);
		}
		if(foldSrc != '') {
			$('.builder-preview #second_img_popup img').attr('src', foldSrc);
			$('.builder-preview #preview_col_2 picture > img').attr('src', foldSrc);
		}
	}
	else { /* relative urls to /images/builder/preview/  */
		var prefix = inv_size;

		if(unfoldSrc != '') {
			$('.builder-preview #preview_col_1 picture > img').attr('src', 'resources/images/builder/preview/'+inv_size+'_'+unfoldSrc);
			$('.builder-preview #first_img_popup img').attr('src', 'resources/images/builder/preview/'+inv_size+'_'+unfoldSrc);
		}
		if(foldSrc != '') {
			$('.builder-preview #preview_col_2 picture > img').attr('src', 'resources/images/builder/preview/'+inv_size+'_'+foldSrc);
			$('.builder-preview #second_img_popup img').attr('src', 'resources/images/builder/preview/'+inv_size+'_'+foldSrc);
		}
	}
}

/* Step 1 related functions 
--------------------------------*/

function invitation_qty_change(qtyInput) {
	$('#step_controls_1_1 .step-message').html('');
	$('#step_content_1_1 #inv_qty_title').removeClass('red-code');

	inv_qty = parseInt( qtyInput.value );
	if (inv_qty === '' || isNaN(inv_qty)) {
		$('#step_controls_1_1 .step-message').html('<span class="error">Please enter an integer value</span>');
		$('#step_content_1_1 #inv_qty_title').addClass('red-code');
		return;
	}
	if(inv_qty < 10) {
		$('#step_controls_1_1 .step-message').html('<span class="error">Please select a quantity of 10 or more</span>');
		$('#step_content_1_1 #inv_qty_title').addClass('red-code');
		return;
	}
	if(inv_qty >= 50 && inv_qty % 5 != 0) {
		$('#step_controls_1_1 .step-message').html('<span class="error">Please choose a quantity in increments of 5</span>');
		$('#step_content_1_1 #inv_qty_title').addClass('red-code');
		return;
	}

	$('.pro-right-side-bar #summary_qty >.fl-right').html(inv_qty);
}

function inv_size_picked(size, inviEl) {
	inv_size = size;
	$('#step_content_1_1 .invi-size-block > a').removeClass('el-picked');
	$(inviEl).addClass('el-picked');

	if ('5x7' == inv_size) {
		changeInvitationPreview('resources/images/builder/preview-style-6x6-unfold.png', 
			'resources/images/builder/preview-style-6x6-fold.png');

		$('.pro-right-side-bar #summary_size >.fl-right').html("5'' x 7''");
	}
	else {
		changeInvitationPreview('resources/images/builder/preview-open-closed.png',
			'resources/images/builder/preview-sides.png');

		$('.pro-right-side-bar #summary_size >.fl-right').html("6'' x 6''");
	}
}

function step_1_1_next() {
	inv_qty = parseInt( $('#invitation_qty').val() );
	$('#step_controls_1_1 .step-message').html('');
	$('#step_content_1_1 #inv_size_title').removeClass('red-code');
	$('#step_content_1_1 #inv_qty_title').removeClass('red-code');

	if (inv_qty === '' || isNaN(inv_qty)) {
		$('#step_controls_1_1 .step-message').html('<span class="error">Please enter an integer value</span>');
		$('#step_content_1_1 #inv_qty_title').addClass('red-code');
		return;
	}
	if(inv_qty < 10) {
		$('#step_controls_1_1 .step-message').html('<span class="error">Please select a quantity of 10 or more</span>');
		$('#step_content_1_1 #inv_qty_title').addClass('red-code');
		return;
	}
	if(inv_qty >= 50 && inv_qty % 5 != 0) {
		$('#step_controls_1_1 .step-message').html('<span class="error">Please choose a quantity in increments of 5</span>');
		$('#step_content_1_1 #inv_qty_title').addClass('red-code');
		return;
	}

	if(!inv_size) {
		$('#step_controls_1_1 .step-message').html('<span class="error">Please choose an invitation size</span>');
		$('#step_content_1_1 #inv_size_title').addClass('red-code');
		return;
	}

	/* summary update */
	$('.pro-right-side-bar #summary_qty >.fl-right').html(inv_qty);
	updateTotalSummary();

	updateStepsStatusNav(1,1, 1);
	$('#steps_main_content #step_content_1_1').addClass('hidden');
	showStep(1, 2);
	updateStepsStatusNav(0,1,2);

	if(!isEmpty(inv_style)) {
		$('.builder-preview').removeClass('hidden');
	}
}

/* Step 1_2 invitation style  */

function style_selected(style, el) {
	inv_style = style;
	
	$('#style_select_color_container').removeClass('hidden');
	$('#style_select_color > div').addClass('hidden');
	$('#inv_styles_to_pick >div .el-opt-img, #inv_styles_to_pick .el-swap-img, #inv_styles_pocketfold .el-swap-img').removeClass('el-picked');
	$(el).addClass('el-picked');

	if(style == 'flat-no-accent') {
		$('#style_color_mailing_envelope').removeClass('hidden');
		inv_style_detail['style-text'] = 'flat panel, no accent layer';
	}
	else if (style == 'flat-accent') {
		$('#style_color_mailing_envelope, #style_color_accent').removeClass('hidden');
		inv_style_detail['style-text'] = 'flat panel, 1 accent layer';
	}
	else if(style == 'flat-2-accent') {
		$('#style_color_inner_accent, #style_color_outer_accent, #style_color_mailing_envelope').removeClass('hidden');
		inv_style_detail['style-text'] = 'flat panel, 2 accent layers';
	}
	else if (style == 'pocketfold-no-accent') {
		$('#style_color_pocketfold, #style_color_mailing_envelope').removeClass('hidden');
		inv_style_detail['style-text'] = 'pocketfold, no accent layer';

		changeInvitationPreview('unfold-pocketfold-no-accent.png', '', inv_size);
	}
	else if(style == 'pocketfold-accent') {
		$('#style_color_pocketfold, #style_color_accent,#style_color_mailing_envelope').removeClass('hidden');
		inv_style_detail['style-text'] = 'pocketfold, 1 accent layer';

		changeInvitationPreview('unfold-pocketfold-accent.png', '', inv_size);
	}

	$('.builder-preview').removeClass('hidden');

	/* Reset selection of colors */
	$('#step_content_1_2 #style_select_color .select-color-evnvo > a').removeAttr('style');
	inv_style_detail['colors'] = undefined;

	/* reset popup selection colors */
	$('#step_content_1_2 .inv-color-name').html('Color Name');
	$('#step_content_1_2 .inv-color-name').removeAttr('old-color-name');
	$('#step_content_1_2 .builder-popover').removeClass('in');

	$('#step_content_1_2 .builder-popover .invitation-colors-list ul li, '
		+'#step_content_1_2 .builder-popover .foil-glitter-cardstock ul li').removeClass('active');

	updateTotalSummary();
}

function openStyleColorPopover(controlId, ctrlEl) {
	$('#step_content_1_2 #style_select_color a').removeClass('style-color-btn-current');
	ctrlEl.classList.add('style-color-btn-current');

	$('#step_content_1_2 .builder-popover').removeClass('in'); 
	$('#step_content_1_2 .builder-popover .popover-title a').removeClass('hidden');

	if ('mailing-envelope' == controlId) {
		$('#style_color_popover-mail-env').addClass('in');
	}
	else if ('accent' == controlId) {
		$('#style_color_popover-accent').addClass('in');
	}
	else if ('outer-accent' == controlId) {
		$('#style_color_popover-outer-accent').addClass('in');
	}
	else if ('inner-accent' == controlId) {
		$('#style_color_popover-inner-accent').addClass('in');
	}
	else if ('pocketfold' == controlId) {
		$('#style_color_popover-pocketfold').addClass('in');
	}
}

/* selection of colors on popovers */
jQuery(document).ready(function() {
	$('#step_content_1_2 .builder-popover .invitation-colors-list ul li, '
		+'#step_content_1_2 .builder-popover .foil-glitter-cardstock ul li').click(function(e) {
		e.stopPropagation();
		$(this).closest('.popover-content').find(' ul > li').removeClass('active');
		this.classList.add('active');

		/* check if color selection or image color selection */
		var imageColor = $(this).find('img').length > 0,
			currentEl = $('#step_content_1_2 .style-color-btn-current');

		if(!imageColor) 
		{
			var selectedColor = this.querySelector('a > span').style.background;
			document.querySelector('#step_content_1_2 .style-color-btn-current').style = 'background: '+selectedColor+';';
		}
		else {
			var selectedImgBkc = this.querySelector('img').getAttribute('src');
			document.querySelector('#step_content_1_2 .style-color-btn-current').style = 'background: url('+selectedImgBkc+') 0 0 no-repeat;background-size:cover;';
		}

		$(this).closest('.builder-popover').removeClass('in');

		/* Color name */
		var colorName = $(this).find('a').attr('data-color');
		$(this).closest('.popover-content').find('.inv-color-name').html(colorName);
		$(this).closest('.popover-content').find('.inv-color-name').attr('old-color-name', colorName);
		currentEl.attr('data-color-name', colorName);

		updateTotalSummary();
	});

	/* Hover of colors */
	$('#step_content_1_2 .builder-popover .invitation-colors-list ul li > a, '
		+'#step_content_1_2 .builder-popover .foil-glitter-cardstock ul li > a').hover(function(e) {
			var colorName = $(this).attr('data-color'),
			    oldColorName = $(this).closest('.popover-content').find('.inv-color-name').html();

			$(this).closest('.popover-content').find('.inv-color-name').attr('old-color-name', oldColorName);
			$(this).closest('.popover-content').find('.inv-color-name').html(colorName);
		},
		function(e) {
			var oldColorName = $(this).closest('.popover-content').find('.inv-color-name').attr('old-color-name');
			if(oldColorName) {
				$(this).closest('.popover-content').find('.inv-color-name').html(oldColorName);
			}
	});
});

/* prev step */

function step_1_2_prev() {
	$('.builder-preview').addClass('hidden');
	gotoStep(1,1);
}

function updateStep1_2_SummaryDetail() {
	/* store colors details for summary */
	if(inv_style !== undefined) {
		var colorChoices = document.querySelectorAll('#step_content_1_2 #style_select_color .select-color-evnvo:not(.hidden) > a');
		inv_style_detail['colors'] = [];
		[].forEach.call(colorChoices, function(el) {
			if(el.style.background) 
			{
				inv_style_detail['colors'].push({ 
					text: (el.innerHTML.trim() + ' color').toUpperCase(), 
					bgColor: el.style.background,
					colorName: el.getAttribute('data-color-name')
				});
			}
		});
	}
}

/* next step */
function step_1_2_next() {
	$('#step_controls_1_2 .step-message').html('');
	$('#step_content_1_2 #style_flat_title').removeClass('red-code');
	$('#step_content_1_2 #style_pocketfold_title').removeClass('red-code');

	if (inv_style === undefined) {
		$('#step_controls_1_2 .step-message').html('<span class="error">Please choose an style</span>');
		$('#step_content_1_2 #style_flat_title').addClass('red-code');
		$('#step_content_1_2 #style_pocketfold_title').addClass('red-code');
		return;
	}

	/* Colors selection */
	$('#style_select_color_title').removeClass('red-code');
	var unselectedColors = $('#step_content_1_2 #style_select_color .select-color-evnvo:not(.hidden) >a:not([style])').length;
	if (unselectedColors > 0) {
		$('#style_select_color_title').addClass('red-code');
		$('#step_controls_1_2 .step-message').html('<span class="error">Please complete all highlighted fields</span>');
		return;
	}

	updateTotalSummary();

	updateStepsStatusNav(1,1, 2); /* completion current step nav */
	$('#steps_main_content #step_content_1_2').addClass('hidden');
	showStep(1, 3);
	updateStepsStatusNav(0,1,3);
}

/* Step 1_3 inv ink colors */

/* Ink selection on step 3 up to 5 selections  */
jQuery('#step_content_1_3 .invitation-colors-list li').click(function() {
	var active = this.classList.contains('active'),
		totalSelected = $('#step_content_1_3 .invitation-colors-list li.active').length;

	if( !active && totalSelected < 5 ) {
		$(this).toggleClass('active');
	}
	else if(active) {
		$(this).toggleClass('active');
	}

	inv_ink_colors['colors'] = [];
	inv_ink_colors['custom-color'] = undefined;

	var colorsSelected = document.querySelectorAll('#step_content_1_3 .invitation-colors-list li.active a > span');
	[].forEach.call(colorsSelected, function(span) {
		inv_ink_colors['colors'].push(span.style.background);
	});

	$('#step_content_1_3 #custom_ink_color_btn').removeClass('el-picked');

	inv_ink_colors['detail'] = undefined;
	
	updateStep1_3Summary();
});

function click_custom_ink_color(btnCustom) {
	inv_ink_colors['colors'] = undefined;
	inv_ink_colors['custom-color'] = 'custom color';

	btnCustom.classList.add('el-picked');
	$('#step_content_1_3 .invitation-colors-list li').removeClass('active');

	var obj  = {cost: 0, summary: ''};
	obj.cost = inv_prices['custom_ink_color'];
	obj.summary += '<p>INK COLORS: ';
	obj.summary += inv_ink_colors['custom-color'] + '<span class="summ-price">$'+obj.cost.toFixed(2)+'</span>';
	obj.summary += '</p>';
	inv_ink_colors['detail'] = obj;
	
	updateStep1_3Summary();
}

function updateStep1_3Summary() {
	/* prepare summary */
	var obj = {cost: 0, summary: ''};
	if(inv_ink_colors['custom-color'] !== undefined || inv_ink_colors['colors'] !== undefined) {
		obj.summary += '<p>INK COLORS: '; 
		if(!isEmpty(inv_ink_colors['colors'])) {
			inv_ink_colors['colors'].forEach(function(bgColor, idx) {
				obj.summary += '<span class="color-o" style="background-color: '+bgColor.replace(/"|'/, '')+';"></span> ';
			});
		}else  {
			obj.cost = inv_prices['custom_ink_color'];
			obj.summary += inv_ink_colors['custom-color'] + '<span class="summ-price">$'+obj.cost.toFixed(2)+'</span>';
		}
		obj.summary += '</p>';
	}
	inv_ink_colors['detail'] = obj;

	updateTotalSummary();
}

function step_1_3_next() {
	$('#step_controls_1_3 .step-message').html('');
	$('#step_content_1_3 #pick_ink_color_title').removeClass('red-code');

	if (inv_ink_colors['custom-color'] == undefined 
		&& (inv_ink_colors['colors'] == undefined || inv_ink_colors['colors'].length == 0)) {
		$('#step_controls_1_3 .step-message').html('<span class="error">Please choose at least one ink color</span>');
		$('#step_content_1_3 #pick_ink_color_title').addClass('red-code');
		return;
	}

	updateStep1_3Summary();

	updateStepsStatusNav(1,1, 3);
	$('#steps_main_content #step_content_1_3').addClass('hidden');
	showStep(1, 4);
	updateStepsStatusNav(0,1,4);
}

/* Step 1_4 rsvp functions */

function pick_rsvp(type, el) {
	$('#rsvp_options_1 >div, #rsvp_options_2 > div:first-child').addClass('hidden');
	$('#step_content_1_4 .pick-your-style-top .el-opt-img, #step_content_1_4 .pick-your-style-top .el-swap-img').removeClass('el-picked');
	$('#step_content_1_4 .pick-your-style-bottom').removeClass('hidden'); /* bottom line */
	$('#step_content_1_4 #extra_rsvp_card').addClass('hidden');
	$(el).addClass('el-picked');

	// reset akternative cards & color selection
	$('#rsvp_alternate select, #extra_rsvp_card select').each(function(idx, el) {
		el.selectedIndex = 0;
	});
	$('#rsvp_color_popover .invitation-colors-list li').removeClass('active');
	$('#rsvp_color_popover .inv-color-name').html('Color Name');

	// deselect any suboption
	$('#rsvp_options_1 .el-opt-black:not(.el-unselect)').removeClass('el-picked');
	document.querySelector('#step_content_1_4 #rsvp_color .el-opt-black').removeAttribute('style');

	if(type == 'double-sided') {
		$('#rsvp_stamping_service, #rsvp_postcard_stamp, #rsvp_alternate').removeClass('hidden');
		inv_rsvp_detail['text'] = 'double sided card & envelope with printed return address';
	}
	else if(type == 'blank-envelope') {
		$('#rsvp_color, #rsvp_alternate').removeClass('hidden');
		inv_rsvp_detail['text'] = 'single sided card & envelope with blank envelope';
	}
	else if(type == 'printed-address') {
		$('#rsvp_color, #rsvp_envelope_stamping_service, #rsvp_first_class, #rsvp_alternate').removeClass('hidden');
		inv_rsvp_detail['text'] = 'single sided card & envelope with printed return address';
	}

	/* restore replace card size dropdown */
	$('#step_content_1_4 .el-dropdown >button').removeClass('el-picked');
	$('#step_content_1_4 .el-dropdown >button').html('SELECT SIZE');

	inv_rsvp_style = type;
	inv_rsvp_replace = undefined;
	inv_rsvp_detail['style_price'] = inv_prices[type];

	inv_rsvp_detail['options'] = {
		stamping_service: undefined,
		envelope_color: undefined,
		alternate_rsvp: undefined,
		extra_rsvp: undefined
	};
	
	updateRsvpSummary();
}

function rsvp_printed_addr_priced_option(el,addedPrice, addedDesc, plusEachPrice) {
	inv_rsvp_detail['options']['stamping_service'] = {
		text: el.innerHTML,
		price: addedPrice,
		description: addedDesc,
		plus_each_price: plusEachPrice,
	};
		
	$('#rsvp_options_1 .el-opt-black:not(.el-unselect)').removeClass('el-picked');
	$(el).addClass('el-picked');

	updateRsvpSummary();
}

function rsvp_single_sided_printed_option(el,addedPrice, addedDesc, plusEachPrice) {
	inv_rsvp_detail['options']['stamping_service'] = {
		text: el.innerHTML,
		price: addedPrice,
		description: addedDesc,
		plus_each_price: plusEachPrice,
	};

	$('#rsvp_options_1 .el-opt-black:not(.el-unselect)').removeClass('el-picked');
	$(el).addClass('el-picked');

	updateRsvpSummary();
}

function rsvp_replace_size(el, type) { 
	var button = $('#step_content_1_4 .el-dropdown >button');
	button.html($(el).html());
	button.addClass('el-picked');

	$('#step_content_1_4 .pick-your-style-bottom').addClass('hidden');
	$('#rsvp_options_1 >div, #rsvp_options_2 > div').addClass('hidden');
	$('#step_content_1_4 .pick-your-style-top .el-opt-img, #step_content_1_4 .pick-your-style-top .el-swap-img').removeClass('el-picked');

	$('#rsvp_options_1 .el-opt-black').removeClass('el-picked');

	// reset akternative cards & color selection
	$('#rsvp_alternate select, #extra_rsvp_card select').each(function(idx, el) {
		el.selectedIndex = 0;
	});
	$('#rsvp_color_popover .invitation-colors-list li').removeClass('active');
	$('#rsvp_color_popover .inv-color-name').html('Color Name');

	var elClone = $(el).clone();
	elClone.find('span').remove();

	inv_rsvp_style = 'replace-card';
	inv_rsvp_replace = button.html();
	inv_rsvp_detail['style_price'] = inv_prices[type];
	inv_rsvp_detail['text'] = elClone.get(0).innerHTML.replace('<br>', ', ');

	inv_rsvp_detail['options'] = undefined;

	updateRsvpSummary();
}

/* selection of rsvp color */
jQuery(document).ready(function($) {
	$('#rsvp_color_popover .invitation-colors-list li').click(function() {
		var popover = $(this).closest('.builder-popover');
		var container = $(this).closest('.invitation-colors-list ');
		var selectedColor = $(this).find('a > span').get(0).style.background,
			rsvpColorBtn = $('#step_content_1_4 #rsvp_color .el-opt-black');

		container.find(' ul li').removeClass('active');
		$(this).addClass('active');

		document.querySelector('#step_content_1_4 #rsvp_color .el-opt-black').style.background = selectedColor;
		popover.removeClass('in');

		inv_rsvp_detail['options']['envelope_color'] = {
			color: rgb2hex(selectedColor),
			text: 'rsvp envelope'
		};

		/* Color name */
		var colorName = $(this).find('a').attr('data-color');
		$(this).closest('.popover-content').find('.inv-color-name').html(colorName);
		$(this).closest('.popover-content').find('.inv-color-name').attr('old-color-name', colorName);
		rsvpColorBtn.attr('data-color-name', colorName);

		inv_rsvp_detail['options']['envelope_color']['colorName'] = colorName;

		updateRsvpSummary();
	});

	/* Hover of colors */
	$('#rsvp_color_popover .invitation-colors-list li a').hover(function(e) {
			var colorName = $(this).attr('data-color'),
			    oldColorName = $(this).closest('.popover-content').find('.inv-color-name').html();

			$(this).closest('.popover-content').find('.inv-color-name').attr('old-color-name', oldColorName);
			$(this).closest('.popover-content').find('.inv-color-name').html(colorName);
		},
		function(e) {
			var oldColorName = $(this).closest('.popover-content').find('.inv-color-name').attr('old-color-name');
			if(oldColorName) {
				$(this).closest('.popover-content').find('.inv-color-name').html(oldColorName);
			}
	});
});

function alternate_card_versions_change(inputEL) {
	var value = inputEL.options[inputEL.selectedIndex].value;
	if(value !== '') {
		$('#step_content_1_4 #extra_rsvp_card').removeClass('hidden');
		inv_rsvp_detail['options']['alternate_rsvp'] = {
			price: inv_prices['alternate-rsvp'],
			qty: value,
		}
	}
	else {
		$('#step_content_1_4 #extra_rsvp_card').addClass('hidden');
		inv_rsvp_detail['options']['extra_rsvp'] = undefined;
		inv_rsvp_detail['options']['alternate_rsvp'] = undefined;

		$('#extra_rsvp_card select').get(0).selectedIndex = 0;
	}

	updateRsvpSummary();
}

function extra_rsvp_cards_change(inputEl) {
	var value = inputEl.options[inputEl.selectedIndex].value;
	if(value !== '') {
		inv_rsvp_detail['options']['extra_rsvp'] = {
			price: inv_prices['extra-rsvp'],
			qty: value
		}
	}
	else {
		inv_rsvp_detail['options']['extra_rsvp'] = undefined;
	}

	updateRsvpSummary();
}

function updateRsvpSummary() {
	/* prepare summary */
	inv_rsvp_detail['total_cost'] = 0;
	inv_rsvp_detail['summary'] = '<p> RSVP STYLE: <i> ' + inv_rsvp_detail['text'];
	if(inv_rsvp_detail['style_price']) {
		var partialCost = inv_rsvp_detail['style_price'] * inv_qty;
		inv_rsvp_detail['summary'] += '[+$'+inv_rsvp_detail['style_price'].toFixed(2)+' ea]';

		inv_rsvp_detail['total_cost'] = partialCost; 
	}
	inv_rsvp_detail['summary'] += '</i>';

	/* RSVP sub otpions */
	if (!isEmpty(inv_rsvp_detail['options'])) {
		var obj = null,
			partialPrice = 0,
			auxPrice = 0;

		/* Envelope color */
		if(!isEmpty(inv_rsvp_detail['options']['envelope_color'])) 
		{
			obj = inv_rsvp_detail['options']['envelope_color'];
			inv_rsvp_detail['summary'] += '<br> <i>';
			inv_rsvp_detail['summary'] += obj.text + ' <span class="color-o" style="background: '+obj.color+';"></span>';
			inv_rsvp_detail['summary'] += '</i>';
		}

		/* Stamping service */
		if(!isEmpty(inv_rsvp_detail['options']['stamping_service'])) 
		{
			obj = inv_rsvp_detail['options']['stamping_service'];

			inv_rsvp_detail['summary'] += '<br> <i>';
			inv_rsvp_detail['summary'] += obj.text;
			if(obj.price != 0) {
				partialPrice += obj.price;
				inv_rsvp_detail['summary'] += ' [+$'+obj.price.toFixed(2)+'] ' + obj.description ;

				if(obj.plus_each_price) {
					auxPrice = obj.plus_each_price * inv_qty;
					partialPrice += auxPrice;
					inv_rsvp_detail['summary'] += ', [+$'+obj.plus_each_price+' ea]';
				}

			}
			inv_rsvp_detail['summary'] += '</i>';
			inv_rsvp_detail['total_cost'] += partialPrice;
		}

		/* Alternate rsvp cards */
		if(!isEmpty(inv_rsvp_detail['options']['alternate_rsvp'])) 
		{
			obj = inv_rsvp_detail['options']['alternate_rsvp'];
			partialPrice = obj.price * obj.qty;

			inv_rsvp_detail['summary'] += '<br> <i> additional versions';
			inv_rsvp_detail['summary'] += ' ' + obj.qty + ', [+$'+obj.price.toFixed(2)+' ea]';
			inv_rsvp_detail['summary'] += '</i>';
			inv_rsvp_detail['total_cost'] += partialPrice;
		}

		/* Extra rsvp cards */
		if(!isEmpty(inv_rsvp_detail['options']['extra_rsvp'])) 
		{
			obj = inv_rsvp_detail['options']['extra_rsvp'];
			partialPrice = obj.price * obj.qty;

			inv_rsvp_detail['summary'] += '<br> <i> extra rsvp cards, without envelopers';
			inv_rsvp_detail['summary'] += ', ' + obj.qty + ', [+$'+obj.price.toFixed(2)+' ea]';
			inv_rsvp_detail['summary'] += '</i>';
			inv_rsvp_detail['total_cost'] += partialPrice;
		}
	}

	if (inv_rsvp_detail['total_cost'] > 0) {
		inv_rsvp_detail['summary'] += '<span class="summ-price">$'+inv_rsvp_detail['total_cost'].toFixed(2)+'</span>';
	}
	inv_rsvp_detail['summary'] += '</p>';

	updateTotalSummary();
}

function step_1_4_validate() {
	$('#step_controls_1_4 .step-message').html('');
	$('#step_content_1_4 .pick-title').removeClass('red-code');

	if(inv_rsvp_style == undefined) {
		$('#step_controls_1_4 .step-message').html('<span class="error">Please select a RSVP style</span>');
		$('#step_content_1_4 .pick-title').addClass('red-code');
		return false;
	}
	else if(inv_rsvp_style !== 'replace-card') {
		if(inv_rsvp_style == 'double-sided' && inv_rsvp_detail['options'].stamping_service == undefined ) {
			$('#step_controls_1_4 .step-message').html('<span class="error">Complete all highlighted fields</span>');
			$('#step_content_1_4 .pick-title').addClass('red-code');
			return false;
		}
		else if(inv_rsvp_style == 'blank-envelope' && inv_rsvp_detail['options'].envelope_color == undefined) {
			$('#step_controls_1_4 .step-message').html('<span class="error">Complete all highlighted fields</span>');
			$('#step_content_1_4 .pick-title').addClass('red-code');
			return false;
		}
		else if(inv_rsvp_style == 'printed-address' && (inv_rsvp_detail['options'].envelope_color == undefined 
			|| inv_rsvp_detail['options'].stamping_service == undefined)) {
			$('#step_controls_1_4 .step-message').html('<span class="error">Complete all highlighted fields</span>');
			$('#step_content_1_4 .pick-title').addClass('red-code');
			return false;
		}
	}
	return true;
}

function step_1_4_next() {
	
	if (!step_1_4_validate()) {
		return;
	}

	updateRsvpSummary();

	updateStepsStatusNav(1, 1,4); /* mark current step nav as completed  */
	$('#steps_main_content #step_content_1_4').addClass('hidden');
	showStep(1, 5);
	updateStepsStatusNav(0,1,5);  /* mark next step nav as current */
}

/* Step 1_5 Paper Selection functions */

$(document).ready(function() {
    $('.image-popup-no-margins').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: true,
        fixedContentPos: true,
        mainClass: 'mfp-no-margins mfp-with-zoom', 
        image: {
            verticalFit: true
        },
        closeMarkup: '<button title="%title%" class="mfp-close" style="position: absolute; top: 30px; right: 3px;opacity:1;"><img src="resources/images/assembley/popup-close-btn.png" width="11" height="11" style="cursor: pointer;"/></button>',
        zoom: {
            enabled: true,
            duration: 300 
        }
    });
});

function paper_selection(elClick, paperStyle) {
	$('#step_content_1_5 .el-opt-img, #step_content_1_5 .el-opt-img').removeClass('el-picked');
	$(elClick).addClass('el-picked');
	inv_paper_style = paperStyle;

	if('smooth-white' == paperStyle) {
		inv_paper_detail['text'] = '130# smooth white <br>[include]';
	}
	else if('smooth-cream' == paperStyle) {
		inv_paper_detail['text'] = '130# smooth cream <br>[include]';
	}
	else if('signature-white' == paperStyle) {
		inv_paper_detail['text'] = '130# signature white <br>[include]';
	}
	else if('signature-cream' == paperStyle) {
		inv_paper_detail['text'] = '130# signature cream <br>[include]';
	}
	else if('linen-white' == paperStyle) {
		inv_paper_detail['text'] = '100# linen white <br>[include]';
	}
	else if('linen-cream' == paperStyle) {
		inv_paper_detail['text'] = '100# linen cream <br>[include]';
	}
	else if('cream-luxe' == paperStyle) {
		inv_paper_detail['text'] = '111# cream luxe <br>';
	}
	else if('white-metallic' == paperStyle) {
		inv_paper_detail['text'] = '137# white metallic <br>';
	}
	inv_paper_detail['style_price'] = inv_prices[paperStyle];

	updatePaperSummary();
}

function updatePaperSummary() {
	/* prepare summary */
	inv_paper_detail['total_cost'] = 0;

	inv_paper_detail['summary'] = '<p>PAPER SELECTION: <i>' + inv_paper_detail['text'];

	if(inv_paper_detail['style_price'] != undefined) {
		var partialCost = inv_paper_detail['style_price'] * inv_qty;
		inv_paper_detail['summary'] += '[+$'+inv_paper_detail['style_price'].toFixed(2)+' ea] </i>';
		inv_paper_detail['summary'] += '<span class="summ-price">$'+partialCost.toFixed(2)+'</span>';
		inv_paper_detail['total_cost'] = partialCost;
	}
	else {
		inv_paper_detail['summary'] += '</i>';
	}
	inv_paper_detail['summary'] += '</p>';
	updateTotalSummary();
}

function step_1_5_next() {
	$('#step_content_1_5 .pick-title').removeClass('red-code');
	$('#step_controls_1_5 .step-message').html('');

	if(inv_paper_style == undefined) {
		$('#step_controls_1_5 .step-message').html('<span class="error">Please choose a paper style</span>');
		$('#step_content_1_5 .pick-title').addClass('red-code');
		return;
	}

	updatePaperSummary();

	updateStepsStatusNav(1, 1,5); 
	$('#steps_main_content #step_content_1_5').addClass('hidden');
	$('#sub_steps_nav_wrap #sub_step_nav_1').addClass('hidden');
	showStep(2);
	updateStepsStatusNav(0,2,false); 
}

/* Step 2 Insert cards related functions 
----------------------------------*/

function addon_card_selection(el, addonInsertCard, price) {
	$('#step_content_2 .insert-select > a').removeClass('active');
	$('#step_content_2 .main-insert-detail').addClass('hidden');
	$('#step_content_2 .main-insert-detail .insert-sided').addClass('hidden');
	$('#step_content_2 .btn-none > a').removeClass('el-picked');

	if(addonInsertCard == false) {
		inv_addon_cards['size'] = 'none';
		inv_addon_cards['side'] = undefined;
		inv_addon_cards['qty'] = undefined;
		inv_addon_cards['addins'] = undefined;
		el.classList.add('el-picked');

		updateStep2Summary();
		return;
	}

	$(el).addClass('active');

	switch(addonInsertCard) {
		case 'sm-single-sided': case 'sm-double-sided':
			$('#step_content_2 #small_inserts, #step_content_2 #small_inserts > .insert-add-ins').removeClass('hidden');
			inv_addon_cards['qty'] = parseInt($('#step_content_2 #addon-sm-qty').val());
			break;
		case 'md-single-sided': case 'md-double-sided':
			$('#step_content_2 #medium_inserts').removeClass('hidden');
			inv_addon_cards['qty'] = parseInt($('#step_content_2 #addon-md-qty').val());
			break;
		case 'lg-single-sided': case 'lg-double-sided':
			$('#step_content_2 #large_inserts').removeClass('hidden');
			inv_addon_cards['qty'] = parseInt($('#step_content_2 #addon-lg-qty').val());
			break;
	}

	inv_addon_cards['size'] = el.getAttribute('data-size');
	inv_addon_cards['bounds'] = el.getAttribute('data-bounds');
	inv_addon_cards['each_price'] = price;
	inv_addon_cards['side'] = addonInsertCard.replace(/sm-|md-|lg-/i, '');
	inv_addon_cards['side'] = inv_addon_cards['side'].replace(/-/i, ' ');
	inv_addon_cards['addins'] = undefined;
	inv_addon_counter = 1;

	// Unmark/Mark current addins wrap
	$('#small_inserts .addins_cards_wrap, #medium_inserts .addins_cards_wrap, #large_inserts .addins_cards_wrap').removeClass('current_addins');
	$('#'+inv_addon_cards['size']+'_inserts .addins_cards_wrap').addClass('current_addins');

	updateStep2Summary();
}

function closeAddonQtyOption(el) {
	$('#step_content_2 .insert-select > a').removeClass('active');
	$(el).closest('.main-insert-detail').addClass('hidden');

	inv_addon_cards['size'] = undefined;
	inv_addon_cards['side'] = undefined;
	inv_addon_cards['qty'] = undefined;
	inv_addon_cards['addins'] = undefined;
	inv_addon_counter = 1;

	updateStep2Summary();
}

function addon_card_qty_changed(qtyInput) {
	var id = qtyInput.getAttribute('id'),
		qty = parseInt(qtyInput.value),
		validResult = validateAddinQty(qty);

	if( validResult !== true)
	{
		$(qtyInput).closest('.insert-detail-row').find('.quan-label').addClass('red-code');
		qtyInput.setAttribute('title', validResult);
	}
	else {
		$(qtyInput).closest('.insert-detail-row').find('.quan-label').removeClass('red-code');
		qtyInput.removeAttribute('title');
	}
	
	if ('addon-sm-qty' == id || 'addon-md-qty' == id || 'addon-lg-qty' == id) {
		inv_addon_cards['qty'] = qty;
	}

	updateStep2Summary();
}

/* Plus button adding click */
function addon_addins_click(plusBtn) {
	if(inv_addon_counter >= inv_addon_max_cards) {
		return;
	}
	var insertSidedEl = $('#step_content_2 .addins_cards_wrap.current_addins .insert-sided.hidden').first();

	insertSidedEl.removeClass('hidden');
	inv_addon_counter += 1;

	if(inv_addon_cards['addins'] == undefined) {
		inv_addon_cards['addins'] = [
			{
				'side': undefined,
				'qty': undefined,
				'ea_price': undefined,
			},
			{
				'side': undefined,
				'qty': undefined,
				ea_price: undefined,
			},
			{ /* up to four case */
				'side': undefined,
				'qty': undefined,
				ea_price: undefined,
			}
		];
	}

	var sideInput = insertSidedEl.find('.input-addin-side'),
		qtyInput  = insertSidedEl.find('.input-addin-qty');

	// set values for inputs
	qtyInput.val(inv_qty);
	sideInput.selectedIndex = 0;

	var addinIdx = insertSidedEl.attr('data-addin-idx');
	inv_addon_cards['addins'][addinIdx]['side'] = sideInput.val();
	inv_addon_cards['addins'][addinIdx]['qty'] = inv_qty;
	inv_addon_cards['addins'][addinIdx]['ea_price'] = inv_prices[inv_addon_cards['size']+'-single-sided'];

	updateStep2Summary();
}

function changeAddinQty(cardIdx,input) {
	inv_addon_cards['addins'][cardIdx]['qty'] = parseInt(input.value);
	// validate qty
	var valid = validateAddinQty(inv_addon_cards['addins'][cardIdx]['qty'])
	if( valid !== true)
	{
		$(input).closest('.insert-detail-row').find('.quan-label').addClass('red-code');
		input.setAttribute('title', valid);
	}
	else {
		$(input).closest('.insert-detail-row').find('.quan-label').removeClass('red-code');
		input.removeAttribute('title');
	}
	updateStep2Summary();
}

function changeAddinSide(cardIdx,select) {
	inv_addon_cards['addins'][cardIdx]['side'] = select.value;
	inv_addon_cards['addins'][cardIdx]['ea_price'] = inv_prices[inv_addon_cards['size']+'-'+select.value.replace(' ', '-')];
	updateStep2Summary();
}

function cancelAddinCard(cardIdx, el) {
	inv_addon_cards['addins'][cardIdx] = {
			side: undefined,
			qty: undefined
	};
	inv_addon_counter -= 1;
	updateStep2Summary();
}

function validateAddinQty(qty) {
	if(isNaN(qty) || qty < 10) {
		return 'invalid quantity';
	}
	if(inv_qty < 50 && qty < inv_qty) {
		return 'quantity must be greater than ' + inv_qty;
	}
	else if(inv_qty >= 50 && qty < 50) {
		return 'quantity must be greater than 50';
	}
	else if(qty >= 50 && qty % 5 != 0) {
		return 'quantity must be in increments of 5';
	}
	return true;
}

function updateStep2Summary() {
	var summaryHTML = '<div class="price-summ-item"> <h6>Step 2</h6>',
		totalPrice  = 0;
	summaryHTML += '<p>INSERT CARD: <br>';

	if (inv_addon_cards['size'] == 'none') {
		summaryHTML += ' &nbsp; <i>none</i>';
	}
	else if (inv_addon_cards['size'] !== undefined) {
		var partialPrice = inv_addon_cards['each_price'] * inv_addon_cards['qty'];
		summaryHTML += ' <i>'+inv_addon_cards['bounds'];
		summaryHTML += ' '+inv_addon_cards['size'];
		summaryHTML += ', '+inv_addon_cards['side'];
		summaryHTML += ', '+inv_addon_cards['qty'];
		summaryHTML += ' [+$'+inv_addon_cards['each_price'].toFixed(2)+' ea]</i>';
		summaryHTML += '<span class="summ-price">$'+partialPrice.toFixed(2)+'</span>';
		totalPrice += partialPrice;
	}

	summaryHTML += '</p>';
	/* check addins */
	if(inv_addon_cards['addins'] !== undefined) {
		var partialPrice = 0,
			cardPrice = 0,
			addin;

		summaryHTML += '<p><i>Additional insert cards:';

		for(var i = 0; i<inv_addon_counter; i++) {
			addin = inv_addon_cards['addins'][i];

			if( addin.qty !== undefined && !isNaN(addin.qty) ) 
			{
				cardPrice = addin.qty * addin.ea_price;

				summaryHTML += '<br>' + inv_addon_cards['size']+', ' + addin.side;
				summaryHTML += ', ' + addin.qty;
				summaryHTML += ' [+$'+addin.ea_price.toFixed(2)+' ea]</i>';

				partialPrice += cardPrice;
			}
		}
		
		summaryHTML += '</i><span class="summ-price">$'+partialPrice.toFixed(2)+'</span>';
		summaryHTML += '</p>';

		totalPrice += partialPrice;
	}
	summaryHTML += '</div>';
	inv_addon_cards['summary'] = summaryHTML;
	inv_addon_cards['total_cost'] = totalPrice;
	updateTotalSummary();
}

function step_2_next() {

	var valid = true,
		 msgResult = '';
	if(undefined == inv_addon_cards['size']) {
		$('#step_controls_2 .step-message').html('<span class="error">Please select a side or none</span>');
		$('#step_content_2 .pick-title').addClass('red-code');
		valid = false;
	}

	if(inv_addon_cards['size'] !== undefined && inv_addon_cards['size'] != 'none') {

		msgResult = validateAddinQty(inv_addon_cards['qty']);
		if( msgResult !== true) {
			$('#step_controls_2 .step-message').html('<span class="error">'+msgResult+'</span>');
			$('#step_content_2 .pick-title').addClass('red-code');
			valid = false;
		}
		else if(inv_addon_cards['addins'] != undefined) {
			for(var i = 0; i<inv_addon_counter; i++) {
				var addin = inv_addon_cards['addins'][i];

				if(addin.side != undefined) {
					msgResult = validateAddinQty(addin.qty);
					if( msgResult !== true) {
						$('#step_controls_2 .step-message').html('<span class="error">'+msgResult+'</span>');
						$('#step_content_2 .pick-title').addClass('red-code');
						valid = false;
						break;
					}
				}
			}
		}
	}
	inv_addon_cards['validation'] = valid;

	if(!valid) {
		return;
	}
	else {
		$('#step_content_2 .pick-title').removeClass('red-code');
		$('#step_controls_2 .step-message').html('');
	}

	updateStep2Summary();

	updateStepsStatusNav(1, 2,false); 
	$('#steps_main_content #step_content_2').addClass('hidden');
	showStep(3);
	updateStepsStatusNav(0,3,false); 

  step_3_startup();
}

/* Step 3 - Embellishments related functions 
----------------------------------*/

function step_3_startup() {
  if(inv_style && inv_style.indexOf('flat') !== -1) {
    $('#em_block_pocketfold').addClass('el-disabled');
  }
  else {
  	$('#em_block_pocketfold').removeClass('el-disabled');
  }
}

function embellishment_selection(emType, chooseEl) {
	$('#step_content_3 .el-opt-img, #step_content_3 .el-swap-img, #step_content_3 .em-btn-none > a').removeClass('el-picked');
	$(chooseEl).addClass('el-picked');
	inv_embellishment = emType;

	// reseting options
	$('#step_content_3 .check-ab-position').addClass('hidden');
	$('#step_content_3 #monogram_wrapping_colors').addClass('hidden');

	$('#ribbon_wrap_options input[type="radio"], #monogram_options input[type="radio"], '
	  +'#hanging_options input[type="radio"]').attr('checked', false);
	$('#monogram_options ul > li').removeClass('active');
	$('#monogram_options #tag-layer-color-btn').removeAttr('style');

	// reset popup color & color name
	$('#monogram-layer-popup .invitation-colors-list ul li, #monogram-layer-popup .foil-glitter-cardstock ul li').removeClass('active');
	$('#monogram-layer-popup .inv-color-name').html('Color Name');

	if('pocketfold' == emType) {
		inv_em_detail['summary'] = 'pocketfold name tag';
		inv_em_detail['unit_price'];
		inv_em_detail['text'] = 'pocketfold';
	}else if ('pre-punched'==emType) {
		inv_em_detail['text'] = 'pre-punched name tag';
	}
	else if ('printed-belly-band' == emType) {
		inv_em_detail['text'] = 'printed belly band';
	}
	else if('ribbon-wrap' == emType) {
		$('#step_content_3 #ribbon_wrap_options').removeClass('hidden');
		inv_em_detail['text'] = 'ribbon wrapping';
	}
	else if('monogram-tag' == emType) {
		$('#step_content_3 #monogram_options').removeClass('hidden');
		inv_em_detail['text'] = 'monogram tag w/ wrapping';
	}
	else if('hanging' == emType) {
		$('#step_content_3 #hanging_options').removeClass('hidden');
		$('#step_content_3 #hanging_option_list li').removeClass('active');
		document.querySelector('#step_content_3 #em_ribbon_options').classList.add('hidden');
		inv_em_detail['text'] = 'hanging name tag';
	}
	else if('none' == emType) {
		inv_em_detail['text'] = 'none';
	}

	inv_em_detail['em_type'] = emType;
	inv_em_detail['each_price'] = inv_prices[emType];
	if (inv_em_detail['each_price'] == undefined) {
		inv_em_detail['each_price'] = 0;
	}

	inv_embellishment = emType;
	inv_em_detail['options'] = undefined;
	inv_em_detail['tag-layer-color'] = undefined;

	updateStep3Summary();
}

function em_choose_ribbon_wrap_color(el) {
	inv_em_detail['options'] = {
		text: 'Ribbon',
		color: $(el).find('img').attr('src'),
		color_type: 'image'
	}
	updateStep3Summary();
}

function em_choose_hanging_ribbon_color(el) {
	inv_em_detail['options']['color'] = $(el).find('img').attr('src');
	inv_em_detail['options']['color_type'] = 'image';
	updateStep3Summary();
}

function hanging_option(option, btnEL) {
	$('#step_content_3 #hanging_option_list li').removeClass('active');
	btnEL.classList.add('active');

	document.querySelector('#step_content_3 #em_ribbon_options').classList.add('hidden');
	inv_em_detail['options'] = {
		text: '',
		color: undefined,
		color_type: undefined,
	};

	if('ribbon' == option) {
		document.querySelector('#step_content_3 #em_ribbon_options').classList.remove('hidden');
		inv_em_detail['options']['text'] = 'Ribbon';
	}
	else if('twine' == option) {
		$('#step_content_3 #em_ribbon_options input[type="radio"]').attr('checked', false);
		inv_em_detail['options']['text'] = 'twine';
	}

	updateStep3Summary();
}

function monogramOption(option, el) {
	$(el).removeAttr('style');

	if('wrapping-color' == option) 
	{
		$(el).addClass('active');
		$('#monogram_wrapping_colors').removeClass('hidden');

		var options = inv_em_detail['options'];
		if (options == undefined) {
			options = {};
		}
		options['text'] = 'wrapping color';
		inv_em_detail['options'] = options;
	}
	else if('tag-layer-color' == option) {
		var options = inv_em_detail['tag-layer-color'];
		if (options == undefined) {
			options = {};
		}
		options['text'] = 'tag layer color';
		inv_em_detail['tag-layer-color'] = options;
	}

	updateStep3Summary();
}

function em_choose_wrapping_color(el) {
	inv_em_detail['options']['color'] = $(el).find('img').attr('src');
	inv_em_detail['options']['color_type'] = 'image';
	updateStep3Summary();
}

/* monogram tag layered color sekection */
jQuery(document).ready(function() {
	$('#monogram-layer-popup .invitation-colors-list ul li, #monogram-layer-popup .foil-glitter-cardstock ul li').click(function(e) {
		e.stopPropagation();
		$('#monogram-layer-popup .invitation-colors-list ul li, #monogram-layer-popup .foil-glitter-cardstock ul li').removeClass('active');
		$(this).addClass('active');

		var imageBgColor = $(this).find('img').length > 0,
			color = undefined,
			tagLayerBtn = $('#tag-layer-color-btn');

		if (!imageBgColor) { /* color */
			color = $(this).find('a span').get(0).style.background;

			document.querySelector('#tag-layer-color-btn').style.background = color;
			document.querySelector('#tag-layer-color-btn').classList.remove('color-img-btn');

			inv_em_detail['tag-layer-color']['color'] = rgb2hex(color);
			inv_em_detail['tag-layer-color']['color_type'] = undefined;
		}
		else { /* image as bg color */
			imageBgColor = $(this).find('a img').attr('src');

			document.querySelector('#tag-layer-color-btn').style.backgroundImage = 'url('+imageBgColor+')';
			document.querySelector('#tag-layer-color-btn').classList.add('color-img-btn');

			inv_em_detail['tag-layer-color']['color'] = imageBgColor;
			inv_em_detail['tag-layer-color']['color_type'] = 'image';
		}

		/* Color name */
		var colorName = $(this).find('a').attr('data-color');
		$('.monogram-layer-popup .inv-color-name').html(colorName);
		$('.monogram-layer-popup .inv-color-name').attr('old-color-name', colorName);
		tagLayerBtn.attr('data-color-name', colorName);
		inv_em_detail['tag-layer-color']['color_name'] = colorName;

		$('#monogram-layer-popup').magnificPopup('close');
		updateStep3Summary();
	});

	/* Hover of colors */
	$('#monogram-layer-popup .invitation-colors-list ul li a, #monogram-layer-popup .foil-glitter-cardstock ul li a').hover(function(e) {
			var colorName = $(this).attr('data-color'),
			    oldColorName = $('#monogram-layer-popup .inv-color-name').html();

			$('#monogram-layer-popup .inv-color-name').attr('old-color-name', oldColorName);
			$('#monogram-layer-popup .inv-color-name').html(colorName);
		},
		function(e) {
			var oldColorName = $('#monogram-layer-popup .inv-color-name').attr('old-color-name');
			if(oldColorName) {
				$('#monogram-layer-popup .inv-color-name').html(oldColorName);
			}
	});
});

function updateStep3Summary() {
	/* prepare summary  */
	inv_em_detail['total_cost'] = inv_qty * inv_em_detail['each_price'];
	inv_em_detail['summary'] = '<p>EMBELLISHMENT:<br><i>' + inv_em_detail['text'] ;
	if (inv_em_detail['each_price'] > 0) {
		inv_em_detail['summary'] += ' [+$'+inv_em_detail['each_price']+' ea]';
	}
	inv_em_detail['summary'] += '</i>';


	if (inv_em_detail['options'] != undefined) {

		var obj = inv_em_detail['options'];
		inv_em_detail['summary'] += '<i><br>'+obj.text;

		if (obj.color !== undefined && obj.color_type=='image') {
			inv_em_detail['summary'] += ': <span class="color-o" style="background:url('+obj.color+'" )"></span>';
		}
		else if(obj.color !== undefined) {
			inv_em_detail['summary'] += ': <span class="color-o" style="background-color: '+obj.color+';"></span>';
		}
		inv_em_detail['summary'] += '</i>';
	}

	/* tag layer color */
	if (inv_em_detail['tag-layer-color'] != undefined) {
		var obj = inv_em_detail['tag-layer-color'];

		inv_em_detail['summary'] += '<i> &nbsp;'+obj.text;

		if (obj.color !== undefined && obj.color_type=='image') {
			inv_em_detail['summary'] += ': <span class="color-o" style="background:url('+obj.color+'" )"></span>';
		}
		else if(obj.color !== undefined) {
			inv_em_detail['summary'] += ': <span class="color-o" style="background-color: '+obj.color+';"></span>';
		}
		inv_em_detail['summary'] += '</i>';
	}

	if (inv_em_detail['total_cost'] > 0) {
		inv_em_detail['summary'] += '<span class="summ-price">'+inv_em_detail['total_cost'].toFixed(2)+'</span>';
	}

	inv_em_detail['summary'] += '</p>';

	updateTotalSummary();
}

function validateStep3() {
	$('#step_controls_3 .step-message').html('');
	$('#step_content_3 .pick-title').removeClass('red-code');

	if (undefined == inv_embellishment) {
		$('#step_controls_3 .step-message').html('<span class="error">Please select an embellishment</span>');
		$('#step_content_3 .pick-title').addClass('red-code');
		return false;
	}

	if(('ribbon-wrap' == inv_em_detail['em_type'] || 'hanging' == inv_em_detail['em_type'] || 'monogram-tag' == inv_em_detail['em_type']) 
	   && inv_em_detail['options'] == undefined) {
		$('#step_controls_3 .step-message').html('<span class="error">Please complete all highlighted fields</span>');
		$('#step_content_3 .pick-title').addClass('red-code');
		return false;
	}

	var obj = inv_em_detail['options'];
	if('hanging' == inv_em_detail['em_type'] && obj.text === 'Ribbon' && obj.color == undefined) {
		$('#step_controls_3 .step-message').html('<span class="error">Please complete all highlighted fields</span>');
		$('#step_content_3 .pick-title').addClass('red-code');
		return false;
	}

	if('monogram-tag' == inv_em_detail['em_type'] ) {
		var tagLayerColor = inv_em_detail['tag-layer-color'];

		if(obj.text == undefined || obj.color == undefined || tagLayerColor == undefined ||  tagLayerColor.text == undefined || tagLayerColor.color == undefined) {
			$('#step_controls_3 .step-message').html('<span class="error">Please complete all highlighted fields</span>');
			$('#step_content_3 .pick-title').addClass('red-code');

			return false;
		}
	}

	return true;
}

function step_3_next() {
	
	if (!validateStep3()) {
		return;
	}

	updateStep3Summary();

	updateStepsStatusNav(1, 3); 
	$('#steps_main_content #step_content_3').addClass('hidden');
	showStep(4);
	updateStepsStatusNav(0,4);  
}

/* Step 4 mailing envelope related functions
---------------------------------------------*/
function envelope_liner_selected(type, el) {
	$('#envelope_liner_area .el-opt-img, #envelope_liner_area .el-swap-img').removeClass('el-picked');
	$(el).addClass('el-picked');

	$('#step_content_4 #envelope_liner_samples > div').addClass('hidden');
	$('#step_content_4 #envelope_liner_area .envelope-options').addClass('hidden');

	// unmark other sub-options
	$('#envelope_liner_area .el-opt-black').removeClass('el-picked');
	$('#envelope_liner_samples input[type="radio"]').attr('checked', false);

	$('#patterned-envelope-popup ul>li.active').removeClass('active');

	inv_env_options['pattern'] = undefined;
	inv_env_options['glitter'] = undefined;

	if('glitter' == type) {
		$('#step_content_4 #envelope_liner_samples > #glitter_sample_list').removeClass('hidden');
		inv_env_options['text-liner'] = 'glitter';
	}
	else if('patterned' == type) {
		$('#envelope_patterned_options').removeClass('hidden');
		inv_env_options['text-liner'] = 'patterned';
	}
	else if ('no-liner' == type) {
		inv_env_options['text-liner'] = 'no liner';
	}

	inv_envelope_liner = type;
	inv_env_options['price-liner'] = inv_prices['env-'+type];

	updateStep4Summary();
}

function envelope_addressing_selected(type, el) {
	$('#envelope_addressing_area .el-opt-img, #envelope_addressing_area .el-swap-img').removeClass('el-picked');
	$(el).addClass('el-picked');
	inv_env_options['text-addr-opt'] = '';

	$('#step_content_4 #envelope_addressing_options >ul').addClass('hidden');

	if('digital' == type) {
		$('#step_content_4 #envelope_addressing_options ul#digital_options').removeClass('hidden');
		inv_env_options['text-addr'] = 'digital calligraphy';
	}
	else if('address-wraps' == type) {
		$('#step_content_4 #envelope_addressing_options ul#address_wraps_options').removeClass('hidden');
		inv_env_options['text-addr'] = 'address wraps';
	}
	else if ('no-addressing' == type) {
		inv_env_options['text-addr'] = 'no addressing';
	}

	$('#step_content_4 #envelope_addressing_options ul li').removeClass('active');

	inv_env_options['price-addressing'] = inv_prices['env-'+type];
	if (typeof inv_env_options['price-addressing'] === 'object') {
		inv_env_options['price-addressing'] = undefined;
	}
	inv_envelope_addressing = type;

	updateStep4Summary();
}

/* patterned list selection */
jQuery(document).ready(function($) {
	$('#patterned-envelope-popup .monogram-layer-content ul li').click(function(e) {
		$('#patterned-envelope-popup .monogram-layer-content ul li').removeClass('active');
		$(this).addClass('active');

		$('#envelope_patterned_options #env_option_pattern').addClass('el-picked');
		inv_env_options['pattern'] = $(this).find('a img').attr('src').replace(/"|'/, '');

    var magnificPopup = $.magnificPopup.instance; 
    magnificPopup.close();

    updateStep4Summary();
	});
});

function env_glitter_change(radio) {
	var giltterBg = $('#glitter_sample_list input[type="radio"]:checked + label > img').attr('src');
	inv_env_options['glitter'] = giltterBg.replace(/"|'/, '');
  
  updateStep4Summary();
}

function envelope_addressing_option(el, elID) {
	$('#envelope_addressing_options ul>li').removeClass('active');
	$(el).addClass('active');
	inv_env_options['price-addressing'] = inv_prices['env-'+inv_envelope_addressing][elID];

	inv_env_options['text-addr-opt'] = $(el).find('a').html();

	updateStep4Summary();
}

function updateStep4Summary() {
	var totalPrice = 0,
		summaryHTML = '';

	/* summary for: envelope liner  */
	if(inv_envelope_liner !== undefined) {
		summaryHTML = '<p>ENVELOPE LINER: <br>';
		summaryHTML += '<i>'+inv_env_options['text-liner']+'</i>';

		if (inv_envelope_liner == 'patterned' && inv_env_options['pattern'] !== undefined) {  
			summaryHTML += ' &nbsp; <span class="color-o" style="background-image: url('+inv_env_options['pattern']+');"></span>';
		}
		if (inv_envelope_liner == 'glitter' && inv_env_options['glitter'] !== undefined) {
			summaryHTML += ' <span class="color-o" style="background-image: url('+inv_env_options['glitter']+');"></span>';
		}
		if (inv_env_options['price-liner'] > 0) {
			var partialPrice = inv_env_options['price-liner'] * inv_qty;
			summaryHTML += ' &nbsp; <i>[+$'+inv_env_options['price-liner'].toFixed(2)+' ea]</i>';
			summaryHTML += '<span class="summ-price">$'+partialPrice.toFixed(2)+'</span>';
			totalPrice += partialPrice;
		}
		summaryHTML += '</p>';
	}

	/* summary for envelope addressing */
	if (!isEmpty(inv_env_options['text-addr'])) {
		summaryHTML += '<p>ENVELOPE ADDRESSING: <br>';
		summaryHTML += '<i>'+inv_env_options['text-addr']+'</i>';
		if (!isEmpty(inv_env_options['text-addr-opt'])) {
			summaryHTML += ' &nbsp; <i>'+inv_env_options['text-addr-opt']+'</i>';
		}
		if (inv_env_options['price-addressing'] > 0) {
			var partialPrice = inv_env_options['price-addressing'] * inv_qty;
			summaryHTML += ' <i>[+$'+inv_env_options['price-addressing'].toFixed(2)+' ea]</i>';
			summaryHTML += '<span class="summ-price">$'+partialPrice.toFixed(2)+'</span>';
			totalPrice += partialPrice;
		}
		summaryHTML += '</p>';
	}

	inv_env_options['summary'] = '<div class="price-summ-item"> <h6>Step 4</h6>';
	inv_env_options['summary'] += summaryHTML;
	inv_env_options['summary']+= '</div>';
	inv_env_options['total_cost'] = totalPrice;

	updateTotalSummary();
}

function step_4_next() {
	$('#step_controls_4 .step-message').html('');
	$('#step_content_4 .invite-title-label').removeClass('red-code');

	if (undefined == inv_envelope_liner) {
		$('#step_controls_4 .step-message').html('<span class="error">Please select an envelope liner</span>');
		$('#step_content_4 .mailing-left .invite-title-label').addClass('red-code');
		return;
	}

	if (undefined == inv_envelope_addressing) {
		$('#step_controls_4 .step-message').html('<span class="error">Please select an envelope addressing</span>');
		$('#step_content_4 .mailing-right .invite-title-label').addClass('red-code');
		return;
	}

	/* check patterned completion  */
	if(inv_envelope_liner == 'patterned' && inv_env_options['pattern'] == undefined) {
		$('#step_controls_4 .step-message').html('<span class="error">Please complete all highlighted fields</span>');
		$('#step_content_4 .mailing-left .invite-title-label').addClass('red-code');
		return;
	}

	/* check glitter completion */
	if(inv_envelope_liner == 'glitter' && inv_env_options['glitter'] == undefined) {
		$('#step_controls_4 .step-message').html('<span class="error">Please complete all highlighted fields</span>');
		$('#step_content_4 .mailing-left .invite-title-label').addClass('red-code');
		return;
	}

	/* check envelope addressing item priced selection completion */
	if (undefined == inv_env_options['price-addressing']) {
		$('#step_controls_4 .step-message').html('<span class="error">Please complete all highlighted fields</span>');
		$('#step_content_4 #envelope_addressing_area .invite-title-label').addClass('red-code');
		return;
	}
	inv_env_options['validation'] = true;

	updateStep4Summary();

	updateStepsStatusNav(1, 4); 
	$('#steps_main_content #step_content_4').addClass('hidden');
	showStep(5,1);
	updateStepsStatusNav(0,5,1);
}

/* Step 5 1 tassembly discounts
-----------------------------*/

function pick_DIY_disccount(el, discount) {
	$(el).toggleClass('el-picked');
	$('#step_content_5_1 .btn-no-assembly > a').removeClass('el-picked');

	inv_DIY_disccounts = [];
	var selected = document.querySelectorAll('#step_content_5_1 .title-block.el-picked');
	[].forEach.call(selected, function(picked){
		inv_DIY_disccounts.push({'text': picked.innerHTML, 'discount': discount });
	});

	updateStep5_1Summary();
}

function unapply_DIY_disccounts(unnaplyEL) {
	$('#step_content_5_1 .title-block').removeClass('el-picked');
	inv_DIY_disccounts = [];
	inv_DIY_disccounts = [{'text': 'NO DIY ASSEMBLY', 'discount':0}];

	$(unnaplyEL).addClass('el-picked');

	updateStep5_1Summary();
}

function updateStep5_1Summary() {
	var totalPrice = 0,
		partialPrice = 0,
		summaryHTML = '<p>ASSEMBLY DISCOUNTS: <br>';
	if (!isEmpty(inv_DIY_disccounts)) {
		inv_DIY_disccounts.forEach(function(info, idx) {
			summaryHTML += '<i>'+info.text+'</i>';
			partialPrice += info.discount * inv_qty;

			if (info.discount != 0) {
				summaryHTML += '<i>[$'+info.discount.toFixed(2)+' ea]</i>';
			}
			summaryHTML += '<br>';
		});
		if (partialPrice != 0) {
			summaryHTML += '<span class="summ-price">$'+partialPrice.toFixed(2)+'</span>';
			totalPrice += partialPrice;
		}
	}
	summaryHTML += '</p>';

	inv_DIY_options['summary'] = summaryHTML;
	inv_DIY_options['total_cost'] = totalPrice;

	updateTotalSummary();
}

function step_5_1_next() {
	$('#step_controls_5_1 .step-message').html('');
	$('#step_content_5_1 .assembley-title').removeClass('red-code');

	inv_DIY_options['validation'] = undefined;
	var selectedLength = $('#step_content_5_1 .el-picked').length;
	if(selectedLength > 0) {
		inv_DIY_options['validation'] = true;
	}
	if (inv_DIY_options['validation'] == undefined) {
		$('#step_controls_5_1 .step-message').html('<span class="error">Please select some option</span>');
		$('#step_content_5_1 .assembley-title').addClass('red-code');
		return;
	}

	updateStep5_1Summary();

	updateStepsStatusNav(1, 5,1); 
	$('#steps_main_content #step_content_5_1').addClass('hidden');
	showStep(5,2);
	updateStepsStatusNav(0,5,2); 

	step5_2Start();
}

/* Step 5_2 additional services */

function step5_2Start() {
	/* Digital RSVP Stamp Design disabled if a customer did not select an RSVP Envelope */
	if(inv_rsvp_style !== 'blank-envelope') {
		document.querySelector('#svc_digital_stamp_design_for_rsvp').classList.add('disabled');
	}
	else {
		document.querySelector('#svc_digital_stamp_design_for_rsvp').classList.remove('disabled');
	}
	/* Custom Ink Color box would be pre-selected if the customer chose a Custom Ink Color in step 1*/
	if(inv_ink_colors !== undefined && inv_ink_colors['custom-color'] == 'custom color') {
		document.querySelector('#svc_custom_ink_color').classList.add('el-picked');
		document.querySelector('#svc_custom_ink_color').classList.add('el-disable-events');

		$('#step_content_5_2 .no-add-service').addClass('el-disabled');
	}
	else {
		document.querySelector('#svc_custom_ink_color').classList.remove('el-disable-events');
		$('#step_content_5_2 .no-add-service').removeClass('el-disabled');
	}
}

function pick_addon_service(pickEl, price) {
	$('#step_content_5_2 .btn-no-assembly > a').removeClass('el-picked');
	pickEl.classList.toggle('el-picked');

	inv_addon_services['detail'] = [];
	$('#step_content_5_2 .title-block.el-picked').each(function(idx, el) {
		var elClone = $(el).clone();
		elClone.find('i').remove();
		inv_addon_services['detail'].push({ 
			'title': elClone.html(), 
			'price': Number($(el).data('price'))
		});
	});

	updateStep5_2Summary();
}

function unpick_addon_services(unpickEl) {
	$('#step_content_5_2 .title-block').removeClass('el-picked');
	unpickEl.classList.add('el-picked');

	inv_addon_services['detail'] = [];
	inv_addon_services['detail'].push({ 
			'title': unpickEl.innerHTML, 
			'price': 0
		});

	updateStep5_2Summary();
}

function updateStep5_2Summary() {
	var partialPrice = 0,
		summaryHTML = '<p>ADDITIONAL SERVICES: <br>';

	if ( !isEmpty(inv_addon_services['detail']) ) {
		inv_addon_services['detail'].forEach(function(info, idx) {
			summaryHTML += '<i>'+info.title+'</i>';
			partialPrice += info.price;

			if (info.price != 0) {
				summaryHTML += '<i>[$'+info.price.toFixed(2)+' ea]</i>';
			}
			summaryHTML += '<br>';
		});
		if (partialPrice > 0) {
			summaryHTML += '<span class="summ-price">$'+partialPrice.toFixed(2)+'</span>';
		}
	}

	summaryHTML += '</p>';

	inv_addon_services['summary'] = summaryHTML;
	inv_addon_services['total_cost'] = partialPrice;

	updateTotalSummary();
}

function step_5_2_next() {
	$('#step_controls_5_2 .step-message').html('');
	$('#step_content_5_2 .assembley-title').removeClass('red-code');

	var selectedLength = $('#step_content_5_2 .el-picked').length;
	inv_addon_services['validation'] = undefined;
	if (selectedLength > 0) {
		inv_addon_services['validation'] = true;
	}

	if (undefined == inv_addon_services['validation']) {
		$('#step_controls_5_2 .step-message').html('<span class="error">Please select at least one option</span>');
		$('#step_content_5_2 .assembley-title').addClass('red-code');
		return;
	}

	updateStep5_2Summary();

	updateStepsStatusNav(1, 5,2); 
	$('#steps_main_content #step_content_5_2').addClass('hidden');
	showStep(5,3);
	updateStepsStatusNav(0,5,3); 
}

/* Step 5-3 functions 
--------------------------*/

function turnaround_design_picked(el, price) {
	$('#step_content_5_3 #turnaround_design .title-block').removeClass('el-picked');
	$(el).addClass('el-picked');
	inv_turnaround['design'] = {
		'title': $(el).html(),
		'price': price
	};
	updateTotalSummary();
}

function turnaround_production_picked(el, percent) {
	$('#step_content_5_3 #turnaround_production .title-block').removeClass('el-picked');
	$(el).addClass('el-picked');
	inv_turnaround['production'] = {
		'title': $(el).html(),
		'percent': percent
	};
	updateTotalSummary();
}

function step_5_3_addtocart() {

	$('#step_controls_5_3 .step-message').html('');
	$('#step_content_5_3 h3').removeClass('red-code');

	if(inv_turnaround['design'] == undefined ) {
		$('#step_controls_5_3 .step-message').html('<span class="error">Please select one option on each one</span>');
		$('#step_content_5_3 .design-turnaround-part > h3').addClass('red-code');
	}
	if(inv_turnaround['production'] == undefined) {
		$('#step_controls_5_3 .step-message').html('<span class="error">Please select one option on each one</span>');
		$('#step_content_5_3 .production-turnaround-part > h3').addClass('red-code');
	}
}



/* Calculate total price and shows it, also calculate total price 
------------------------------------------------------------------*/

function updateTotalSummary() {
	var unitPrice 	= 0.00,
		percent 	= 0,
		partialPrice = 0.00,
		totalPrice 	= 0.00,
		summaryHTML 	= '';

	if(!isEmpty(inv_qty)) { 

		summaryHTML += '<div class="price-summ-item"> <h6>Step 1</h6>';

		/* check step1-2 */
		updateStep1_2_SummaryDetail();
		if(inv_style != undefined) {
			unitPrice = inv_prices[inv_style];
			partialPrice = inv_prices[inv_style] * inv_qty;
			totalPrice += partialPrice;

			summaryHTML += '<p>STYLE: <i>'+inv_style_detail['style-text']+' [$'+unitPrice.toFixed(2)+' ea]</i> <span class="summ-price">$'+partialPrice+'</span></p>';

			if (!isEmpty(inv_style_detail['colors'])) {

				inv_style_detail['colors'].forEach(function(obj, idx) {
					summaryHTML += '<p>'+obj.text+': <span class="color-o" style="background: '+obj.bgColor.replace(/"|'/, '')+';"></span></p>';
				});
			}
		}

		/* inv ink colors */
		if(!isEmpty(inv_ink_colors['detail'])) {
			summaryHTML += inv_ink_colors['detail'].summary;
			totalPrice 	+= inv_ink_colors['detail'].cost;
		}

		/* RSVP style step */
		if (!isEmpty(inv_rsvp_detail['total_cost'])) {
			summaryHTML += inv_rsvp_detail['summary'];
			totalPrice 	+= inv_rsvp_detail['total_cost'];
		}

		/* Paper selection */
		if (!isEmpty(inv_paper_detail['total_cost'])) {
			summaryHTML += inv_paper_detail['summary'];
			totalPrice 	+= inv_paper_detail['total_cost'];
		}
		summaryHTML += '</div>';

		/* Step 2 Additional insert cards */
		if (!isEmpty(inv_addon_cards['summary'])) {
			summaryHTML += inv_addon_cards['summary'];
			totalPrice 	+= inv_addon_cards['total_cost'];
		}

		/* Step 3 embellishments */
		if (!isEmpty(inv_em_detail['total_cost'])) {
			summaryHTML += '<div class="price-summ-item"> <h6>Step 3</h6>';

			summaryHTML += inv_em_detail['summary'];
			totalPrice 	+= inv_em_detail['total_cost'];

			summaryHTML += '</div>'; 
		}

		/* Step 4 mailing envelope */
		if (!isEmpty(inv_env_options['summary'])) {
			summaryHTML += inv_env_options['summary'];
			totalPrice 	+= inv_env_options['total_cost'];
		}

		/* STEP 5 
		----------*/
		var step5Valid = (!isEmpty(inv_DIY_disccounts) || !isEmpty(inv_addon_services['detail']) )
						|| inv_turnaround['design'] != undefined || inv_turnaround['production'] != undefined;
		if(step5Valid) {
			summaryHTML += '<div class="price-summ-item"> <h6>Step 5</h6>';
		}

		/* Step 5-1 Assembly discounts */
		if(!isEmpty(inv_DIY_disccounts)) {
			summaryHTML += inv_DIY_options['summary'];
			totalPrice += inv_DIY_options['total_cost'];
		}

		/* Step 5-2 Additional services */
		if(!isEmpty(inv_addon_services['summary'])) {
			summaryHTML += inv_addon_services['summary'];
			totalPrice += inv_addon_services['total_cost'];
		}

		/* Step 5-3 turnaround */
		if(inv_turnaround['design'] != undefined) {
			partialPrice = inv_turnaround['design']['price'];
			summaryHTML += '<p>DESIGN TURNAROUND: <br>';
			summaryHTML += '<i>'+inv_turnaround['design']['title']+'</i>';
			if (partialPrice > 0) {
				summaryHTML += '<i>[$'+partialPrice.toFixed(2)+']</i>';
				summaryHTML += '<span class="summ-price">$'+partialPrice.toFixed(2)+'</span>';
				totalPrice += partialPrice;
			}
			summaryHTML += '</p>';
		}
		if(inv_turnaround['production'] != undefined) {
			percent = inv_turnaround['production']['percent'];
			partialPrice = totalPrice * percent;
			summaryHTML += '<p>PRODUCTION TURNAROUND: <br>';
			summaryHTML += '<i>'+inv_turnaround['production']['title']+'</i>';
			if (partialPrice > 0) {
				summaryHTML += '<i>['+parseInt(percent * 100)+'%]</i>';
				summaryHTML += '<span class="summ-price">$'+partialPrice.toFixed(2)+'</span>';
				totalPrice += partialPrice;
			}
			summaryHTML += '</p>';
		}
		if (step5Valid) {
			summaryHTML += '</div>';
		}

	}

	document.querySelector('.total-price-count').innerHTML = '$' + totalPrice.toFixed(2);
	document.querySelector('#popup_summary_content').innerHTML = '';
	document.querySelector('#popup_summary_content').innerHTML = summaryHTML;
}

function isEmpty(val) {
	return (val == null || val==undefined || val === '' || val.length == 0);
}

/* Function to convert rgb(...) string color to hex format */
function rgb2hex(orig){
 var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
}