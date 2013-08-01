/**
	APP TODO APP FILE
*/

var ToDo = Efesto.pattern.module( function( ) {
	
	//self object
	var self = this;
	
	//vars
	var mainView = false;
	var listData = [ ];
	var filter = {
		'done': true,
		'todo': false
	};
	var actualFilter = false;
	
	//check cache
	
	
	//define model
	self.define( 'model/todo', function( m, data ) {
		//extend data
		data = $.extend( {
			state: false,
			content: ''
		}, data || {} );
		
		//return model object
		m.extract = {
			setContent: function( value ) {
				data.content = value;
			},
			getContent: function( ) {
				return data.content;
			},
			setState: function( value ) {
				data.state = value;
			},
			getState: function( ) {
				return data.state;
			},
			checkState: function( value ) {
				return data.state == value;
			}
		};
	} );
	
	//define view main
	self.define( 'view/main', function( m ) {
		//append main to body
		document.body.innerHTML = Efesto.manager.View.fetchView( 'main' );
		mainView = $( ".ToDo" ).last( );
	} );
	
	//define view list
	self.define( 'view/todo_list', function( m ) {
		//append todo_list to body
		$( ".listContainer", mainView ).html( Efesto.manager.View.fetchView( 'todo_list' ) );
		
		//check filter
			//loop listData and render only if the actualFilter if verifyed on state
	} );
	
	//define view list_item
	/*
	self.define( 'view/list_item', function( m, param ) {
		//extend param
		param = $.extend( {
			listDataIndex: -1
		}, param || {} );
		
		//append todo_list to todoItems
		$( Efesto.manager.View.fetchView( 'todo_item' ) ).append( $( ".todoItems", mainView ) );
		
		
	} );
	*/
	
	
	
	//define controller add item
	
	
	//define controller filter
	
	
	//define init
	self.define( 'controller/init', function() {
		
		//instance view main
		self.require( 'view/main' );
		
		//instance list view
		self.require( 'view/todo_list' );
		
		//add route
		
	} );
	
	//use init
	self.require( "controller/init" );
	
} );