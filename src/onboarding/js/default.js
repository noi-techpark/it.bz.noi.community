
	var bTypeTextSkip = false;
	
	function scrollToElement (sID, lOffSet) {
		$('html, body').animate({
			scrollTop: $('#' + sID).offset().top - lOffSet
		}, 2000);
	}
	
	function submitThisForm (oForm) {
		if (checkFormErrors(oForm)) {
			oForm.addClass('loading');
			
			var formData = oForm.serialize();
			$.ajax({
				type: 'POST',
				url: oForm.attr('action'),
				data: formData
			})
			.done(function(response) {
				oForm.removeClass('loading');
				oForm.addClass('sent');
			})
			.fail(function(data) {
				oForm.removeClass('loading');
				oForm.addClass('senderror');
			});
		} else {
			$('html, body').animate({
				scrollTop: $(oForm.find('.field.error').first()).offset().top - 100
			}, 2000);
		}
	}
	
	function checkFormErrors (oForm) {
		var bNoErrors = true;
		oForm.find('input,textarea,select').each(function(i,o) {
			var oElement = $(o);
			var oElementParent = oElement.closest('.field');
			if (oElementParent.hasClass('required')) {
				if (oElement.val() == '') {
					oElementParent.addClass('error');
					oElementParent.removeClass('nonvalidemail');
					bNoErrors = false;
				} else {
					oElementParent.removeClass('error');
					if (oElement.attr('type') == 'email') {
						if (!isValidEMail(oElement.val())) {
							oElementParent.addClass('nonvalidemail');
							bNoErrors = false;
						} else {
							oElementParent.removeClass('nonvalidemail');
						}
					}
				}
			}
		});
		
		if (oForm.find('input[name="privacy"]').is(':checked')) {
			oForm.find('.privacynotaccepted').hide();
		} else {
			bNoErrors = false;
			oForm.find('.privacynotaccepted').show();
		}
		
		return bNoErrors;
	}
	
	function toggleCheckbox (oCheckboxContainer) {
		var oCheckbox = oCheckboxContainer.find('input');
		if (oCheckboxContainer.hasClass('checked')) {
			oCheckboxContainer.removeClass('checked');
			oCheckbox.prop('checked', false);
		} else {
			oCheckboxContainer.addClass('checked');
			oCheckbox.prop('checked', true);
		}
	}
	
	function isValidEMail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}
	
	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
	
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	
	function deleteCookie(cname) {
		document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}
	
	function toggleDesc(bInitial) {
		var oDesc;
		
		if ($('.desc-toggle').length) {
			$('.desc-toggle').each(function () {
				if($(this).find('[data-minheight]').length) {
					oDesc = $(this).find('[data-minheight]');
					oDesc.css('height', 'auto');
					
					if ((oDesc.height() / parseInt(oDesc.css('font-size'))) > oDesc.attr('data-minheight')) {
						oDesc.next().show();
						oDesc.attr('data-height', oDesc.height()).height(oDesc.attr('data-minheight') + 'em');
						oDesc.addClass('gradient');
					} else {
						oDesc.next().hide();
						oDesc.removeClass('gradient');
					}
					
					if (bInitial) {
						oDesc.next().on('click', function () {
							$(this).closest('.desc-toggle').toggleClass('open');
							if ($(this).closest('.desc-toggle').hasClass('open')) {
								$(this).prev('[data-minheight]').animate({height: $(this).prev('[data-minheight]').attr('data-height')});
							} else {
								$(this).prev('[data-minheight]').animate({height: $(this).prev('[data-minheight]').attr('data-minheight') + 'em'});
							}
						});
					}
				}
			});
		}
	}
	
	function setUnderline (oElement) {
		var oUnderlineContainer;
		
		if (oElement != undefined) {
			oUnderlineContainer = oElement;
		} else {
			oUnderlineContainer = $('.underline-js');
		}
		
		if (oUnderlineContainer.hasClass('underline-initialized')) {
			return;
		}
		
		oUnderlineContainer.addClass('underline-initialized');
		
		oUnderlineContainer.each(function () {
			$(this).find('a,em,code').each(function () {
				var sText = $(this).html();
				var sReplacedText = '';
				var lPrevHeight = 0;
				
				for (var i = 0; i < sText.length; i++) {
					if (sText.charAt(i) == '<' || sText.charAt(i) == '&') {
						bTypeTextSkip = true;
						sReplacedText += '<span class="char">';
					}
					if (bTypeTextSkip) {
						if (sText.charAt(i-1) == '>' || sText.charAt(i-1) == ';') {
							bTypeTextSkip = false;
							sReplacedText += '</span>';
						}
					}
					
					if (!bTypeTextSkip) {
						sReplacedText += '<span class="char">' + sText.charAt(i) + '</span>';
					} else {
						sReplacedText += sText.charAt(i);
					}
				}
				
				$(this).html(sReplacedText);
				
				sReplacedText = '';
				var bClosingTag = false;
				
				$(this).find('span.char').each(function () {
					if ($(this).offset().top > lPrevHeight) {
						if (bClosingTag) {
							sReplacedText += '</span>';
						}
						sReplacedText += '<span class="line">' + $(this).text();
						
						bClosingTag = true;
					} else {
						sReplacedText += $(this).text();
					}
					lPrevHeight = $(this).offset().top;
				});
				sReplacedText += '</span>';
				
				$(this).html(sReplacedText);
			});
		});
	}
	
	$(function() {
	
		$('.externlinks a').attr('target', '_blank');
		$('p a').each(function(i,o) {
			if ($(o).prop('id') !== 'ae-cookiebanner-opener') {
				var a = new RegExp('/' + window.location.host + '/');
				if (!a.test(this.href)) {
					$(this).attr("target","_blank");
				}
			}
		});
		
		if ($('.csrfcontainer').length > 0) {
			$.ajax({
				type: 'POST',
				url: '/csrf',
				success: function(data) {
					if(data) {
						$('.csrfcontainer').each(function (i,o) {
							$(o).html(data);
						});
					}
				}
			});
		}
		
		setUnderline();
		toggleDesc(true);
		$(window).resize(function() {
			toggleDesc(false);
		});
	
	});