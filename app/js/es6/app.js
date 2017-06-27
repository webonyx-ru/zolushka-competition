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
    });

})();
