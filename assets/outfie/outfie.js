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
		xhrProducts : ST_ACTIVE,
		sandbox: {
			pagination:{
				currentPage : 1,
				pageSize: 20
			}
		},
		range:{
			min: 0,
			max: 0,
			from: 0,
			to: 0
		},
		search:[],
		done : ST_INACTIVE
	}

angular.module('app',['ngRoute','ngAnimate','angularUtils.directives.dirPagination','ngDragDrop'])
	.factory("mainService", function($http,$location,$window){
		var categories = [];
		var subcategories = [];
		var range = {};
		var search = [];
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

							scope.$parent.item.size = {width:width,height:height};
							scope.$parent.item.position = {left:left,top:top};

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
					
					console.log(mainService.config.get().search);
	        		// Call sliders update method with any params
	        		elem.select2({data: mainService.config.get().search});
	        	});

	        }
	    }
	})
	.controller('FilterCtrl',function FilterCtrl($scope,$location,mainService){

		// Containers - Scope
		$scope.categories = [];
		$scope.subcategories = [];
		$scope.range = {};
		$scope.search=[];
		$scope.field={};
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
				console.log($scope.search)
				$scope.search = mainService.search.set( $scope.search );
				mainService.config.set( "search" , $scope.search );
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
		
	})
	.controller('SandCtrl',function SandCtrl($http,$scope,$location,mainService){

		// Left-Side
		$scope.products = [];
		// Right-Side
		$scope.box = [];

		$scope.boxItemActive = false;
		$scope.boxItemModelActive = false;

		$scope.config = mainService.config.get();
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
	    		console.log(cat);
	    	});
	        $scope.getSand().then(function(a){
	        	// Simulate category and subcat$scope.config.get().category[i]
	        		
        		for (var i = 0; i < a.length; i++) {
        			var RandCat = Math.floor(Math.random() * ((cat.length-1) - 0 + 1)) + 0;
        			var RandSub = Math.floor(Math.random() * ((cat[RandCat].ch.length-1) - 0 + 1)) + 0;
        			a[i].cat = cat[RandCat].id;
        			a[i].sub = cat[RandCat].ch[RandSub].id;
        			a[i].price = Math.floor(Math.random() * (600 - 50 + 1)) + 50
        		};

        		//console.log(JSON.stringify(a));

	        	$scope.products = a;
	        });
	        $scope.getBox().then(function(a){
	        	if(a.length > 0){
	        		$scope.box = a;
	        	}
	        });
	    });

		$scope.$watch("mainService.config.range.to", function(o,n,e) {
			console.log(o);
			$scope.config.range = mainService.config.get().range;
		})
		$scope.byPrice = function (fieldName) {
			var minValue = $scope.config.range.from;
			var maxValue = $scope.config.range.to;

			return function predicateFunc(item) {
		    	return minValue <= item[fieldName] && item[fieldName] <= maxValue;
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
					  "per_page":"300",
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

			mainService.boxItemModelActive = $scope.boxItemModelActive;
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
	    	// console.log("Del:"+item);
	    	// console.log($scope.box.indexOf(item));
	    	
	    	for (var i = 0; i < $scope.box.length; i++) {
	    		if(i>index){
	    			if( $scope.box[i].zindex != 0)
	    				$scope.box[i].zindex = parseInt($scope.box[i].zindex) - 1;
	    		}
	    	};
	    	$scope.box.splice(index, 1);
	    	$scope.boxItemModelActive = false;
	    }
	    $scope.cropInit = function(){
	    	$scope.$broadcast('cropInit', $scope.boxItemModelActive );
	    }
	    $scope.$on('cropDone', function(event, src) { 
			$scope.box[$scope.boxItemActive].url_m = src;
			$scope.$apply();
		});
	    $scope.saveOutfie = function(){

	    	if($scope.box.length >= 1){
				// for (var i = 0; i < $scope.box.length; i++) {
				// 	console.log( $scope.box[i] );
				// };
				$http({
			    	method: 'POST',
			    	url: ROOT_PATH + ROOT_SETDATA,           
			    	data: $scope.box,
			    	headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
			    });

				// to remove
			    alert("Done");
			}else{
				alert("Debe escoger como minimo una imagen");
			}
	    }

	    // Helpers on event
	    $scope.dragCallback = function (event, ui) {
	        var obj = ui.draggable;
		    // console.log("Drag: ",obj);
	    };
		$scope.dropCallback = function (evt, ui) {
			// TODO : drop on the position of mouse
		   	var $ui = ui.offset;
		   	var $obj = ui.position;
		};
		$scope.drag = function(evt,ui) {
	      	//console.log (evt,ui);
	      	// console.log(ui);
	    }
		$scope.resize = function(evt,ui) {
	      	//console.log (evt,ui);
	      	$scope.w = ui.size.width;
	      	$scope.h = ui.size.height;
	    }
	})
	.controller('CropCtrl',function CropCtrl($http,$scope,$location,mainService){

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
			setTimeout(function() {

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

			        var dataurl = canvas.toDataURL("image/png");
			        var files = dataurl;
			        var data = new FormData();
			        data = 'image=' + files;

			        // Save cropped image to server and return its url to use in item in box
			        var xhr = $.ajax({
			          	url: ROOT_PATH + ROOT_PROCESSCROP ,
			          	type: "POST",
			          	dataType: "json", // expected format for response
			          	contentType: "application/x-www-form-urlencoded", // send as JSON
			          	data: data
			        });
			        xhr.success(function(rsp , status, jqXHR){
			        	if(rsp.result){
			        		$scope.setCropStatus( ST_INACTIVE );
			        		$(".crop").removeClass("active");
			        		$scope.setCroppedImage( ROOT_PATH + rsp.image );
			        	}
		        	});
			    }
			}, 20);
		}

		$scope.setCroppedImage = function( src ){
			// After render
			$scope.$emit('cropDone', src );
		}

		$scope.setCropStatus = function( status ){
			$scope.status = status;
		}
		$scope.isActive = function( cropStatus ){
			if( cropStatus == ST_ACTIVE ){
				return 'active';
			}else{
				return ''
			}
		}
		function crop(condition,points,canvas,jqCanvas,item){

			var imageSrc  = $scope.image.url_m;

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
		        }//condition
		    });
		}
	});



