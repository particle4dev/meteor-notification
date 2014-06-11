/**
 *
 */
AutoIncrement = (function(){
    return function(value, func){
        var id = null;
        var generator = function(value){
            return value;
        };
        if(!_.isUndefined(value))
            id = value;
        else
            id = 1;
        if(_.isFunction(func))
            generator = func;
        else if(_.isUndefined(func))
            generator = function(v){
                return v + 1;
            }
        this.next = function(){
            var result = _.clone(id);
            id = generator(id);
            return result;
        };
    };
})();