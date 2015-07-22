var MtEventHandler = function MtEventHandler(){

    this.__channels = {};

    //DO NOT CHANGE DURING RUNTIME!!!
    this.__eventlistPropertyName = "__mt_evedddnts";


    this.__defineProperty = function(obj, val, func){
        Object.defineProperty(obj, val, {
          value: func,
          writable: false,
          enumerable: false,
          configurable: false
        });
    };

    /*
     * This initializes while loading and sets the property-name of the eventlist for all objects
     */
    this.__eventFunctions = {
        "on": (function(propertyName){
            return function(eventName, func){
                var eventMap = this[propertyName];
                if(!eventMap) throw TypeError("This is not an mt-Evented Object!");
                if(!(func instanceof Function)) throw TypeError("Need to provide Function Object to \"ON\"");
                // if this is the first event with this name, create new array for this event type
                if(!eventMap[eventName]) eventMap[eventName] = [];
                var identifier = eventMap[eventName].length;
                eventMap[eventName].push(func);
                return identifier;
            };
        })(this.__eventlistPropertyName),

        "emit": (function(propertyName){
            return function(eventName, infoObj){
                var eventMap = this[propertyName];
                if(!eventMap || !(eventMap instanceof Object)) throw TypeError("This is not an mt-Evented Object!");
                // if this is the first event with this name, create new array for this event type
                eventMap[eventName].forEach(function(func){
                    !!func && func(infoObj);
                });
            };
        })(this.__eventlistPropertyName),

        "ignore": (function(propertyName){
            return function(eventName, identifier){
                var eventMap = this[propertyName];
                if(!eventMap ) throw TypeError("This is not an mt-Evented Object!");
                if(!eventMap[eventName] || !eventMap[eventName][identifier]) throw RangeError("Don't have this event!");

                var eventFunc = eventMap[eventName][identifier];
                eventMap[eventName][identifier] = undefined;
                return eventFunc;
            };
        })(this.__eventlistPropertyName)
    };



    this.createChannel = function(channelName){
        if(this.__channels[channelName]) throw Error("This channel already exists!");

        var channel = {};
        var eventName = "basicChannelEvent";
        var eventFunctions = this.__eventFunctions;

        this.__defineProperty(channel, this.__eventlistPropertyName, {});

        channel.listen = function(func){
            return eventFunctions.on.call(channel, eventName, func);
        };

        channel.broadcast = function(infoObj){
            return eventFunctions.emit.call(channel, eventName, infoObj);
        };

        channel.ignore = function(identifier){
            return eventFunctions.ignore.call(channel, eventName, identifier);
        };

        this.__channels[channelName] = channel;
        return channel;
    };

    this.getChannel = function(channelName){
        if(!this.__channels[channelName]) throw Error("This channel doesn't exist!");
        return this.__channels[channelName];
    };



    this.makeEvented = function(obj){
        this.__defineProperty(obj, this.__eventlistPropertyName, {});
        this.__defineProperty(obj, "on", this.__eventFunctions.on);
        this.__defineProperty(obj, "emit", this.__eventFunctions.emit);
        this.__defineProperty(obj, "ignore", this.__eventFunctions.ignore);
    };

};

if(typeof module !== "undefined" && typeof module.exports !== "undefined") module.exports.MtEventHandler = MtEventHandler;
