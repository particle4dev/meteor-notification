
    Pipeline = function () {
        var self = this;
        /**
         * Pipeline
         *
         *
         */
        var _pipeline = [];
        var length;
        /**
         * @description It is true if we are in flushing function now
         * @type {boolean}
         */
        var inFlush = false;
        /**
         * @description It true if a flushing function is scheduled, or if we are in flushing now
         * @type {boolean}
         */
        var willFlush = false;
        self.push = function(func /** param1, param2 ... */){
            var args = Array.prototype.slice.call(arguments, 1);
            if(!_.isFunction(func))
                throw new Error("param must be type of function");
            func = _.bind.apply(_, [func, null].concat(args));
            _pipeline.push(func);

            return this;
        };
        self.flushing = function(num){
            var tmp = null;
            inFlush = true;
            length = _.isNumber(num) ? num : _pipeline.length;
            for (var i = 0; i < length; i++) {
                tmp = _pipeline.shift();
                if(_.isFunction(tmp))
                    tmp();
            }
            //reset
            //_pipeline = [];
            length = 0;
            willFlush = false;
            inFlush = false;
            return this;
        };
        // set
        self.willFlush = function( p ){
            willFlush = !!p;
            return this;
        };
        self.inFlush = function( p ){
            inFlush = !!p;
            return this;
        };
        // get
        self.isWillFlush = function(){
            return willFlush;
        };
        self.isInFlush = function(){
            return inFlush;
        };
        self.requireFlush = function (num) {
            if (! willFlush) {
                var args = Array.prototype.slice.call(arguments, 0);
                var func = _.bind.apply(self, [self.flushing, null].concat(args));
                Meteor.setTimeout(func, 0);
                willFlush = true;
            }
            return this;
        }
    };