/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: HotSpotLine.js
 * @Create: 2013/02/07 06:20:10
 * @Author: mingfa.pan@china.jinfonet.com
 */

$package("js.awt");

js.awt.HotSpotLine = function(def, Runtime){
	var CLASS = js.awt.HotSpotLine, thi$ = CLASS.prototype;
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, System = J$VM.System, DOM = J$VM.DOM;
	
	thi$.getMoveObject = function(e){
		var moveObj = this.moveObj;
		if(!moveObj){
			var absXY = DOM.absXY(this.view), 
			def = System.objectCopy(this.def, {}, true),
			ele = this.cloneView();
			
			def.className = this.className + "_move";
			def.stateless = true;
			
			if(ele){
				ele.className = def.className;
			}
			
			moveObj = this.moveObj = 
				new CLASS(def, this.Runtime(), ele);
			moveObj.applyStyles({position: "absolute"});
			moveObj.setMovingPeer(this.getPeerComponent());
			moveObj.appendTo(document.body);
			moveObj.setPosition(absXY.x, absXY.y);
		}

		return moveObj;
		
	}.$override(this.getMoveObject);
	
	thi$.getMovingMsgType = function(){
		return "js.awt.event.HotSpotLineMovingEvent";		  
		
	}.$override(this.getMovingMsgType);
	
	thi$._init = function(def, Runtime){
		if(typeof def !== "object") return;
		
		def.classType = def.classType || "js.awt.HotSpotLine";
		def.className = def.className || "jsvm_hotSpotLine";
		arguments.callee.__super__.apply(this, arguments);
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Component);
