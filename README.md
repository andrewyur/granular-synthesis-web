# Granular Synthesis Web Playground

rust + wasm + react

## More Info & Resources

- https://en.wikipedia.org/wiki/Granular_synthesis
- https://en.wikipedia.org/wiki/Frequency_modulation_synthesis
- https://rustwasm.github.io/book/
- https://rustwasm.github.io/wasm-bindgen/examples/web-audio.html

## Ideas

split up a sample into grains, around 1 to 100 ms in duration

use fast fourier transform to analyse the presence of frequencies in each of the parts

allow user to convert groups of grains into a manipulatable sound

- sort grains by a parameter
- interleave sequences of grains
- use grains to model another sample
- shuffle

allow for layering, pitch/frequency/speed/phase modulation

have a bank of samples available to the user, allow user to record and import samples

give a randomizer control of these tools, allow for computer generated soundscapes

## App Structure

playback of individual samples can be controlled through sequences. sequences cannot affect other sequences. sequences can be combined.

a sequence can be created from a raw content link, an audio file, a preset sound offered by the app, or a recording

each sequence contains a bank of grains. when creating a sequence, the user will choose what grain size they would like their sample to be split into. this is irreversible.

the user can play. when the sequence is playing, it plays the contents of its store in order, once. the user can set a sequence to play on repeat.

the user can change properties of the sequence, like gain, phase, frequency of grains, speed of grains, pitch of grains

the user can manipulate the order of grains: they can combine two sequences to combine their stores. they can shuffle the store to order them randomly. they can threshold which grains are played. they can sort the grains. they can model the grains off of a sample(not sequence).

## Techical Structure

the two main structures are grains, which are small slices of an audio sample, and sequences, which contain an array of grains. these two will be defined in rust.

sequences will have the attributes:

- array of grains
- gain, phase, etc.

sequences will have the methods:

- create
- combine with another sequence
- play
- pause
- set attributes
- manipulate array

grains will have the attributes:

- amplitude array
- array of calculated frequency

grains will not have any methods

sequences will have a wrapper structure which controls the appearance, and maps user input to sequence methods. javascript will handle storing sequence structures, and wrapping them with the appearance structure.

## TODO

- sequence structure, containing a node and not grain array
- add react + sequence display structure
- sequence can be played, playing its sample
- sample is split up into grains on sequence creation
- sequence can played, playing its grain array
