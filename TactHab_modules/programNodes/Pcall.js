define( [ 'async'
	    ]
	  , function(async) {
// Definition of a call for programs
var Pcall = function(targets, mtdName, params, CB_success, CB_cancel) {
	 this.CB_cancel	= CB_cancel;
	 this.CB_success= CB_success;
	 this.targets	= targets;
	 this.mtdName	= mtdName;
	 this.params	= params;
	 this.nb_res	= 0;
	 return this;
	}
Pcall.prototype.constructor = Pcall;

Pcall.prototype.update_res	= function(A_res, i, type, value) {
	A_res[i] = {type: type, value: value};
	this.nb_res++;
	if(this.nb_res === A_res.length) {
		 // Check all results to decide which callback to trigger
		 for(var j=0; j<A_res.length; j++) {
			 if(A_res[j].type === 'error') {this.CB_cancel (A_res); return;}
			}
		 this.CB_success(A_res);
		}
}

Pcall.prototype.executeFor	= function(A_res, i) {
	var self = this, obj, mtd, res, params;
	try {params = this.params.slice(0);
		 params.push( function(res) {self.update_res(A_res, i, 'success', res);}
					, function(err) {self.update_res(A_res, i, 'error'  , err);}
					);
		 obj = this.targets[i];
		 if(obj) {
			 mtd = obj[this.mtdName];
			 res = mtd.apply(obj, params);
			 if(res !== undefined) {this.update_res(A_res, i, 'success', res);}
			} else {console.error("Unknown target object for method", this.mtdName);}
		} catch (err) {
			 console.error( "Error axecuting action:", err
						  , "\n\t-mtd:", this.mtdName
						  , "\n\t-obj:", obj?'PRESENT':'NONE'
						  , "\n\t-par:", params
						  , "\n\t-this.params:", this.params
						  , "\n\t-obj:", obj
						  );
			 A_res[i] = {error  : err};
			}
}

Pcall.prototype.execute = function() {
	var self = this;
	// console.log("Pcall :", this.targets.length, this.mtdName, this.params);
	// this.CB_success, this.CB_cancel
	try {var A_res = new Array(this.targets.length);
		 if(A_res.length) {
			 for(var i=0; i<A_res.length; i++) {this.executeFor(A_res, i);}
			} else {self.CB_success();}
		} catch(err) {self.CB_cancel(err);}
}

Pcall.prototype.cancel = function() {
	this.CB_cancel();
}

return Pcall;
});