/**
 * Config, variable
 */
var id = new AutoIncrement();
var pipeline = new Pipeline();
/**
 * Function or class
 */
var Message = function(data, template, parent){
    var self = this;
    self._id = id.next();
    self._template = template;
    self._parent = parent;
    self._component = null;
    self._parent._add(self);

    self._data = new ReactiveDict();
    _.each(data, function(v, k){
        self._data.set(k, v);
    });
};
_.extend(Message.prototype, {
    constructor: Message,
    show: function(){
        var self = this;
        Deps.autorun(function(c){
            if(self._component){
                self._component.dom.remove();
                self._component = null;
                self._parent._remove(self._id);
            }
            self._component = self._parent._render(self._getMigrationData(), self._template);
            self._parent._insert(self._component);
        });
        return this;
    },
    hide: function(){
        return this;
    },
    update: function(data, delay){
        var delay = delay || 0;
        var self = this;
        pipeline.push(function(){
            Meteor.setTimeout(function(){
                _.each(data, function(v, k){
                    self._data.set(k, v);
                });

                pipeline.requireFlush(1);
            }, delay * 1000);
        });

        if(!pipeline.isWillFlush())
            pipeline.requireFlush(1);
        return this;
    },
    clear: function(delay){
        var delay = delay || 0;
        var self = this;
        pipeline.push(function(){
            Meteor.setTimeout(function(){
                self._component.dom.remove();
                self._component = null;
                self._parent._remove(self._id);

                pipeline.requireFlush(1);
            }, delay * 1000);
        });

        if(!pipeline.isWillFlush())
            pipeline.requireFlush(1);
    },
    _getMigrationData: function(){
        var self = this;
        var result = {};
        _.each(self._data.getMigrationData(), function(v, k){
            result[k] = self._data.get(k);
        });
        return result;
    }
});

/**
 * export
 */
(function(){
    var _messageList = {};
    var template = Template.messageDefault;
    var self = this;
    _.extend(self, {
        newMessage: function(data){
            var tmp = data.template ? data.template : template;
            if(data.template) {
                data.template = null;
                delete data.template;
            }
            return new Message(data, tmp, self);
        },
        _render: function(data, template){
            return UI.renderWithData(template, data);
        },
        _insert: function(component){
            return UI.insert(component, document.body);
        },
        _add: function(message){
            if(!message._id || !_.isNumber(message._id))
                throw new Error('message id is invalid');
            _messageList[message._id] = message;
        },
        _remove: function(id){
            if(!_.isNumber(id))
                throw new Error('id is invalid');
            _messageList[id] = null;
            delete _messageList[id];
        }
    });
}).apply(NotificationDOM);