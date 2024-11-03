$('document').ready(function(){
	
});


//Меню бургер
const iconMenu = document.querySelector('.menu_icon');
const menuBody = document.querySelector('.menu_body');
if(iconMenu) {
	iconMenu.addEventListener("click", function(e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}



/*Динамический адаптив open*/
/**
 * @typedef {Object} dNode
 * @property {HTMLElement} parent
 * @property {HTMLElement} element
 * @property {HTMLElement} to
 * @property {string} breakpoint
 * @property {string} order
 * @property {number} index
 */

/**
 * @typedef {Object} dMediaQuery
 * @property {string} query
 * @property {number} breakpoint
 */

/**
 * @param {'min' | 'max'} type
 */
function useDynamicAdapt(type = 'max') {
    const className = '_dynamic_adapt_'
    const attrName = 'data-da'
  
    /** @type {dNode[]} */
    const dNodes = getDNodes()
  
    /** @type {dMediaQuery[]} */
    const dMediaQueries = getDMediaQueries(dNodes)
  
    dMediaQueries.forEach((dMediaQuery) => {
      const matchMedia = window.matchMedia(dMediaQuery.query)
      // массив объектов с подходящим брейкпоинтом
      const filteredDNodes = dNodes.filter(({ breakpoint }) => breakpoint === dMediaQuery.breakpoint)
      const mediaHandler = getMediaHandler(matchMedia, filteredDNodes)
      matchMedia.addEventListener('change', mediaHandler)
  
      mediaHandler()
    })
  
    function getDNodes() {
      const result = []
      const elements = [...document.querySelectorAll(`[${attrName}]`)]
  
      elements.forEach((element) => {
        const attr = element.getAttribute(attrName)
        const [toSelector, breakpoint, order] = attr.split(',').map((val) => val.trim())
  
        const to = document.querySelector(toSelector)
  
        if (to) {
          result.push({
            parent: element.parentElement,
            element,
            to,
            breakpoint: breakpoint ?? '767',
            order: order !== undefined ? (isNumber(order) ? Number(order) : order) : 'last',
            index: -1,
          })
        }
      })
  
      return sortDNodes(result)
    }
  
    /**
     * @param {dNode} items
     * @returns {dMediaQuery[]}
     */
    function getDMediaQueries(items) {
      const uniqItems = [...new Set(items.map(({ breakpoint }) => `(${type}-width: ${breakpoint}px),${breakpoint}`))]
  
      return uniqItems.map((item) => {
        const [query, breakpoint] = item.split(',')
  
        return { query, breakpoint }
      })
    }
  
    /**
     * @param {MediaQueryList} matchMedia
     * @param {dNodes} items
     */
    function getMediaHandler(matchMedia, items) {
      return function mediaHandler() {
        if (matchMedia.matches) {
          items.forEach((item) => {
            moveTo(item)
          })
  
          items.reverse()
        } else {
          items.forEach((item) => {
            if (item.element.classList.contains(className)) {
              moveBack(item)
            }
          })
  
          items.reverse()
        }
      }
    }
  
    /**
     * @param {dNode} dNode
     */
    function moveTo(dNode) {
      const { to, element, order } = dNode
      dNode.index = getIndexInParent(dNode.element, dNode.element.parentElement)
      element.classList.add(className)
  
      if (order === 'last' || order >= to.children.length) {
        to.append(element)
  
        return
      }
  
      if (order === 'first') {
        to.prepend(element)
  
        return
      }
  
      to.children[order].before(element)
    }
  
    /**
     * @param {dNode} dNode
     */
    function moveBack(dNode) {
      const { parent, element, index } = dNode
      element.classList.remove(className)
  
      if (index >= 0 && parent.children[index]) {
        parent.children[index].before(element)
      } else {
        parent.append(element)
      }
    }
  
    /**
     * @param {HTMLElement} element
     * @param {HTMLElement} parent
     */
    function getIndexInParent(element, parent) {
      return [...parent.children].indexOf(element)
    }
  
    /**
     * Функция сортировки массива по breakpoint и order
     * по возрастанию для type = min
     * по убыванию для type = max
     *
     * @param {dNode[]} items
     */
    function sortDNodes(items) {
      const isMin = type === 'min' ? 1 : 0
  
      return [...items].sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.order === b.order) {
            return 0
          }
  
          if (a.order === 'first' || b.order === 'last') {
            return -1 * isMin
          }
  
          if (a.order === 'last' || b.order === 'first') {
            return 1 * isMin
          }
  
          return 0
        }
  
        return (a.breakpoint - b.breakpoint) * isMin
      })
    }
  
    function isNumber(value) {
      return !isNaN(value)
    }
  }
  
useDynamicAdapt();
/*Динамический адаптив close*/




/*const icon_wich_drop = document.querySelector('.icon-my-account-icon');
const drop_menu = document.querySelector('.drop_block_my_account');

icon_wich_drop.addEventListener('click', function (event) {
	drop_menu.classList.toggle('drop_active');
});*/

const dropBlock = document.querySelector('.header_block_icon_drop');

document.addEventListener("click", dropMenu);

function dropMenu(event) {
	if (event.target.closest('.icon-my-account-icon')) {
		dropBlock.classList.toggle('drop_active');
	}
	
	if (!event.target.closest('.header_block_icon_drop')) {
		dropBlock.classList.remove('drop_active');
	}
}

const mini_cart = document.querySelector('.mini_cart');
const icon_cart = document.querySelector('.icon-cart');
const mini_cart_close = document.querySelector('.container_icon_close_cart');

icon_cart.addEventListener('click', function (event) {
	mini_cart.classList.add('cart_open');
});
mini_cart_close.addEventListener('click', function (event) {
	mini_cart.classList.remove('cart_open');
});


/*управление клавишой*/
document.addEventListener('keyup', function (event) {
	if (event.code === 'Escape') {
		mini_cart.classList.remove('cart_open');
    dropBlock.classList.remove('drop_active');
	}
});


/*Swiper*/

new Swiper('.product-slider', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  slidesPerView: 3,
  watchOverflow: true,
  spaceBetween: 30,
  slidesPerGroup: 1,
  freeMode: true,
  effect: 'slide',
  speed: 600,

  breakpoints: {
    991: {
      slidesPerView: 3,
    },
    500: {
      slidesPerView: 2,
    },
    320: {
      slidesPerView: 1,
    },
  },
});



const video_block = document.querySelector('.video_block');
const video_about = document.querySelector('.video_container_about_us video');

if(video_block != null) {
  video_block.addEventListener('click', function (event) {
    video_about.setAttribute('controls', '');
    video_about.play();
    video_block.classList.add('show');
  });
}



//SPOLLERS
//Получаем коллекцию всех объектов у которых есть атрибут data-spollers
const spollersArray = document.querySelectorAll('[data-spollers]');
//Проверяем их наличие
if (spollersArray.length > 0) {
	//В рамках JS нам нужно разделить всю коллекцию на 2 массива. Один будет с простыми споллерами, а другой с теми которые работают по определённому брейкпоинту
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		//Проверяем отсутствие параметров у атрибута data-spollers
		return !item.dataset.spollers.split(",")[0];
	});
	//Проверяем есть ли они
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	//Получаем объекты с параметрами и которые будут работать в зависимости от ширины экрана
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		//Проверяем наличие параметров у атрибута data-spollers
		return item.dataset.spollers.split(",")[0];
	});
	
	//Далее нам нужно инициализировать споллеры с медиа запросом +
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		//Получаем уникальные брейкпоинты +
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		//Работаем с каждым брейкпоинтом +
			mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			//Обекты с нужными условиями +
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});

			//Событие +
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	//Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	//Работа с контентом +
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						const spollerBodyNext = spollerTitle.nextElementSibling;
						if (spollerBodyNext != null) {
							spollerTitle.nextElementSibling.hidden = true;
						} else {
							spollerTitle.previousElementSibling.hidden = true;
						}
						
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					const spollerBodyNext = spollerTitle.nextElementSibling;
					if (spollerBodyNext != null) {
						spollerTitle.nextElementSibling.hidden = false;
					} else {
						spollerTitle.previousElementSibling.hidden = false;
					}
				}
			});
		}
	}

	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				const spollerBodyNext = spollerTitle.nextElementSibling;
				if (spollerBodyNext != null) {
					_slideToggle(spollerTitle.nextElementSibling, 500);
				} else {
					_slideToggle(spollerTitle.previousElementSibling, 500);
				}
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			const spollerBodyNext = spollerActiveTitle.nextElementSibling;
			if (spollerBodyNext != null) {
				_slideUp(spollerActiveTitle.nextElementSibling, 500);
			} else {
				_slideUp(spollerActiveTitle.previousElementSibling, 500);
			}
		}
	}
}


//====================================================================================================================
//SlideToggle +
let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;


		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');			
		}, duration);
	}
}
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		
		window.setTimeout(() => {
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');

			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}

let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}


/*open block Add To Cart*/

const containersImageProduct = document.querySelectorAll('.container_image_product');

document.addEventListener("click", openContainer);

function openContainer(event) {
  containersImageProduct.forEach(containerImageProduct => {
    containerImageProduct.classList.remove('_active');
  });
	if (event.target.closest('.container_image_product')) {
    
    event.target.closest('.container_image_product').classList.add('_active');
    
	}
}




/*slider images product*/

function initSlider() {
  new Swiper('.container_gallery_product_page_product', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    watchOverflow: true,
    spaceBetween: 30,
    slidesPerGroup: 1,
    effect: 'slide',
    speed: 600,
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      500: {
        slidesPerView: 2,
      },
    },
  });
}
      
      
function detectDevice() {
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    // true for mobile device
    initSlider();
          
  }else{
    // false for not mobile device
          
  }
}
      
detectDevice();



/*popup script*/
/*Получаю все объекты с классом popup_link */
const popupLinks = document.querySelectorAll('.popup_link');
/*Получаю body для того чтобы блокировать его скролл */
const body = document.querySelector('body');
/*Получаю все объекты с классом lock-padding этот класс я присваиваю всем объектам которые у меня фиксированные, например шапке*/
const lockPadding = document.querySelectorAll('.lock-padding');

/*Эта переменная нужна для того чтобы не было двойных нажатий*/
let unlock = true;

/*timeout = 800 миллисекунд это то, что указано у нас в свойстве transition*/
const timeout = 800;

/*Проверяю есть ли вообще у нас такие ссылки*/
if (popupLinks.length > 0) {
	/*Бегаю по всем этим ссылкам*/
	for (let index = 0; index < popupLinks.length; index++) {
		/*Получаю каждую в переменную popupLink и на неё вешаю событие click*/
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			
			/*При клике я беру атрибут href и убираю из нео #*/
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

/*Класс close-popup нужно прописывать ссылке которая закрывает попап в нашем случае крестику*/
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup_content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}
function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for(let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	/*по классу lock блокируется скролл - overflow: hidden;*/
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});



/*Для поддержки старых браузеров!
Полефилы для свойств closest и matches я их нашол в интернете*/

(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверям поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMetchesSelector ||
			Element.prototype.mozMetchesSelector ||
			Element.prototype.msMetchesSelector
	}
})();



let subSliderCustomProduct = new Swiper('.sub_slider_custom_product', {
    
	loop: true,
    spaceBetween: 12,
	slidesPerView: 3,
    effect: 'slide',
    speed: 600,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
		320: {
			spaceBetween: 23,
		},
		470: {
			spaceBetween: 12,
		},
	},
});

let mainSliderCustomProduct = new Swiper('.main_slider_custom_product', {
	navigation: {
		nextEl: '.button_next_slider_custom_product',
		prevEl: '.button_prev_slider_custom_product',
	  },
	  pagination: {
		  el: '.swiper-pagination',
		  clickable: true,
	  },
    loop: true,
    spaceBetween: 12,
    slidesPerGroup: 1,
    effect: 'slide',
    speed: 600,
    thumbs: {
        swiper: subSliderCustomProduct,
    },
	
});


$('document').ready(function(){
	$('.block_title').click(function(event) {
		if($('.block').hasClass('one')) {
			$('.block_title').not($(this)).removeClass('active');
			$('.block_content').not($(this).next()).slideUp(300);
		}
		$(this).toggleClass('active').next().slideToggle(300);
	});
	if($('.block_title').hasClass('open')){
		$('.block_title.open').addClass('active').next().slideToggle(0);
		$('.block_title.open').removeClass('open')
	}
});

/*select*/
const Select = () => {
	const elements = document.querySelectorAll('.select');
	if(elements.length > 0) {
	  elements.forEach(element => {
		const choices = new Choices(element, {
		  silent: false,
		  items: [],
		  choices: [],
		  renderChoiceLimit: -1,
		  maxItemCount: -1,
		  addItems: true,
		  addItemFilter: null,
		  removeItems: true,
		  removeItemButton: false,
		  editItems: false,
		  allowHTML: true,
		  duplicateItemsAllowed: true,
		  delimiter: ',',
		  paste: true,
		  searchEnabled: false, //Поиск по селекту
		  searchChoices: true,
		  searchFloor: 1,
		  searchResultLimit: 4,
		  searchFields: ['label', 'value'],
		  position: 'auto',
		  resetScrollPosition: true,
		  shouldSort: true,
		  shouldSortItems: false,
		  sorter: () => {},
		  placeholder: false,
		  placeholderValue: null,
		  searchPlaceholderValue: null,
		  prependValue: null,
		  appendValue: null,
		  renderSelectedChoices: 'auto',
		  loadingText: 'Loading...',
		  noResultsText: 'No results found', //Текст когда поиск по селекту не находит результата
		  noChoicesText: 'No choices to choose from',
		  itemSelectText: 'Press to select',
		  uniqueItemText: 'Only unique values can be added',
		  customAddItemText: 'Only values matching specific conditions can be added',
		  classNames: {
			containerOuter: 'choices',
			containerInner: 'choices__inner',
			input: 'choices__input',
			inputCloned: 'choices__input--cloned',
			list: 'choices__list',
			listItems: 'choices__list--multiple',
			listSingle: 'choices__list--single',
			listDropdown: 'choices__list--dropdown',
			item: 'choices__item',
			itemSelectable: 'choices__item--selectable',
			itemDisabled: 'choices__item--disabled',
			itemChoice: 'choices__item--choice',
			placeholder: 'choices__placeholder',
			group: 'choices__group',
			groupHeading: 'choices__heading',
			button: 'choices__button',
			activeState: 'is-active',
			focusState: 'is-focused',
			openState: 'is-open',
			disabledState: 'is-disabled',
			highlightedState: 'is-highlighted',
			selectedState: 'is-selected',
			flippedState: 'is-flipped',
			loadingState: 'is-loading',
			noResults: 'has-no-results',
			noChoices: 'has-no-choices'
		  },
		  // Choices uses the great Fuse library for searching. You
		  // can find more options here: https://fusejs.io/api/options.html
		  fuseOptions: {
			includeScore: true
		  },
		  labelId: '',
		  callbackOnInit: null,
		  callbackOnCreateTemplates: null
		});
  
  
		let areaLabel = element.getAttribute('aria-label');
      	element.closest('.choices').setAttribute('aria-label', areaLabel);
	  });
	}
}
  
Select();






/*tabs_mods---------------------------------------------------------*/
const tabsTitle = document.querySelectorAll('.tabs_item');
const tabsContent = document.querySelectorAll('.tabs_block');

if (tabsTitle.length > 0 || tabsContent.length > 0) {
	tabsTitle.forEach(item => item.addEventListener("click", event => {

		const tabsTitleTarget = event.target.getAttribute('data-tab');

		tabsTitle.forEach(element => element.classList.remove('active-tab'));

		tabsContent.forEach(element => element.classList.add('hidden-tab-content'));

		item.classList.add('active-tab');

		
		const tabsTitles = document.querySelectorAll(`#${tabsTitleTarget}`);
		for (let tabsTitle of tabsTitles) {
			tabsTitle.classList.remove('hidden-tab-content');
		}
	}));

	const tabsTitlesStart = document.querySelectorAll('[data-tab="tab-1"]');
	for (let tabsTitleStart of tabsTitlesStart) {
		tabsTitleStart.classList.add('active-tab');
	}

	const tabsContentsStart = document.querySelectorAll('#tab-1');
	for (let tabsContentStart of tabsContentsStart) {
		tabsContentStart.classList.remove('hidden-tab-content');
	}
}