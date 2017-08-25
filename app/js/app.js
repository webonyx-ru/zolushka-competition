'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var YOURAPPNAME = function () {
    function YOURAPPNAME(doc) {
        _classCallCheck(this, YOURAPPNAME);

        this.doc = doc;
        this.window = window;
        this.html = this.doc.querySelector('html');
        this.body = this.doc.body;
        this.location = location;
        this.hash = location.hash;
        this.Object = Object;
        this.scrollWidth = 0;

        this.scrollWidth = this.scrollBarWidth();
    }

    // Window load types (loading, dom, full)


    _createClass(YOURAPPNAME, [{
        key: 'appLoad',
        value: function appLoad(type, callback) {
            var _self = this;

            switch (type) {
                case 'loading':
                    if (_self.doc.readyState === 'loading') callback();

                    break;
                case 'dom':
                    _self.doc.onreadystatechange = function () {
                        if (_self.doc.readyState === 'complete') callback();
                    };

                    break;
                case 'full':
                    _self.window.onload = function (e) {
                        callback(e);
                    };

                    break;
                default:
                    callback();
            }
        }
    }, {
        key: 'scrollBarWidth',


        // Detect scroll default scrollBar width (return a number)
        value: function scrollBarWidth() {
            var _self = this;
            var outer = _self.doc.createElement("div");

            outer.style.visibility = "hidden";
            outer.style.width = "100px";
            outer.style.msOverflowStyle = "scrollbar";

            _self.body.appendChild(outer);

            var widthNoScroll = outer.offsetWidth;

            outer.style.overflow = "scroll";

            var inner = _self.doc.createElement("div");

            inner.style.width = "100%";
            outer.appendChild(inner);

            var widthWithScroll = inner.offsetWidth;

            outer.parentNode.removeChild(outer);

            return widthNoScroll - widthWithScroll;
        }
    }, {
        key: 'initSwitcher',
        value: function initSwitcher() {
            var _self = this;

            var switchers = _self.doc.querySelectorAll('[data-switcher]');

            if (switchers && switchers.length > 0) {
                for (var i = 0; i < switchers.length; i++) {
                    var switcher = switchers[i],
                        switcherOptions = _self.options(switcher.dataset["switcher"]),
                        switcherElems = switcher.children,
                        switcherTargets = _self.doc.querySelector('[data-switcher-target="' + switcherOptions.target + '"]').children,
                        switchersActive = [];

                    for (var y = 0; y < switcherElems.length; y++) {
                        var switcherElem = switcherElems[y],
                            parentNode = switcher.children,
                            switcherTrigger = switcherElem.children.length ? switcherElem.children[0] : switcherElem,
                            switcherTarget = switcherTargets[y];

                        if (switcherElem.classList.contains('active')) {
                            for (var z = 0; z < parentNode.length; z++) {
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
                                    for (var _z = 0; _z < elem.parentNode.children.length; _z++) {
                                        elem.parentNode.children[_z].classList.remove('active');
                                        targets[_z].classList.remove('active');
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
        }
    }, {
        key: 'str2json',
        value: function str2json(str, notevil) {
            try {
                if (notevil) {
                    return JSON.parse(str.replace(/([\$\w]+)\s*:/g, function (_, $1) {
                        return '"' + $1 + '":';
                    }).replace(/'([^']+)'/g, function (_, $1) {
                        return '"' + $1 + '"';
                    }));
                } else {
                    return new Function("", "const json = " + str + "; return JSON.parse(JSON.stringify(json));")();
                }
            } catch (e) {
                return false;
            }
        }
    }, {
        key: 'options',
        value: function options(string) {
            var _self = this;

            if (typeof string !== 'string') return string;

            if (string.indexOf(':') !== -1 && string.trim().substr(-1) !== '}') {
                string = '{' + string + '}';
            }

            var start = string ? string.indexOf("{") : -1;
            var options = {};

            if (start !== -1) {
                try {
                    options = _self.str2json(string.substr(start));
                } catch (e) {}
            }

            return options;
        }
    }, {
        key: 'popups',
        value: function popups(options) {
            var _self = this;

            var defaults = {
                reachElementClass: '.js-popup',
                closePopupClass: '.js-close-popup',
                currentElementClass: '.js-open-popup',
                changePopupClass: '.js-change-popup'
            };

            options = $.extend({}, options, defaults);

            var plugin = {
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
                    var pop = $(this).attr('data-popup-target');
                    plugin.openPopup(pop);
                });

                plugin.closePopupEl.on('click', function (e) {
                    e.preventDefault();

                    var pop = void 0;
                    if (this.hasAttribute('data-popup-target')) {
                        pop = $(this).attr('data-popup-target');
                    } else {
                        pop = $(this).closest(options.reachElementClass).attr('data-popup');
                    }

                    plugin.closePopup(pop);
                });

                plugin.changePopupEl.on('click', function (e) {
                    var closingPop = $(this).attr('data-closing-popup');
                    var openingPop = $(this).attr('data-opening-popup');

                    plugin.changePopup(closingPop, openingPop);
                });

                plugin.reachPopups.on('click', function (e) {
                    var target = $(e.target);
                    var className = options.reachElementClass.replace('.', '');
                    if (target.hasClass(className)) {
                        plugin.closePopup($(e.target).attr('data-popup'));
                    }
                });
            };

            if (options) plugin.init();

            return plugin;
        }
    }, {
        key: 'photosUpload',
        value: function photosUpload() {
            var $imageDropBox = $('#image-drop-box');

            if ($imageDropBox.length) {
                var imageList = [];
                var imageFilesList = [];
                var imageDropBoxLoadingClass = 'image-drop-box-loading';
                var imageDropBoxHasFilesClass = 'image-drop-box-has-file';
                var imageDropBoxFullClass = 'image-drop-box-full';

                var input = this.doc.getElementById('image-drop-box__files');

                var showPreloader = function showPreloader() {
                    $imageDropBox.addClass(imageDropBoxLoadingClass);
                };

                var hidePreloader = function hidePreloader() {
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

                var checkImageDropBox = function checkImageDropBox() {
                    imageList.length ? $imageDropBox.addClass(imageDropBoxHasFilesClass) : $imageDropBox.removeClass(imageDropBoxHasFilesClass);
                };

                var renderTemplate = function renderTemplate(src, index) {
                    return '<div class="fw-width-1-6 preview__item">' + '<div class="fw-width-1-1 fw-box-proportional-100 preview__thumb"><div class="fw-height-1-1 fw-width-1-1">' + '<img src="' + src + '" alt="" class="fw-img-cover fw-border-radius-5">' + '<a href="#' + index + '" class="fw-absolute fw-absolute-top-right fw-mt-inverse-10 fw-mr-inverse-10 preview__remove"><i class="icon icon-trash"></i></a>' + '</div></div></div>';
                };

                var renderFiles = function renderFiles() {
                    var $imagePreviewBox = $('#image-drop-box__preview');
                    var templates = [];
                    if (imageList.length) {
                        for (var i = 0; i < imageList.length; i++) {
                            var imageListSrc = imageList[i];

                            templates.push(renderTemplate(imageListSrc, i));

                            $imagePreviewBox.children().not(':last-child').remove();
                            $imagePreviewBox.prepend(templates.join(''));
                        }
                    }
                };
                $(this.doc).on('click', '.preview__remove', function (e) {
                    e.preventDefault();
                    showPreloader();

                    var $removeImage = $(this);
                    var index = parseInt($removeImage.attr('href').replace('#', ''));

                    if (index > 0) {
                        imageList.splice(index, 1);
                        imageFilesList.splice(index, 1);
                    } else {
                        imageList.shift();
                        imageFilesList.shift();
                    }
                    checkImageDropBox();
                    setTimeout(function () {
                        renderFiles();
                        hidePreloader();
                        $removeImage.closest('.preview__item').remove();
                    }, 300);
                });

                input.addEventListener('change', function () {
                    var currentFiles = this.files;
                    var currentFilesLength = currentFiles.length;

                    if (currentFilesLength) {
                        showPreloader();

                        var _loop = function _loop(i) {

                            if (imageList.length <= 15) {
                                var reader = new FileReader();

                                reader.onload = function (e) {

                                    imageList.push(e.target.result);
                                    imageFilesList.push(currentFilesLength[i]);
                                    checkImageDropBox();

                                    if (i === currentFilesLength - 1) {
                                        setTimeout(function () {
                                            renderFiles();
                                            hidePreloader();
                                        }, 300);
                                    }
                                };

                                reader.readAsDataURL(currentFiles[i]);
                            }
                        };

                        for (var i = 0; i < currentFilesLength; i++) {
                            _loop(i);
                        }
                    }
                });
            }
        }
    }, {
        key: 'voteTrigger',
        value: function voteTrigger() {
            var $voteItems = $('.js-vote-item');
            $('.js-vote-trigger').on('click', function (e) {
                e.preventDefault();
                var $this = $(this);

                $this.addClass('active');

                $voteItems.addClass('transition');

                setTimeout(function (e) {
                    $this.removeClass('active');
                    var $timeout = 0;
                    $voteItems.each(function () {
                        var $voteItem = $(this);
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
    }, {
        key: 'dropBox',
        value: function dropBox() {
            var dropBoxClassName = 'drop-box',
                dropBoxLoaderClassName = 'drop-box__loader',
                dropBoxElementClassName = 'drop-box__element',
                dropBoxElementCloneClassName = dropBoxElementClassName.concat('--copy'),
                dropBoxElementRemoveClassName = dropBoxElementClassName.concat('--remove'),
                dropBoxInputClassName = 'drop-box__input';

            var files = {};

            var dropBoxElementRemove = function dropBoxElementRemove(e) {
                e.preventDefault();

                var $dropBoxElementRemoveTrigger = $(this),
                    $dropBoxElementRemoveTriggerSrc = $dropBoxElementRemoveTrigger.data('src'),
                    $dropBoxElement = $dropBoxElementRemoveTrigger.closest('.'.concat(dropBoxElementClassName)),
                    $dropBox = $dropBoxElementRemoveTrigger.closest('.'.concat(dropBoxClassName)),
                    $dropBoxInput = $dropBox.find('.'.concat(dropBoxInputClassName));

                $dropBoxElement.remove();
                files[$dropBoxElementRemoveTriggerSrc] = null;
                delete files[$dropBoxElementRemoveTriggerSrc];

                $dropBoxInput.val('');

                console.log(Object.keys(files));
            };

            var dropBoxInputChanged = function dropBoxInputChanged(e) {
                var $dropBoxInput = $(this),
                    $dropBoxInputFiles = $dropBoxInput.prop('files'),
                    $dropBox = $dropBoxInput.closest('.'.concat(dropBoxClassName)),
                    $elementClone = $dropBox.find('.'.concat(dropBoxElementCloneClassName)),
                    $dropBoxLoader = $dropBox.find('.'.concat(dropBoxLoaderClassName));

                if ($dropBoxInputFiles.length) {
                    $.each($dropBoxInputFiles, function (key, file) {
                        if (files[file.name] === undefined) {
                            files[file.name] = file;

                            var $element = $elementClone.clone(),
                                $elementImage = $element.find('img'),
                                $elementRemover = $element.find('.'.concat(dropBoxElementRemoveClassName));

                            $element.removeClass(dropBoxElementCloneClassName);
                            $element.removeClass('fw-hidden');
                            $element.addClass(dropBoxElementClassName);
                            $elementRemover.attr('data-src', file.name);

                            $elementRemover.attr('data-src', file.name);

                            $elementRemover.on('click', dropBoxElementRemove);

                            var reader = new FileReader();

                            reader.onload = function (e) {
                                $elementImage.attr('src', e.target.result);
                            };

                            reader.readAsDataURL(file);

                            $element.appendTo($dropBoxLoader);
                        }

                        if ($dropBoxInputFiles.length - 1 === key) {}
                    });
                }
            };

            $('.'.concat(dropBoxInputClassName)).on('change', dropBoxInputChanged);

            return {
                reinitialize: function reinitialize() {
                    $('.'.concat(dropBoxInputClassName)).on('change', dropBoxInputChanged);
                }
            };
        }
    }]);

    return YOURAPPNAME;
}();

(function () {

    var app = new YOURAPPNAME(document);

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

    app.dropBox();

    $('#image-drop-box__preview').sortable();

    $('.form-select-box').each(function () {
        var $selectBox = $(this);
        var $select = $selectBox.find('select');
        var $selectOptions = $select.find('option');
        var $selectBoxHeader = $("<a href='#'></a>");
        var $selectBoxList = $('<div class="form-select-box__list"></div>');

        $selectOptions.each(function () {
            var $option = $(this);
            var $link = $("<a href='#'>" + $option.html() + "</a>");

            if ($option.is(':selected')) {
                $link.addClass('active');
                $selectBoxHeader.html($option.html());
            }

            $link.appendTo($selectBoxList);

            $link.click(function (e) {
                e.preventDefault();

                var $currentLink = $(this);
                var $options = $currentLink.closest('.form-select-box').find('select').find('option');

                $currentLink.siblings().removeClass('active');
                $currentLink.addClass('active');
                $selectBoxHeader.html($currentLink.html());
                $options.attr('selected', false);
                $currentLink.closest('.form-select-box').find('select').find('option').eq($currentLink.index()).attr('selected', true);
                $selectBox.removeClass('active');

                $selectBoxList.stop().slideUp(150);
                $selectBox.removeClass('active');
            });
        });

        $selectBoxList.prependTo($selectBox);
        $selectBoxHeader.prependTo($selectBox);

        $selectBoxHeader.click(function (e) {
            e.preventDefault();

            if ($selectBox.hasClass('active')) {
                $selectBoxList.stop().slideUp(150);
                $selectBox.removeClass('active');
            } else {
                $selectBoxList.stop().slideDown(200);
                $selectBox.addClass('active');
            }
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest('.form-select-box').length) {
                $selectBox.find('.form-select-box__list').stop().slideUp(150);
                $selectBox.removeClass('active');
            }
        });
    });

    $('.profile-share-icon').on('click', function () {
        $('.profile-share-icon').children('input[type=radio]').attr('checked', false);
        $('.profile-share-icon').removeClass('active');
        $(this).children('input[type=radio]').attr('checked', true);
        $(this).siblings('button').addClass('active');
        $(this).addClass('active');
    });

    $('.js-slide-questionnaire').click(function (e) {
        e.preventDefault();

        var memberQuestionnaireBlock = $('.member-questionnaire');
        var memberQuestionnaireBlockContent = memberQuestionnaireBlock.find('.member-questionnaire__content');

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

    $('.js-change-password-type').click(function (e) {
        e.preventDefault();

        var $changeBtn = $(this);
        var $icon = $changeBtn.find('.icon');
        var $input = $changeBtn.prev();

        if ($changeBtn.hasClass('active')) {
            $icon.removeClass('icon-eye-dark').addClass('icon-eye');
            $input.attr('type', 'password');
            $changeBtn.removeClass('active');
        } else {
            $icon.removeClass('icon-eye').addClass('icon-eye-dark');
            $input.attr('type', 'text');
            $changeBtn.addClass('active');
        }
    });

    $('.js-photolist-trigger').click(function (e) {
        e.preventDefault();

        $('.photolist').addClass('photolist-full');

        var timeout = 0;

        $('.photolist .photolist__item:not(.visiblity-true)').each(function () {
            var $this = $(this);
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
    });

    $('.js-open-image-gallery').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });

    $('.photo-menu__dots').on('click', function () {
        var $menuItems = $(this).siblings('.photo-menu__items');
        if ($menuItems.hasClass('active')) {
            $menuItems.removeClass('active');
            $menuItems.closest('.photo-menu').removeClass('clicked');
        } else {
            $menuItems.addClass('active');
            $menuItems.closest('.photo-menu').addClass('clicked');
        }
    });

    $('.hover-photo-menu').hover(function () {
        var $menuItems = $('.photo-menu__items');
        if ($menuItems.hasClass('active')) {
            $menuItems.removeClass('active');
            $menuItems.closest('.photo-menu').removeClass('clicked');
        }
    });
})();