var ROOT_PATH = "assets/outfie/";
var ST_ACTIVE = true;
var ST_INACTIVE = false;
var ROOT_USERDATA = "ws.user.json";
var ROOT_GETDATA = "ws.data.json";
var ROOT_GETPRODUCTS = "ws.products.json";
var ROOT_SETDATA = "ws.data.php";
var ROOT_PROCESSCROP = "ws.processCrop.php"
var $config = {
		category :    ST_INACTIVE,
		subcategory : ST_INACTIVE,
		store: ST_INACTIVE,
		brand: ST_INACTIVE,
		xhrProducts : ST_INACTIVE,
		sandbox: {
			pagination:{
				currentPage : 1,
				pageSize: 20
			},
			status: ST_ACTIVE
		},
		range:{
			min: 0,
			max: 0,
			from: 0,
			to: 0
		},
		search:[],
		colors:[],
		color:ST_INACTIVE,
		done : ST_INACTIVE,
		text:{
			loadingProducts: "Cargando productos",
			loadingTool: "Cargando herramienta",
			noitems: "No hay productos con tu selección",
			dragGreet: "Arrastra una imagen para crear tu outfie"
		}
	}

angular.module('appOutfie',['ngRoute','ngAnimate','ui.bootstrap','angularUtils.directives.dirPagination','ngDragDrop'])
	.config(['$compileProvider', function ($compileProvider) {
	  $compileProvider.debugInfoEnabled(false);
	}])
	.factory("mainService", function($http,$location,$window){
		var categories = [];
		var subcategories = [];
		var range = {};
		var search = [];
		var colors = [];
		var config = $config;

	  	var xhrData = $http.get(ROOT_PATH + ROOT_GETDATA).then(function(d) { 
			return d.data
		});
	  	return {
	  		config: {
	  			get: function(){
	  				return config;
	  			},
	  			set: function(attr,val){
	  				config[attr] = val;
	  			}
	  		},
	  		data:{
	  			get:function(){
	  				return xhrData;
	  			}
	  		},
	  		categories:{
	  			get: function(){
					return categories;
				},
				set : function( $categories ){
					categories = $categories;
					return categories;
				},
				setActive : function( index ){
					for (var i = 0; i < categories.length; i++) {
						categories[i].status = ST_INACTIVE;
					};
					categories[index].status = ST_ACTIVE;
				}
	  		},
	  		subcategories:{
	  			get: function(){
		  			return subcategories;
				},
				set : function( $subcategories ){
					subcategories = $subcategories;
					return subcategories;
				},
				setActive : function( index ){
					for (var i = 0; i < subcategories.length; i++) {
						subcategories[i].status = ST_INACTIVE;
					};
					subcategories[index].status = ST_ACTIVE;
				}
	  		},
	  		range:{
	  			get: function(){
		  			return range;
				},
				set : function( $range ){
					range = $range;
					return range;
				}
	  		},
	  		search:{
	  			get: function(){
		  			return search;
				},
				set : function( $search ){
					search = $search;
					return search;
				}
	  		},
	  		colors:{
	  			get: function(){
		  			return colors;
				},
				set : function( $colors ){
					colors = $colors;
					return colors;
				}
	  		}
			
		}
	})
	.directive("owlCarousel", function() {
	    return {
	        restrict: 'E',
	        transclude: false,
	        link: function (scope,element) {
	            scope.initCarousel = function(element) {
	            	var id = $(element).attr('id');
	            	var o = scope.$eval($(element).attr('data-options')),
	            		options;

	            	// Set loop to false due to cloning elements on DOM after ng-repeat rendered
	            	// causing out of scope elements that can not be controlled with Angular
	            	// TODO: repair bug
	            	switch(o){
	            		case 1:
			                options = {
								items: 8,
								loop:false,
								margin: 10,
								responsiveClass: true,
								dots: false,
								navText: [ '', '' ],
								responsive: {
									0: {
										items: 1,
										nav: true
									},
									600: {
										items: 4,
										nav: true
									},
									1000: {
										items: 8,
										nav: true,
										margin: 10
									}
								}
							};
	            		break;
	            		case 2:
	            			options = { 
	            				items:4,
								loop:false,
								margin: 10,
								responsiveClass: true,
								dots: false,
								navText: [ '', '' ],
								responsive: {
									0: {
										items: 1,
										nav: true
									},
									600: {
										items: 3,
										nav: true
									},
									1000: {
										items: 4,
										nav: true,
										margin: 10
									}
								}
							};
	            		break;
	            	}

	               	var $owl = $( "#"+id );
					$owl.trigger('destroy.owl.carousel');
					$owl.find('.owl-stage-outer').remove().removeClass('owl-loaded');
					$owl.owlCarousel( options );
	            };
	        }
	    };
	})
	.directive('owlCarouselItem', [function() {
	    return {
	        restrict: 'A',
	        transclude: false,
	        link: function(scope, element) {
	          // wait for the last item in the ng-repeat then call init
	            if(scope.$last) {
	                scope.initCarousel(element.parent());
	            }
	        }
	    };
	}])
	.directive('resizable', function () {
	    return {
	        restrict: 'A',
	        controller: function($scope, $element){
 				
 				//TODO : Image should appear where is dropped
 				
 				// After image is loaded
 				$element.find("img").load(function() {
 					// Set dimension,position and z-index to default if it's a new element
 					if( typeof $scope.item.position === 'undefined' ){
	 					var containment = $("#sand-ground");

	 				    var width = $($element).find("img")[0].width;
	 					var height = $($element).find("img")[0].height;

	 					var cWidth = containment.width();
	 					var cHeight = containment.height();

	 					var left = ( cWidth - width )/ 2;
	 					var top = ( cHeight - height )/ 2;

	 					var cantSiblings = $scope.$parent.box.length;
	 					var zindex = $scope.item.zindex;

	 					$scope.item.size = {width:width,height:height};
	 					$scope.item.position = {top:top,left:left};
	 					$scope.item.zindex = cantSiblings;

	 					$element.css({"top":top,"left":left,"z-index":zindex});
	 				}
 				});
 				
        	},
	        link: function (scope, elem, attrs) {

	        	// Make picture dragable and resizable
	        	elem.draggable({
			        cursor      : "move",
			        delay       : 100,
			        scroll      : false,
			        containment : "parent"
			    }).resizable({
				    aspectRatio: true,
				    handles: 'ne, se, sw, nw',
				    containment : "parent"
				});

			    // Reposition elements after render
				scope.reposition = function(){
					
					// Set position
					if( typeof scope.item.position !== 'undefined' ){
						var pos = scope.item.position;
						var left = pos.left;
						var top = pos.top;
						elem.css({left:left,top:top});
					}
					// Set dimension
					if( typeof scope.item.size !== 'undefined' ){
						var size = scope.item.size;
						var width = size.width;
						var height = size.height;
						elem.css({width:width,height:height});
					}

					// Set z-index position
					if( typeof scope.item.zindex !== 'undefined' ){
						var zindex = scope.item.zindex;
						elem.css("z-index",zindex);
					}
				}
				// Call reposition
				scope.reposition();

				// Update data(position,size) image on resizing / dragging
	            elem.on('resize', function (evt, ui) {
	              	setTimeout(function(){
						// Update position and size when resizing
	              		scope.item.size = ui.size;
	              		scope.item.position = ui.position;
	                	scope.$apply();                
	              	},0)
	            });
	            elem.on('drag', function (evt, ui) {
	              	setTimeout(function(){
	              		// Update position when dragging
	             		scope.item.position = ui.position;
	                	scope.$apply();               
	              	},0)
	            });
	            // TODO : Event mousedown activate cloned item in list due to track by $index
	            elem.on('mousedown', function (evt, ui) {
	              	$(".draggable").removeClass("active");
	              	$(elem).addClass("active");
	            });
	            // Detect when a image have been cropped
	            scope.$on("imageCropped",function handlePingEvent( event, pingCount ) {
                       	setTimeout(function(){
                       		scope.reposition();
                       	},0);
                    }
                );
                // Watch if element is moved to front
				scope.$watch("item.zindex", function(n,o,e) {
					setTimeout(function(){
						elem.css("z-index",n);
						scope.reposition();
					},0)
					return n;
			    });
	        }
	    };
	})
	.directive('ionrangeslider',['$timeout','mainService', function ($timeout,mainService) {
	    return {
	        restrict: 'A',
	        scope: {},
	        link: function postLink(scope, elem, attrs) {
	        	var merge = function() {
	        	    var obj = {},
	        	        i = 0,
	        	        il = arguments.length,
	        	        key;
	        	    for (; i < il; i++) {
	        	        for (key in arguments[i]) {
	        	            if (arguments[i].hasOwnProperty(key)) {
	        	                obj[key] = arguments[i][key];
	        	            }
	        	        }
	        	    }
	        	    return obj;
	        	};
	        	scope.getOption = function(customOptions){
	        		var defaultOptions = {
	        			type: "double",
	        			hide_min_max: true,
	        			hide_from_to: false,
	        			grid: false
	        		}
	        		return merge(defaultOptions, customOptions);
	        	}

	        	scope.rangeOptions = scope.getOption( mainService.config.get().range );
	        	elem.ionRangeSlider( scope.rangeOptions );
	        	elem.on("change", function () {
				   	$timeout(function() {
				   		var $this = $(elem),
				        value = $this.prop("value").split(";");
				    	scope.$parent.range.from=parseInt(value[0]);
				   	 	scope.$parent.range.to=parseInt(value[1]);
					},0);
				});

	        	scope.$parent.$watch('range',function(n,o){
	        		// Call sliders update method with any params
	        		scope.rangeOptions = scope.getOption( n );
	        		var slider = elem.data("ionRangeSlider");
					slider.update( scope.rangeOptions );
	        	});
	        }
	    }
	}])
	.directive('select2', function (mainService) {
	    return {
	        restrict: 'A',
	        link: function (scope, elem, attrs) {
	        	elem.select2( {data : [] } );
				scope.$watch(function () {
					return mainService.config.get().done;
				},function(n,o){
	        		elem.select2({data: mainService.search.get()});
	        	});

	        	elem.on("select2:select", function (e) {
	        		scope.$apply(function() {
		        		var $this = $(elem);
		        		var $item = e.params.data.id;
		        		var $tmp = $item.split("-");
						switch($tmp[0]){
	        				case "0":
	        					mainService.config.set( "store", $item);
	        				break;
	        				case "1":
	        					mainService.config.set( "brand", $item);
	        				break;
	        			}
	        			var store = mainService.config.get().store;
	        			var brand = mainService.config.get().brand;
	        			var data = [];

		        		if( store != ST_INACTIVE ){
		        			data.push(store);
		        		}
		        		if( brand != ST_INACTIVE ){
		        			data.push(brand);
		        		}
		        		$this.val(data).trigger("change");
	        		});
				});
				elem.on("select2:unselect", function (e,a) {
					scope.$apply(function() {
						var $this = $(elem);
						var $item = e.params.data.id;
						var $tmp = $item.split("-");
						switch($tmp[0]){
	        				case "0":
	        					mainService.config.set( "store", ST_INACTIVE);
	        				break;
	        				case "1":
	        					mainService.config.set( "brand", ST_INACTIVE);
	        				break;
	        			}
	        			var store = mainService.config.get().store;
	        			var brand = mainService.config.get().brand;
	        			var data = [];

	        			if( store != ST_INACTIVE ){
	        				data.push(store);
	        			}
	        			if( brand != ST_INACTIVE ){
	        				data.push(brand);
	        			}
	        			$this.val(data).trigger("change");
        			});
				});
	        }
	    }
	})
	.directive('colorpicker', function (mainService) {
	    return {
	        restrict: 'A',
	        link: function (scope, elem, attrs) {

	        	scope.$watch(function () {
					return mainService.config.get().done;
				},function(n,o){
		        	elem.spectrum({
					    showPaletteOnly: true,
				        showPalette:true,
				        allowEmpty:true,
				        preferredFormat: "hex",
				        palette: mainService.colors.get(),
				        change: function(color) {
					        scope.changeColor( color.toHexString() );
					    }
					});
	        	});
	        	
				scope.changeColor = function( color ){
					scope.$apply(function() {
						mainService.config.set( "color", color);
					});
				}
				$("#btnClearColor").on('click',function(){
					$(".sp-clear.sp-clear-display").trigger("click");
					elem.spectrum("hide");
				})
	       }
	    }
	})        
	.controller('FilterController',function FilterController($scope,$location,$timeout,mainService){

		// Containers - Scope
		$scope.categories = [];
		$scope.subcategories = [];
		$scope.range = {};
		$scope.search=[];
		$scope.colors=[];
		$scope.identifiers = {store:0,brand:1};

		// Call xhr promise for categories from mainService
		mainService.data.get().then(function(d) { 

			if(d.categories != undefined){
				// Set categories to mainService and then get them from mainService
				$scope.categories = mainService.categories.set( d.categories );
				// Set default category to 'active' from config
				$scope.setCategoryActive( 0 );
			}
			if(d.range != undefined){
				$scope.range = mainService.range.set( d.range );
				mainService.config.set( "range" , $scope.range );
			}
			if(d.search != undefined){
				var search = d.search;
				if( search.stores != undefined ){
					var stores = {id:$scope.identifiers.store,text:"Tiendas",children:[]};
					for (var i = 0; i < search.stores.length; i++) {
						search.stores[i].id = $scope.identifiers.store+'-'+search.stores[i].id;
						stores.children.push( search.stores[i] );
					};
					$scope.search.push( stores );
				}
				if( search.brands != undefined ){
					var brands = {id:$scope.identifiers.brand,text:"Marcas",children:[]};
					for (var i = 0; i < search.brands.length; i++) {
						search.brands[i].id = $scope.identifiers.brand+'-'+search.brands[i].id;
						brands.children.push( search.brands[i] );
					};
					$scope.search.push( brands );
				}
				$scope.search = mainService.search.set( $scope.search );
				mainService.config.set( "search" , $scope.search );

			}
			if(d.colors != undefined){
				var colors = d.colors;
				var set = [];
				for (var i = 0; i < colors.length; i++) {
					if(i == Math.floor(colors.length/2)){
						$scope.colors.push(set);
						set = [];
					}
					set.push(colors[i]);
				};
				$scope.colors.push(set);
				mainService.config.set( "colors",  d.colors );
				$scope.colors = mainService.colors.set( $scope.colors );
			}

			mainService.config.set( "done" , ST_ACTIVE );
		});

		$scope.setCategoryActive = function( index , item){
			$scope.subcategories = mainService.subcategories.set( $scope.categories[index].subcategories );
			if( item == undefined ){
				var item = $scope.categories[index];
			}
			mainService.config.set( "category" , item );
			mainService.categories.setActive( index );

			$scope.setSubCategoryActive( 0 );
		}
		$scope.setSubCategoryActive = function( index , item){
			mainService.config.set( "subcategory" , item );
			mainService.subcategories.setActive( index );
		}
		$scope.isActive = function( categoryStatus ){
			if( categoryStatus == ST_ACTIVE ){
				return 'active';
			}else{
				return ''
			}
		}
		$scope.clearColor = function(){
			$timeout(function() {
				mainService.config.get().color = ST_INACTIVE;
			},0);
		}
		
	})
	.controller('SandController',function SandController($http,$scope,$location,$timeout,mainService){

		// Left-Side
		$scope.products = [];
		// Right-Side
		$scope.box = [];

		$scope.boxItemActive = false;
		$scope.boxItemModelActive = false;

		$scope.config = mainService.config.get();

		$scope.messageSand = $scope.config.text.loadingProducts;
		$scope.messageBox = $scope.config.text.loadingTool;
		var cat = []
		
		$scope.currentPage = mainService.config.get().sandbox.pagination.currentPage;
  		$scope.pageSize = mainService.config.get().sandbox.pagination.pageSize;


  		// Connection with filter bar
	    $scope.$watch("mainService.config.subcategory", function(o,n,e) {
	    	mainService.data.get().then(function(a){
	    		$scope.categories = a.categories;
	    		cat = [];
	    		for (var i = 0; i < $scope.categories.length; i++) {
	    			cat[i] = {id:$scope.categories[i].id,ch:[]} ;
	    			for (var j = 0; j < $scope.categories[i].subcategories.length; j++) {
	    				cat[i].ch[j] = {id:$scope.categories[i].subcategories[j].id};
	    			};
	    		};
	    	});
	        $scope.getSand().then(function(a){

	        	if( mainService.config.get().xhrProducts == ST_ACTIVE ){
		        	// Filter images from flirck : Just for simulation
		        	var colors = mainService.config.get().colors;

		        	var products = [];
	        		for (var i = 0; i < a.length; i++) {
	        			var RandCat = Math.floor(Math.random() * ((cat.length-1) - 0 + 1)) + 0;
	        			var RandSub = Math.floor(Math.random() * ((cat[RandCat].ch.length-1) - 0 + 1)) + 0;
	        			var RandColor =  Math.floor(Math.random() * ((colors.length-1) - 0 + 1)) + 0;
	        			a[i].cat = cat[RandCat].id;
	        			a[i].sub = cat[RandCat].ch[RandSub].id;
	        			a[i].price = Math.floor(Math.random() * (600 - 50 + 1)) + 50;
	        			a[i].store = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
	        			a[i].brand = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
	        			a[i].color = colors[RandColor];

	        			var p = {
	        				brand: a[i].brand,
							cat: a[i].cat,
							color: a[i].color,
							price: a[i].price,
							status: true,
							store: a[i].store,
							sub: a[i].sub,
							title: a[i].title,
							url: a[i].url_m
	        			}

	        			products.push(p);
	        		};
	        		//console.log(JSON.stringify(products));
		        	$scope.products = products;
	        	}else{
	        		// Set images from json
	        		$scope.products = a;
	        	}
	        	$scope.messageSand = $scope.config.text.noitems;
	        });
	        $scope.getBox().then(function(a){
	        	if(a.length > 0){
	        		$scope.box = a;
	        	}
	        	$scope.messageBox = $scope.config.text.dragGreet;
	        });
	    });

		$scope.getIndex = function(obj){
		    return $scope.products.indexOf(obj);
		}
		$scope.getCategoria = function( id ){
			var cats = mainService.categories.get();
			var name = false;
			for (var i = 0; i < cats.length; i++) {
				if(cats[i].id == id){
					name = cats[i].text;
					break;
				}
			};
			return name || null;
		}
		$scope.getSubCategoria = function( id ){
			var cats = mainService.subcategories.get();
			var name = false;
			for (var i = 0; i < cats.length; i++) {
				if(cats[i].id == id){
					name = cats[i].text;
					break;
				}
			};
			return name || null;
		}
		$scope.getTienda = function( id ){
			if(  mainService.search.get()[0] != undefined){
				var cats = mainService.search.get()[0].children;
				
				var name = false;
				for (var i = 0; i < cats.length; i++) {
					var split = cats[i].id.split("-");
					if(split[1] == id){
						name = cats[i].text;
						break;
					}
				};
				return name || null;
			}else{
				return null;
			}
		}
		$scope.getMarca = function( id ){
			if(  mainService.search.get()[1] != undefined){
				var cats = mainService.search.get()[1].children;
				var name = false;
				for (var i = 0; i < cats.length; i++) {
					var split = cats[i].id.split("-");
					if(split[1] == id){
						name = cats[i].text;
						break;
					}
				};
				return name || null;
			}else{
				return null;
			}
		}
		$scope.ignoredImages = function(){
			var box = $scope.box;
			var count = 0;
			for (var i = 0; i < box.length; i++) {
				if(box[i].removed != undefined && box[i].removed == ST_ACTIVE ){
					count++;
				}
			};
			return ( count == box.length );
		}
		$scope.byPrice = function (fieldName) {
			var minValue = $scope.config.range.from;
			var maxValue = $scope.config.range.to;
			return function predicateFunc(item) {
		    	return minValue <= item[fieldName] && item[fieldName] <= maxValue;
			};
		};
		$scope.byStore = function (fieldName) {
			var configStore = $scope.config.store;
			return function predicateFunc(item) {
				if( configStore != ST_INACTIVE){
					var key = configStore.split("-");
		    		return key[1] == item[fieldName];
				}else{
					return true;
				}
			};
		};
		$scope.byBrand = function (fieldName) {
			var configBrand = $scope.config.brand;
			return function predicateFunc(item) {
				if( configBrand != ST_INACTIVE){
					var key = configBrand.split("-");
		    		return key[1] == item[fieldName];
				}else{
					return true;
				}
			};
		};
		$scope.byColor = function (fieldName) {
			var configColor = $scope.config.color;
			return function predicateFunc(item) {
				if( configColor != ST_INACTIVE){
		    		return configColor.toLowerCase() == item[fieldName].toLowerCase();
				}else{
					return true;
				}
			};
		};
		$scope.getSand = function(){

			var url, item, first;

			switch( mainService.config.get().xhrProducts ){
				// Get Images from Flickr API
				case ST_ACTIVE:
					var options = { 
					  "api_key": "753bae9d6822dd7fb51f61ff075e60fd",
					  "method": "flickr.photos.search", 
					  "format": "json",
					  "nojsoncallback": "1",
					  "text": "women clothes",
					  "content_type": "1",
					  "extras":'url_m',
					  "per_page":"450",
					  "color_codes":"c"
					}
					url = "https://api.flickr.com/services/rest/";
					first = true;
					$.each(options, function(key, value) { 
					    url += (first ? "?" : "&") + key + "=" + value;
					    first = false; 
					});

					var xhrProducts = $http.get(url).then(function(d) { 
						return  d.data.photos.photo;
					});
				break;
				// Get Images from WS
				case ST_INACTIVE:

					url = ROOT_PATH+ROOT_GETPRODUCTS;
					var xhrProducts = $http.get(url).then(function(d) { 
						return  d.data;
					});

				break;
			}
			return xhrProducts;
		}
		$scope.getBox = function(){
			var url = ROOT_PATH+ROOT_USERDATA;
			var xhrUserProducts = $http.get(url).then(function(d) { 
				return  d.data;
			});
			return xhrUserProducts;
		}
	    $scope.setActive = function( index ){

	    	for (var i = 0; i < $scope.box.length; i++) {
				$scope.box[i].status = ST_INACTIVE;
			};

			$scope.box[index].status = ST_ACTIVE;
			$scope.boxItemActive = index;
			$scope.boxItemModelActive = $scope.box[index];
	    }
	    $scope.isActive = function( boxItemStatus ){
	    	if( boxItemStatus == ST_ACTIVE ){
				return 'active';
			}else{
				return ''
			}
	    }
	    $scope.moveLayerToFront = function(){
	    	var item = $scope.boxItemActive;
	    	if($scope.box[item].zindex == $scope.box.length){
	    		return false;
	    	}
	    	for (var i = 0; i < $scope.box.length; i++) {
	    		if(i!=item){
	    			if( $scope.box[i].zindex != 0)
	    				$scope.box[i].zindex = parseInt($scope.box[i].zindex) - 1;
	    		}
	    	};
	    	$scope.box[item].zindex = $scope.box.length;
	    }
	    $scope.moveLayerUp = function(){
	    	var item = $scope.boxItemActive;
	    	if($scope.box[item].zindex == $scope.box.length){
	    		return false;
	    	}
	    	var nextItem ;
	    	for (var i = 0; i < $scope.box.length; i++) {
	    		if( ($scope.box[item].zindex + 1 ) == $scope.box[i].zindex){
	    			nextItem = i;
	    			break;
	    		}
	    	};
	    	if (nextItem == null) {
	    		//console.log("What: "+nextItem);
	    		return false;
	    	};
	    	var tmpZindex = $scope.box[nextItem].zindex;
	    	$scope.box[nextItem].zindex = $scope.box[item].zindex;
	    	$scope.box[item].zindex = tmpZindex;
	    }
	    $scope.moveLayerToBehind = function(){
	    	var item = $scope.boxItemActive;
	    	if($scope.box[item].zindex <= 1){
	    		return false;
	    	}
	    	for (var i = 0; i < $scope.box.length; i++) {
	    		if(i!=item){
	    			if( $scope.box[i].zindex != 0)
	    				$scope.box[i].zindex = parseInt($scope.box[i].zindex) + 1;
	    		}
	    	};
	    	$scope.box[item].zindex = 1;
	    }
	    $scope.moveLayerDown = function(){
	    	var item = $scope.boxItemActive;
	    	if($scope.box[item].zindex <= 1){
	    		return false;
	    	}
	    	var nextItem ;
	    	for (var i = 0; i < $scope.box.length; i++) {
	    		if( ($scope.box[item].zindex - 1 ) == $scope.box[i].zindex){
	    			nextItem = i;
	    			break;
	    		}
	    	};
	    	if (nextItem == null) {
	    		//console.log("What: "+nextItem);
	    		return false;
	    	};
	    	var tmpZindex = $scope.box[nextItem].zindex;
	    	$scope.box[nextItem].zindex = $scope.box[item].zindex;
	    	$scope.box[item].zindex = tmpZindex;
	    }
	    $scope.deleteLayer = function(){
	    	if($scope.boxItemModelActive === ST_INACTIVE){
	    		return false;
	    	}
	    	var item = $scope.boxItemModelActive;
	    	var index = $scope.box.indexOf(item);
	    	if( index == -1){
	    		return false;
	    	}
	    	// console.log("Del:"+item);
	    	// console.log($scope.box.indexOf(item));
	    	
	    	// for (var i = 0; i < $scope.box.length; i++) {
	    	// 	if(i>index){
	    	// 		if( $scope.box[i].zindex != 0)
	    	// 			$scope.box[i].zindex = parseInt($scope.box[i].zindex) - 1;
	    	// 	}
	    	// };
	    	// $scope.box.splice(index, 1);
	    	$scope.box[index].removed = ST_ACTIVE;
	    	$scope.boxItemModelActive = ST_INACTIVE;
	    }
	    $scope.cropInit = function(){
	    	if( $scope.boxItemModelActive != ST_INACTIVE ){
	    		$scope.$broadcast('cropInit', $scope.boxItemModelActive );
	    	}
	    }
	    $scope.saveOutfie = function(){
	    	if($scope.box.length >= 1 ){
	    		// Splice all removed elemented
	    		var box = $scope.box;
				for (var i = 0; i < box.length; i++) {
					if(box[i].removed != undefined && box[i].removed == ST_ACTIVE ){
						box.splice(i, 1);
					}
				};
				$http({
			    	method: 'POST',
			    	url: ROOT_PATH + ROOT_SETDATA,           
			    	data: box,
			    	headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
			    });
				// to remove
			    alert("Done");
			}else{
				alert("Debe escoger como minimo una imagen");
			}
	    }
	})
	.controller('CropController',function CropController($http,$scope,$location,mainService){

		var condition = 1;
		var idCanvas = 'myCanvas';
		var canvas = document.getElementById(idCanvas);
		var jqCanvas = $("#"+idCanvas);
		var ctx = canvas.getContext('2d');
		var imageObj;

		$scope.image = {};
		$scope.points = [];
		$scope.status = ST_INACTIVE;

		$scope.$on('cropInit', function(event, item) { 
			$scope.getDataImageSelected( item );
		});
		
		$scope.getDataImageSelected = function( item ){
			$scope.image = item;
			$scope.points = [];
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			crop(condition,$scope.points,canvas,jqCanvas,$scope.image);
			$scope.setCropStatus( ST_ACTIVE );
		}

		$scope.createNewImage = function(){

			if( $scope.points.length == 0){
				$scope.setCropStatus( ST_INACTIVE );
				return false;
			}
			condition = 0;
			$('.spot').each(function() {
			    $(this).remove();
			})
			//clear canvas
			ctx.clearRect(0, 0, $scope.image.size.width, $scope.image.size.height);
			ctx.beginPath();
			ctx.width = $scope.image.size.width;
			ctx.height = $scope.image.size.height;
			ctx.globalCompositeOperation = 'destination-over';
			
			//draw the polygon
		    var offset = jqCanvas.offset();
		    for (var i = 0; i < $scope.points.length; i += 2) {
		        var x = parseInt(jQuery.trim($scope.points[i]));
		        var y = parseInt(jQuery.trim($scope.points[i + 1]));

		        if (i == 0) {
		            ctx.moveTo(x - offset.left, y - offset.top);
		        } else {
		            ctx.lineTo(x - offset.left, y - offset.top);
		        }
		    }
		    // TODO: Check what "this.isOldIE" is for
		    if (this.isOldIE) {

		        ctx.fillStyle = '';
		        ctx.fill();
		        var fill = $('fill', myCanvas).get(0);
		        fill.color = '';
		        fill.src = element.src;
		        fill.type = 'tile';
		        fill.alignShape = false;
		    }else {
		    	// Create a tempCanvas to use it as pattern
		    	var tempCanvas = document.createElement("canvas"),
		    	    tCtx = tempCanvas.getContext("2d");

		    	tempCanvas.width = $scope.image.size.width;
		    	tempCanvas.height = $scope.image.size.height;
		    	tCtx.drawImage(imageObj,0,0,imageObj.width,imageObj.height,0,0,tempCanvas.width,tempCanvas.height);

		    	// Draw pattern
		        var pattern = ctx.createPattern(tempCanvas, "repeat");
		        ctx.fillStyle = pattern;
		        ctx.fill();

		        // Get Image with borders
		        var dataurl = canvas.toDataURL("image/png");

		        // Set the new image to canvas
		        var img = new Image;
				img.onload = function(){
				  ctx.drawImage(img,0,0); // Or at whatever offset you like
				};
				img.src = dataurl;

				// Get the images without borders and save it to send later;
				var imageCropped = cropImageFromCanvas( ctx , canvas);

				var files = imageCropped.image;
				
				var newSize = {
						width : imageCropped.newWidth,
						height: imageCropped.newHeight
				}
				var newPosition = {
						top : $scope.image.position.top + imageCropped.addTop,
						left: $scope.image.position.left + imageCropped.addLeft
				}

				// Attach it to data
		        var data = new FormData();
		        data = 'image=' + files;

        		

		        // Save cropped image to server and return its url to use in item in box
		        $http({
		            url: ROOT_PATH + ROOT_PROCESSCROP ,
		            dataType: "json",
		            method: "POST",
		            headers: {
		                "Content-Type": "application/x-www-form-urlencoded"
		            },
		            data: data
		        }).success(function(rsp){
                	if(rsp.result){

                		$scope.setCropStatus( ST_INACTIVE );
                		$(".crop").removeClass("active");

                		setTimeout(function(){
                			$scope.$parent.box[$scope.$parent.boxItemActive].position = newPosition;
                			$scope.$parent.box[$scope.$parent.boxItemActive].size = newSize;
                			$scope.$parent.box[$scope.$parent.boxItemActive].url = ROOT_PATH + rsp.image;

                			$scope.$apply();
			        		$scope.$parent.$broadcast( "imageCropped", "done" );
                		})		
                	}
		        }).error(function(error){
		           	alert( error.toString() );
		        });
		    }
		}
		
		$scope.setCropStatus = function( status ){
			$scope.status = status;
			if( status == ST_INACTIVE ){
				$('.spot').each(function() {
				    $(this).remove();
				});
				$scope.points = [];
			}
		}
		$scope.isActive = function( cropStatus ){
			if( cropStatus == ST_ACTIVE ){
				return 'active';
			}else{
				return ''
			}
		}
		function crop(condition,points,canvas,jqCanvas,item){

			var imageSrc  = $scope.image.url;

		    this.isOldIE = (window.G_vmlCanvasManager);
		    if (this.isOldIE) {
		        G_vmlCanvasManager.initElement(myCanvas);
		    }
		    // Set dimension
		    canvas.width = $scope.image.size.width;
		    canvas.height = $scope.image.size.height;

		    // Set dimension of canva-layer for spots
		    $(".canvas-layer").css({
		    	width:$scope.image.size.width,
		    	height:$scope.image.size.height,
		    	left:$scope.image.position.left,
		    	top:$scope.image.position.top
		    })

		    imageObj = new Image();
		    imageObj.setAttribute('crossOrigin', 'anonymous');

		    var posx = null,posy = null,oldposx = null,oldposy = null;

		    function init() {
		        canvas.addEventListener('mousedown', mouseDown, false);
		        canvas.addEventListener('mouseup', mouseUp, false);
		        canvas.addEventListener('mousemove', mouseMove, false);
		    }

		    // Draw  image onto the canvas
		    imageObj.onload = function() {
		        ctx.drawImage(imageObj, 0, 0, imageObj.width,imageObj.height,    // source rectangle
                   						0, 0, canvas.width, canvas.height ) // destination rectangle
		    };
		    imageObj.src = imageSrc;

		    // Switch the blending mode
		    ctx.globalCompositeOperation = 'destination-over';

		    //mousemove event
		    jqCanvas.mousemove(function(e) {
		        if (condition == 1) {
		            ctx.beginPath();
		            posx = e.offsetX;
		            posy = e.offsetY;
		        }
		    });
		    //mousedown event
		    jqCanvas.mousedown(function(e) {
		        if (condition == 1) {
		            if (e.which == 1) {
		            	var offset = $(this).offset();
		            	pTop = (e.pageX - offset.left);
		            	pLeft = (e.pageY - offset.top);

		                var pointer = $('<span class="spot">').css({
		                    'position': 'absolute',
		                    'background-color': 'red',
		                    'width': '6px',
		                    'height': '6px',
		                    'top': pLeft,
		                    'left': pTop
		                });
		                //store the $scope.points on mousedown
		                $scope.points.push( e.pageX , e.pageY);

		                ctx.globalCompositeOperation = 'destination-out';

		                ctx.beginPath();
		                ctx.moveTo(oldposx, oldposy);
		                if (oldposx != null) {
		                    ctx.lineTo(posx, posy);
		                    ctx.stroke();
		                }
		                oldposx = e.offsetX;
		                oldposy = e.offsetY;

		                $(".canvas-layer > .wrap").append(pointer);
		            }
		            posx = e.offsetX;
		            posy = e.offsetY;
		        }
		    });
		}
		function cropImageFromCanvas(ctx, canvas) {

			var w = canvas.width,
			h = canvas.height,
			pix = {x:[], y:[]},
			imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
			x, y, index;

			for (y = 0; y < h; y++) {
			    for (x = 0; x < w; x++) {
			        index = (y * w + x) * 4;
			        if (imageData.data[index+3] > 0) {

			            pix.x.push(x);
			            pix.y.push(y);

			        }   
			    }
			}
			pix.x.sort(function(a,b){return a-b});
			pix.y.sort(function(a,b){return a-b});
			var n = pix.x.length-1;

			w = pix.x[n] - pix.x[0];
			h = pix.y[n] - pix.y[0];
			var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

			canvas.width = w;
			canvas.height = h;
			ctx.putImageData(cut, 0, 0);

			var image = canvas.toDataURL();
			var result = {
				image : image,
				newWidth : w,
				newHeight : h,
				addTop : pix.y[0],
				addLeft: pix.x[0],
			}
			return result;
		}
	});



