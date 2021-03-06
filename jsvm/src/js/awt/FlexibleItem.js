/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without modification, 
 are permitted provided that the following conditions are met:
 
 1. Redistributions of source code must retain the above copyright notice, 
 this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above copyright notice, 
 this list of conditions and the following disclaimer in the 
 documentation and/or other materials provided with the distribution.
 
 3. Neither the name of the JSVM nor the names of its contributors may be 
 used to endorse or promote products derived from this software 
 without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 OF THE POSSIBILITY OF SUCH DAMAGE.

 *
 * Author:	Pan Mingfa
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * @param def: {Object} Definition of current item, include:
 *	   id: {String} 
 *	   iconImage: {String} Optional. Image filename for the icon.
 *	   labelText: {String} Optional. Textual content for current item. 
 *	   
 *	   markable: {Boolean} Default is true.
 *	   iconic: {Boolean} Indicate whether an icon existed for current item.
 *	   custom: {Object} Specify a component as current item's main contents. It's prior.
 *			   If the custom is specified, the given textual content will be ignored.
 *			   Otherwise an input or label will be created.
 */
js.awt.FlexibleItem = function(def, Runtime){
	var CLASS = js.awt.FlexibleItem,
	thi$ = CLASS.prototype;
	
	if(CLASS.__defined__){
		this._init.apply(this, arguments);
		return;
	}
	CLASS.__defined__ = true;
	
	var Class = js.lang.Class, Event = js.util.Event,
	DOM = J$VM.DOM, System = J$VM.System;
	
	thi$.isCustomized = function(){
		return this._local.customized;	
	};
	
	/**
	 * @see js.awt.Item #getPreferredSize
	 */
	thi$.getPreferredSize = function(){
		var U = this._local, prefSize = this.def.prefSize, customComp, 
		nodes, leftmostCtrl, len, overline = false, width = 0, preEle,
		ele, s, w, bounds, D;

		if(!prefSize){
			customComp = this.getCustomComponent();
			nodes = this.view.childNodes;
			leftmostCtrl = U.leftmostCtrl || this.ctrl;
			
			len = nodes.length;
			for(var i = 0; i < len; i++){
				ele = nodes[i];
				if(leftmostCtrl && ele == leftmostCtrl){
					break;
				}
				
				if(customComp && customComp.view == ele){
					if(!overline){
						overline = true;
						width += ele.offsetLeft;
					}
					s = customComp.getPreferredSize();
					width += s.width;
				}else{
					if(ele.tagName == "SPAN" || ele.tagName == "INPUT"){
						if(!overline){
							overline = true;
							width += ele.offsetLeft;
						}
						
						if(ele.tagName == "SPAN"){
							width += DOM.getTextSize(ele).width;   
						}else{
							width += ele.scrollWidth;
						}
					}
				}
			}
			
			w = U.ctrlsWidth;
			if(!isNaN(w)){
				width += w;
			}
			
			if(this.ctrl){
				D = DOM.getBounds(this.ctrl);
				width += D.MBP.marginLeft + D.width + D.MBP.marginRight;
			}
			
			bounds = this.getBounds();
			width += bounds.MBP.BPW;
			prefSize = {width: width, height: bounds.height};
		}
		
		return prefSize;
		
	}.$override(this.getPreferredSize);
	
	/**
	 * @see js.awt.Item #isMoverSpot
	 */
	thi$.isMoverSpot = function(el, x, y){
		if($super(this)){
			var extraCtrls = this._local.extraCtrls,
			ids = extraCtrls ? extraCtrls.keys() : [], ctrl;
			for(var i = 0, len = ids; i < len; i++){
				ctrl = this[ids[i]];
				if(el === ctrl){
					return false;
				}
			}
			
			if(this.customComponent 
			   && this.customComponent.contains(el, true)){
				return false;
			}
		}
		
		return true;
		
	}.$override(this.isMoverSpot);
	
	/**
	 * @see js.awt.Item #doLayout
	 */
	thi$.doLayout = function(force){
		if(!this.isDOMElement() || !this.needLayout(force)){
			return false;
		}
		
		var customComp = this.getCustomComponent(), 
		leftmostCtrl = this._local.leftmostCtrl,
		ele = (customComp && customComp.view) 
			? customComp.view : (this.input || this.label),
		leftEle, rightEle, w, width, bounds, D, MBP, ybase,
		innerHeight, x, y;

		if(ele){
			bounds = this.getBounds();
			MBP = bounds.MBP;
			innerHeight = bounds.innerHeight;

			leftEle = ele.previousSibling;
			rightEle = leftmostCtrl || this.ctrl;
			w = rightEle ? rightEle.offsetLeft : bounds.innerWidth;
			
			if(customComp && customComp.view){
				ybase = MBP.paddingTop;

				if(leftEle){
					D = DOM.getBounds(leftEle);
					x = leftEle.offsetLeft + D.width + D.MBP.marginRight;
				}else{
					x = MBP.borderLeftWidth + MBP.paddingRight;
				}

				D = customComp.getBounds();
				y = ybase + (innerHeight - D.height)*0.5;

				width = Math.max(w - x, 0);
				customComp.setBounds(x, y, width, undefined);

				// Trigger custom component's doLayou
				customComp.doLayout(true);
			}else{
				width = Math.max(w - ele.offsetLeft, 0);

				if(this.input){
					DOM.setSize(ele, width, undefined);
				}else{
					ele.style.width = width + "px";
				}
			}
		}
		
		return true;
		
	}.$override(this.doLayout);

	thi$.destroy = function(){
		delete this._local.leftmostCtrl;
		delete this._local.extraCtrls;
		
		$super(this);
		
	}.$override(this.destroy);
	
	/**
	 * Specify a component as current item's customized contents.
	 * 
	 * @param comp: {Object} A custom component must be an object of the Component
	 *		  or Component's derived class. And it must implement an getValue method
	 *		  to return the item's value.
	 */
	thi$.setCustomComponent = function(comp){
		if(!comp || !comp.view 
		   || !Class.isFunction(comp.getValue)){
			return;
		}
		
		var customComponent = this._local.customComponent,
		ctrl = this._local.leftmostCtrl || this.ctrl, peer;
		if(customComponent){
			DOM.remove(customComponent.view, true);
		}else{
			this._local.customComponent = comp;
		}
		
		comp.applyStyles({position: "absolute"});
		DOM.insertBefore(comp.view, ctrl, this.view);
		comp.setContainer(this);
		
		var uuid = this.uuid(), items = this.def.items,
		nodes = comp.view.childNodes || [], node, id, 
		i = 0, len = nodes.length;
		while(i <= len){
			if(i == len){
				node = comp.view;
				
				id = node.id = "custom";
				items.push(id);
				this[id] = node;
			}else{
				node = nodes[i];
				id = node.id;
			}
			
			node.uuid = uuid;
			node.iid = (node.iid || id.split(/\d+/g)[0]);
			
			++i;
		}
		
		if(DOM.isDOMElement(comp.view)){
			this.doLayout(true);
		}
	};
	
	/**
	 * Return the customized component of current item.
	 */
	thi$.getCustomComponent = function(){
		return this._local.customComponent;	 
	};
	
	/**
	 * Judge whethe the current event hit some extra ctrl.
	 * 
	 * @param e: {js.awt.Event}
	 */	   
	thi$.hitCtrl = function(e){
		var src = e.srcElement, extraCtrls = this._local.extraCtrls, 
		ids = extraCtrls ? extraCtrls.keys() : undefined, id, ele, ctrl;
		if(!src || !ids || ids.length == 0) {
			return false;
		}
		
		for(var i = 0, len = ids.length; i < len; i++){
			id = ids[i];
			ele = this[id];
			
			if(ele && DOM.contains(ele, src, true)){
				// ctrl = extraCtrls.get(id);
				return true;
			}
		}
		
		return false;
	};

	var _createExtraCtrls = function(){
		var M = this.def, U = this._local, buf = this.__buf__,
		ctrls = M.ctrls, len = ctrls.length;
		if(len == 0){
			return;
		}

		var extraCtrls = U.extraCtrls = new js.util.HashMap(), MBP,
		bounds = DOM.getBounds(this.view), innerHeight = bounds.innerHeight,
		ybase = bounds.MBP.paddingTop, anchor = this.ctrl, ctrlsWidth = 0, 
		align = 0.5, top = 0, right = 0, el, iid, D, w, h, styleW, styleH,
		ctrl, ctrlId, 

		items = M.items, uuid = this.uuid(), 
		imagePath = this.Runtime().imagePath();

		if(this.ctrl){
			D = DOM.getBounds(this.ctrl);
			right = bounds.MBP.paddingRight 
				+ D.MBP.marginLeft + D.width + D.MBP.marginRight; 
		}
		
		for(var i = len - 1; i >= 0; i--){
			ctrl = ctrls[i];
			ctrlId = ctrl.id || ("ctrl" + i);
			iid = ctrlId.split(/\d+/g)[0];

			if(ctrlId !== "ctrl"){
				extraCtrls.put(ctrlId, ctrl);
				
				el = DOM.createElement("DIV");
				el.id = ctrlId;
				el.iid = iid;
				el.uuid = uuid;
				el.className = ctrl.className 
					|| DOM.combineClassName(this.className, "extra");
				
				buf.clear();
				buf.append("position:absolute;");
				
				if(ctrl.image){
					buf.append("background-image: url(")
						.append(imagePath + ctrl.image).append(");")
						.append("background-repeat:no-repeat;background-position:center;");
				}
				
				if(ctrl.css){
					buf.append(css);
				}				 
				el.style.cssText = buf.toString();
				
				D = DOM.getBounds(el);
				MBP = D.MBP;

				w = ctrl.width;
				if(!Class.isNumber(w)){
					w = D.innerWidth;
				}

				h = ctrl.height;
				if(!Class.isNumber(h)){
					h = D.innerHeight;
				}

				DOM.setBounds(el, w, h, D);

				buf.append("width:").append(styleW).append("px;");
				buf.append("height:").append(styleH).append("px;");
				
				align = (ctrl.align && !isNaN(ctrl.align)) ? ctrl.align : align; 
				top = ybase + (innerHeight - D.height) * align;
				buf.append("top:").append(top).append("px;");
				buf.append("right:").append(right).append("px;");
				el.style.cssText = buf.toString();
				
				DOM.insertBefore(el, anchor, this.view);
				anchor = el;
				
				// The leftmost ctrl which will be used to calculate the lable 
				// or input width in doLayout
				U.leftmostCtrl = el;

				items.push(ctrlId);
				this[ctrlId] = el;
				
				ctrlsWidth = D.MBP.marginLeft + D.width + D.MBP.marginRight;
				right += ctrlsWidth;
			}else{
				System.err.println("The \"ctrl\" has been reserved for special purpose.");
			}
			
			// Cache this value for calculate the prefered size
			U.ctrlsWidth = ctrlsWidth;
		}
	};
	
	var _createCustomComponent = function(){
		var R = this.Runtime(), cdef = this.def.custom,
		comp = new (Class.forName(custom.classType))(custom, R);

		this.setCustomComponent(comp);
	};
	
	var _checkItems = function(def){
		var U = this._local = this._local || {}, items = def.items, 
		custom = def.custom, customized = false;
		
		if(Class.isObject(custom) 
		   && Class.isString(custom.classType)){
			customized = U.customized = true;
		}
		
		if(items.length > 0){
			return def;
		}
		
		if(def.markable === true){
			items.push("marker");
		}
		
		if(def.iconic !== false){
			items.push("icon");
		}
		
		if(!customized){
			if(Class.isValid(def.inputText)){
				items.push("input");
			}else{
				items.push("label");
			}
		}
		
		if(def.controlled === true){
			items.push("ctrl");
		}
		
		return def;
	};
	
	thi$._init = function(def, Runtime, view){
		if(typeof def !== "object") return;
		
		def.classType = def.classType || "js.awt.FlexibleItem";
		def.markable = def.markable !== false;
		def.strict = false;
		
		if(view == undefined){
			def.items = js.util.LinkedList.$decorate([]);
			_checkItems.call(this, def);
		}
		
		$super(this, def, Runtime, view);
		
		if(this.isCustomized()){
			_createCustomComponent.call(this);
		}
		
		if(Class.isArray(def.ctrls)){
			_createExtraCtrls.call(this);
		}
		
		if(this.isMarkable()){
			this.mark(def.checked);
		}
		
	}.$override(this._init);
	
	this._init.apply(this, arguments);
	
}.$extend(js.awt.Item);
