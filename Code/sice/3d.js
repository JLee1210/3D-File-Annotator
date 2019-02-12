var scene = new THREE.Scene();
//scene.background = new THREE.Color( 0xffffff );
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( 1000, window.innerHeight );
document.body.appendChild( renderer.domElement );

/*var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
*/


//camera.position.z = 1000;

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.camping = true;
controls.dampingFactor = .7;
controls.enableZoom = true;

controls.update();

var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);
 
var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);
 
var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();
 
scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

const boundingBox = new THREE.Box3();
offset = 10 || 1.25

var l = -1;
var r = 1;
var name = "";
var c = 0;

document.getElementById('right').onclick = function(){
	while(scene.children.length > 0){ 
    	scene.remove(scene.children[0]); 
	}	
	scene.add(keyLight);
	scene.add(fillLight);
	scene.add(backLight);
	var file_data = $('input[name="file"]')[0].files;
	name = file_data[r].name;
	c = r;
	fileUpload(name);
	nameUpdate(name);
	animate();
	console.log(r);
	if(r < file_data.length - 1 && l < file_data.length - 1){
		r += 1;
		l += 1;
	}
	else if(r < file_data.length - 1 && l == file_data.length - 1){
		r += 1;
		l = 0;
	}
	else{
		r = 0;
		l = file_data.length - 2;
	}
}

document.getElementById('left').onclick = function(){
	while(scene.children.length > 0){ 
		scene.remove(scene.children[0]); 
	}	
	scene.add(keyLight);
	scene.add(fillLight);
	scene.add(backLight);
	var file_data = $('input[name="file"]')[0].files;
	var l2 = l;
	console.log(l2);
	if(l < 0){
		l = file_data.length - 2;
		l2 = file_data.length - 1;
		r = 0;
	}
	else if(r == 0){
		l -= 1;
		r = file_data.length - 1;
	}
	else{
		l -= 1;
		r -= 1;
	}
	name = file_data[l2].name;
	fileUpload(name);
	nameUpdate(name);
	c = l2;
	animate();
}

function nameUpdate(name){
	document.getElementById("objName").innerHTML = name;
}

function fileUpload(name){
	var objLoader = new THREE.OBJLoader();
	objLoader.setPath('/sice/objs/');
	objLoader.load(name, function(object){
		object.position.y -= 0;
		object.position.x -= 5;
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
		controls.target = center;

	    // prevent camera from zooming out far enough to create far plane cutoff
	    controls.maxDistance = cameraToFarEdge * 2;
	    controls.saveState();
	});
	animate();
}

document.getElementById('sice').onclick = function(){
	l = -1;
	r = 1;
	c = 0;
	var file_data = $('input[name="file"]')[0].files;
	fileUpload(file_data[0].name);
	nameUpdate(file_data[0].name);
	/*var objLoader = new THREE.OBJLoader();
	objLoader.setPath('/sice/objs/');
	objLoader.load($('input[name="file"]')[0].files[0].name, function(object){
		object.position.y -= 0;
		object.position.x -= 5;
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
		controls.target = center;

	    // prevent camera from zooming out far enough to create far plane cutoff
	    controls.maxDistance = cameraToFarEdge * 2;
	    controls.saveState();
	});*/
}
var animate = function () {
	requestAnimationFrame( animate );

	//cube.rotation.x += 0.1;
	//cube.rotation.y += 0.1;

	renderer.render(scene, camera);
};

animate();

document.addEventListener("DOMContentLoaded", function(event) {
	let today = new Date().toISOString().substr(0, 10);
	document.querySelector("#date").value = today;
});

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
	    var file_data = $('input[name="file"]')[0].files;
		    output["file"] = file_data[c].name;

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
		function download(content, fileName, contentType) {
		    var a = document.createElement("a");
		    var file = new Blob([JSON.stringify(content, null, "\t")], {type: contentType});
		    a.href = URL.createObjectURL(file);
		    a.download = fileName;
		    a.click();
		}
		download(output, 'data.json', 'application/json');
	});
});