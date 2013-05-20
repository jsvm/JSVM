/**
 * @File SVGGraphic.js
 * @Create 2013-1-4
 * @author fengbo.wang@china.jinfonet.com
 */
$package("js.awt");

$import("js.awt.Graphic");

js.awt.SVGGraphic = function(def, Runtime){
    var CLASS = js.awt.SVGGraphic, thi$ = CLASS.prototype;
    if (CLASS.__defined__) {
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    var Class = js.lang.Class, Event = js.awt.Event, DOM = J$VM.DOM,
        System = J$VM.System, MQ = J$VM.MQ;

    thi$.drawPath = function(ginfo){
        var pot = ginfo.points,
            p = (function(ps){
                var s = ["M"];
                for (var i = 0, k = 1, ii = ps.length; i < ii; i++) {
                    s[k++] = ps[i].x;
                    s[k++] = ps[i].y;
                }
                s[k] = "Z";
                return s;
            })(pot);

        var rect = this.g.path(p);
        if(ginfo.param)
            rect.attr(ginfo.param);
        bindEvent(rect,ginfo);
        return rect;
    }.$override(this.drawPath);

    thi$.drawRect = function(ginfo){
        var p = ginfo.points[0],s=ginfo.size;
        var rect = this.g.rect(p.x, p.y, s.w, s.h, s.r||0);
        if(ginfo.param)
            rect.attr(ginfo.param);
        bindEvent(rect,ginfo);
        return rect;
    }.$override(this.drawRect);

    thi$.drawLabel = function(ginfo){
        var p=ginfo.points[0];
        var Jtext = this.g.text(p.x, p.y, ginfo.v).attr(ginfo.param);
        if(ginfo.rotate)
            Jtext.rotate(ginfo.rotate, p.x,p.y);
        bindEvent(Jtext,ginfo);
        return Jtext;
    }.$override(this.drawLabel);

    thi$.drawImage = function(ginfo){
        var img=ginfo.imginfo,p=ginfo.points[0];
        var Jimg = this.g.image(img.path, p.x, p.y, img.width, img.height);
        if(ginfo.param){
            Jimg.attr(ginfo.param);
        }
        bindEvent(Jimg,ginfo);
        return Jimg;
    }.$override(this.drawImage);

    thi$.drawEllipse = function(ginfo){
        var p=ginfo.points[0],s=ginfo.size,path = this.g.ellipse(p.x, p.y, s.w, s.h);
        if(ginfo.param)
            path.attr(ginfo.param);
        bindEvent(path,ginfo);
        return path;
    }.$override(this.drawEllipse);

    thi$.drawLine = function(ginfo){
        var pot = ginfo.points,
            p = (function(ps){
                var s = ["M"];
                for (var i = 0, k = 1, ii = ps.length; i < ii; i++) {
                    s[k++] = ps[i].x;
                    s[k++] = ps[i].y;
                }
                return s;//.join(",");
            })(pot);
        var rect = this.g.path(p);
        if(ginfo.param)
            rect.attr(ginfo.param);
        return rect;
    }.$override(this.drawLine);

    thi$.drawCircle = function(ginfo){
        var arc = ginfo.arcInfo,
            at = arc.at,
            v = arc.v,
            a = null;
        if (v == "0")
            return;
        a = this.g.circle(arc.cx,arc.cy,arc.R);
        a.attr(at);

        if (ginfo.lab){
            var lab = ginfo.lab,la = lab.vLab.lab;
            if (!lab.on){
                this.drawLine(lab);
            }
            this.drawLabel(la);
        }
        bindEvent(a,ginfo);
    }.$override(this.drawCircle);

    thi$.drawEllipse3D = function(ginfo){
        var arc = ginfo.arcInfo,
            f = ginfo.floor,
            at = arc.at,
            v = arc.v,
            a = null,
            as = this.g.set();
        if (v == "0")
            return;
        for (var i = f; i > 1; i--){
            a = this.g.ellipse(arc.cx, arc.cy + i, arc.r, arc.R);
            a.attr(at[1]);
            as.push(a);
        }
        a = this.g.ellipse(arc.cx, arc.cy, arc.r, arc.R);
        a.attr(at[0]);
        as.push(a);
        if (ginfo.lab){
            var lab = ginfo.lab,la = lab.vLab.lab;
            if (!lab.on){
                this.drawLine(lab);
            }
            this.drawLabel(la);
        }
        bindEvent(as,ginfo);
    }.$override(this.drawEllipse3D);

    thi$.drawPieArc = function(ginfo){
        var arc = ginfo.arcInfo,
            f = ginfo.floor,
            at = arc.at,
            v = arc.v,
            a = null,g=this.g,
            as = g.set();

        for (var i = f; i > 1; i--){
            a = this.g.path(['M', arc.cx, arc.cy+i, 'L', arc.x1, arc.y1+i, 'A', arc.r, arc.R, 0,
                arc.a, 0, arc.x2, arc.y2+i, 'Z']);
            a.attr(at[1]);
            as.push(a);
        }
        a = this.g.path(['M', arc.cx, arc.cy, 'L', arc.x1, arc.y1, 'A', arc.r, arc.R, 0,
            arc.a, 0, arc.x2, arc.y2, 'Z']);
        a.attr(at[0]);
        as.push(a);

        if (ginfo.lab){
            var lab = ginfo.lab,la = lab.vLab.lab;
            if (!lab.on){
                this.drawLine(lab);
            }
            this.drawLabel(la);
        }
        bindEvent(as,ginfo);
    }.$override(this.drawPieArc);

    thi$.drawPieRArc = function(ginfo){
        var arc = ginfo.arcInfo,
            f = ginfo.floor,
            at = arc.at,
            v = arc.v,
            a = null,
            g=this.g,
            as = g.set();
        var y = arc.cy - arc.R;
        var	n = arc.R - arc.H;
        for (var i = f; i > 1; i--){
            a = g.path(['M', arc.cx, y + i, 'a', arc.r, arc.R, 0, 1, 0, 1, 0, 'm', -1, n,
                'a', arc.h, arc.H, 0, 1, 1, -1, 0]);
            a.attr(at[1]);
            as.push(a);
        }
        a = g.path(['M', arc.cx, y, 'a', arc.r, arc.R, 0, 1, 0, 1, 0, 'm', -1, n,
            'a', arc.h, arc.H, 0, 1, 1, -1, 0]);
        a.attr(at[0]);
        as.push(a);
        if (ginfo.lab){
            var lab = ginfo.lab,la = lab.vLab.lab;
            if (!lab.on){
                this.drawLine(lab);
            }
            this.drawLabel(la);
        }

        bindEvent(as,ginfo);
    }.$override(this.drawPieRArc);

    thi$.drawPieDArc = function(ginfo){
        var arc = ginfo.arcInfo,
            f = ginfo.floor,
            at = arc.at,
            v = arc.v,
            a = null,
            g=this.g,
            as = g.set();

        for (var i = f; i > 1; i--){
            a = g.path(['M', arc.x1, arc.y1 + i, 'A', arc.r, arc.R, 0, arc.a, 0, arc.x2, arc.y2 + i,
                'L', arc.x3, arc.y3 + i, 'A', arc.h, arc.H, 0, arc.a, 1, arc.x4, arc.y4 + i, 'Z']);
            a.attr(at[1]);
            as.push(a);
        }
        a = g.path(['M', arc.x1, arc.y1, 'A', arc.r, arc.R, 0, arc.a, 0, arc.x2, arc.y2,
            'L', arc.x3, arc.y3, 'A', arc.h, arc.H, 0, arc.a, 1, arc.x4, arc.y4, 'Z']);
        a.attr(at[0]);
        as.push(a);

        if (ginfo.lab){
            var lab = ginfo.lab,la = lab.vLab.lab;
            if (!lab.on){
                this.drawLine(lab);
            }
            this.drawLabel(la);
        }

        bindEvent(as,ginfo);
    }.$override(this.drawPieDArc);

	thi$.drawDountArcPath=function(ginfo){
		var ps = ginfo.points;
		var JPath = this.g.path(['M', ps[0].x, ps[0].y, 'A', ps[1].r, ps[1].R, 0, ps[1].a, 0, ps[2].x, ps[2].y,
		'L', ps[3].x, ps[3].y, 'A', ps[4].w, ps[4].h, 0, ps[4].a, 1, ps[5].x, ps[5].y, 'Z']);
		if (ginfo.param){
			JPath.attr(ginfo.param);
		}
		bindEvent(JPath,ginfo);
	};
	
	thi$.drawcurve=function(ginfo){
		var ps = ginfo.points;
		var JPath = this.g.path(['M', ps[0].x, ps[0].y, 'A', ps[1].r, ps[1].R, 0, ps[1].a, 0, ps[2].x, ps[2].y]);
		if (ginfo.param){
			JPath.attr(ginfo.param);
		}
		bindEvent(JPath,ginfo);
		return ;
	};
	
    thi$.createSet=function(){
        return this.g.set();
    };

    thi$.removeAll=function(){
        this.g.remove();
    };
	
	thi$.setSize = function(w, h){
		this.g.setSize(w, h);
	};
	
    thi$.clear=function(){
        var bot = this.g.bottom;
        while (bot) {
            bot.remove();
            bot = this.g.bottom;
        }
    };

    var bindEvent=function(el,ginfo){
        var id=ginfo.uuid;
        if (id){
            var msg=ginfo.msg;
            if(msg){
                var ms = msg.msgInfo;
                for (var n=0, len = ms.length; n<len; n++){
                    var msgs = ms[n];
                    //var msgdef =  $.extend(true,{},msgs);
                    var msgdef = System.objectCopy(msgs,{},true);
                    el[msgs.event](function(){
                        MQ.send("chartEvent", {"fn":"postMSG", pm:[msgdef.msg, msg.filed, msg.value, true]}, [id]);
                    });
                }
            }
            var menu=ginfo.menu;
            var link=ginfo.lnk;
            var gr=ginfo.group;
            var isAxis=ginfo.isAxis;
            if (menu || link || gr){// && m.type == "Chart"){
                if (link || gr){
                    el.attr("cursor", "pointer");
                }
                el.mousedown(function (event) {
                    var e = new Event(event);
                    if (J$VM.ie && parseInt(J$VM.ie) < 9){
                        e.button = event.button;
                    }
                    if (e.button == 2){
                        if (isAxis){
                            MQ.send("chartEvent", {"fn":"showAxisMenu", pm:[e, menu]}, [id]);
                        }else {
                            MQ.send("chartEvent", {"fn":"showValueMenu", pm:[e, menu]}, [id]);
                        }
                    }else if (e.button == 1){
                    	MQ.send("chartEvent", {"fn":"onMouseDown", pm:[e,link,gr]}, [id]);
//                        if (link){
//                            MQ.send("chartEvent", {"fn":"doLinkACtion", pm:[link]}, [id]);
//                        }else if (gr){
//                            MQ.send("chartEvent", {"fn":"doGoDown", pm:[gr]}, [id]);
//                        }
                    }
                });
            }
        }

        var v=ginfo.v;
        var tip=ginfo.tip,tipNode=ginfo.tipNode,tipText=ginfo.tipText,cssText = ginfo.hintCSS;
        if (tip && v && v != ""){
            el.mouseover(function (event) {
                var scTop = 0,scLeft = 0;
                if (J$VM.runtime.JDashboard){
                    var bounds = J$VM.runtime.JDashboard.Application.getActiveDashboard().getBounds();
                    scTop = bounds.scrollTop;
                    scLeft = bounds.scrollLeft;
                }
                tip.innerHTML="";
//                tip.cssText = cssText;
                if (tipText){
                    tip.innerHTML=tipText;
                }else {
                    tip.innerHTML=v;
                }
                if(event!=undefined){
                    tip.style.left=(event.clientX + 15 + scLeft)+"px";
                    tip.style.top=(event.clientY + scTop)+"px";
                    tip.style.display="block";
                }
                if (tipNode){
                    //Cross1, Cross2, Start1, Satrt2
                    if (tipNode[3].indexOf("1") != -1 || tipNode[3].indexOf("2") != -1){
                        tipNode[0].animate({stroke: tipNode[2]}, 0, "");
                    }else {
                        tipNode[0].animate({fill: tipNode[2]}, 0, "");
                    }
                }
            }).mouseout(function () {
                    tip.innerHTML="";
                    tip.style.display="none";
                    if (tipNode){
                        //Cross1, Cross2, Start1, Satrt2
                        if (tipNode[3].indexOf("1") != -1 || tipNode[3].indexOf("2") != -1){
                            tipNode[0].animate({stroke: tipNode[1]}, 0, "");
                        }else {
                            tipNode[0].animate({fill: tipNode[1]}, 0, "");
                        }
                    }
                });
        }
    };

    /*
     jsonStr:{font:{fontSize:"",fontName:"",fontStyle:["font-weight","font-style"]},value:""}
     */
    thi$.getHDimension=function(jsonStr){
        var d=this._local_?this._local_.dom:"";
        if(d)
            this.display();
        var font = jsonStr.font,
            fontStr = font.fontSize + 'px ' + _graphUtil.getFontFace(font.fontName),
            fontStyle =  font.fontStyle,
            at={opacity: 0,"font": fontStyle[0] + " " + fontStyle[1] + " " + fontStr};
        var lblT=this.drawLabel({points:[{x:100,y:100}],v:jsonStr.value,param:at,rotate:jsonStr.rt});
        var box=lblT.getBBox();
        var returnJson={"w":box.width,"h":box.height};
        lblT.remove();
        return returnJson;
    };

    thi$.display = function (){
        if(this._local_){
            var dom=this._local_.dom;
            if(dom){
                var f=dom.firstChild;
                if(f)
                    dom.insertBefore(this._local_.frag,f);
                else
                    dom.appendChild(this._local_.frag);
                if(this.g.raphael.svg){
                    var bot = this.g.bottom;
                    while (bot) {
                        bot.fixPostion();
                        bot = bot.next;
                    }
                }
                this.g.display();
                delete this._local_.frag;
                delete this._local_.dom;
            }
        }
    };

    thi$._init = function(def, Runtime){
        var cache=(def.cache==0?0:1)&&1;
        if(cache){
            this._local_={};
            var d=def.dom;
            var temp=document.createDocumentFragment();
            temp.tagName= "fragment";
            temp.width = d.style.pixelWidth;
            temp.height= d.style.pixelHeight;
            this._local_.dom=d;
            this._local_.frag=temp;
            this.g = Raphael(temp,def.width,def.height);
        }else
            this.g = Raphael(def.dom,def.width,def.height);
    }.$override(this._init);
    this._init.apply(this, arguments);
}.$extend(js.awt.Graphic);