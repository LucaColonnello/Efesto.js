/**
	APP TODO APP FILE
*/

var ToDo = Efesto.pattern.module( function( ) {
	
	//self object
	var self = this;
	
	//vars
	var mainView = false;
	var listData = [ ];
	var filters = {
		'done': true,
		'todo': false
	};
	var actualFilter = false;
	var addOpened = false;
	
	//define model
	self.define( 'model/todo', function( m, data ) {
		//extend data
		data = $.extend( {
			index: -1,
			state: false,
			content: ''
		}, data || {} );
		
		//return model object
		var dataObject = {
			saveChangesInCache: function( ) {
				//save listData to cache
				var data = [ ];
				
				//loop listData
				for( var i in listData ) {
					//prevent deleted element
					if( !listData[ i ] ) continue;
					
					//save in data
					data[ data.length ] = listData[ i ].getData( );
				}
				
				localStorage.setItem( 'ToDoCache', base64_encode( json_encode( data ) ) )
			},
			getData: function( ) {
				return data;
			},
			getIndex: function( ) {
				return data.index;
			},
			setContent: function( value ) {
				data.content = value;
				dataObject.saveChangesInCache( );
			},
			getContent: function( ) {
				return data.content;
			},
			setState: function( value ) {
				data.state = value;
				dataObject.saveChangesInCache( );
			},
			getState: function( ) {
				return data.state;
			},
			checkState: function( value ) {
				return data.state == value;
			},
			checkInFilter: function( ) {
				return ( !actualFilter || dataObject.checkState( filters[ actualFilter ] ) );
			},
			removeItem: function( ) {
				listData[ data.index ] = false;
				dataObject.saveChangesInCache( );
			}
		};
		
		//extract dataObject from module
		m.extract = dataObject;
	} );
	
	//define view main
	self.define( 'view/main', function( m ) {
		//append main to body
		document.body.innerHTML = Efesto.manager.View.fetchView( 'main' );
		
		//get view
		mainView = $( ".ToDo" ).last( );
	} );
	
	//define view list
	self.define( 'view/todo_list', function( m ) {
		//append todo_list to body
		$( ".listContainer", mainView ).html( "" );
		$( ".listContainer", mainView ).html( Efesto.manager.View.fetchView( 'todo_list' ) );
		
		//loop listData and render only if the actualFilter if verifyed on state
		for( var i in listData ) {
			//check filter and item state
			if( listData[ i ] && listData[ i ].checkInFilter( ) ) {
				//add list item view to list
				self.require( 'view/todo_item', {
					listDataIndex: listData[ i ].getIndex( )
				} );
			}
		}
		
		//bind delete and done click
		
		//bind done checkbox click
		$( ".todoItems", mainView ).on( 'click', ".todoItem input[type=checkbox]", function( ) {
			//index
			var index = this.dataset.index;
			
			//set done
			listData[ index ].setState( this.checked );
			
			//toggle done class
			$( this ).closest( ".todoItem" ).find( ".content" ).toggleClass( "done" );
			
			//check filter - if the state isn't ok for actual filter remove from this list
			if( !listData[ index ].checkInFilter( ) ) {
				//remove from done
				$( this ).closest( ".todoItem" ).fadeOut( );
			}
		} );
		
		//bind delete click
		//use bubbling to instance event only in parent, triggered when click the selector .todoItem .delete
		$( ".todoItems", mainView ).on( 'click', ".todoItem .delete", function( ) {
			//index
			var index = this.dataset.index;
			
			//set done
			listData[ index ].removeItem( );
			
			//remove from done
			$( this ).closest( ".todoItem" ).fadeOut( );
			
			//navigate to list
			Efesto.manager.Router.navigate( "list" );
		} );
	} );
	
	//define view todo_item
	self.define( 'view/todo_item', function( m, param ) {
		//extend param
		param = $.extend( {
			listDataIndex: -1				//if = -1 create new view
		}, param || {} );

		//check index
		if( param.listDataIndex != -1 ) {
			//check filter
			if( !listData[ param.listDataIndex ].checkInFilter( ) ) return;
			
			//list item
			var o = {
				data: listData[ param.listDataIndex ]
			};
			
			//append todo_list to todoItems
			$( ".todoItems", mainView )[ 0 ].innerHTML += Efesto.manager.View.fetchView( 'todo_item', o );
		}
		else {
			//new
			
			//append todo_list to todoItems
			$( ".todoItems", mainView )[ 0 ].innerHTML += Efesto.manager.View.fetchView( 'todo_item' );
			
			//bind add button
			$( ".listItem_new .addBtn" ).click( function( ) {
				//change add opened state
				addOpened = false;
				
				//get content
				var content = $( ".listItem_new .content input[type=text]" ).val( );
				var index = listData.length;
				listData[ index ] = self.require( "model/todo", {
					index: index,
					content: content
				} );
				
				//save in cache
				listData[ index ].saveChangesInCache( );
				
				//remove add 
				$( ".listItem_new" ).remove( );
				
				//add list item
				self.require( 'view/todo_item', {
					listDataIndex: index
				} );
				
				//navigate to list
				if( !actualFilter ) {
					Efesto.manager.Router.navigate( "list" );
				}
				else {
					//if there's a filter navigate to it
					Efesto.manager.Router.navigate( "filter/" + actualFilter );
				}
				
			} );
		}
	} );
	
	//define controller add item
	self.define( 'controller/add', function( m, param ) {
		//check opened
		if( addOpened ) return;
		
		//call add item
		self.require( 'view/todo_item' );
		
		//change add opened state
		addOpened = true;
	} );
	
	//define controller filter
	self.define( 'controller/filter', function( m, param ) {
		//check param
		if( param && ( param == "done" || param == "todo" || param == "all" ) ) {
			//set actual filter
			actualFilter = param;
			if( param == "all" )
				actualFilter = false;
			
			//call controller todo_list
			self.require( 'view/todo_list' );
		}
	} );
	
	//define init
	self.define( 'controller/init', function() {
		
		//instance view main
		self.require( 'view/main' );
		
		//check cache
		if( localStorage.getItem( 'ToDoCache' ) ) {
			//get cache
			var cache = json_decode( base64_decode( localStorage.getItem( 'ToDoCache' ) ) );
			
			//loop cache
			for( var i in cache ) {
				console.log( cache[ i ] );
				var index = cache[ i ].index;
				listData[ index ] = self.require( "model/todo", cache[ i ] );
			}
		}
		
		//instance list view
		self.require( 'view/todo_list' );
		
		//add route
		
		//new
		Efesto.manager.Router.add( 'new', function( ) {
			//call controller add
			self.require( 'controller/add' );
		} );
		
		//filter
		Efesto.manager.Router.add( 'filter\/([a-zA-Z0-9]+)', function( p ) {
			//call controller filter
			self.require( 'controller/filter', p[ 0 ] );
		} );
	} );
	
	//use init
	self.require( "controller/init" );
	
} );