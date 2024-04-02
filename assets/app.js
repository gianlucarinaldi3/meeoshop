(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "../jquery.validate"], factory );
	} else if (typeof module === "object" && module.exports) {
		module.exports = factory( require( "jquery" ) );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: IT (Italian; Italiano)
 */
$.extend( $.validator.messages, {
	required: "Campo obbligatorio",
	remote: "Controlla questo campo",
	email: "Inserisci un indirizzo email valido",
	url: "Inserisci un indirizzo web valido",
	date: "Inserisci una data valida",
	dateISO: "Inserisci una data valida (ISO)",
	number: "Inserisci un numero valido",
	digits: "Inserisci solo numeri",
	creditcard: "Inserisci un numero di carta di credito valido",
	equalTo: "Il valore non corrisponde",
	extension: "Inserisci un valore con un&apos;estensione valida",
	maxlength: $.validator.format( "Non inserire pi&ugrave; di {0} caratteri" ),
	minlength: $.validator.format( "Inserisci almeno {0} caratteri" ),
	rangelength: $.validator.format( "Inserisci un valore compreso tra {0} e {1} caratteri" ),
	range: $.validator.format( "Inserisci un valore compreso tra {0} e {1}" ),
	max: $.validator.format( "Inserisci un valore minore o uguale a {0}" ),
	min: $.validator.format( "Inserisci un valore maggiore o uguale a {0}" ),
	nifES: "Inserisci un NIF valido",
	nieES: "Inserisci un NIE valido",
	cifES: "Inserisci un CIF valido",
	currency: "Inserisci una valuta valida",
} );
return $;
}));

jQuery.validator.setDefaults({
  errorPlacement: function(error, element) {
    error.appendTo(element.parents(".field"));
  }
});

var app = {
  init: function() {
		var _this = this;
		$(document).keydown(function (e) {
			if ((e.ctrlKey) && (String.fromCharCode(e.which).toLowerCase() === 'g')) {
				$("#grid").toggle();
			}
		});
		_this.initHeader();
		_this.initShoppableImages();
		_this.enableFakeSelect();
		_this.enableProductViewPrice();
		_this.enableWaypoints();
		_this.enableProductFeatures();
		Fancybox.bind('[data-fancybox]', {
		  Thumbs: false,
			Toolbar: {
				display: [{ id: "counter", position: "left" }, "close"],
			}
		});
		$("[data-quantity-selector]").quantitize();
  },
	enableWaypoints: function() {
		$("[data-waypoint]").each(function() {
			var el = this;
			if ($(this).data("waypointed")) return;
			new Waypoint({
				element: el,
				handler: function(direction) {
					$(this.element).addClass("waypointed");
				},
				offset: '80%'
			});
			$(this).data("waypointed", true);
		});
	},
	enableProductFeatures: function() {
		$("#product-view .features-handle").on("click", function() {
			$(this).toggleClass("open");
			$("#product-view .features").slideToggle(300);
			return false;
		});
	},
	enableProductViewPrice: function() {
		$(".product-buy .quantity-selector").on("quantity-change", function() {
			var qty = $(this).find("input").val();
			var price = $(this).closest(".add").data("price");
			var format = $(this).closest(".add").data("money-format");
			$(this).closest(".add").find(".cta .button .total-product-price").text(window.Shopify.formatMoney(price*qty,format));
		});
	},
	enableFakeSelect: function() {
		$(".selector select").on("change", function() {
			var val = $(this).find("option:selected").text();
			$(this).closest(".selector").find(".value").text(val);
		});
	},
	initShoppableImages: function() {
		$(".shoppable-image").spottedImage();
	},
	initHeader: function() {
		$(window).on("scroll", function() {
			var pos = $(this).scrollTop();
			if (pos > 0) {
				$("body").addClass("scrolled");
			} else {
				$("body").removeClass("scrolled");
			}
		});
		$("#header .search .handle").on("click", function() {
			$("body").addClass("search-open");
			$("#header .search input").val("").focus();
			$("#header .search .quick-menu").show();
		});
		$("#header .search input").on("input", function() {
			if ($(this).val() == '') {
				$("#header .search .quick-menu").show();
				$("#header .search .ui-autocomplete").hide();
			} else {
				$("#header .search .quick-menu").hide();
			}
		})
		var autocomplete_url = $("#header .search .form").data("autocomplete-url");
		$.widget("custom.headerSearch", $.ui.autocomplete, {
	    _renderItem: function (ul, item) {
				if (item.price) {
					var html = $("<div />").addClass("product");
					var image = $("<span />").addClass("img").appendTo(html);
					var imageSpacer = $("<span />").addClass("img-spacer").appendTo(image);
					$("<img />").attr("src",item.img).appendTo(imageSpacer);
					var content = $("<div />").addClass("content").appendTo(html);
					$("<span />").addClass("name").text(item.value).appendTo(content);
					var price = $("<span />").addClass("price").text(item.price.priceHtml).appendTo(content);
					if (item.options) {
						$("<span>").addClass("options").text(item.options).appendTo(content);
					}
				} else {
					var html = $("<div />").addClass("no-results");
					$("<p />").addClass("title").text("Nessun risultato per '"+item.term+"'").appendTo(html);
					$("<p />").text("Spiacenti, non abbiamo trovato nessuna corrispondenza.").appendTo(html);
					$("<a />").addClass("arrow-link").attr("href","/collections/all").html("Visualizza tutti i prodotti <svg class=\"arrow\"><use xlink:href=\"#icon-link\"></use></svg>").appendTo(html);
				}
				return $("<li>").append(html).appendTo(ul);
	    }
		});
		$("#header .search .form input").headerSearch({
      source: function(request, response) {
				if (request.term !== '') {
					$.getJSON(autocomplete_url, {
						q: request.term
					}, function(data) {
						if (data.products.length > 0) {
							response(data.products);
						} else {
							response([{type:null, term: request.term}]);
						}
					});
				}
			},
      minLength: 1,
			appendTo: "#header .search .form",
      select: function(event, ui) {
				if (ui.item.url) window.location.href = ui.item.url;
				return false;
      }
    });
		$(document).mouseup(function(e) {
			var container = $("#header .search");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				$("body").removeClass("search-open");
			}
		});
		$("#header .menu-handle").on("click", function() {
			$("body").addClass("menu-open");
		});
		$("#menu .close").on("click", function() {
			$("body").removeClass("menu-open");
		});
		new Swiper('#menu .collections-slider .slider', {
			wrapperClass: 'slider-wrapper',
			slideClass: 'collection',
			slidesPerView: 'auto',
			scrollbar: {
				el: '.slider-scrollbar',
				draggable: true,
			},
		});
	},
  isMobile: function() {
    return Modernizr.mq('(max-width:767px)');
  },
  isTablet: function() {
    return Modernizr.mq('(min-width:768px) and (max-width:1023px)');
  },
  isDesktop: function() {
    return Modernizr.mq('(min-width:1024px)');
  }
}

$(document).ready(function() {
  app.init();
});

$.fn.spottedImage = function() {
	var obj;
	var area;
	var overlay;
	var productOpen;
	if (this.length > 1) {
		this.each(function() {
			$(this).spottedImage();
		});
		return this;
	}
	if ($(this).data("spotted-image-enabled")) return;
	obj = $(this);
	createArea();
	createOverlay();
	$(this).on("click", ".handle", function(event) {
		open($(this).closest(".product"));
		event.stopPropagation();
	});
	$(this).on("click", ".card", function(event) {
		event.stopPropagation();
	});
	$(this).data("spotted-image-enabled",true);
	$(window).on("resize", function() {
		close();
	});
	this.on("click", function() {
		close();
	});
	function createArea() {
		area = $("<span>").addClass("area").appendTo(obj);
	}
	function createOverlay() {
		overlay = $("<span>").addClass("overlay").appendTo(obj);
		overlay.on("click", function() {
			close();
		});
	}
	function open(product) {
		var card = product.find(".card");
		var point = product.find(".handle");
		if (product.hasClass("open")) {
			close();
			return;
		}
		if (productOpen) hide(productOpen);
		obj.addClass("open");
		product.addClass("open").trigger("spotted-image-open");
		productOpen = product;
    if (app.isMobile()) {
      $(card).show().position({
  			of: point,
  			my: 'center bottom',
  			at: 'center top-12',
  			collision: "fit flip"
  		});
    } else {
      $(card).show().position({
        of: point,
        my: 'left center',
        at: 'right+12 center',
        collision: "flip fit"
      });
    }
	}
	function hide(product) {
		product.removeClass("open");
		product.find(".card").hide();
	}
	function close() {
		if (productOpen) hide(productOpen);
		obj.removeClass("open");
	}
};

$.fn.quantitize = function() {
	var obj;
	var select;
	var input;
	var currentValue;
	var valueElement;
	if (this.length > 1) {
		this.each(function() {
			$(this).quantitize();
		});
		return this;
	}
	if ($(this).data("quantity-enabled")) return;
	obj = $(this);
	select = obj.find("select");
	valueElement = obj.find(".value");
	input = obj.find("input");
	currentValue = input.val();
	input.on("input", function() {
		this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
		obj.trigger("quantity-input");
		//obj.trigger("quantity-change");
	});
	input.on("change", function() {
		if ($(this).val() == '') $(this).val(1);
		obj.trigger("quantity-change");
	});
	select.on("change", function(event) {
		if ($(this).val() == '10+') {
			input.val(10);
			obj.addClass("more");
			input.trigger("quantity-change").focus();
		} else {
			input.val($(this).val()).trigger("change");
		}
	});
	if (currentValue > 9) {
		obj.addClass("more");
	}

	//select.trigger("change");
};
