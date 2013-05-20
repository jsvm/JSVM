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

$package("js.awt.shape");

$import("js.awt.Shape");

/**
 * def:{
 *   cx: 
 *   cy:
 *   radius:
 *   startAngle:
 *   endAngle:
 *   angleUnit: "deg" | "rad"
 *   close: "open" | "short" | "center"
 * }
 */
js.awt.shape.Arc = function(def, Runtime){

    var CLASS = js.awt.shape.Arc, thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System,
        Graph = Class.forName("js.awt.Graphics2D");

    thi$.getArc = function(){
        var M = this.def, u = this.getAttr("angleUnit") || Graph.RAD,
            s = M.startAngle, e = M.endAngle;

        s = Class.isNumber(s) ? Graph.deg2rad(s, u) : 0;
        e = Class.isNumber(e) ? Graph.deg2rad(e, u) : 2*Math.PI;

        return {
            cx: M.cx,
            cy: M.cy,
            radius: M.radius,
            startAngle: s,
            endAngle: e,
            close: M.close
        };
    };

    thi$.relDraw = function(shape){
        var layer = shape.getLayer();
        switch(layer.classType()){
        case "js.awt.CanvasLayer":
            layer.drawArc(shape);
            break;
        default:
            // TODO: for svg, vml ?
            break;
        };
    };

    thi$.hitDraw = function(shape){
        var layer = shape.getLayer();
        switch(layer.classType()){
        case "js.awt.CanvasLayer":
            layer.drawArc(shape, true);
            break;
        };
    };

    thi$.isFill = function(){
        return arguments.callee.__super__.apply(this, arguments) && 
            (def.close !== "open");
    }.$override(this.isFill);

    thi$._init = function(def, Runtime){
        if(def == undefined) return;

        def.classType = def.classType || "js.awt.shape.Arc";

        var r = def.radius;
        def.x = def.cx - r;
        def.y = def.cy - r;
        def.width = def.height = 2 * r;

        def.close = def.close || "open";
        arguments.callee.__super__.apply(this, arguments);

    }.$override(this._init);
    
    this._init.apply(this, arguments);

}.$extend(js.awt.Shape);

