use wasm_bindgen::prelude::*;
use web_sys::{AudioBuffer, AudioContext};

#[wasm_bindgen]
pub struct Sound {
    audio_buffer: AudioBuffer, // modification values, this can come later
}

#[wasm_bindgen]
impl Sound {
    #[wasm_bindgen]
    pub fn play(&self, context: &AudioContext) -> Result<(), JsValue> {
        let source = context.create_buffer_source()?;

        source.set_buffer(Some(&self.audio_buffer));

        source.connect_with_audio_node(&context.destination())?;

        source.start()?;
        Ok(())
    }
}

impl Sound {
    pub fn new(buffer: AudioBuffer) -> Self {
        Sound {
            audio_buffer: buffer,
        }
    }
}
