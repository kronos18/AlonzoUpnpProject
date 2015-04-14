define	( [ './Program_UsePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(Program_UsePresentation, DragDrop) {

var Program_ExposedAPI_elementPresentation = function(infoObj) {
	// console.log(this);
	Program_UsePresentation.apply(this, [infoObj]);
	if(infoObj) {
		 this.init();
		 this.selector.variableId	= infoObj.config.variableId;
		 this.selector.variableName	= infoObj.config.variableName;
		 this.selector.variableTypes= infoObj.config.variableTypes;
		}
	return this;
}

Program_ExposedAPI_elementPresentation.prototype = new Program_UsePresentation();
Program_ExposedAPI_elementPresentation.prototype.className = 'Pselector_variable';

Program_ExposedAPI_elementPresentation.prototype.init		= function(PnodeID, parent, children) {
	Program_UsePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	if(typeof this.selector === 'undefined') {this.selector = {};}
	this.selector.variableId	= this.selector.variableId		|| null;
	this.selector.variableTypes	= this.selector.variableTypes	|| [];
	return this;
}

Program_ExposedAPI_elementPresentation.prototype.serialize	= function() {
	var json = Program_UsePresentation.prototype.serialize.apply(this, []);
	// Describe node here
	json.subType	= 'Program_ExposedAPI_elementPresentation';
	json.selector.variableId	= this.selector.variableId;

	return json;
}

Program_ExposedAPI_elementPresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	Program_UsePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.selector.variableId	= json.selector.variableId;
	this.selector.variableName	= json.selector.variableName;
	this.selector.variableTypes	= json.selector.variableTypes || [];
	if(this.html.spanVarId) {
		 this.html.spanVarId.innerHTML = '';
		 this.html.spanVarId.classList.add( this.selector.variableId );
		 for(var i=0;i<this.selector.variableTypes.length; i++) {
			 this.html.spanVarId.classList.add( this.selector.variableTypes[i] );
			}
		 this.html.spanVarId.appendChild( document.createTextNode(this.selector.variableName) );
		}
	return this;
}

Program_ExposedAPI_elementPresentation.prototype.updateType = function() {
	
}

Program_ExposedAPI_elementPresentation.prototype.Render	= function() {
	// var self = this;
	var root = Program_UsePresentation.prototype.Render.apply(this, []);
	root.classList.add('Pselector_variable');
	if(typeof this.html.spanVarId === 'undefined') {
		 this.html.spanVarId = document.createElement('span');
			this.html.spanVarId.classList.add( 'variable' );
			for(var i=0; i<this.selector.variableTypes.length; i++) {
				 this.html.spanVarId.classList.add( this.selector.variableTypes[i] );
				}
			this.divDescription.appendChild( this.html.spanVarId );
			if(this.selector.variableId) {
				 this.html.spanVarId.classList.add( this.selector.variableId );
				 this.html.spanVarId.appendChild( document.createTextNode(this.selector.variableName) );
				}
		}
	return root;
}

// Return the constructor
return Program_ExposedAPI_elementPresentation;
});