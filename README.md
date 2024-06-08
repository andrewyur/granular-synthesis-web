# Granular Synthesis Web Playground

Written in rust and compiled to webassembly

## More Info & Resources

- https://en.wikipedia.org/wiki/Granular_synthesis
- https://en.wikipedia.org/wiki/Frequency_modulation_synthesis
- https://rustwasm.github.io/book/
- https://rustwasm.github.io/wasm-bindgen/examples/web-audio.html

## Process

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

## TODO

- starting platform
  - give rust crate access to audio files, ability to play back audio
  - ability to upload files through front end
  - ability to interact with sounds through front end
  - fast fourier transform for frequency analysis through sounds
- implement main functionality
