# Granular Synthesis Web Playground

rust + wasm + react

## I gave up

Managing state with javascript (i am learning typescript for my next web project) and react was starting to get pretty challenging, not to mention sharing data between separate components. The anvil that broke the already very shaky and sloppy camel's miserable back was the fact that because of the nature of javascript, sharing references to data between java and wasm components is impossible. because the nature of this project is storing large amounts of data, and the challenge was supposed to be about how to minimize data copying, this meant that the two options going forward were: abandon the challenge of the project and copy data every time it is needed, or rewrite the applicaton so that rust handles and stores everything. neither of these sounded very appealing, and i was also looking forward to learning gleam, so i have decided to move on and put the camel out of its misery.

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

samples can be converted into banks. banks cannot affect other banks. banks can be combined.
a bank can be created from a raw content link, an audio file, a preset sound offered by the app, or a live recording
when creating a bank, the user will choose what grain size they would like their sample to be split into. this is irreversible.

a sequence takes from one or more banks. sequences cannot affect other sequences. sequences can be combined.
in the sequence, the user can manipulate the order of grains: they can combine two sequences to combine their contents. they can shuffle the store to order them randomly. they can threshold which grains are played. they can sort the grains. they can model the grains off of a sound. the user can set a sequence to play on repeat.

the user can change properties of the sequence, like gain, phase, frequency of grains, speed of grains, pitch of grains.

a sound can be generated from a sequence. all sounds are independent. aspects of the sound that can be changed by running it through an audio node can be changed, but things like phase, grain order, and which grains are played cannot be changed. sounds play the contents of its parent sequence in order. sounds can also be imported directly.

all user supplied scalar values should eventually be able to be controlled by a graph, so a dynamic range of values can be used instead of just one static value

## Techical Structure

grains, which are , and sequences, which contain an array of grains. these two will be defined in rust.
the main structures are as follows:

- Grains: small slices of an audio sample
  - Fields:
    - amp_array: a vec of f32 PCM values between 1.0 and -1.0, representing amplitudes of the sample at a point in time.
    - freq_array: an array of freqencies present within the grain, calculated by fourier transform. non-essential, can be implemented later
  - Methods:
- Banks: an ordered collection of grains
  - Fields:
    - grain_array: a vec of grain structs. grain values do not move out of this vector. they are copied when a sound is generated from a sequence
  - Methods:
    - get: returns a reference to the grain at the given index
    - query methods: returns the index of a grain that is closest to the user's query
- Sequences: collections of indecies from banks
  - Fields:
    - banks_array: an array of references to banks whose grains compose the sequence
    - grain_inds: an array of tuples of indexes, the first one being the position of the grain's bank reference in the reference array, and the second being the grain's position in that bank.
  - Methods:
    - create methods: calls to bank query methods will be made here
    - modify methods: modify phase, frequency, and modification of grains individually
- Sounds: a js audiobuffer object
  - Fields:
    - audiobuffer: the js audiobuffer
    - modification values: the values to which audiobuffer
  - Methods:
    - play/pause: creates a source node, and then chains the node through modification nodes if necessary
    - modify: sets modification values

all structures (except for grains)will have a wrapper structure which controls the appearance, and maps user input to methods. javascript will handle storing the structures, and wrapping them with the appearance structure.

## TODO

- add react + sequence display structure
- user is able to create a bank, modify bank creation parameters
- user is able to create a sequence, modify sequence creation parameters
- user is able to create a sound, modify sound creation parameters
- user is able to play a sound, modify sound parameters
- user is able to control parameters with graphs
- user is able to create multiple structs, play multiple sounds
- user can arrange sounds on a board, which dictates when they play

I am so done with react after this, this sucks
