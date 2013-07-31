/**
 * EFESTO.JS - The fire's JavaScript Tool FrameWork
 * COPYRIGHT 2013
 * ***************
 * LUCA COLONNELLO
 * ***************
 * Efesto.js is a JavaScript framework that offers utilities for design pattern,
 * dinamycal script loading, view template engine with data controllers
 * ***************
 * Efesto.js use:
 * jQuery.js 1.9+
 * PHP.js
 * JSmart Template Engine
 * ***************
 * VERSION: 1.0
 * ***************
 * LICENCE: GPL v2
 **
*/

//use folding pattern to create functionality in Efesto.js

/** Efesto Object */
var Efesto = { };

//version
Efesto.version = "1.0";

//pattern object
Efesto.pattern = { };
(function( ) {
	
	//singleton pattern
	Efesto.pattern.singleton = ( function( handle ){
		return handle( );
	} );
	
	//factory pattern
	Efesto.pattern.factory = ( function( handle ){
		return (function( ) {
			return new handle( );
		});
	} );
	
	//observer pattern
	Efesto.pattern.observer = ( function( handle ){
		
		//observer
		handle.prototype.observer = [ ];
		
		//observe
		/*
		Observer object: (function(){
			this.Update = function( value ){
				// do some stuff with value ...
			}
		})()
		*/
		handle.prototype.addObserver = function( object ) {
			this.observer[ this.observer.length ] = object;
		};
		
		//update
		handle.prototype.update = function( value ) {
			for( var i in this.observer ) {
				this.observer[ i ].Update( value );
			}
		};
		
		return handle;
	} );
	
	//subscription pattern
	Efesto.pattern.subscription = ( function( handle ){
		
		//subscribers
		handle.prototype.subscribers = { };
		
		//subscribers
		/*
		Subscribers function: (function( value ){
			// do some stuff with value ...
		})
		*/
		handle.prototype.subscribe = function( name, func ) {
			this.subscribers[ name ] = func;
		};
		
		//unsubscribe
		handle.prototype.unsubscribe = function( name ) {
			if( this.subscribers[ name ] )
				this.subscribers[ name ] = false;
		};
		
		//notify
		handle.prototype.notify = function( value ) {
			for( var i in this.subscribers ) {
				if( !this.subscribers[ i ] ) continue;
				
				this.subscribers[ i ]( value );
			}
		};
		
		return handle;
	} );
	
	//module pattern
	Efesto.pattern.module = ( function( handle ){
		//modules
		handle.prototype.modules = { };
		
		//define method
		/*
		Define Module
		this.define( 'mymodule', function( module ) {
			//public vars and method
			module.a = 5;
			
			module.getAPerC = function( ) {
				return module.a * module.extract.c;
			};
			
			//public vars and method
			module.extract.c = 10;
			
			module.extract.getA = function( ) {
				// print 50
				return module.getAPerC( );
			};
		} );
		*/
		handle.prototype.define = function( name, func ){
			this.modules[ name ] = func;
		};
		
		//require method
		handle.prototype.require = function( name ){
			var module = {
				extract: { }
			};
			
			(this.modules[ name ])( module );
			
			return module.extract;
		};
		
		return handle;
	} );
	
	//production pattern
	/*		
		define (void):       definisce classi per creazione di oggetti
		[Object define] :
			- {} settings
			- {} data
			- {} vars
			- {} controller
			- {} view
			- () init
		create ([Object]):   permette di creare oggetti di un modello definito (classe inserita con define)
		[Object create] : 
			- {} settings
			- {} data
			- {} vars
			- {} controller
			- {} view
			- () init
		[Object created instance] :
			- {} settings
			- {} data
			- {} vars
			- {} controller
			- {} view
			- () init
			- () appendTo
			- () then
			- () add
			- () get
			- {} parent
	*/
	Efesto.pattern.production = ( function( ){
		 /* DATA ARCHIVE */
		 return Efesto.utils.singleton( function( ) {
			 //definition object
			 var _definition = {};
			 
			 
			 /* FACTORY CREATOR OBJECT MODELLING */
			 
			 //implement create object model
			 var objectModel = function( name, definition, config ){
			  //create object from object model
			  var _config = copyObject( definition );
			  
			  //object
			  var _obj = {};
			  
			  //archive data settings, data, vars, usedView
			  _obj.component = name;
			  _obj.id = microtime();
			  _obj.settings = $.extend( {}, _config.settings || {}, config.settings || {} );
			  _obj.data = $.extend( {}, _config.data || {}, config.data || {} );
			  _obj.vars = $.extend( {}, _config.vars || {}, config.vars || {} );
			  _obj.view = $.extend( {}, _config.view || {}, config.view || {} );
			  _obj.usedView = {};
			  _obj.usedObject = {};
			  _obj.parent = false;
			  
			  
			  //tree object incapsulation implementation
			  
			  //public add method
			  _obj.add = function( name, object ){
			   //add parent
			   object.parent = _obj;
			   
			   //add to usedObject
			   _obj.usedObject[ name ] = object;
			   
			   return object;
			  };
			  
			  //public get method
			  _obj.get = function( name ){
			   if( typeof name == "undefined" ) return false;
			   return ( ( typeof _obj.usedObject[ name ] != "undefined" ) ? _obj.usedObject[ name ] : false );
			  };
			  
			 
			  //controller implementation
			  var getController = function( name ){
			   if( typeof name == "undefined" ) return false;
			   return ( ( typeof _config.controller[ name ] != "undefined" ) ? _config.controller[ name ] : false );
			  };
			  
			  //public controller method
			  _obj.controller = function( name, param ){
			   //get controller
			   var c = getController( name );
			   
			   //check controller
			   if( !c ) return false;
			   
			   //check param - deleted in order to do check in controller for getting parameters
			   //if( typeof param == "undefined" ) param = {};
			   
			   //log system - to do
			   console.log( "--------------------------------------------------------------------------------------------" );
			   console.log( "Component: " + _obj.component + ", Controller: " + name + ", Param: " );
			   console.log( param );
			   console.log( "--------------------------------------------------------------------------------------------" );
			   
			   return c( _obj, param );
			  };
			  
			  
			  //view implementation
			  
			  //shared appendTo method, view and object
			  var appendTo = function( obj, selector, domnode, callback ){
			   //check param
			   if( typeof selector == "undefined" || typeof obj == "undefined" ) return false;
			   
			   //check parent
			   if( typeof domnode != "undefined" ) {
				//use jquery selector
				$( selector, domnode ).append( obj );
			   }
			   else {
				//use jquery selector
				$( selector ).append( obj );
			   }
			   
			   //callback
			   callback( _obj, obj );
			   
			   return _obj;
			  };
			  
			  //internal get view from config
			  var getView = function( name, parent ) {
			   if( typeof name == "undefined" ) return false;
			   
			   //get view
			   if( typeof _config.view[ name ] != "undefined" )
					var view = _config.view[ name ];
			   
			   //check device class exists or view is not an array
			   if( typeof Device == "undefined" || !view.length ) {
					return view;
			   }
			   
			   //loop selected view and look for view by screen properties
			   return Device.controller( 'getFromScreen', {
				items: view,
				parent: parent || window
			   } );
			  };
			  
			  //public view instance
			  _obj.view = function( name, param, saveName, parent ) {
			   //get view from config
			   var v = getView( name, parent );
			   
			   //check view
			   if( !v ) return false;
			   
			   //check param
			   if( typeof param == "undefined" ) param = {};
			   
			   //viewObj
			   var viewObj = v;
			   
			   //save name
			   viewObj.saveName = saveName || "";
			   
			   //appendTo implementation
			   viewObj.appendTo = function( selector, domnode ){
				//create view action
				var _crvaction = function( func, p, first, last ){
				 return func( _obj, p, first || false, last || false );
				};
				
				//check recursive
				if( typeof viewObj.recursive != "undefined" && typeof viewObj.recursive.param != "undefined" && typeof viewObj.recursive.as != "undefined" && typeof param[ viewObj.recursive.param ] != "undefined" ) {
				  //data
				  var data = [];
				  
				  //counter and length
				  var counter = 0;
				  var length = 0;
				  if( typeof param[ viewObj.recursive.param ].length != "undefined" ) length = param[ viewObj.recursive.param ].length;
				   
				  for( var i in param[ viewObj.recursive.param ] ) {
				   //param
				   var _param = copyObject( param );
				   _param[ viewObj.recursive.as ] = param[ viewObj.recursive.param ][i];
				   
				   //action
				   data[ data.length ] = _crvaction( viewObj.get, _param, ( ( counter == 0 ) ? true : false ), ( ( counter == ( length - 1 ) ) ? true : false ) );
				   
				   //append
				   var _callback = function( obj, view ) {
					//check afterAppend
					if( typeof viewObj.afterAppend == "undefined" ) return false;
					
					setTimeout( (function( _p ){
						return function( ) {
							//call afterAppend
							viewObj.afterAppend( obj, view, _p );
						};
					})( _param ), 50 );
				   };
				   appendTo( data[ data.length-1 ], selector, domnode, _callback );
				   
				   //counter +1
				   counter++;
				  }
				}
				else {
				 //action
				 var data = _crvaction( viewObj.get, param );
				 
				 //append
				 var _callback = function( obj, view ) {
					//check afterAppend
					if( typeof viewObj.afterAppend == "undefined" ) return false;
					
					setTimeout( function(){
						//call afterAppend
						viewObj.afterAppend( obj, view, param );
					}, 50 );
				 };
				 appendTo( data, selector, domnode, _callback );
				}
				
				//save in usedView
				if( viewObj.saveName != "" )
					_obj.usedView[ viewObj.saveName ] = data;
				
				return {
				 then: function( callback ){
				  callback( data );
				 }
				};
			   };
			   
			   return viewObj;
			  };
			  
			  //getView implementation - get view from used view by name
			  _obj.getView = function( name ) {
			   if( typeof name == "undefined" ) return _obj.usedView;
			   
			   return ( ( typeof _obj.usedView[ name ] != "undefined" ) ? _obj.usedView[ name ] : false );
			  };
			  
			  
			  //init implementation
			  _obj.init = function( ){
			   //call init
			   _config.init( _obj );
			   
			   return _obj;
			  };
			  
			  
			  //appendTo implementation
			  _obj.appendTo = function( selector, domnode ){
				//get main view if exists
				var v = getView( 'main' );
				if( !v ) return false;
				
				//viewObj
				var viewObj = v;
				
				//save name
				viewObj.saveName = 'main';
				
				//create view action
				var _crvaction = function( func, p ){
				 return func( _obj, p );
				};
				
				//action
				var data = _crvaction( viewObj.get, {} );
				
				//save in usedView
				_obj.usedView[ viewObj.saveName ] = data;
				
				//append
				return appendTo( data, selector, domnode, ( ( typeof viewObj.afterAppend != "undefined" ) ? viewObj.afterAppend : function(){} ) );
			  };
			  
			  //then implementation
			  _obj.then = function( callback ){
				//check callback
				if( typeof callback == "undefined" ) return _obj;
				
				//run callback
				callback( _obj );
				
				return _obj;
			  };
			  
			  return _obj;
			 };
			 
			 
			 /* UTILITY */
			 
			 //copy object
			 var copyObject = Efesto.utils.copyObject;
			 
			 
			 /* FACTORY OBJECT IMPLEMENTATION */
			 
			 //get definition
			 var getDefinition = function( name ){
			  //check param
			  if( typeof name == "undefined" ) return false;
			  
			  //return definition if exists
			  return ( ( typeof _definition[ name ] != "undefined" ) ? _definition[ name ] : false );
			 };
			 
			 
			 //create factory object
			 var object = { };
			 
			 //utility dispose
			 object.copyObject = copyObject;
			 
			 //implement define method
			 object.define = function( args1, args2 ){
			  //check param
			  if( typeof args1 == "undefined" ) return false;
			  
			  //check name
			  if( typeof args1 == "string" ) {
			   //check param
			   if( typeof args2 == "undefined" ) return false;
			   
			   //create def
			   var def = {
				 settings:{},
				 data:{},
				 vars:{},
				 controller:{},
				 view:{},
				 init:function( o ){}
			   };
			   def = $.extend( {}, def, args2 || {} );
			   
			   //extend method
			   _definition[ args1 ] = def;
			  }
			  else if( typeof args1 == "object" ) {  //non salva in definition
			   //create def
			   var def = {
				 settings:{},
				 data:{},
				 vars:{},
				 controller:{},
				 view:{},
				 init:function( o ){}
			   };
			   def = $.extend( {}, def, args1 || {} );
			  }
			  else return false;
			  
			  
			  //return object creation for singleton usage
			  return function( p ){
			   return objectModel( "singletonUsage", def, p || {} );
			  };
			 };
			 
			 //implement create method
			 object.create = function( name, config ){
			  //check param
			  if( typeof name == "undefined" ) return false;
			  
			  //get definition
			  var def = getDefinition( name );
			  
			  //check definition
			  if( !def ) return false;
			  
			  //return object creation
			  return objectModel( name, def, ( ( typeof config != "undefined" ) ? config : {} ) );
			 };
			 
			 //implement get definition name
			 object.getDefinitionName = function( ){
				//data
				var name = [];
				for( var i in _definition ) {
					name[ name.length ] = i;
				}
				
				return name;
			 };
			 
			 //implement get definition struct by name
			 object.getDefinitionStructByName = function( name ){
				//check param
				if( typeof name == "undefined" ) return false;
				
				//get definition
				var def = getDefinition( name );
				
				//check definition
				if( !def ) return false;
				
				//data
				var data = {};
				
				//recursive
				return (function( _d ) {
					//data
					var data = {};
					
					//loop definition
					for( var i in _d ) {
						if( typeof _d[ i ] == "string" ) {
							data[ i ] = "strings";
						}
						else if( typeof _d[ i ] == "number" ) {
							data[ i ] = "number";
						}
						else if( typeof _d[ i ] == "boolean" ) {
							data[ i ] = "boolean";
						}
						else if( typeof _d[ i ] == "function" ) {
							data[ i ] = "function";
						}
						else if( typeof _d[ i ] == "object" && typeof _d[ i ].length == "undefined" ) {
							data[ i ] = arguments.callee( _d[ i ] );
						}
						else if( typeof _d[ i ] == "object" ) {
							data[ i ] = "array";
						}
					}
					
					return data;
				})( def );
			 };
			 
			 //return object
			 return object;
		} );
	} );
	
})( );


//utils object
Efesto.utils = { };
(function( ) {
	
	//loader utility
	Efesto.utils.Loader = Efesto.pattern.singleton( function( ) {
		//return object
		return{
				  //internal load resource method
				  loadResource: function( param ){
					   //extend
					   param = $.extend( {}, {
						/*
						 resources:
						 {
						  type: ['css','js'],
						  url:  ''
						 }
						*/
						resources: [],
						callback: function(){},
						onerror: function(){}
					   }, param || {} );
					   
					   //check resources
					   if( param.resources.length == 0 ) return false;
					   
					   //load action script - http://unixpapa.com/js/dyna.html method
					   var loadActionScript = function( res, callback ){//cache actual loader - IE9-10 match eighter onreadystatechange and onload
							var alreadyLoad = false;
							
							//get head
							var head = document.getElementsByTagName('head')[0];
							
							//create script
							var script = document.createElement('script');
							script.type = 'text/javascript';
							script.charset = 'utf-8';
							
							//onready state change - IE6-7-8
							script.onreadystatechange = function( ){
								 //check cache
								 if( alreadyLoad ) return false;
								 
								 //check state
								 if( this.readyState && ( this.readyState == 'complete' || this.readyState == 'loaded' ) ){
								  //update cache
								  alreadyLoad = true;
								  
								  //callback
								  callback( );
							 }
							};
							
							//onload - IE9-10/WEBKIT/GECKO/OPERA
							script.onload = function( ){
								 //check cache
								 if( alreadyLoad ) return false;
								 
								 //update cache
								 alreadyLoad = true;
								 
								 //callback
								 callback( );
							};
							script.src = res;
							
							//append tp head
							head.appendChild(script);
					   };
					   
					   //load action css
					   var loadActionCss = function( res, callback ){
							//get head
							var head = document.getElementsByTagName('head')[0];
							
							//create link
							var link = document.createElement('link');
							link.media = 'screen';
							link.rel = 'stylesheet';
							link.href = res;
							
							//append tp head
							head.appendChild(link);
							
							//callback
							callback( );
					   };
					   
					   //count
					   var res_count = param.resources.length;
					   var res_index = 0;
					   
					   //load resource
					   var _t = function(){
							var _call = function(){
							 //increment index
							 res_index++;
							 
							 if( res_index < res_count ) _t();
							 else                        param.callback( );
							};
							
							//load
							if( param.resources[ res_index ].type == 'js' ) {
							 //load script
							 loadActionScript( param.resources[ res_index ].url, _call );
							}
							else if( param.resources[ res_index ].type == 'css' ) {
							 //load css
							 loadActionCss( param.resources[ res_index ].url, _call );
							}
					   };
					   _t();
					   
					   //set timer to call definitive callback if resources not loaded
					   setTimeout( function(){
							//check already call
							if( res_count == res_index ) return false;
							
							//call on error
							if( param.onerror )
							 param.onerror( );
					   }, 10000 );
				  }
		};
	} );

	//copy object
	Efesto.utils.copyObject = function( obj ) {
		//check param
		if( typeof obj == "undefined" ) return false;
		
		//check object
		if( !obj ) return {};
		
		//copy object
		if( typeof obj.length == "undefined" )
			var o = {};
		else  //copy array
			var o = [];
		
		for( var i in obj ) {
			if( typeof obj[ i ] != "object" || obj[ i ] instanceof RegExp )
				o[ i ] = obj[i];
			else
				o[ i ] = copyObject( obj[i] );
		}
		
		return o;
	};
	
})( );


//managers object
Efesto.manager = { };
(function( ) {
	//view manager
	Efesto.manager.View = Efesto.pattern.singleton( function( ) {
		
		//views
		var views = { };
		
		//return object
		var obj = { };
		
		//get view object
		obj.getViewObject = function( html ) {
			return new jSmart( html );
		};
		
		//get view object
		obj.addView = function( name, html ) {
			//add html to view name
			views[ name ] = html;
		};
		
		//get view from name
		obj.getView = function( name ) {
			//check name
			if( typeof name == "undefined" || typeof views[ name ] == "undefined" ) return false;
			
			return obj.getViewObject( views[ name ] );
		};
		
		//fetch view by name and data
		obj.fetchView = function( name, data ) {
			//check name
			if( typeof name == "undefined" ) return false;
			
			//get view
			var tpl = obj.getView( name );
			if( !tpl ) return false;
			
			return tpl.fetch( data || { } );
		};
		
		return obj;
		
	} );
	
	//router manager
	/*
		Router Manager Usage:
			- add:	add a route by reg exp, parameters and callback function
			  Es: Efesto.manager.Router.add( "\/update\/([0-9]+)", [ "update_id" ], function( param ) { } );
	*/
	Efesto.manager.Router = Efesto.pattern.singleton( function( ) {
		
		//route
		var route = { };
		var routeIndex = 0;
		
		//object
		var obj = { };
		
		//parse changes
		var parseHash = function( ) {
			//hash
			var hash = substr( document.location.hash, 1 );
			
			//loop route
			for( var i in route ) {
				var match = hash.match( route[ i ] );
				if( match ) {
					var param = ( ( route[ i ].paramKey ) ? { } : [ ] );
					for( var j = 1; j < match.length; j++ ) {
						if( route[ i ].paramKey[ j - 1 ] ) {
							param[ route[ i ].paramKey[ j - 1 ] ] = match[ j ];
						}
						else {
							param[ param.length ] = match[ j ];
						}
					}
					
					//try to call callback
					try {
						//call callback
						route[ i ].callback( param );
					}
					catch( e ) {
						//throw error
						console.log( "Route Error: " );
						console.log( e );
					}
					
					break;
				}
			}
		};
		
		//add route
		obj.add = function( arg1, arg2, arg3 ) {
			//get param
			if( typeof arg1 == "undefined" || typeof arg1 == "undefined" ) return false;
			
			var	regExp = arg1;
			var	paramKey = false;
			
			if( typeof arg2 == "function" ) {
				var	callback = arg2;
			}
			else {
				var	paramKey = arg2;
				if( typeof arg3 == "undefined" ) return false;
				var	callback = arg3;
			}
			
			//add route
			route[ routeIndex ] = {
				path: new RegExp("^" + pattern + "$"),
				callback: callback,
				paramKey: paramKey
			};
			routeIndex++;
		};
		
		return obj;
		
	} );
	
	//data manager
	Efesto.manager.Data = Efesto.pattern.singleton( function( ) {
		//return object
		var obj = { };
		
		//drivers
		var drivers = { };
		
		//on error callback
		obj.errorGlobalCallback = function( e ) { };
		
		//set on error callback - callback must receive param 'e'
		obj.setErrorGlobalCallback = function( func ) {
			obj.errorGlobalCallback = func;
		};
		
		//add driver
		obj.addDriver = function( param ) {
			//extend
			param = $.extend( {}, {
				name: '',
				url: '',
				requestFormat: function( data ){
					return data;
				},
				dataResponseType: '',                 //'' = querystring, json, xml - to jquery ajax dataType, http://api.jquery.com/jQuery.ajax/
				response: function( data ){
					return {
						state: 'success',   //[success, error]
						error: '',          //[string, object]
						data: []            //[object]
					};
				}
			}, param || {} );

			//check param
			if( param.name == "" || param.url == "" ) return false;

			//add drivers
			drivers[ param.name ] = param;
		};
		
		//get driver
		obj.getDriver = function( param ) {
			//extend
			param = $.extend( {}, {
				name: ''
			}, param || {} );

			//check param
			if( param.name == "" || typeof drivers[ param.name ] == "undefined" ) return false;

			return drivers[ param.name ];
		};
		
		//get call data
		obj.getCallData = function( param ) {
			//extend
			param = $.extend( {}, {
				url: '',                    //url to call - concatenate with driver url
				driver: '',
				lang: 'it',
				type: '',
				data: {}                   //must be plain object
			}, param || {} );

			//check
			if( param.url == "" || param.driver == "" ) return false;

			//get driver
			var driver = obj.getDriver( {
				name: param.driver
			} );

			//check driver
			if( !driver ) return false;

			//data Type
			var dataType = driver.dataResponseType;
			if( dataType == 'xml' ) dataType = ($.browser.msie) ? "text" : "xml";

			//data
			var data = param.data;

			//format data with driver
			if( driver.requestFormat ) {
				data = driver.requestFormat( data );
			}

			//url
			var url = driver.url + param.url;

			//lang settings
			var langPath = '';
			if( typeof driver.langs != "undefined" && typeof driver.langs[ param.lang ] != "undefined" ) {
				langPath = driver.langs[ param.lang ];
			}

			//replace placeholder lang
			url = str_replace( "[LANG]", langPath, url );

			//create extended get type url
			var url_ext = url;
			if( data ) {
				var d_url = "";
				for( var i in data )
					d_url += i + "=" + data[ i ] + "&";
				if( d_url.length > 0 ) url_ext = url_ext + "?" + substr( d_url, 0, -1 );
			}

			if( dataType == 'jsonp' ) {
				driver.jsonpCallback = ( ( typeof driver.jsonpCallback == "undefined" || driver.jsonpCallback == '' ) ? 'callback' : driver.jsonpCallback );
				url = url + "?"+driver.jsonpCallback+"=?&_=[TIMESTAMP]";
			}

			//type
			var type = driver.type;
			if( param.type != "" ) {
				type = param.type;
			}

			return{
				url: url,
				type: type,
				driver: driver,
				dataType: dataType,
				data: data,
				url_extended: url_ext
			};
		};
		
		//call
		obj.call = function( param ) {
			//extend
			param = $.extend( {}, {
				url: '',                    //url to call - concatenate with driver url
				driver: '',
				lang: 'it',
				type: '',
				errorGlobalCallback: true,   //call the errorGlobalCallback
				data: { },                   //must be plain object
				success: function( data ) { },
				error: function( error ) { }
			}, param || {} );

			//get call data
			var callData = obj.getCallData( param );
			if( !callData ) return false;

			//loader ui call
			//ui._showLoading( );

			//ajax call
			$.ajax({
				url: callData.url,
				type: callData.type,
				dataType: callData.dataType,
				data: callData.data
			}).done(function( data ){
				//loader ui call
				//ui._hideLoading( );

				//xml msie parsing
				if( callData.driver.dataResponseType == 'xml' && typeof data == "string" ) {
					var xml = new ActiveXObject("Microsoft.XMLDOM");
					xml.async = false;
					xml.loadXML( data );
				}

				//check response
				if( callData.driver.response ) {
					//get response from driver
					var res = callData.driver.response( data );

					//check state
					if( typeof res.state != "undefined" && typeof param[ res.state ] != "undefined" ) {
						if( res.state == 'success' ) {
							if( typeof res.data != "undefined" ) {
								//call state callback
								(param[ res.state ])( res.data );
							}
							else {
								//call state callback
								(param[ res.state ])( );
							}
						}
						else if( res.state == 'error' ) {
							//check errorGlobalCallback
							if( param.errorGlobalCallback )
								obj.errorGlobalCallback( res.error );


							if( typeof res.error != "undefined" ) {
								//call state callback
								(param[ res.state ])( res.error );
							}
							else {
								//call state callback
								(param[ res.state ])( );
							}
						}
					}
				}
				else {
					//call success on default and pass data
					param.success( data );
				}
			}).fail(function( error ){
				//loader ui call
				//ui._hideLoading( );

				//check errorGlobalCallback
				if( param.errorGlobalCallback )
					obj.errorGlobalCallback( error );

				//param.error check
				if( param.error )
					param.error( error );
			});
		};
		
		
		return obj;
	} );
	
	
})( );