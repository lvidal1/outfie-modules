var ROOT_PATH = "assets/outfie/";
var ST_ACTIVE = true;
var ST_INACTIVE = false;
var ROOT_USERDATA = "ws.user.json";
var ROOT_GETDATA = "ws.data.json";
var ROOT_GETPRODUCTS = "ws.products.json";
var ROOT_SETDATA = "ws.data.php";
var $config = {
		category :    ST_INACTIVE,
		subcategory : ST_INACTIVE,
		xhrProducts : ST_INACTIVE,
		sandbox: {
			pagination:{
				currentPage : 1,
				pageSize: 20
			}
		}
	}

angular.module('app',['ngRoute','ngAnimate','angularUtils.directives.dirPagination','ngDragDrop'])
	.factory("mainService", function($http,$location,$window){
		var categories = [];
		var subcategories = [];
		var config = $config;

	  	var xhrCatergories = $http.get(ROOT_PATH + ROOT_GETDATA).then(function(d) { 
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
	  		categories:{
	  			get: function(){
		  			if( categories.length > 0){
		  				return categories;
		  			}else{
		  				return xhrCatergories;
		  			}
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

	                // init carousel
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
	        scope: {
	            callresize: '&onResize',
	            calldrag : '&onDrag',
	            zindex:      '='  
	        },
	        link: function postLink(scope, elem, attrs) {

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
					if( typeof scope.$parent.item.position === 'undefined' ){
						//TODO : Image should appear where is dropped
						elem.find("img").load(function() {
							var containment = $("#sand-ground");

						    var width = $(elem).find("img")[0].width;
							var height = $(elem).find("img")[0].height;

							var cWidth = containment.width();
							var cHeight = containment.height();

							var left = ( cWidth - width )/ 2;
							var top = ( cHeight - height )/ 2;

							elem.css({left:left,top:top});
						});
					}else{
						var pos = scope.$parent.item.position;
						var left = pos.left;
						var top = pos.top;
						elem.css({left:left,top:top});
					}
					// Set dimension
					if( typeof scope.$parent.item.size !== 'undefined' ){
						var size = scope.$parent.item.size;
						var width = size.width;
						var height = size.height;
						elem.css({width:width,height:height});
					}
					// Set z-index position
					if( typeof scope.$parent.item.zindex !== 'undefined' ){
						var zindex = scope.$parent.item.zindex;
						elem.css("z-index",zindex);
					}else{
						var cantSiblings = scope.$parent.$parent.box.length;
						scope.$parent.item.zindex = cantSiblings;
						var zindex = scope.$parent.item.zindex;
						elem.css("z-index",zindex);
					}
				}
				// Call reposition
				scope.reposition();

				// Watch if element is moved to front
				scope.$parent.$watch("item.zindex", function(n,o,e) {
					setTimeout(function(){
						elem.css("z-index",n);
						scope.reposition();
					})
					return n;
			    });

	            elem.on('resize', function (evt, ui) {
	              	scope.$apply(function() {
						// Update position and size when resizing
	              		scope.$parent.item.size = ui.size;
	              		scope.$parent.item.position = ui.position;
	              		// Remove : Call helper	
	                	if (scope.callresize) { 
	                  		scope.callresize({$evt: evt, $ui: ui }); 
	                	}                
	              	})
	            });
	            elem.on('drag', function (evt, ui) {
	              	scope.$apply(function() {
	              		// Update position when dragging
	             		scope.$parent.item.position = ui.position;
						// Remove : Call helper	
	                	if (scope.calldrag) { 
	                  		scope.calldrag({$evt: evt, $ui: ui }); 
	                	}                
	              	})
	            });

	            // TODO : Event mousedown activate cloned item in list due to track by $index
	            elem.on('mousedown', function (evt, ui) {
	              	$(".draggable").removeClass("active");
	              	$(elem).addClass("active");
	            });
	        }
	    };
	  })
	.controller('FilterCtrl',function FilterCtrl($scope,$location,mainService){

		// Containers - Scope
		$scope.categories = [];
		$scope.subcategories = [];

		// Call xhr promise for categories from mainService
		mainService.categories.get().then(function(d) { 
			// Set categories to mainService and then get them from mainService
			$scope.categories = mainService.categories.set( d.categories );
			// Set default category to 'active' from config
			$scope.setCategoryActive( 0 );
		});

		$scope.setCategoryActive = function( index ){
			$scope.subcategories = mainService.subcategories.set( $scope.categories[index].subcategories );
			mainService.config.get().category = index;
			mainService.categories.setActive( index );

			$scope.setSubCategoryActive( 0 );
		}
		$scope.setSubCategoryActive = function( index ){
			mainService.config.get().subcategory = index;
			mainService.subcategories.setActive( index );
		}
		$scope.isActive = function( categoryStatus ){
			if( categoryStatus == ST_ACTIVE ){
				return 'active';
			}else{
				return ''
			}
		}
		
	})
	.controller('SandCtrl',function SandCtrl($http,$scope,$location,mainService){

		// Left-Side
		$scope.products = [];
		// Right-Side
		$scope.box = [];

		$scope.boxItemActive = false;
		$scope.boxItemModelActive = false;

		$scope.currentPage = mainService.config.get().sandbox.pagination.currentPage;
  		$scope.pageSize = mainService.config.get().sandbox.pagination.pageSize;

  		// Connection with filter bar
	    $scope.$watch("mainService.config.subcategory", function(o,n,e) {
	        $scope.getSand().then(function(a){
	        	$scope.products = a;
	        });
	        $scope.getBox().then(function(a){
	        	if(a.length > 0){
	        		$scope.box = a;
	        	}
	        });
	    });
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
					  "text": "Arawys mujer",
					  "content_type": "1",
					  "extras":'url_m',
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
			console.log($scope.boxItemActive);
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
	    		console.log("What: "+nextItem);
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
	    		console.log("What: "+nextItem);
	    		return false;
	    	};
	    	var tmpZindex = $scope.box[nextItem].zindex;
	    	$scope.box[nextItem].zindex = $scope.box[item].zindex;
	    	$scope.box[item].zindex = tmpZindex;
	    }
	    $scope.deleteLayer = function(){
	    	// TODO : set inactive to deleted elements
	    	if($scope.boxItemModelActive === false){
	    		return false;
	    	}
	    	var item = $scope.boxItemModelActive;
	    	var index = $scope.box.indexOf(item);
	    	if( index == -1){
	    		return false;
	    	}
	    	console.log("Del:"+item);
	    	console.log($scope.box.indexOf(item));
	    	
	    	for (var i = 0; i < $scope.box.length; i++) {
	    		if(i>index){
	    			if( $scope.box[i].zindex != 0)
	    				$scope.box[i].zindex = parseInt($scope.box[i].zindex) - 1;
	    		}
	    	};
	    	$scope.box.splice(index, 1);
	    	$scope.boxItemModelActive = false;
	    }
	    $scope.saveOutfie = function(){

	    	if($scope.box.length >= 1){
				for (var i = 0; i < $scope.box.length; i++) {
					console.log( $scope.box[i] );
				};
				$http({
			    	method: 'POST',
			    	url: ROOT_PATH + ROOT_SETDATA,           
			    	data: $scope.box,
			    	headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
			    });

				// to remove
			    alert("Done");
			}else{
				alert("Debe escoger como minimo un estilos");
			}
	    }

	    // Helpers on event
	    $scope.dragCallback = function (event, ui) {
	        var obj = ui.draggable;
		    console.log("Drag: ",obj);
	    };
		$scope.dropCallback = function (evt, ui) {
			// TODO : drop on the position of mouse
		   	var $ui = ui.offset;
		   	var $obj = ui.position;
		};
		$scope.drag = function(evt,ui) {
	      	//console.log (evt,ui);
	      	console.log(ui);
	    }
		$scope.resize = function(evt,ui) {
	      	//console.log (evt,ui);
	      	$scope.w = ui.size.width;
	      	$scope.h = ui.size.height;
	    }
	})
	.controller('CropCtrl',function CropCtrl($http,$scope,$location,mainService){
		$scope.image = {src:"",points:[]};

		var condition = 1;
		var points = [];//holds the mousedown points
		var idCanvas = 'myCanvas';
		var canvas = document.getElementById(idCanvas);
		var jqCanvas = $("#"+idCanvas);
		var imageSrc = mainService.boxItemModelActive;

	});



