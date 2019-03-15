var scene = new THREE.Scene();
scene.background = new THREE.Color(0xF5F5F5);
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 0.1, 1000 );
var object = new THREE.Object3D();
var renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas"), antialias: true});
var controls = new THREE.OrbitControls(camera, renderer.domElement);
var keyLight = new THREE.DirectionalLight(new THREE.Color(0xA9A9A9), .5);
var fillLight = new THREE.DirectionalLight(new THREE.Color(0xA9A9A9), 0.75);
var backLight = new THREE.DirectionalLight(0xA9A9A9, 1.3);
var l = -1;
var r = 1;
var name = "";
var c = 0;
var file;
const boundingBox = new THREE.Box3();
var offset = 10 || 1.25
const canvas = renderer.domElement;
const width = canvas.clientWidth;
const height = canvas.clientHeight;
renderer.setSize(width, height);
//document.body.appendChild( renderer.domElement );

controls.enableDamping = true;
controls.camping = true;
controls.dampingFactor = .7;
controls.enableZoom = true;

controls.update();

keyLight.position.set(0, 200, 0);
 
fillLight.position.set(100, 200, 100);
 
backLight.position.set(-100, -200, -100).normalize();
 
scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);



//next obj file via right arrow
document.getElementById('right').onclick = function(){
	$('input[type="checkbox"]:checked').prop('checked',false);
	if (files.length != 0) {
		scene.add(keyLight);
		scene.add(fillLight);
		scene.add(backLight);
		name = files[r].name;
		file = files[r];
		c = r;
		fileUpload(file);
		nameUpdate(name);
		if(newUser)
			document.getElementById("user").value = user;
		else
			document.getElementById("user").value = "";
		animate();
		if(r < files.length - 1 && l < files.length - 1){
			r += 1;
			l += 1;
		}
		else if(r < files.length - 1 && l == files.length - 1){
			r += 1;
			l = 0;
		}
		else{
			r = 0;
			l = files.length - 2;
		}

		document.getElementById('comment').value = "";
	}
}

//previous obj file via left arrow
document.getElementById('left').onclick = function(){
	$('input[type="checkbox"]:checked').prop('checked',false);
	if (files.length != 0) {
		lighting(keyLight, fillLight, backLight);
		var l2 = l;
		if(l < 0){
			l = files.length - 2;
			l2 = files.length - 1;
			r = 0;
		}
		else if(r == 0){
			l -= 1;
			r = files.length - 1;
		}
		else{
			l -= 1;
			r -= 1;
		}
		name = files[l2].name;
		file = files[l2];
		fileUpload(file);
		nameUpdate(name);
		if(newUser)
			document.getElementById("user").value = user;
		else
			document.getElementById("user").value = "";
		c = l2;
		animate();
		document.getElementById('comment').value = "";
	}
}

//updates title of obj file
function nameUpdate(name){
	document.getElementById("objName").innerHTML = "File Name: " + name;
}

//uploads obj onto canvas
function fileUpload(file){
	newUser = true;
	while(scene.children.length > 0) { 
		scene.remove(scene.children[0]); 
	}	
	var objLoader = new THREE.OBJLoader();
      
    // set your file encoding
    var encoding = 'ISO-8859-1'; 
	var jreader = new FileReader();
    var json = null;
    var jsonFile = "";
    var objFile = "";
    var sice = false;
    if (file != null) {
	    // set on load handler for reader
	    	for (var i = 0; i < jsons.length; i++) {
	    		jsonFile = jsons[i].name.split(".")[0];
	    		objFile = file.name.split(".")[0];
	    		if (jsonFile === objFile) { //if json file exists, read the file
	    			jsonFile = jsons[i];
	    			jreader.onload = function(e) {
	    				json = jreader.result;
	    			}
	    			sice = true;
	    			break;
	    		}
	    	}
	    if (sice == true) {
	  		jreader.readAsText(jsonFile, encoding);
	  		newUser = false;
	    }

    // create a file reader
    var reader = new FileReader();
    // set on load handler for reader
    reader.onload = function(e) {
    	if (sice == true) {
	    	var data = JSON.parse(json);
		    document.getElementById("user").value = data.user;
			for (var check = 0; check < data.label.length; check++)
				document.getElementById(data.label[check]).checked = true;		    
			//$(':checkbox').not( document.getElementById(data.label) ).attr('checked', false);
		    document.getElementById("date").value = data.date;
		    document.getElementById("comment").value = data.comment;
			//$(':checkbox').not( document.getElementById(data.label) ).attr('disabled', true);
			//$(document.getElementById(data.label)).attr('disabled', false);
		}
		else {
			$('input:checkbox').removeAttr('checked');
			var $inputs = $('.labels input:checkbox');
			$inputs.prop('disabled',false);
		}
		    var result = reader.result;
			lighting(keyLight, fillLight, backLight);
		    // parse using your corresponding loader
		    object = objLoader.parse( result );
		    object.position.y -= 0;
			object.position.x -= 5;
			object.traverse( function ( child ) {

	            if ( child instanceof THREE.Mesh ) {

	               child.geometry.center();

	            }
	    	});
			scene.add(object);
			boundingBox.setFromObject( object );
		    const center = boundingBox.getCenter();
		    const size = boundingBox.getSize();
			const maxDim = Math.max( size.x, size.y, size.z );
			const fov = camera.fov * ( Math.PI / 180 );
		    let cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );
			cameraZ *= offset;
			const minZ = boundingBox.min.z;
		    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;
			camera.position.z = center.z + cameraZ;

			camera.lookAt(center);
			controls.target = center;

		    // prevent camera from zooming out far enough to create far plane cutoff
		    controls.maxDistance = cameraToFarEdge * 4;
		    controls.saveState();
  		}

	    // read the file as text using the reader
	    reader.readAsText(file, encoding);
	    animate();
	    name = file.name
	    nameUpdate(name);
	}
}
var files = []; //array of files that are .obj
var jsons = []; //json files
var user = "";
var newUser = true;

window.onload = function() {
	var jsonInput = document.getElementById('jFile');
	jsonInput.addEventListener('change', function(e) {
		var jsonFileObject = $('input[name="jFile"]')[0].files;
		for (var i = 0; i < jsonFileObject.length; i++) {
			jsons.push(jsonFileObject[i]);
		}
	});

	var fileInput = document.getElementById('file');
	fileInput.addEventListener('change', function(e) {
	l = -1;
	r = 1;
	c = 0;
	files = [];

	//reset scene 
	while(scene.children.length > 0){ 
		scene.remove(scene.children[0]); 
	}	
	var file_data = $('input[name="file"]')[0].files;
	
	//filter out all the non-obj files
	for (var i = 0; i < file_data.length; i++) {
		if (file_data[i].name.split(".")[file_data[i].name.split(".").length - 1] == "obj") {
			files.push(file_data[i]);
		}
	}
	var objLoader = new THREE.OBJLoader();
	var i = 0;
	file = files[i];
      
    // set your file encoding
    var encoding = 'ISO-8859-1'; 

    // create a file reader
    var reader = new FileReader();
    var jreader = new FileReader();
    var json = "";
    var jsonFile = "";
    var objFile = "";
    var sice = false;
    if (file != null) {
	    // set on load handler for reader
	    	for (var i = 0; i < jsons.length; i++) {
	    		jsonFile = jsons[i].name.split(".")[0];
	    		objFile = file.name.split(".")[0];
	    		if (jsonFile === objFile) { //if json file exists, read the file
	    			jsonFile = jsons[i];
	    			jreader.onload = function(e) {
	    				json = jreader.result;
	    			}
	    			sice = true;
	    			break;
	    		}
	    	}
	  	if (sice == true) {
	  		jreader.readAsText(jsonFile, encoding);
	  		newUser = false;
	  	}

	    reader.onload = function(e) {
	    if (sice == true) {
			   	var data = JSON.parse(json);
			    document.getElementById("user").value = data.user;
			    for (var check = 0; check < data.label.length; check++)
					document.getElementById(data.label[check]).checked = true;
			    //$(':checkbox').not( document.getElementById(data.label) ).attr('checked', false);
			    document.getElementById("date").value = data.date;
			    document.getElementById("comment").value = data.comment;
				//$(':checkbox').not( document.getElementById(data.label) ).attr('disabled', true);
		}
	    else {
				$('input:checkbox').removeAttr('checked');
				var $inputs = $('.labels input:checkbox');
				$inputs.prop('disabled',false);
		}
	    var result = reader.result;
		lighting(keyLight, fillLight, backLight);
        // parse using your corresponding loader
        object = objLoader.parse( result );
        object.position.y -= 0;
		object.position.x -= 5;
		object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

               child.geometry.center();

            }
	    });
		scene.add(object);
		//centers obj object
		var height = boundingBox.size().y;
		boundingBox.setFromObject( object );
	    const center = boundingBox.getCenter();
	    const size = boundingBox.getSize();
		const maxDim = Math.max( size.x, size.y, size.z );
		const fov = camera.fov * ( Math.PI / 180 );
	    let cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );
		cameraZ *= offset;
		const minZ = boundingBox.min.z;
	    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;
		camera.position.z = center.z + cameraZ;
		var dist = height / (2 * Math.tan(camera.fov * Math.PI / 360));
		var pos = scene.position;
		//camera.position.set(pos.x, pos.y, dist * 1.1); // fudge factor so you can see the boundaries
		camera.lookAt(center);
		controls.target = center;
		

	    // prevent camera from zooming out far enough to create far plane cutoff
	    controls.maxDistance = cameraToFarEdge * 4;
	    controls.saveState();
      }

      // read the file as text using the reader
      reader.readAsText(file, encoding);
      animate();
      name = file.name
      nameUpdate(name);
      $('input:checkbox').removeAttr('checked');
      document.getElementById('comment').value = "";
	}
	  else //if file isn't obj, alert user
	  	alert("File is not '.obj', please try again.");

    });
}

var animate = function () {
	requestAnimationFrame( animate );

	//cube.rotation.x += 0.1;
	//cube.rotation.y += 0.1;

	renderer.render(scene, camera);
};

//convenient source for debugging lighting
var lighting = function (keyLight, fillLight, backLight) {
	scene.add(keyLight);
	scene.add(fillLight);
	scene.add(backLight);
}

//sets date to current date
document.addEventListener("DOMContentLoaded", function(event) {
	let today = new Date().toISOString().substr(0, 10);
	document.querySelector("#date").value = today;
});

//gets formatted date for JSON file
function getFormattedDate(date) {
    return date.getFullYear()
        + "-"
        + ("0" + (date.getMonth() + 1)).slice(-2)
        + "-"
        + ("0" + date.getDate()).slice(-2);
}

$(document).ready(function() {
	$("#btn").click(function(e){
	    var output = {};

	    //file json
		    output["file"] = files[c].name;

		//form json
		jQuery("#myform").serializeArray().map(function(item) {
		    if ( output[item.name] ) {
		        if ( typeof(output[item.name]) === "string" ) {
		            output[item.name] = [output[item.name]];
		        }
		        output[item.name].push(item.value);
		    } else {
		        output[item.name] = item.value;
		    }
		});
		e.preventDefault(); 
		var postData = $('#myform').serialize() + "&file=" + files[c].name + "&fname=" + files[c].name.split(".")[0];
	    $.ajax({
            type: "post",
            url: "submit.php",
            data: postData,
            success: function(data) {
            	var arr = data.split("\n");
            	jsons.push(new File(arr, files[c].name.split(".")[0] + ".json", {type: "application/json"}));
            	alert("Saved in Code/json!");
            	if(newUser)
					user = document.getElementById("user").value;
            }
	    });
		/*function download(content, fileName, contentType) {
		    var a = document.createElement("a");
		    var file = new Blob([JSON.stringify(content, null, "\t")], {type: contentType});
	
		    a.href = URL.createObjectURL(file);
		    a.download = fileName;
		    a.click();  
		}
		download(output, name.split(".")[0] + '.json', 'application/json');*/
	});
});

/*$('.labels input:checkbox').click(function(){
    var $inputs = $('.labels input:checkbox'); 
    if($(this).is(':checked')){  // <-- check if clicked box is currently checked
       $inputs.not(this).prop('disabled',true); // <-- disable all but checked checkbox
    }else{  //<-- if checkbox was unchecked
       $inputs.prop('disabled',false); // <-- enable all checkboxes
    }
})*/