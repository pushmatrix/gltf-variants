USD has apparently had variant support for ages, and is a standard in the VFX world. Unfortunately usdz does not support it yet.

<img width="635" alt="e283912e18" src="https://user-images.githubusercontent.com/190692/53742842-92fb3100-3e67-11e9-9c55-c5173bd7d836.png">


The paradigm USD uses is that you can define variants as overrides. So by default in the image above, the sphere is a certain colour, and the blue variant overrides its color property to be color = (0,0,1). You could do multiple overrides, so that the blue variant is color = (0,0,1) and roughness = 1, for example.

Any property in glTF supports adding an "extensions" object to it, to add supplemental data. This data is then accessible on the object itself when it gets loaded by Three.
Here was my initial thoughts on adding variant data:

<img width="435" alt="790b861d82" src="https://user-images.githubusercontent.com/190692/53742897-aad2b500-3e67-11e9-88b8-4955392bf621.png">

For every given material, you would list all the variant options that can affect that material. So for example, if you have the "Red" value selected for the "Color" option, it would override the base color with [1,0,0,0]. If you have the "Glossy" value selected for "Finish", it would override the roughness with value 0.

For this first test I didn't use textures, but you could easily extend it to do that (you'd have to then load the textures on the fly).

I then created a simple viewer that loads the glTF file, and loops through all of its nodes to see if it has any SHOP_variants data. If it does, I populate a dropdown list in the top right showing the available options. When you click on one of the options, (i.e Color = Red), it loops through all the nodes of the model again, checking for any properties that are affected by the "Color" option, and then updates the properties for the corresponding override (Red).

![82b1c9b302](https://user-images.githubusercontent.com/190692/53742939-bde58500-3e67-11e9-9e79-98285049981e.gif)

Here's an example of a glTF combining two properties overrides into one. The option is called Style, and the possible values are "Regular" and "Deluxe".

<img width="464" alt="54513bdfce" src="https://user-images.githubusercontent.com/190692/53742955-c8078380-3e67-11e9-94a0-614bab135e4a.png">

Regular is red and matte, deluxe is yellow and glossy.

![37a3f5e4e4](https://user-images.githubusercontent.com/190692/53743015-e5d4e880-3e67-11e9-8841-76f434d718fe.gif)

Note the glossiness can be seen by the white highlight that appears on the cube.
