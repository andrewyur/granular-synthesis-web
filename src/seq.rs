use crate::{bank::Bank, grain::Grain, sound::Sound};
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use web_sys::{AudioBuffer, AudioBufferOptions, AudioContext};

#[wasm_bindgen]
pub struct Sequence {
    // wasm does not allow lifetimes
    grain_arrs: Vec<Rc<Vec<Grain>>>,
    // bank index, grain index
    grain_inds: Vec<(usize, usize)>,
    // modification values, this can come later
}

#[wasm_bindgen]
impl Sequence {
    #[wasm_bindgen]
    pub fn create_from_all(bank: &Bank) -> Sequence {
        let grain_arr = bank.get_arr();

        let mut grain_inds = Vec::with_capacity(grain_arr.len());

        grain_inds.extend((0..(grain_arr.len())).map(|grain_ind| (0, grain_ind)));

        Sequence {
            grain_arrs: vec![grain_arr],
            grain_inds,
        }
    }
    #[wasm_bindgen]
    pub fn generate_sound(&self, context: &AudioContext) -> Result<Sound, JsValue> {
        let options = AudioBufferOptions::new(self.length(), context.sample_rate());

        let buffer = AudioBuffer::new(&options)?;

        let mut pos = 0;
        for (bank_ind, grain_ind) in self.grain_inds.iter() {
            buffer.copy_to_channel_with_start_in_channel(
                &self.grain_arrs[*bank_ind][*grain_ind].amp,
                0,
                pos,
            )?;
            pos += self.grain_arrs[*bank_ind][*grain_ind].size as u32;
        }

        Ok(Sound::new(buffer))
    }
}

impl Sequence {
    fn length(&self) -> u32 {
        let grain_size = self.grain_arrs[0][0].size;

        (grain_size * self.grain_inds.len()) as u32
    }
}
