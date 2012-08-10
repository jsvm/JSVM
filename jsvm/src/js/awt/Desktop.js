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
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.awt");

$import("js.awt.Container");

js.awt.Desktop = function (element){

    var CLASS = js.awt.Desktop, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System, MQ =J$VM.MQ, Factory = J$VM.Factory;
    
    /**
     * Popup message box
     * 
     * @see js.lang.Runtime
     */
    thi$.message = function(type, subject, content){
        var msgbox = {
            className: "msgbox",
            model:{
                msgType: type,
                msgSubject: subject || "Subject",
                msgContent: content || "Content"
            }
        };

        this.openDialog(
            "message",
            {},
            new js.awt.MessageBox(msgbox, this));

    }.$override(this.message);

    var _registerMessageClass = function(){
        Factory.registerClass(
            {
                classType : "js.awt.Dialog",
                className : "message",

                items: [ "title", "client", "btnpane"],

                title: {
                    classType: "js.awt.HBox",
                    className: "win_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],
                    
                    labTitle:{
                        classType: "js.awt.Label",
                        className: "win_title_label",
                        text : "Dialog",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
                        className: "win_title_button",
                        iconImage: "dialog_close.png"
                    }
                },

                client:{
                    classType: "js.awt.Container",
                    className: "message_client",
                    constraints: "center",
                    css: "overflow:hidden;",
                    layout:{
                        classType: "js.awt.BorderLayout"
                    }                
                },

                btnpane:{
                    classType: "js.awt.HBox",
                    className: "message_btnpane",
                    constraints: "south",

                    items:["btnCancel"],
                    
                    btnCancel:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnClose", "Close")
                    },
                    
                    layout:{
                        gap: 4,
                        align_x : 1.0,
                        align_y : 0.0
                    }
                },

                width: 330,
                height:150,
                miniSize:{width:330, height:150},
                resizable: true
            }
        );
    };

    var _registerConfirmClass = function(){
        Factory.registerClass(
            {
                classType : "js.awt.Dialog",
                className : "confirm",

                items: [ "title", "client", "btnpane"],

                title: {
                    classType: "js.awt.HBox",
                    className: "win_title",
                    constraints: "north",

                    items:["labTitle", "btnClose"],
                    
                    labTitle:{
                        classType: "js.awt.Label",
                        className: "win_title_label",
                        text : "Confirm",
                        rigid_w: false,
                        rigid_h: false
                    },

                    btnClose:{
                        classType: "js.awt.Button",
                        className: "win_title_button",
                        iconImage: "dialog_close.png"
                    }
                },

                client:{
                    classType: "js.awt.Container",
                    className: "message_client",
                    constraints: "center",
                    css: "overflow:hidden;",
                    layout:{
                        classType: "js.awt.BorderLayout"
                    }                
                },

                btnpane:{
                    classType: "js.awt.HBox",
                    className: "message_btnpane",
                    constraints: "south",

                    items:["btnOK", "btnCancel"],

                    btnOK:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnOK", "Yes")
                    },
                    
                    btnCancel:{
                        classType: "js.awt.Button",
                        className: "dlg_button",
                        effect: true,
                        labelText: this.nlsText("btnNo", "No")
                    },
                    
                    layout:{
                        gap: 4,
                        align_x : 1.0,
                        align_y : 0.0
                    }
                },

                modal: true,                
                width: 330,
                height:150,
                miniSize:{width:330, height:150},
                resizable: true
            }
        );
    };

    var _activateComponent = function(target, uuid){
        if(!target) return;
        
        if(target.activateComponent){
            target.activateComponent();
        }
    };

    var _notifyLM = function(e){
        var el = e.srcElement, target = e.getEventTarget(), 
        uuid = el ? el.uuid : undefined;

        _activateComponent.$delay(this, 1, target, uuid);

        this.LM.cleanLayers(e, this);
        return true;
    };
    
    var _onresize = function(e){
        var d = this.getBounds();
        this.LM.clearStack(e);
        if(this._local.userW != d.width || this._local.userH != d.height){
            this.def.width = this._local.userW = d.width;
            this.def.height= this._local.userH = d.height;

            this.doLayout(true);
        }
    };

    /**
     * @see js.awt.BaseComponent
     */
    thi$.destroy = function(){
        arguments.callee.__super__.apply(this, arguments);

        this.DM.destroy();
        delete this.DM;
        
        this.LM.destroy();
        delete this.LM;

    }.$override(this.destroy);

    thi$._init = function(element){
        var def = {
            classType: "js.awt.Desktop",
            className: "jsvm_desktop",
            css: "position:absolute;width:100%;height:100%;",
            zorder:true,
            stateless: true,
            layout:{
                classType: "js.awt.AbstractLayout"
            }
        };
        
        arguments.callee.__super__.apply(this, [def, this, element]);

        if(!element){
            var body = document.body;
            this.insertBefore(body.firstChild, body);
        }

        this.LM = new js.awt.LayerManager(this);

        var DM = this.DM = new js.awt.Container(
            {classType: "js.awt.Desktop",
             zorder:true,
             stateless: true,
             zbase: 1000
            }, this, this.view);

        DM.destroy = function(){
            this.removeAll(true);

        }.$override(DM.destroy);
        
        this.attachEvent(Event.W3C_EVT_RESIZE, 4, this, _onresize);
        
        // Bring the component to the front and notify popup LayerManager
        Event.attachEvent(document.body, "mousedown", 0, this, _notifyLM);

        // Notify popup LayerManager
        Event.attachEvent(document.body,
                          J$VM.firefox ? "DOMMouseScroll" : "mousewheel",0, this, _notifyLM);

        MQ.register("js.awt.event.LayerEvent", this, _notifyLM);
        
        _registerMessageClass.call(this);
        _registerConfirmClass.call(this);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.Container).$implements(js.lang.Runtime);
