define	( [ './EventNodePresentation.js'
		  , '../DragDrop.js'
		  , '../utils.js'
		  ]
		, function(EventNodePresentation, DragDrop, utils) {

// linking CSS
var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/HTML_templates/PeventFromSocketIOPresentation.css');
	document.body.appendChild(css);
	
var htmlTemplate = null, htmlTemplateFilter = null;
utils.XHR( 'GET', 'js/Presentations/HTML_templates/PeventFromSocketIOPresentation.html'
		 , function() {htmlTemplate = this.responseText;}
		 );
utils.XHR( 'GET', 'js/Presentations/HTML_templates/PeventFromSocketIOPresentationFilter.html'
		 , function() {htmlTemplateFilter = this.responseText;}
		 );

// Defining PeventFromSocketIOPresentation
var PeventFromSocketIOPresentation = function() {
	EventNodePresentation.prototype.constructor.apply(this, []);
	this.event = {topic: '', filters:[]};
	this.html = {};
	return this;
}

PeventFromSocketIOPresentation.prototype = new EventNodePresentation();
PeventFromSocketIOPresentation.prototype.className = 'PeventFromSocketIO';

PeventFromSocketIOPresentation.prototype.serialize	= function() {
	var json = EventNodePresentation.prototype.serialize.apply(this, []);
	json.subType = 'PeventFromSocketIOPresentation';
	json.event = { topic	: this.event.topic
				 , filters	: []
				 };
	if(this.html.filter) {
		 var L_filters = this.html.filter.querySelectorAll( 'div.FILTER' )
		   , filter;
		 for(var i=0; i<L_filters.length; i++) {
			 filter = L_filters.item(i);
			 json.event.filters.push( { attribute	: filter.querySelector('input.attribute').value
									  , operator	: filter.querySelector('select.operator').value
									  , value		: filter.querySelector('input.value'    ).value
									  } 
									);
			}
		}
	// console.log("PeventFromSocketIOPresentation::serialize =>", json);
	return json;
}

PeventFromSocketIOPresentation.prototype.unserialize	= function(json, PresoUtils) {
	// console.log("PeventFromSocketIOPresentation::unserialize", json);
	EventNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.event = json.event;
	if(this.html.eventTopic) {
		 this.html.eventTopic.setAttribute('value', this.event.topic);
		 // Add filters
		 var i, filter;
		 for(i=0; i<this.event.filters.length; i++) {
			 filter = this.event.filters[i];
			 this.appendFilter( filter.attribute, filter.operator, filter.value );
			}
		}
	return this;
}

PeventFromSocketIOPresentation.prototype.appendFilter	= function(attribute, operator, value) {
	var filter = document.createElement( 'div' );
		filter.classList.add( 'FILTER' );
		filter.innerHTML = htmlTemplateFilter;
		var del = filter.querySelector( 'input.delete' );
		del.onclick = function() {filter.parentNode.removeChild(filter); del.onclick = null;}
		if(attribute) {filter.querySelector('.attribute').value = attribute;}
		if(operator ) {filter.querySelector('.operator' ).value = operator ;}
		if(value    ) {filter.querySelector('.value'    ).value = value    ;}
	this.html.filter.appendChild( filter );
}

PeventFromSocketIOPresentation.prototype.Render	= function() {
	var self = this;
	var root = EventNodePresentation.prototype.Render.apply(this, []);
	root.classList.add('PeventFromSocketIOPresentation');
	if(htmlTemplate && htmlTemplateFilter) {
		// Describe the event to be observed on socketIO
		this.divDescription.innerHTML = htmlTemplate;
		this.html.filter		= this.divDescription.querySelector(".eventRoot > .filter");
		this.html.eventTopic	= this.divDescription.querySelector("input.receive.topic");
			this.html.eventTopic.onkeyup = function() {self.event.topic = self.html.eventTopic.value;};
			this.html.eventTopic.setAttribute('value', this.event.topic);
		this.html.addFilter	= this.divDescription.querySelector(".filter > input.addFilter");
			this.html.addFilter.onclick	= function() {self.appendFilter();}
		 // Add filters
		 var i, filter;
		 for(i=0; i<this.event.filters.length; i++) {
			 filter = this.event.filters[i];
			 this.appendFilter( filter.attribute, filter.operator, filter.value );
			}
		}
	return root;
}

// Return the constructor
return PeventFromSocketIOPresentation;
});
