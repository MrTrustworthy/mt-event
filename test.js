
var runTests = function(){

    var noMsg = function(){
        console.info("-----------NO Message should follow---------------");
    };
    var oneMsg = function(){
        console.info("-----------ONE Message should follow---------------");
    };
    var twoMsg = function(){
        console.info("-----------TWO Messages should follow:---------------");
    }

    var Player = function(name){

        this.name = name;
        this.friend = null;
        this.friendIndex = null;

        this.setFriend = function(friend){
            this.friend = friend;
            this.friendIndex = friend.on("hit", function(obj){
                console.log("oh no my friend", friend.name, "has been hit!", obj.info);
            });
        };

        this.removeFriend = function(){
            this.friend.ignore("hit", this.friendIndex);
        };

        this.hit = function(){
            console.log("I'm", this.name, "and I've been hit!");
            this.emit("hit", {info: "ok!"});
        };
    };

    var p1 = new Player("Arnold");
    var p2 = new Player("Brutus");

    var eventHandler = new MtEventHandler();

    eventHandler.makeEvented(p1);
    eventHandler.makeEvented(p2);

    p1.setFriend(p2);
    p2.setFriend(p1);

    twoMsg();
    p1.hit();

    twoMsg();
    p2.hit();

    p1.removeFriend();
    p2.removeFriend();

    oneMsg();
    p1.hit();

    oneMsg();
    p2.hit();

    //----------------------------------------------------------------------------
    console.log("..............................................................");

    var c1 = eventHandler.createChannel("one");
    var c1a = c1.listen(function(obj){
        console.log("listening to channel1 playing", obj.info);
    });
    var c1b = c1.listen(function(obj){
        console.log("ALSO listening to channel1 playing", obj.info);
    });

    twoMsg();
    c1.broadcast({info: "wonderwall"});

    oneMsg();
    c1.ignore(c1a);
    c1.broadcast({info: "wonderwall"});

    var c2 = eventHandler.createChannel("two");
    var c2a = c2.listen(function(obj){
        console.log("c2 and listening to channel1 playing", obj.info);
    });
    var c2b = c2.listen(function(obj){
        console.log("ALSO c2 and listening to channel1 playing", obj.info);
    });

    twoMsg();
    c2.broadcast({info: "nickelback"});

    oneMsg();
    c2.ignore(c2a);
    c2.broadcast({info: "nickelback"});

    noMsg();
    c2.ignore(c2b);
    c2.broadcast({info: "nothing"});

};
