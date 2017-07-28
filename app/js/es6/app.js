class YOURAPPNAME {

    constructor(doc) {
        this.doc = doc;
        this.window = window;
        this.html = this.doc.querySelector('html');
        this.body= this.doc.body;
        this.location = location;
        this.hash = location.hash;
        this.Object = Object;
        this.scrollWidth = 0;

        this.scrollWidth = this.scrollBarWidth();
    }

    // Window load types (loading, dom, full)
    appLoad(type, callback) {
        const _self = this;

        switch(type) {
            case 'loading':
                if (_self.doc.readyState === 'loading') callback();

                break;
            case 'dom':
                _self.doc.onreadystatechange = function () {
                    if (_self.doc.readyState === 'complete') callback();
                };

                break;
            case 'full':
                _self.window.onload = function(e) {
                    callback(e);
                };

                break;
            default:
                callback();
        }
    };

    // Detect scroll default scrollBar width (return a number)
    scrollBarWidth() {
        const _self = this;
        const outer = _self.doc.createElement("div");

        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar";

        _self.body.appendChild(outer);

        const widthNoScroll = outer.offsetWidth;

        outer.style.overflow = "scroll";

        const inner = _self.doc.createElement("div");

        inner.style.width = "100%";
        outer.appendChild(inner);

        const widthWithScroll = inner.offsetWidth;

        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    };

    initSwitcher() {
        const _self = this;

        const switchers = _self.doc.querySelectorAll('[data-switcher]');

        if (switchers && switchers.length > 0) {
            for (let i = 0; i < switchers.length; i++) {
                const switcher = switchers[i],
                    switcherOptions = _self.options(switcher.dataset["switcher"]),
                    switcherElems = switcher.children,
                    switcherTargets = _self.doc.querySelector('[data-switcher-target="' + switcherOptions.target + '"]').children,
                    switchersActive = [];

                for (let y = 0; y < switcherElems.length; y++) {
                    const switcherElem = switcherElems[y],
                        parentNode = switcher.children,
                        switcherTrigger = (switcherElem.children.length) ? switcherElem.children[0] : switcherElem,
                        switcherTarget = switcherTargets[y];


                    if (switcherElem.classList.contains('active')) {
                        for (let z = 0; z < parentNode.length; z++) {
                            parentNode[z].classList.remove('active');
                            switcherTargets[z].classList.remove('active');
                        }
                        switcherElem.classList.add('active');
                        switcherTarget.classList.add('active');
                    } else switchersActive.push(0);

                    switcherTrigger.addEventListener('click', function (elem, target, parent, targets) {
                        return function (e) {
                            e.preventDefault();

                            if (!elem.classList.contains('active')) {
                                for (let z = 0; z < elem.parentNode.children.length; z++) {
                                    elem.parentNode.children[z].classList.remove('active');
                                    targets[z].classList.remove('active');
                                }
                                elem.classList.add('active');
                                target.classList.add('active');
                            }
                        };

                    }(switcherElem, switcherTarget, parentNode, switcherTargets));
                }

                if (switchersActive.length === switcherElems.length) {
                    switcherElems[0].classList.add('active');
                    switcherTargets[0].classList.add('active');
                }
            }
        }
    };

    str2json(str, notevil) {
        try {
            if (notevil) {
                return JSON.parse(str
                    .replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":';})
                    .replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"';})
                );
            } else {
                return (new Function("", "const json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
            }
        } catch(e) { return false; }
    };

    options(string) {
        const _self = this;

        if (typeof string !== 'string') return string;

        if (string.indexOf(':') !== -1 && string.trim().substr(-1) !== '}') {
            string = '{'+string+'}';
        }

        const start = (string ? string.indexOf("{") : -1);
        let options = {};

        if (start !== -1) {
            try {
                options = _self.str2json(string.substr(start));
            } catch (e) {}
        }

        return options;
    };

    popups(options) {
        const _self = this;

        const defaults = {
            reachElementClass: '.js-popup',
            closePopupClass: '.js-close-popup',
            currentElementClass: '.js-open-popup',
            changePopupClass: '.js-change-popup'
        };

        options = $.extend({}, options, defaults);

        const plugin = {
            reachPopups: $(options.reachElementClass),
            bodyEl: $('body'),
            topPanelEl: $('.top-panel-wrapper'),
            htmlEl: $('html'),
            closePopupEl: $(options.closePopupClass),
            openPopupEl: $(options.currentElementClass),
            changePopupEl: $(options.changePopupClass),
            bodyPos: 0
        };

        plugin.openPopup = function (popupName) {
            plugin.reachPopups.filter('[data-popup="' + popupName + '"]').addClass('opened');
            plugin.bodyEl.css('overflow-y', 'scroll');
            // plugin.topPanelEl.css('padding-right', scrollSettings.width);
            plugin.htmlEl.addClass('popup-opened');
        };

        plugin.closePopup = function (popupName) {
            plugin.reachPopups.filter('[data-popup="' + popupName + '"]').removeClass('opened');
            setTimeout(function () {
                plugin.bodyEl.removeAttr('style');
                plugin.htmlEl.removeClass('popup-opened');
                plugin.topPanelEl.removeAttr('style');
            }, 300);
        };

        plugin.changePopup = function (closingPopup, openingPopup) {
            plugin.reachPopups.filter('[data-popup="' + closingPopup + '"]').removeClass('opened');
            plugin.reachPopups.filter('[data-popup="' + openingPopup + '"]').addClass('opened');
        };

        plugin.init = function () {
            plugin.bindings();
        };

        plugin.bindings = function () {
            plugin.openPopupEl.on('click', function (e) {
                e.preventDefault();
                const pop = $(this).attr('data-popup-target');
                plugin.openPopup(pop);
            });

            plugin.closePopupEl.on('click', function (e) {
                e.preventDefault();

                let pop;
                if (this.hasAttribute('data-popup-target')) {
                    pop = $(this).attr('data-popup-target');
                } else {
                    pop = $(this).closest(options.reachElementClass).attr('data-popup');
                }

                plugin.closePopup(pop);
            });

            plugin.changePopupEl.on('click', function (e) {
                const closingPop = $(this).attr('data-closing-popup');
                const openingPop = $(this).attr('data-opening-popup');

                plugin.changePopup(closingPop, openingPop);
            });

            plugin.reachPopups.on('click', function (e) {
                const target = $(e.target);
                const className = options.reachElementClass.replace('.', '');
                if (target.hasClass(className)) {
                    plugin.closePopup($(e.target).attr('data-popup'));
                }
            });
        };

        if (options)
            plugin.init();

        return plugin;
    };

    photosUpload() {
        const $imageDropBox = $('#image-drop-box');

        if($imageDropBox.length) {
            const imageList = [];
            const imageFilesList = [];
            const imageDropBoxLoadingClass = 'image-drop-box-loading';
            const imageDropBoxHasFilesClass = 'image-drop-box-has-file';
            const imageDropBoxFullClass = 'image-drop-box-full';

            const input = this.doc.getElementById('image-drop-box__files');

            const showPreloader = () => {
                $imageDropBox.addClass(imageDropBoxLoadingClass);
            };

            const hidePreloader = () => {
                setTimeout(function () {
                    $imageDropBox.removeClass(imageDropBoxLoadingClass);

                    $imageDropBox.find('.preview__count').html(15 - imageList.length);

                    console.log(imageFilesList.length);

                    if (imageFilesList.length === 15) {
                        $imageDropBox.addClass(imageDropBoxFullClass);
                    } else if (imageFilesList.length < 15) {
                        $imageDropBox.removeClass(imageDropBoxFullClass);
                    }
                }, 300);
            };

            const checkImageDropBox = () => {
                (imageList.length) ? $imageDropBox.addClass(imageDropBoxHasFilesClass) : $imageDropBox.removeClass(imageDropBoxHasFilesClass);
            };

            const renderTemplate = (src, index) => {
                return '<div class="fw-width-1-6 preview__item">' +
                    '<div class="fw-width-1-1 fw-box-proportional-100 preview__thumb"><div class="fw-height-1-1 fw-width-1-1">' +
                    '<img src="' + src + '" alt="" class="fw-img-cover fw-border-radius-5">' +
                    '<a href="#'+ index +'" class="fw-absolute fw-absolute-top-right fw-mt-inverse-10 fw-mr-inverse-10 preview__remove"><i class="icon icon-trash"></i></a>' +
                    '</div></div></div>';
            };

            const renderFiles = () => {
                const $imagePreviewBox = $('#image-drop-box__preview');
                let templates = [];

                if(imageList.length) {
                    for(let i = 0; i < imageList.length; i++) {
                        const imageListSrc = imageList[i];

                        templates.push(renderTemplate(imageListSrc, i));

                        $imagePreviewBox.children().not(':last-child').remove();
                        $imagePreviewBox.prepend(templates.join(''));
                    }
                }
            };

            $(this.doc).on('click', '.preview__remove', function(e) {
                e.preventDefault();
                showPreloader();

                const $removeImage = $(this);
                const index = parseInt($removeImage.attr('href').replace('#', ''));

                if(index > 0) {
                    imageList.splice(index, 1);
                    imageFilesList.splice(index, 1);
                } else {
                    imageList.shift();
                    imageFilesList.shift();
                }
                checkImageDropBox();
                setTimeout(function() {
                    renderFiles();
                    hidePreloader();
                    $removeImage.closest('.preview__item').remove();
                }, 300);
            });

            input.addEventListener('change', function() {
                const currentFiles = this.files;
                const currentFilesLength = currentFiles.length;

                if(currentFilesLength) {
                    showPreloader();

                    for(let i = 0; i < currentFilesLength; i++) {

                        if(imageList.length <= 15) {
                            const reader = new FileReader();

                            reader.onload = function (e) {

                                    imageList.push(e.target.result);
                                    imageFilesList.push(currentFilesLength[i]);
                                    checkImageDropBox();

                                    if (i === currentFilesLength - 1) {
                                        setTimeout(function() {
                                            renderFiles();
                                            hidePreloader();
                                        }, 300);
                                    }
                            };

                            reader.readAsDataURL(currentFiles[i]);
                        }
                    }
                }
            });
        }
    };

    voteTrigger() {
        const $voteItems = $('.js-vote-item');
        $('.js-vote-trigger').on('click', function (e) {
            e.preventDefault();
            const $this = $(this);

            $this.addClass('active');

            $voteItems.addClass('transition');

            setTimeout(function (e) {
                $this.removeClass('active');
                let $timeout = 0;
                $voteItems.each(function () {
                    const $voteItem = $(this);
                    setTimeout(function () {

                        $voteItem.addClass('animate-flip');

                        setTimeout(function () {
                            $voteItem.removeClass('animate-flip transition');
                        }, 1050);
                    }, $timeout);
                    $timeout += 300;
                });

            }, 500);
        });
    }
}

(function() {

    const app = new YOURAPPNAME(document);

    app.appLoad('loading', function () {
        console.log('App is loading... Paste your app code here.');
        // App is loading... Paste your app code here. 4example u can run preloader event here and stop it in action appLoad dom or full
    });

    app.appLoad('dom', function () {
        console.log('DOM is loaded! Paste your app code here (Pure JS code).');
        // DOM is loaded! Paste your app code here (Pure JS code).
        // Do not use jQuery here cause external libs do not loads here...

        app.initSwitcher(); // data-switcher="{target='anything'}" , data-switcher-target="anything"
    });

    app.appLoad('full', function (e) {
        console.log('App was fully load! Paste external app source code here... For example if your use jQuery and something else');
        // App was fully load! Paste external app source code here... 4example if your use jQuery and something else
        // Please do not use jQuery ready state function to avoid mass calling document event trigger!

        app.popups();
        app.voteTrigger();
    });

    app.photosUpload();

    $('.form-select-box').each(function() {
        const $selectBox = $(this);
        const $select = $selectBox.find('select');
        const $selectOptions = $select.find('option');
        const $selectBoxHeader = $("<a href='#'></a>");
        const $selectBoxList = $('<div class="form-select-box__list"></div>');

        $selectOptions.each(function() {
            const $option = $(this);
            const $link = $("<a href='#'>" + $option.html() + "</a>");

            if ($option.is(':selected')) {
                $link.addClass('active');
                $selectBoxHeader.html($option.html());
            }

            $link.appendTo($selectBoxList);

            $link.click(function(e) {
                e.preventDefault();

                const $currentLink = $(this);
                const $options = $currentLink.closest('.form-select-box').find('select').find('option');

                $currentLink.siblings().removeClass('active');
                $currentLink.addClass('active');
                $selectBoxHeader.html($currentLink.html());
                $options.attr('selected', false);
                $currentLink.closest('.form-select-box').find('select').find('option').eq($currentLink.index()).attr('selected', true);
                $selectBox.removeClass('active');

                $selectBoxList.stop().slideUp(150);
                $selectBox.removeClass('active')
            });
        });

        $selectBoxList.prependTo($selectBox);
        $selectBoxHeader.prependTo($selectBox);



        $selectBoxHeader.click(function (e) {
            e.preventDefault();

            if ($selectBox.hasClass('active')) {
                $selectBoxList.stop().slideUp(150);
                $selectBox.removeClass('active')
            } else {
                $selectBoxList.stop().slideDown(200);
                $selectBox.addClass('active');
            }
        });

        $(document).on('click', function (e) {
            if(!$(e.target).closest('.form-select-box').length) {
                $selectBox.find('.form-select-box__list').stop().slideUp(150);
                $selectBox.removeClass('active');
            }
        });
    });

    $('.js-slide-questionnaire').click(function(e) {
        e.preventDefault();

        const memberQuestionnaireBlock = $('.member-questionnaire');
        const memberQuestionnaireBlockContent = memberQuestionnaireBlock.find('.member-questionnaire__content');

        if (memberQuestionnaireBlock.hasClass('active')) {
            $(this).show();
            memberQuestionnaireBlock.removeClass('active');
            memberQuestionnaireBlockContent.slideUp(300);
        } else {
            $(this).hide();
            memberQuestionnaireBlock.addClass('active');
            memberQuestionnaireBlockContent.slideDown(300);
        }
    });

    $('.js-change-password-type').click(function(e) {
        e.preventDefault();

        const $changeBtn = $(this);
        const $icon = $changeBtn.find('.icon');
        const $input = $changeBtn.prev();

        if($changeBtn.hasClass('active')) {
            $icon.removeClass('icon-eye-dark').addClass('icon-eye');
            $input.attr('type', 'password');
            $changeBtn.removeClass('active');
        } else {
            $icon.removeClass('icon-eye').addClass('icon-eye-dark');
            $input.attr('type', 'text');
            $changeBtn.addClass('active');
        }
    });


    $('.js-photolist-trigger').click(function(e) {
        e.preventDefault();

        $('.photolist').addClass('photolist-full');

        let timeout = 0;

        $('.photolist .photolist__item:not(.visiblity-true)').each(function () {
            const $this = $(this);
            setTimeout(function () {
                $this.addClass('visiblity-true');
            }, timeout);

            timeout += 200;
        });
    });

    $('.js-chose-other-photo').on('click', function (e) {
        e.preventDefault();

        app.popups().closePopup('warning-photo');
        $('input[type="file"]:eq(0)').click();
    })

})();
