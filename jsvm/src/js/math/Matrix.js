/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 *
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.math");

/**
 * def:{
 *   M: Array 
 *   m:
 *   n: 
 *  }
 */
js.math.Matrix = function(def){
    var CLASS = js.math.Matrix,
        thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;

    thi$.Aij = function(i, j, value){
        var M = this.M;
        if(Class.isValid(value)){
            M[i][j] = value;
        }
        return M[i][j];
    };
    
    thi$._init = function(def){
        if(!Class.isObject(def)) return;

        var M = this.M = def.M;
        if(Class.isArray(M)){
            this.m = M.length;
            var r0 = M[0];
            this.n = r0.length;
        }else{
            M = this.M = [];
            var m = this.m = def.m;
            var n = this.n = def.n;
            var C;
            for(var i=0; i<m; i++){
                C = [];
                for(var j=0; j<n; j++){
                    C.push(0);
                }
                M.push(C);
            }
        }
    };
    
    this._init.apply(this, arguments);
};

js.math.Matrix.plus = function(M0, M1){
    if(M0.m !== M1.m || M0.n !== M1.n) 
        throw "M1's m*n must be same as M0";
    
    var i, j, m = M0.m, n = M0.n, v,
        ret = new js.math.Matrix({m:m, n:n});

    for(i=0; i<m; i++){
        for(j=0; j<n; j++){
            v = M0.Aij(i, j) + M1.Aij(i, j);
            ret.Aij(i, j, v);
        }
    }

    return ret;
};

js.math.Matrix.multiply = function(M0, M1){
    if(M0.n !== M1.m) 
        throw "M1.m must be same as M0.n";

    var i, j, k,  m = M0.m, n = M0.n, p = M1.n, v=0,
        ret = new js.math.Matrix({m:m, n:p});

    for(i=0; i<m; i++){
        for(j=0; j<p; j++){
            v = 0;
            for(k=0; k<n; k++){
                v += M0.Aij(i,k)*M1.Aij(k,j);
            }
            ret.Aij(i, j, v);
        }
    }

    return ret;
};

