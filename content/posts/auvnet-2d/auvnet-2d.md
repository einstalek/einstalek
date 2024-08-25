---
title: "AUV-Net: Paper Break-down, Part 1"
date: "2023-05-18"
ShowToc: true
TocOpen: false
tags: ["pca", "alignment", "paper"]
---


Aligning mesh textures with different topologies could be a fantastic feature for any 3D project. This would unlock numerous possibilities, such as texture transfer or novel texture generation. That’s precisely what the [AUV-Net paper](https://research.nvidia.com/labs/toronto-ai/AUV-NET/) by Nvidia addresses. Let’s review the paper to understand its primary concepts, implement it from scratch, and see if we can achieve results similar to those in the paper.

{{< figure align="center" src="/posts/auvnet-2d/animals-3d.webp" caption="Figure 1: Texture transfer with AUV-Net, image from the paper" class="custom-caption" >}}


### 2D case

To illustrate the main concept of their approach, the authors first demonstrate how this method would work in 2D. Instead of dealing with meshes, we consider the task of aligning face images in various poses (face textures, as they call it in the paper).

Having any dataset of aligned faces, it’s easy to generate misaligned ones using `cv2.perspectiveTransform`.

{{< figure src="/posts/auvnet-2d/1_VEUyk2tEokrAJ9NllKM1Ng.webp" caption="Figure 2: Examples of generated misaligned faces" class=custom-caption >}}

>To link this task with texture mapping, one could consider training images as square shapes in 2D, and [original images]are their aligned texture images


It is suggested to map each pixel’s coordinates into the aligned UV space, and then index the texture image by UV coordinates from that space.

### PCA analogy

>We take inspiration from classic linear subspace learning methods such as eigenfaces, where a basis is computed via PCA for a set of face images, so that each face is decomposed into a weighted sum of the eigenfaces. Note that PCA works best when the images are aligned. Therefore, if a network is designed to decompose the input images into weighted sums of basis images, and is allowed to deform the input images before the decomposition, the network should learn to align the input images into a canonical pose".

**`There’s the main idea`**: build the network in such a way, that it <ins>first learns to deform the input (with the UV mapper), and then decomposes the result into a weighted sum of basis components</ins>.

Now, our goal is to learn the UV mapping and a basis set of faces. A separate encoder is used to predict weights for the basis. In this specific case, given a set of 2D points, the `Basis Generator` will produce a set of N grayscale images (color for each pixel’s coordinate).

{{< figure align="center" src="/posts/auvnet-2d/1_eSSK0nHI7AhPBHgHNWf9lQ.webp" caption="Figure 3: 2D AUV-Net approach from the paper" class=custom-caption >}}

### Results

Training this is straightforward, so let’s proceed directly to the results. We can pass a uniform grid of points to the `Basis Generator` to obtain the aligned face basis. Here are some samples of grayscale images from the basis obtained for one input image:

{{< figure align="center" src="/posts/auvnet-2d/1_tIk1Vcmy6XQXFXiaf3oLpA.webp" caption="Figure 4: Aligned face basis components" class=custom-caption >}}

The results are reminiscent of the PCA decomposition applied to face images.


{{< figure align="center" src="/posts/auvnet-2d/1_-4YrCs6M3CIhPJCGDVV0xg.webp" caption="Figure 5: From left to right: input distorted image, reconstruction, aligned reconstruction, original image" class=custom-caption >}}


Now we can obtain aligned input faces, but the quality is low because we’re using a weighted sum operation to produce them. To address this issue, the authors propose the following solution:

>We sample points from the input image, feed those points to the UV mapper to obtain UV coordinates, use the UV coordinates and colors of the sampled points to fill a blank image, and finally inpaint the missing regions.

By following the proposed solution, these are the aligned textures I got:

{{< figure align="center" src="/posts/auvnet-2d/1__ahi0mkwp5BHSwaAGg2Abw.webp">}}
{{< figure align="center" src="/posts/auvnet-2d/1_S2acPd_IYDv8JaG2qaEG9A.webp" caption="Figure 6: Aligned images, high resolution" class=custom-caption >}}

### Conclusion
The results appear not as impressive as those shown in the paper, but with additional training iterations, the quality should improve. 

It’s important to notice one detail here: we see that face images are getting aligned, but not exactly in the expected manner. Results are aligned with each other, but they are not aligned with the canonical pose (which would mean removing the initial distortion).

One could actually achieve such result, by adding an additional supervision based on face key-points. This is actually done in the 3D case, to ensure a specific UV split.


