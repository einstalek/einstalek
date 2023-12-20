# AUV-Net: Paper Break-down, Part 1

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*1mygQ4qtpEiPAJdbLdBRmQ.png" alt="alt text" width="80%"/>
    <figcaption> *Texture transfer with AUV-Net, image from the paper* </figcaption>
</div>

Aligning mesh textures with different topologies could be a fantastic feature for any 3D project. This would unlock numerous possibilities, such as texture transfer or novel texture generation. That’s precisely what the [AUV-Net paper by Nvidia](https://research.nvidia.com/labs/toronto-ai/AUV-NET/) addresses. Let’s review the paper to understand its primary concepts, implement it from scratch, and see if we can achieve results similar to those in the paper.

## 2D case

To illustrate the main concept of their approach, the authors first demonstrate how this method would work in 2D. Instead of dealing with meshes, we consider the task of aligning face images in various poses (face textures, as they call it in the paper).

Having any dataset of aligned faces, it’s easy to generate misaligned ones using *cv2.perspectiveTransform*.

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*VEUyk2tEokrAJ9NllKM1Ng.png" alt="alt text" width="80%"/>
    <figcaption> *Examples of generated misaligned faces* </figcaption>
</div>

*"To link this task with texture mapping, one could consider training images as square shapes in 2D, and [original images]are their aligned texture images".*

It is suggested to map each pixel’s coordinates into the aligned UV space, and then index the texture image by UV coordinates from that space.

*"We take inspiration from classic linear subspace learning methods such as eigenfaces, where a basis is computed via PCA for a set of face images, so that each face is decomposed into a weighted sum of the eigenfaces. Note that PCA works best when the images are aligned. Therefore, if a network is designed to decompose the input images into weighted sums of basis images, and is allowed to deform the input images before the decomposition, the network should learn to align the input images into a canonical pose".*

**There’s the main idea**: build the network in such a way, that it <ins>first learns to deform the input (with the UV mapper), and then decomposes the result into a weighted sum of basis components</ins>.

Now, our goal is to learn the UV mapping and a basis set of faces. A separate encoder is used to predict weights for the basis. In this specific case, given a set of 2D points, the Basis Generator will produce a set of N grayscale images (color for each pixel’s coordinate).

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*eSSK0nHI7AhPBHgHNWf9lQ.png" alt="alt text" width="80%"/>
    <figcaption> *2D AUV-Net approach from the paper* </figcaption>
</div>

Training this is straightforward, so let’s proceed directly to the results. We can pass a uniform grid of points to the *Basis Generator* to obtain the aligned face basis. Here are some samples of grayscale images from the basis obtained for one input image:

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*tIk1Vcmy6XQXFXiaf3oLpA.png" alt="alt text" width="80%"/>
    <figcaption> *Aligned face basis components* </figcaption>
</div>

The results are reminiscent of the PCA decomposition applied to face images.

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://miro.medium.com/v2/resize:fit:1000/format:webp/1*p1KTpIXUxBnYuZ5AK-n3Qg.png" 
    alt="alt text" 
    width="80%"/>
</div>
<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://miro.medium.com/v2/resize:fit:1000/format:webp/1*-4YrCs6M3CIhPJCGDVV0xg.png" 
    alt="alt text" 
    width="80%"/>
    <figcaption> *From left to right: input distorted image, reconstruction, aligned reconstruction, original image* </figcaption>
</div>

Now we can obtain aligned input faces, but the quality is low because we’re using a weighted sum operation to produce them. To address this issue, the authors propose the following solution:

*"We sample points from the input image, feed those points to the UV mapper to obtain UV coordinates, use the UV coordinates and colors of the sampled points to fill a blank image, and finally inpaint the missing regions".*

By following the proposed solution, these are the aligned textures I obtained these:

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://miro.medium.com/v2/resize:fit:1000/format:webp/1*_ahi0mkwp5BHSwaAGg2Abw.png" 
    alt="alt text" 
    width="80%"/>
</div>
<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://miro.medium.com/v2/resize:fit:1002/format:webp/1*S2acPd_IYDv8JaG2qaEG9A.png" 
    alt="alt text" 
    width="80%"/>
    <figcaption> *Aligned images, high resolution* </figcaption>
</div>

The results appear not as impressive as those shown in the paper, but with additional training iterations, the quality should improve. It’s important to notice one detail here: we see that face images are getting aligned, but not exactly in the expected manner. Results are aligned with each other, but they are not aligned with the canonical pose (which would mean removing the initial distortion).
