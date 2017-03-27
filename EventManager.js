var EventManager = (function EventManager(){
  
   var EventManager = function(){
   	  this.eventMap = {};
   	  this.handlers = ["add","remove","setup"];
   	  this.guid = 0;
   };

   function isArrayOrObject(obj,type){
      return Object.prototype.toString.call(obj) === '[object ' + type + ']';
   }

   
   function deepClone(obj){
     var child;

     if(isArrayOrObject(obj,'Array')){
     	child = obj.slice(0);
     }else if(isArrayOrObject(obj, 'Object')){
      child = {};
     	for(var key in obj){
     		if(obj.hasOwnProperty(key)){
           child[key] = deepClone(obj[key]);
     		}
     	}
     }else{
     	child = obj;
     }

      return child;
   }
   
   EventManager.prototype.registerEvent = function(name,eventObj) {
   	 var eventMap = this.eventMap;

   	 if(!eventMap.hasOwnProperty(name)){
   	 	eventMap[name] = {};

   	 	for(var i=0,len=this.handlers.length; i<len; i++){
   	 		var handlerName = this.handlers[i] + "Handler";
   	 		eventMap[name][handlerName] = eventObj[handlerName] || null;
   	 	}

   	 	eventMap[name]["queue"] = [];
   	 }else{
   	 	for(var key in eventObj){
   	 	    if( !key.test(/'queue'/g)){
   	 	      eventMap[name][key] = eventObj[key];
   	 	    }else{
   	 	    	eventMap[name][key].concat(eventObj[key].slice(0));
   	 	    }
   	 		
   	 	}
   	 }

   };


   EventManager.prototype.removeEvent = function(name){
   	  var eventMap = this.eventMap;

   	  if(!eventMap.hasOwnProperty(name)){console.log("has no such event type"); return ;}

   	  delete eventMap[name];
   }

   EventManager.prototype.on = function(elem,type,callback){
   	  var args = Array.prototype.slice.call(arguments, 0);
   	  if(args.length < 3 || !this.eventMap.hasOwnProperty(type)) return ; // 如果参数提供的不齐全，或者没有该type，那么直接返回

      //这里应该调整一下参数，先不实现
      var queue = this.eventMap[type]["queue"],
          addHandler = this.eventMap[type]["addHandler"],
          setupHandler = this.eventMap[type]["setupHandler"],
          i = 0, len = queue.length,dom = "dom";

      
      for(; i<len; i++){
      	if(elem.nodeType == 1 && queue[i][dom] === elem){//该元素已经监听过的情况
           addHandler &&addHandler.apply(elem);

           queue[i]["callbacks"].push(callback);
           break;
      	}
      }

      if(i == len){ // 该元素还没有监听任何事件
      	var temp = {
      		"id" : this.guid++,
      		"dom" : elem,
      		"callbacks" : []
      	};

      	setupHandler && setupHandler.apply(elem);
      	temp["callbacks"].push(callback);

      	queue.push(deepClone(temp));
      	temp = null;
      }
   }

   EventManager.prototype.off = function(elem,type){
   	  var queue = this.eventMap[type]["queue"];

   	  if(arguments.length < 2 || queue == undefined) return ;

   	  var i=0, len= queue.length,removeHandler = this.eventMap[type]["removeHandler"];

   	  for(; i<len; i++){
   	  	 if(elem.nodeType == 1 && queue[i]["dom"] === elem){
   	  	 	removeHandler && removeHandler.apply(elem);
   	  	 	queue.splice(i,1);
   	  	 	break;
   	  	 }
   	  }
   }

   EventManager.prototype.fire = function(elem,type){
     var queue = this.eventMap[type]["queue"];

     if(arguments.length < 2 || queue === undefined) return;

     var i=0,len = queue.length;
     for(; i<len; i++){
        var context = queue[i]["dom"],
            callbacks = queue[i]["callbacks"];

        callbacks.forEach(function(callback){
           callback.call(context,elem);
        });
     }
   }

   function plugin(){
   	 return new EventManager();
   }

   return plugin();
 
})();