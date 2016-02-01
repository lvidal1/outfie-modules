var ROOT_PATH = "assets/wizard/";
var ST_ACTIVE = true;
var ST_INACTIVE = false;
var ROOT_GETDATA = "ws.data.json";
var ROOT_SETDATA = "ws.data.php";
var ROOT_UPLOAD = "ws.upload.php";
var $config = {
		views : [
			{id:"p1",file:"create-dilema-p1.html",data:{text:"",title:"Ocasión"},url:"/ocasion",controller:"OcasionCtrl","status":ST_ACTIVE,"seen":ST_INACTIVE , default: ST_ACTIVE},
			{id:"p2",file:"create-dilema-p2.html",data:{text:"",title:"Dónde"},url:"/donde",controller:"DondeCtrl","status":ST_INACTIVE,"seen":ST_INACTIVE , default: ST_INACTIVE},
			{id:"p3",file:"create-dilema-p3.html",data:{text:"",title:"Cuando"},url:"/cuando",controller:"CuandoCtrl","status":ST_INACTIVE,"seen":ST_INACTIVE , default: ST_INACTIVE},
			{id:"p4",file:"create-dilema-p4.html",data:{text:"",title:"Título"},url:"/titulo",controller:"TituloCtrl","status":ST_INACTIVE,"seen":ST_INACTIVE , default: ST_INACTIVE},
			{id:"p4-2",file:"create-dilema-p4.html",data:{text:"",title:""},url:"/titulo",controller:"TituloCtrl","status":ST_INACTIVE,"seen":ST_INACTIVE , default: ST_INACTIVE},
			{id:"p5",file:"create-dilema-p5.html",data:{text:"",title:"Presupuesto"},url:"/presupuesto",controller:"PresupuestoCtrl","status":ST_INACTIVE,"seen":ST_INACTIVE , default: ST_INACTIVE},
			{id:"p6",file:"create-dilema-p6.html",data:{text:"",title:"Imagen"},url:"/imagen",controller:"ImagenCtrl","status":ST_INACTIVE,"seen":ST_INACTIVE , default: ST_INACTIVE},
			{id:"p7",file:"create-dilema-p7.html",data:{text:"",title:"Preview"},url:"/preview",controller:"PreviewCtrl","status":ST_INACTIVE,"seen":ST_INACTIVE , default: ST_INACTIVE}
		]

}

angular.module('app',['ngRoute','ngAnimate','ngFileUpload'])
	.config(function($routeProvider){
		// Set routes / views / controllers
		var views = $config.views;
		for (var i = 0; i < views.length; i++) {
			$routeProvider.when( views[i].url ,{
				templateUrl:ROOT_PATH + "partials/" + views[i].file,
				controller:views[i].controller
			});
			if( views[i].default == ST_ACTIVE ){
				$routeProvider.otherwise({
					redirectTo: views[i].url,
					controller: views[i].controller
				});
			}
		};

	})
	.factory("mainService", function($http,$location,$window){

		// Set views
		var views = $config.views;
		var viewIndex = 0;
		var promise = $http.get(ROOT_PATH + ROOT_GETDATA).then(function(d) {
	    	return d.data;
	  	});
	  	return {
	  		getViews : function(){
				return views;
			},
			currentView : function(){
				return views[viewIndex];
			},
			setNavText : function(data, index){
				if(typeof index === 'undefined'){
					var index = viewIndex;
				}
				if(typeof data.text !== 'undefined'){
					views[index].data.text = data.text;
				}
				if(typeof data.title !== 'undefined'){
					views[index].data.title = data.title;
				}
			},
			getData : function(){
				return promise;
			},
			goToView: function(index){
				for (var i = 0; i < index; i++) {
					views[i].seen = ST_ACTIVE;
				};
				viewIndex = index;
				var view = views[viewIndex];
				$window.location = '#'+view.url;
			},
			nextView: function(){
				views[viewIndex].seen = ST_ACTIVE;
				viewIndex = (viewIndex+1);
				var view = views[viewIndex];
				$window.location = '#'+view.url;
			},
			preferences : {},
			ui:{
				nav:ST_INACTIVE,
				uploadCache: ST_INACTIVE
			}
		}
	})
	.directive('pluginsfor', function() {
	  	return function(scope, element, attrs) {
	  		// Active plugin after DOM has rendered
	  		var pluginsPage = attrs["pluginsfor"];    
	    	setTimeout(function doWork(){
	    		switch(pluginsPage){
	    			case "p1":
	    				utils.gallery('#ocation-carousel');
	    			break;
	    			case "p2":
	    				utils.selectpicker();
	    			break;
	    			case "p3":
	    			break;
	    			case "p4":
	    			break;
	    			case "p5":
	    			break;
	    			case "p6":
	    				utils.gallery('#imagen-carousel');
	    			break;
	    			case "p7":
	    			break;
	    		}
	    	}, 0);        
	  	};
	})
	.controller('NavCtrl',function NavCtrl($scope,$location,mainService){
		// Reset to default view
		$location.path('#/', false);
		// Get views from mainService
		$scope.views = mainService.getViews();
		$scope.ui = mainService.ui;
		$scope.go = function(index){
			mainService.goToView(index);
		}
	})
	.controller('OcasionCtrl',function OcasionCtrl($scope,mainService){

		var view = "p1";
		$scope.galeria = [];
		$scope.preferences = mainService.preferences;
		mainService.getData().then(function(data){
			$scope.galeria = data[view]["galeria"];

			if(mainService.currentView().seen == ST_ACTIVE){
				for (var i = 0; i < $scope.galeria.length; i++) {
					
					if( $scope.galeria[i].id == mainService.preferences[view].id ){
						$scope.galeria[i].active="active";
					}else{
						$scope.galeria[i].active="";
					}
					
				};
			}
		});
		$scope.setOcasion = function(item){

			$scope.preferences[ view ] = item;
			mainService.setNavText( { text: item.text} );
			mainService.nextView();
		}

	})
	.controller('DondeCtrl',function DondeCtrl($scope,mainService){

		var view = "p2";
		$scope.ciudad = [];
		$scope.lugar = [];
		$scope.preferences = mainService.preferences;
		$scope.ui = mainService.ui;

		mainService.getData().then(function(data){
			$scope.ciudad = data[view]["ciudad"];
			$scope.lugar = data[view]["lugar"];

			// If page have been not SEEN, create scope for data 
			if(mainService.currentView().seen == ST_INACTIVE){

				$scope.ui.show = {
					ciudad :{
						 "class":"active",
						 "select":true
					},
					lugar :{
						 "class":"",
						 "select":false
					},
				}
				$scope.preferences[view] = {};
				$scope.preferences[view]["ciudad"] = $scope.ciudad[0];
				$scope.preferences[view]["lugar"] = $scope.lugar[0];

				setTimeout(function(){
					mainService.ui.nav = ST_ACTIVE;
				},1000)
			}

		});
		$scope.changeDonde = function( select ){

			// Let's keep the option selected
			var item = $scope.preferences[view][select];
	        // If the option selected is not 0, go to next page
	        if(parseInt(item) != 0 ){
	        	switch( select ){
	        		case 'lugar':
	        			$scope.preferences[view]["ciudad"] = $scope.ciudad[0];
	        		break;
	        		case 'ciudad':
	        			$scope.preferences[view]["lugar"] = $scope.lugar[0];
	        		break;
	        	}
	        	mainService.setNavText( { title: select ,text: item.text} );
	            mainService.nextView();
	        	// Otherwise, stay
	        }
		}
		$scope.showSelect = function( select ){
			switch( select ){
				case 'ciudad':
					$scope.preferences[view]["ciudad"] = $scope.ciudad[0];

					$scope.ui.show.ciudad.select = true;
					$scope.ui.show.ciudad.class = "active";
					$scope.ui.show.lugar.select = false;
					$scope.ui.show.lugar.class = "";
				break;
				case 'lugar':
					$scope.preferences[view]["lugar"] = $scope.lugar[0];

					$scope.ui.show.ciudad.select = false;
					$scope.ui.show.ciudad.class = "";
					$scope.ui.show.lugar.select = true;
					$scope.ui.show.lugar.class = "active";
				break;
			}
		}

	})
	.controller('CuandoCtrl',function CuandoCtrl($scope,mainService){

		var view = "p3";
		$scope.fechas = [];
		$scope.preferences = mainService.preferences;
		mainService.getData().then(function(data){
			var fechas = data[view]["fechas"];
			var today = new Date();
			for (var i = 0; i < fechas.length; i++) {
				var fecha = utils.addDays(fechas[i]);
				$scope.fechas.push(fecha);
			};

			if(mainService.currentView().seen == ST_ACTIVE){
				for (var i = 0; i < fechas.length; i++) {
					if( $scope.fechas[i].date == mainService.preferences[view].date ){
						$scope.fechas[i].active="active";
					}else{
						$scope.fechas[i].active="";
					}
				};
			}
		});
		$scope.setFecha = function(item){
			$scope.preferences[ view ] = item;
			mainService.setNavText( { text: "En "+ item.number + " "+ item.unit} );
			mainService.nextView();
		}

	})
	.controller('TituloCtrl',function TituloCtrl($scope,mainService){

		var view = "p4";
		$scope.preferences = mainService.preferences;
		if(mainService.currentView().seen == ST_INACTIVE){
			$scope.preferences[view] = {};
			$scope.preferences[view]["titulo"] = "";
			$scope.preferences[view]["descripcion"] = "";
			$scope.preferences[view]["hashtag"] = "#zapatos, #cartera, #fiesta, #amigas";
		}
		$scope.setTitulo = function(){
			var data = $scope.preferences[view];
			if(data.titulo != "" && data.descripcion !="" && data.hashtag ){
				mainService.setNavText( { text: $scope.preferences[view]["titulo"] });
				mainService.setNavText( { text: $scope.preferences[view]["hashtag"] } , 4);
				mainService.goToView(5);
			}else{
				// TODO: message for error
				alert("Llenar todos los campos");
			}
		}
	})
	.controller('PresupuestoCtrl',function PresupuestoCtrl($scope,mainService){

		var view = "p5";
		$scope.presupuesto = [];
		$scope.preferences = mainService.preferences;
		mainService.getData().then(function(data){
			var presupuesto = data[view]["presupuesto"];
			var moneda = data[view]["moneda"];
			for (var i = 0; i < presupuesto.length; i++) {
				var pre = { id: i ,number:presupuesto[i] , text:"Hasta " + moneda + presupuesto[i]};
				$scope.presupuesto.push(pre);
			};

			if(mainService.currentView().seen == ST_ACTIVE){
				for (var i = 0; i < presupuesto.length; i++) {
					if( $scope.presupuesto[i].id == mainService.preferences[view].id ){
						$scope.presupuesto[i].active="active";
					}else{
						$scope.presupuesto[i].active="";
					}
					
				};
			}
		});
		$scope.setPresupuesto = function(item){
			$scope.preferences[ view ] = item;
			mainService.setNavText( { text: item.text} );
			mainService.nextView();
		}
	})
	.controller('ImagenCtrl',function ImagenCtrl($scope,mainService,Upload,$timeout){
		var view = "p6";
		var text = {
			initial : "Arrastra una imagen aquí o haz click para subir",
			loading : "Estamos subiendo tu imagen, espera un momento"
		}
		
		$scope.galeria = [];

		$scope.dropText = text.initial;
		$scope.uploaderStatus = ST_INACTIVE;
		$scope.progressStatus = ST_INACTIVE;
		$scope.filePreview = false;

		$scope.preferences = mainService.preferences;
		$scope.ui = mainService.ui;
		mainService.getData().then(function(data){
			$scope.galeria = data[view]["galeria"];

			if(mainService.currentView().seen == ST_ACTIVE){

				// If view have been seen, set data to chosen tab
				switch( mainService.preferences[view].type ){
					case 'gallery':
						mainService.ui.uploadCache = ST_INACTIVE;
						for (var i = 0; i < $scope.galeria.length; i++) {
							
							if( $scope.galeria[i].id == mainService.preferences[view].id ){
								$scope.galeria[i].active="active";
							}else{
								$scope.galeria[i].active="";
							}
							
						};
					break;
					case 'uploader':
						
						$scope.filePreview = mainService.preferences[view].src;
						// Set Tab uploader as active
						setTimeout(function(){
							setTabActive($('a[data-href="#upload"]'));
						},200);
					break;
					case 'instagram':
						// Call method to set image gotten from Instagram
					break;
				}
				
			}
		});
		$scope.setImagen = function(item , type ){
			// We need a reference to chosen image for futher views
			switch( type ){
				// As gallery get a image preloaded we need a reference to it
				case 'gallery':
					mainService.ui.uploadCache = item.src;
				break;
				// As uploader get a image from file chosen and then it is set as base64 after get the token
				// from server, it's not needed to set it again
				case 'uploader':
				break;
			}
			item.type = type;
			$scope.preferences[ view ] = item;
			mainService.nextView();
		}
		// Uploader
		$scope.$watch('files', function () {
		    $scope.upload($scope.files);
		});
		$scope.$watch('uploaderStatus', function (n) {
		    if( n  == ST_ACTIVE ){
		    	$scope.dropText = text.loading;
		    }else{
		    	$scope.dropText = text.initial;
		    }
		});
		$scope.upload = function (files) {
	        if (files) {
              var file = files;
              if (!file.$error) {
              	$scope.uploaderStatus = ST_ACTIVE;
              	$scope.progressStatus = ST_ACTIVE;
                Upload.upload({
                    url: ROOT_PATH + ROOT_UPLOAD,
                    data: {
                      	file: file  
                    }
                }).then(function (resp) {
                    $timeout(function() {

                    	if( resp.data.result == 1){
                    		var img = new Image();
                    		var newSrc = ROOT_PATH + resp.data.token;
							// Set image from client
							var reader = new FileReader();
							reader.onload = (function(theFile) {
						       return function(e) {
						       		mainService.ui.uploadCache = e.target.result;
						          	// Save token url to scope for futher use
						          	$scope.filePreview = newSrc;
						          	$scope.uploaderStatus = ST_INACTIVE;
						          	setTimeout(function(){
						          		$scope.progressStatus = ST_INACTIVE;
						          		$scope.$apply();
						          	},10);
						       };
						     })(file);

							// Read in the image file as a data URL.
							reader.readAsDataURL(file);
                    	}
                    });
                }, function (response) {
		            if (response.status > 0) 
		            	$scope.errorMsg = response.status + ': ' + response.data;
		        }, function (evt) {
		            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
		        });
              }
	        }
	    };
	    $scope.setImageUploaded = function(){
	    	var item = {
	    		src: $scope.filePreview
	    	}
	    	$scope.setImagen( item , 'uploader');
	    	// Clean gallery
	    	for (var i = 0; i < $scope.galeria.length; i++) {
	    		$scope.galeria[i].active="";    		
	    	};
	    }
	    // As it's used renderPartial with #, this is a setTab workaround in jq
	    function setTabActive( obj ){
	    	$("#imagenTab").find("li").removeClass('active')
	    	$( ".tab-pane" ).removeClass('in').removeClass('active');
	    	obj.parent('li').addClass('active')
	    	$(obj.attr('data-href')).addClass('in').addClass('active');
	    }


	})
	.controller('PreviewCtrl',function PreviewCtrl($scope,mainService,$http){
		var view = "p7";
		$scope.selected = [];
		$scope.preferences = mainService.preferences;
		$scope.ui = mainService.ui;
		mainService.getData().then(function(data){
			$scope.preferences[ view ] = data[view]["estilo"];
			mainService.currentView().seen = ST_ACTIVE;
		});
		$scope.setEstilo = function(item,index){
			if(item.select == "select"){
				item.select = "";
				$scope.selected.splice(index, 1);
			}else{
				if($scope.selected.length == 3){
					var shutdown = $scope.selected[0];
					$scope.preferences[view][shutdown].select = "";
					$scope.selected.splice(0, 1);
				}
				item.select = "select";
				$scope.selected.push(index);
			}
		}
		$scope.changeImagen = function(){
			mainService.goToView(6);
		}
		$scope.publicar = function(){

			if($scope.selected.length >= 1){
				// TODO : filter and format data selected
				$http({
			    	method: 'POST',
			    	url: ROOT_PATH + ROOT_SETDATA,           
			    	data: mainService.preferences,
			    	headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
			    });

				// to remove
			    $(".data-result").html(JSON.stringify(mainService.preferences, undefined, 4)); // Indented 4 spaces
			    $("#result").modal("show");
			}else{
				alert("Debe escoger como minimo un estilos");
			}
			
 
		}
	});


var utils = {
	gallery:function(id){
		/*  [ Owl Carousel ]
		- - - - - - - - - - - - - - - - - - - - */
		$(id).owlCarousel({
	        loop: true,
					margin: 16,
					responsiveClass: true,
					navText: ['', ''],
					responsive: {
						0: {
							items: 1,
							nav: true
						},
						600: {
							items: 4,
							nav: false
						},
						1000: {
							items: 6,
							nav: true,
							loop: false
						}
					}
	      });
	},
	selectpicker:function(){
		$('.selectpicker').selectpicker('render');
	},
	modal : function(){
		// Reposition when a modal is shown
		$('.modal').on('show.bs.modal', misc.reposition);
		// Reposition when the window is resized
		$(window).on('resize', function() {
				$('.modal:visible').each(misc.reposition);
		});
	},
	addDays: function(num){
		var today = new Date();
		today.setDate( today.getDate()+num);
		var dd = today.getDate();
	    var mm = today.getMonth()+1; //January is 0!

	    var yyyy = today.getFullYear();
	    if(dd<10){
	        dd='0'+dd
	    } 
	    if(mm<10){
	        mm='0'+mm
	    } 
	    var date = dd+'/'+mm+'/'+yyyy;

	    return {
					number: num,
					unit: "DÍAS",
					date: date
				}
	}
}

var misc = {
	reposition: function () {
		var modal = $(this),
				dialog = modal.find('.modal-dialog');
		modal.css('display', 'block');
		
		// Dividing by two centers the modal exactly, but dividing by three 
		// or four works better for larger screens.
		dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
	}
}




