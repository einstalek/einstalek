# Text-Guided 3D Face Synthesis: Paper Break-Down

In this post, I want to revisit Score Samping Distillation (SDS) for 3D head synthesis. Having recently found [this paper](https://faceg2e.github.io/), I discovered several ideas on how to properly generate textures with SDS. In my previous post on this topic I was mentioning that it was particularly complicated to generate clean face textures.

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://i.imgur.com/OHSYAoA.png" alt="alt text" width="100%"/>
    <figcaption> *Image from the paper: faceg2e pipeline* </figcaption>
</div>

## Geometry phase

First thing to notice is that the pipeline is split into two parts: geometry generation and then texture generation. Geometry is decoupled from texture in order not to produce textures with geometry details baked in them.

The first part is pretty much the same as I described in my [previous post](sds-head-shape). 3DMM parameters are iteratively updated with a grey-scale render (all vertices assingned the same color) being fed into denoising unet. One thing different is scheduling timestamp to linearly decrease during the training.

Without proposed view-dependent prompts, I get something like this during the geometry phase:  

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <video src="https://i.imgur.com/p8AvUQt.mp4" alt="alt text" width="100%" autoplay loop muted/>
    <figcaption> *From left to right: Scarlett Johansson, Barack Obama, Elon Musk, Leelee Sobieski * </figcaption>
</div>


## Texture phase

During the texture phase, we fix the geometry and tune the texture in the latent space of VAE decoder. In order not to produce cleaner textures, two types of supervision are proposed.

1. Depth supervision: use depth-controlnet, by passing to it depth-render of the mesh, to keep awareness of the geometry itself, separated from the texture. This is intended to get rid of geometric details baked into texture, and to "uphold geometry-texture alignment".

2. Texture-prior: train a custom SD model on textures. This custom SD would help to get rid of light baked into textures, making use of learnt texture distribution.

First, I'm just gonna add the first type of supervision, by using a depth-controlnet. Instead of randomly initializing texture latents, I'll use latents of some fixed texture for each training. Let's see the results I get:

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <video src="https://i.imgur.com/eGA345T.mp4" alt="alt text" width="100%" autoplay loop muted/>
    <img src="https://i.imgur.com/A29xHod.png" alt="alt text" width="100%"/>
    <figcaption> *From left to right: Scarlett Johansson, Barack Obama, Elon Musk, Leelee Sobieski * </figcaption>
</div>


Now, I'm gonna add something similar to the proposed texture-prior, but without havinng to train my own SD model. Instead, I will use a controlnet model trained on pair of textures and canny edges in them. Passing a fixed control input to this controlnet, alonside with prompt like "face texture", I'll pass its output to the denoising UNet and get a second SDS gradient tensor (additional to the one obtained with depth-controlnet).

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <video src="https://i.imgur.com/Vrgbvhx.mp4" alt="alt text" width="100%" autoplay loop muted/>
    <img src="https://i.imgur.com/qhgLfpn.png" alt="alt text" width="100%"/>
    <figcaption> *From left to right: Scarlett Johansson, Barack Obama, Elon Musk, Leelee Sobieski * </figcaption>
</div>

Notice how with the second type of supervision added, resulting textures have more even lighting.