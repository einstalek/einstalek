# Eliminating Seams: Joining Separate Meshes with Blender

I recently encountered a problem working with 3D avatars: having a custom-generated head mesh, I needed to merge it seamlessly with the avatar's body. And since you can't go around asking 3D artists to do their magic all the time, here I suggest a simple solution for this type of problem.

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://i.imgur.com/jBHQxtt.png" alt="alt text" width="100%"/>
    <figcaption> *Separate head and body meshes* </figcaption>
</div>

To tackle this, one can make use of Blender's proportional editing, and as it turns out, it works pretty well.

## Finding Neck-Seam Vertex Correspondences

First, I needed to establish a vertex-to-vertex correspondence between the head and body neck seam vertices. This was fairly straightforward since I had an example of a head mesh that fit precisely onto the body. By measuring pairwise distances between head and body vertices, I found the desired correspondences.

<p>
``
body_seam_indices = [...]  # vertex indices of the neck seam on the body
head_seam_indices = [...]  # vertex indices of the neck seam on the head that fits the body 

# get body seam vertex coordinates
body_verts = [bpy.data.objects[body].data.vertices[i].co for i in body_seam_indices]
body_verts = np.array(body_verts)
# and head seam vertex coordinates
head_verts = [bpy.context.scene.objects[src_head_key].data.vertices[i].co for i in head_seam_indices]
head_verts = np.array(head_verts)

# find vertex-to-vertex correspondances by comparing distances
head_indices = np.arange(len(head_seam_indices))
body_indices = np.argmin(scipy.spatial.distance.cdist(head_verts, body_verts), axis=1)
``
</p>

## Proportional editing

Using proportional editing, I can pull a vertex in a specific direction while influencing a certain zone around that vertex as well. The radius of this zone of influence is a hyperparameter in this approach. Let's see what happens if I go through the neck-seam vertex correspondences that I found and pull each head seam vertex towards its corresponding vertex from the neck seam.

<p>
``
body_seam_indices = np.array(body_seam_indices)[body_indices]
head_seam_indices = np.array(head_seam_indices)[head_indices]

# go through each seam vertex-pair
for i, (head_vertex_index, body_vertex_index) in enumerate(zip(head_seam_indices, body_seam_indices)):
    # get target coordinate from the body vertex
    target_coord = bpy.data.objects[body].data.vertices[body_vertex_index].co

    # enter edit mode on the head that we will be editing
    obj = bpy.data.objects[head]
    bpy.ops.object.mode_set(mode='EDIT')

    # find initial head vertex coordinate and select that vertex
    bm = bmesh.from_edit_mesh(bpy.context.edit_object.data)
    vertex = [v for v in bm.verts if v.index == head_vertex_index][0]
    vertex.select = True
    init_coord = vertex.co
        
    # pull the head vertex with proportional editing
    translation = coord - init_coord
    bpy.ops.transform.translate(value=1*translation, 
        proportional_size=0.1,  # hyperparameter
        constraint_axis=(False, False, False),
        mirror=False,
        use_proportional_edit=True,
        proportional_edit_falloff='SMOOTH'
        )
``
</p>

By the time we pull on the last vertex, the first one will have already shifted a bit from the target position. But repeating this a few times will reach a certain convergence pretty fast.

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://i.imgur.com/Bc02ovP.png" alt="alt text" width="100%"/>
    <figcaption> *Neck seam after 1, 2, 5 and 10 passes proposed editing* </figcaption>
</div>

After ~10 passes the gap between two meshes is so small, that I can now just set head seam vertex corrdinates to the same ones as their corresponding body vertices.

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://i.imgur.com/vbT9g42.png" alt="alt text" width="100%"/>
    <figcaption> *Hard-setting seam vertices to target positions after 10 passes of proportional editing* </figcaption>
</div>

## Conclusion
Described here is a very simple yet effective approach to joining two separate meshes with different seams. In my case, the vertex count of both seams was the same, but this solution can be extended to other cases as well.