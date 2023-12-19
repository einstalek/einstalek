# How to Visually Evaluate Image Classifier Using StyleGAN2

*29 March, 2022*

In this article, we’ll be evaluating image classifiers by exploring StyleGAN2 latent space. In our case, we’ll look at the performance of the hairstyle classifier that we use in Ready Player Me.

StyleGAN2 is a generative model architecture demonstrating state-of-the-art image generation. Code of the model and pre-trained weights can be found, for example, in this [repo](https://github.com/rosinality/stylegan2-pytorch), alongside generated examples across various domains.

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://assets-global.website-files.com/647a5cfe9ae504d687e5d999/647e592d20114e12ccfa5ba2_bHXHHxsYf9DVzsXJ5UUCt0SxEefs8y_yLmMrul6ErE6MlsC_HJ7CbZVarvZuIvv4sGSG62tLrkcON1dJ8kzKIeg2mTe87tDVPZvfafdR04SBJWjMfPtoRmgiCvAmqv4IQs0x_s0s.png" alt="alt text" width="80%"/>
    <figcaption> *Examples generated with StyleGAN2* </figcaption>
</div>

First, what are we going to do? The idea is pretty simple. Having a hairstyle classifier, we’ll search through StyleGAN2 latent space to find directions in it corresponding to each of our classes.

It’s not the best way to test your model if you need some good-old metrics like accuracy, F1-score, and others. But, this way, you get to see what kind of pictures actually trigger your model to predict a certain class. So, it’s going to be more visual.

## Small intro to StyleGAN2

Let’s not go too deep into technical details, but here’s what you need to know. If you look at the StyleGAN2 architecture below, you would see that the noise input Z is first mapped to the style space W, which then is fed to the Generator.

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://assets-global.website-files.com/647a5cfe9ae504d687e5d999/647e592d20114e12ccfa5ba6_F4evsTE37sILNDzCPEJW62gBjRaESsxwDqNU1F57hKO9M5ZhbHeIBJpmmdiiLnftygpu97S5z6P8oUjQr7idXIEJ9QUU4R4Od5L5LxNTpa9bFs-H6AxDwjUKGWqhMQooLQSbgQo1.png" alt="alt text" width="60%"/>
</div>

Manipulating input to StyleGAN in the W+ space may be used to generate images from a certain domain. For example, it’s done in StyleCLIP:

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://assets-global.website-files.com/647a5cfe9ae504d687e5d999/647e592d20114e12ccfa5b93_qnqK2kdjmcscJtB4s53LZ8SMVMRjht6ck7wFq6QnA7ntG_JLqE2iVozZ-yrAa0rjylTL5fNZU8OvB8-2TQ1MTG67xl3GK0epTnaVlcUlGbZJBxoEfV4pKn58q4mg6RthrW4XIGxP.png" alt="alt text" width="80%"/>
    <figcaption> *Variance in StyleGAN2 space* </figcaption>
</div>

## CNN Classifier + StyleGAN

Let’s take our hairstyle classifier and consider one of its classes. Say, “curly bob with fringe”. The goal is to check whether the classifier is triggered by the right high-level features presented in images.

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://assets-global.website-files.com/647a5cfe9ae504d687e5d999/647fbaf420632cb4c34329c8_CNN%20Classifier%20StyleGAN.png" alt="alt text" width="80%"/>
    <figcaption> *Examples from training dataset, "curly bob with fringe" class* </figcaption>
</div>

What we want to do is to make our StyleGAN generate pictures that will maximize the probability of the “curly bob with fringe” class predicted by our hairstyle model. And hopefully, we’re going to see images similar to the ground truth ones.
By tuning the direction in latent space, we're optimizing two losses:

1. Classifier loss, which could be cross-entropy between what the hairstyle classifier predicts and the label of the desired class;

2. Identity loss, to preserve the person’s identity while changing only their hairstyle. Sort of like a regularization. For that, we can use, for example, a pre-trained [InsightFace](https://github.com/TreB1eN/InsightFace_Pytorch).

## Results

After running tuning for multiple classes, we can now check how well we managed to capture those style directions. For that, we’ll generate a sequence of images adding the learned direction vector to the latent vector with some weight.

Combining these sequences of images into GIFs, we got something like this for the “curly bob with fringe” class:

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://assets-global.website-files.com/647a5cfe9ae504d687e5d999/647fbc1d99d20d55ab083fd6_Interpolation-wplus.gif" alt="alt text" width="100%"/>
    <figcaption> *Interpolation in W+ space for "curly bob with fringe" hairstyle* </figcaption>
</div>

Remember, we got these results simply by maximizing our classifier’s probabilities for a certain class. This shows quite visually what kind of high-level features trigger the classifier to predict a particular class.

Let’s see the same kind of visualizations for one more class, long straight hair with fringe:

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://assets-global.website-files.com/647a5cfe9ae504d687e5d999/647fbd84fb33f6c5f768c590_interpolation-wplus-2.gif" alt="alt text" width="100%"/>
    <figcaption> *Interpolation in W+ space for "long straight with fringe" hairstyle* </figcaption>
</div>

These are both classes that our hairstyle model seems to have learned correctly. With face features not changing much during the interpolation in the W+ space, we see hairstyles in our examples change exactly how they are supposed to.

But of course, sometimes models overfit or learn to detect something else but the real target features. To illustrate one of those cases, let’s look at interpolation examples for a class of “long African braids”.

<div style="text-align:center; margin-top: 20px; margin-bottom: 20px;">
    <img src="https://assets-global.website-files.com/647a5cfe9ae504d687e5d999/647fbe5d7ca5e3200ced940f_ezgif.com-optimize.gif" alt="alt text" width="100%"/>
    <figcaption> *Interpolation in W+ space for "long African braids" hairstyle* </figcaption>
</div>

Here, we see that maximizing the hairstyle model’s confidence for this hairstyle class also causes changes in skin color. This may suggest, for example, that the dataset is unbalanced for this particular class. Racial disbalance in the dataset can easily cause such behavior and should be dealt with by collecting more images with a more diverse representation.