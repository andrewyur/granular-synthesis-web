use crate::grain::Grain;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{js_sys::ArrayBuffer, AudioBuffer, AudioContext};

#[wasm_bindgen]
pub struct Bank {
    grains: Rc<Vec<Grain>>,
}

#[wasm_bindgen]
impl Bank {
    #[wasm_bindgen]
    pub async fn new(
        audio_data: &ArrayBuffer,
        grain_size_ms: usize,
        context: &AudioContext,
    ) -> Result<Bank, JsValue> {
        let audio_buffer: AudioBuffer = JsFuture::from(context.decode_audio_data(audio_data)?)
            .await?
            .into();

        let grain_size = grain_size_ms * (context.sample_rate() as usize / 1000);

        let data = audio_buffer.get_channel_data(0)?;

        let mut grains = Vec::with_capacity(data.len() / grain_size);

        // the remainder of the audio is not used
        for grain_i in 0..(data.len() / grain_size) {
            let pos = grain_i * grain_size;
            grains.push(Grain::new(&data[pos..(pos + grain_size)]))
        }

        Ok(Bank {
            grains: Rc::new(grains),
        })
    }
}

// methods for internal use
impl Bank {
    pub fn get_arr(&self) -> Rc<Vec<Grain>> {
        Rc::clone(&self.grains)
    }
}
