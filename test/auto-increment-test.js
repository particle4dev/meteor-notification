/**
 * Test
if(Meteor.isServer){
    Meteor.startup(function(){
        var a = new AutoIncrement("default value", function(value){
            return value + "123";
        });
        var b = new AutoIncrement(1, function(value){
            return value + 2;
        });
        var c = new AutoIncrement();

        console.log(a.next());
        console.log(a.next());
        console.log(a.next());
        console.log(a.next());
        
        console.log(b.next());
        console.log(b.next());
        console.log(b.next());
        console.log(b.next());
        
        console.log(c.next());
        console.log(c.next());
        console.log(c.next());
        console.log(c.next());
    });
}
 */