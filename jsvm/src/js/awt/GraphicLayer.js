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
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://github.com/jsvm
 */

$package("js.awt");

/**
 * 
 */
js.awt.GraphicLayer = function(def, Runtime){

    var CLASS = js.awt.GraphicLayer, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ;

    thi$.getGraph = function(){
        return this.getContainer();
    };

    thi$.getContext = function(){

    };

    thi$.getShape = function(id){
        return this.getComponent(id);
    };

    thi$.addShape = function(shape){
        return this.addComponent(shape);
    };

    thi$.delShape = function(id){
        return this.removeComponent(id);
    };

    thi$.measureText = function(text, font, ctx){
    };

    thi$.getAttr = function(key){
        var v = arguments.callee.__super__.apply(this, arguments), p;
        if(!v){
            p = this.getContainer();
            v = p ? p.getAttr(key) : undefined;
        }
        return v;
    }.$override(this.getAttr);

    thi$._init = function(def, Runtime){
		if(def == undefined) return;

        def.classType = def.classType || "js.awt.GraphicLayer";
        
        var zorder = def.zorder;
        def.zorder = Class.isBoolean(zorder) ? zorder : true;

        def.layout = def.layout || {classType: "js.awt.AbstractLayout"};

        arguments.callee.__super__.apply(this, arguments);
        
    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container);
