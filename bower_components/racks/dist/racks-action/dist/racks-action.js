(function() {
    var RacksActionElementPrototype = Object.create(HTMLElement.prototype);

    function cleanupHandler(el) {
        var pair = el._rs.listener;
        if (pair && pair[0]) {
            pair[0].removeEventListener(pair[1], pair[2]);
        }
    }

    function makeHandler(method, target) {
        return function(e) {
            var data = e.detail;
            if (method in target && typeof target[method] === 'function') {
                target[method](data);
            }
        };
    }

    function setupHandler(el) {
        var source = el.getAttribute('source');
        var trigger = el.getAttribute('trigger') || 'click';
        var action = el.getAttribute('action');
        var target = el.getAttribute('target');
        var sourceEl;
        if (!action || !target) {
            return;
        }
        var targetEl = document.getElementById(target);
        if (!targetEl) {
            return;
        }
        if (source) {
            sourceEl = document.getElementById(source);
        }
        if (!sourceEl) {
            sourceEl = el;
        }
        var listener = makeHandler(action, targetEl);
        el._rs.listener = [sourceEl, trigger, listener];
        sourceEl.addEventListener(trigger, listener);
    }

    RacksActionElementPrototype.createdCallback = function () {
        this._rs = {};
    };

    RacksActionElementPrototype.attachedCallback = function () {
        setupHandler(this);
    };

    RacksActionElementPrototype.detachedCallback = function () {
        cleanupHandler(this);

    };

    RacksActionElementPrototype.attributeChangedCallback = function () {
        cleanupHandler(this);
        setupHandler(this);
    };

    if (!window.RacksActionElement) {
        window.RacksActionElement = document.registerElement('racks-action', {
            prototype: RacksActionElementPrototype
        });
    }

})();
