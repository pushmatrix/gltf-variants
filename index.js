var THREE = require('THREE')
window.THREE = THREE
var OrbitControls = require('three-orbit-controls')(THREE)
require('./GLTFLoader.js');
const loader = new THREE.GLTFLoader();
document.body.style.margin = 0
const dat = require('dat.gui');
const gui = new dat.GUI();

var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setClearColor(0xFFFFFF, 1);
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000)
scene.add(camera)
camera.position.z = 300
var controls = new OrbitControls(camera)
controls.enabled = false;

var currentModel;

var guiOptions = {
	model:  "Box/Box.gltf"
}

gui.add(guiOptions, 'model', {"Box0": "Box/Box.gltf", "Box1": "Box1/Box.gltf"}).onChange(function(path) {
	loadModel(path);
})

var optionsFolder;


function loadModel(path) {
	if (optionsFolder) {
		gui.removeFolder(optionsFolder);
	}
	
	optionsFolder = gui.addFolder('Options');
	optionsFolder.open();
	if (currentModel) {
		scene.remove(currentModel);
	}

	loader.load(
		// resource URL
		path,
		function ( gltf ) {
		  currentModel = gltf.scene;
		  currentModel.scale.set(100, 100, 100);
		  scene.add(currentModel);

		  fetchVariants(currentModel);

		  setVariant(currentModel, "Green");
		},
		// called while loading is progressing
		function ( xhr ) {

		  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

		},
		// called when loading has errors
		function ( error ) {

		  console.log( 'An error happened' );
		}
	)
}




var pointLight = new THREE.PointLight(0xFFFFFF)
scene.add(pointLight)
pointLight.position.set(10, 50, 130)
pointLight.intensity = 2;


var ambient = new THREE.AmbientLight( 0x202020 )
ambient.intensity = 5;
scene.add(ambient)

var animate = function() {
	requestAnimationFrame(animate)
	if (currentModel) {
		currentModel.rotation.y += 0.01
	}
	renderer.render(scene, camera)
}
animate()


function fetchVariants(model) {
	var variants = {};
	model.traverse(function(child) {
		if (child.isMesh && child.material && child.material.userData && child.material.userData.gltfExtensions && child.material.userData.gltfExtensions.SHOP_variants) {
		console.log(child);
			for (const [key, value] of Object.entries(child.material.userData.gltfExtensions.SHOP_variants)) {
				var options;
				if (variants[key]) {
					options = variants[key];
				} else {
					options = new Set();
					variants[key] = options;
				}
				for (const [k, v] of Object.entries(value)) {
					options.add(k);
				}
			}
		}
	});
	
	for (const [key, value] of Object.entries(variants)) {
		var defaultValue = Array.from(value)[1];
		variants[key] = defaultValue;
		setVariant(model, key, defaultValue);
		optionsFolder.add(variants, key, Array.from(value)).onChange(function(v) {
			setVariant(model, key, v);
		});
	}
	return variants;
}


// glTF -> threejs property name mappings
mappings = {
	"baseColorFactor" : "color"
}

function setVariant(model, optionName, optionValue) {
	model.traverse(function(child) {
		if (child.isMesh && child.material && child.material.userData && child.material.userData.gltfExtensions && child.material.userData.gltfExtensions.SHOP_variants && child.material.userData.gltfExtensions.SHOP_variants[optionName]) {
			var properties = child.material.userData.gltfExtensions.SHOP_variants[optionName][optionValue];
			if (properties) {
				for (const [key, value] of Object.entries(properties)) {
					var propertyName = key;

					if (mappings[propertyName]) {
						propertyName = mappings[propertyName];
					}
					console.log(child.material[propertyName]);
					if (Array.isArray(value)) {
						child.material[propertyName].fromArray(value);
					} else {
						child.material[propertyName] = value;
					}
				}
			}
		}
	});
}

loadModel("Box/Box.gltf");


