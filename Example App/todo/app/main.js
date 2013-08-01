/**
	MAIN TODO APP FILE
*/

$( document ).ready( function( ) {
	
	//load resources
	Efesto.utils.Loader.loadResource( {
		resources: [
			{
				type: 'js',
				url: 'app/app.js'
			},
			{
				type: 'view',
				url: 'view/main.html',
				name: 'main'
			},
			{
				type: 'view',
				url: 'view/todo_list.html',
				name: 'todo_list'
			},
			{
				type: 'view',
				url: 'view/todo_item.html',
				name: 'todo_item'
			}
		],
		callback: function( ) {
			// initialize ToDo app
			new ToDo( );
		},
		onerror: function( ) {
			alert( "Error triggered when try to load resources." );
		}
	} );
	
} );