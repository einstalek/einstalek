---
title: "How To Visually Evaluate Image Classifier Using StyleGAN2"
date: "2023-11-12"
ShowToc: true
TocOpen: false
tags: ["classifier", "gan", "latent"]
---


In this article, we’ll be evaluating an image classifier by exploring StyleGAN2 latent space. We’ll look at the performance of a hairstyle classifier that we use in [Ready Player Me](https://readyplayer.me/).

StyleGAN2 is a generative model architecture demonstrating state-of-the-art image generation. Code of the model and pre-trained weights can be found, for example, in this [repo](https://github.com/rosinality/stylegan2-pytorch), alongside generated examples across various domains.

{{< figure src="/posts/hairstyle-classifier/faces.png" align=center
caption="Figure 1: Examples generated with StyleGAN2" class=custom-caption >}}


First, what are we going to do? The idea is pretty simple. Having a hairstyle classifier, we’ll search through StyleGAN2 latent space to find directions in it corresponding to each of our classes.

It’s not the best way to test your model if you need some good-old metrics like accuracy, F1-score, and others. But, this way, you get to see what kind of pictures actually trigger your model to predict a certain class. So, it’s going to be more visual.

### Small intro to StyleGAN2

Let’s not go too deep into technical details, but here’s what you need to know. If you look at the StyleGAN2 architecture below, you would see that the noise input Z is first mapped to the style space W, which then is fed to the Generator.

{{< figure src="/posts/hairstyle-classifier/stylegan.png" 
caption="Figure 2: StyleGAN2 architecture" align=center height=512 class=custom-caption >}}


Manipulating input to StyleGAN in the W+ space may be used to generate images from a certain domain. For example, it’s done in StyleCLIP:

{{< figure src="/posts/hairstyle-classifier/samples.png" 
caption="Figure 3: Variance in StyleGAN2 space" class=custom-caption >}}

### CNN Classifier + StyleGAN

Let’s take our hairstyle classifier and consider one of its classes. Say, “curly bob with fringe”. The goal is to check whether the classifier is triggered by the right high-level features presented in images.

{{< figure src="/posts/hairstyle-classifier/training-set.png" 
caption="Figure 4: Examples from training dataset, 'curly bob with fringe'" align=center class=custom-caption >}}


What we want to do is to make our StyleGAN generate pictures that will maximize the probability of the “curly bob with fringe” class predicted by our hairstyle model. And hopefully, we’re going to see images similar to the ground truth ones.
By tuning the direction in latent space, we're optimizing two losses:

1. Classifier loss, which could be cross-entropy between what the hairstyle classifier predicts and the label of the desired class;

2. Identity loss, to preserve the person’s identity while changing only their hairstyle. Sort of like a regularization. For that, we can use, for example, a pre-trained [InsightFace](https://github.com/TreB1eN/InsightFace_Pytorch).

### Results

After running tuning for multiple classes, we can now check how well we managed to capture those style directions. For that, we’ll generate a sequence of images adding the learned direction vector to the latent vector with some weight.

Combining these sequences of images into GIFs, we got something like this for the “curly bob with fringe” class:

{{< figure src="/posts/hairstyle-classifier/interpolation.gif" 
caption="Figure 5: Interpolation in W+ space for 'curly bob with fringe' hairstyle" align=center class=custom-caption >}}

Remember, we got these results simply by maximizing our classifier’s probabilities for a certain class. This shows quite visually what kind of high-level features trigger the classifier to predict a particular class.

Let’s see the same kind of visualizations for one more class, long straight hair with fringe:

{{< figure src="/posts/hairstyle-classifier/interpolation-1.gif" 
caption="Figure 6: Interpolation in W+ space for 'long straight with fringe' hairstyle" align=center class=custom-caption >}}

These are both classes that our hairstyle model seems to have learned correctly. With face features not changing much during the interpolation in the W+ space, we see hairstyles in our examples change exactly how they are supposed to.

But of course, sometimes models overfit or learn to detect something else but the real target features. To illustrate one of those cases, let’s look at interpolation examples for a class of “long African braids”.

{{< figure src="/posts/hairstyle-classifier/interpolation-2.gif" 
caption="Figure 7: Interpolation in W+ space for 'long African braids' hairstyle" align=center class=custom-caption >}}


Here, we see that maximizing the hairstyle model’s confidence for this hairstyle class also causes changes in skin color. This may suggest, for example, that the dataset is unbalanced for this particular class. Racial disbalance in the dataset can easily cause such behavior and should be dealt with by collecting more images with a more diverse representation.