use rand::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{console, js_sys::ArrayBuffer, AudioBuffer, AudioBufferOptions, AudioContext};

#[wasm_bindgen]
pub struct Sequence {
    audio_buffer: AudioBuffer,
}

#[wasm_bindgen]
impl Sequence {
    fn create(data: Vec<f32>, context: &AudioContext) -> Result<Sequence, JsValue> {
        let options = AudioBufferOptions::new(data.len() as u32, context.sample_rate());

        let buffer = AudioBuffer::new(&options)?;

        buffer.copy_to_channel(&data, 0)?;

        Ok(Sequence {
            audio_buffer: buffer,
        })
    }
    #[wasm_bindgen]
    pub fn create_white_noise(
        duration_secs: usize,
        context: &AudioContext,
    ) -> Result<Sequence, JsValue> {
        let mut data = Vec::with_capacity(duration_secs * context.sample_rate() as usize);

        let mut rng = thread_rng();
        for _ in 0..(duration_secs * context.sample_rate() as usize) {
            data.push((rng.gen::<f32>() * 2.0) - 1.0)
        }

        Self::create(data, context)
    }
    #[wasm_bindgen]
    pub fn create_wave(duration_secs: usize, context: &AudioContext) -> Result<Sequence, JsValue> {
        let mut data = Vec::with_capacity(duration_secs * context.sample_rate() as usize);
        for i in 0..(duration_secs * context.sample_rate() as usize) {
            data.push(f32::sin(i as f32 / 10.0));
        }

        Self::create(data, context)
    }
    #[wasm_bindgen]
    pub async fn create_from_sample(
        audio_data: &ArrayBuffer,
        context: &AudioContext,
    ) -> Result<Sequence, JsValue> {
        let audio_buffer = JsFuture::from(context.decode_audio_data(audio_data)?)
            .await?
            .into();

        Ok(Sequence { audio_buffer })
    }
    #[wasm_bindgen]
    pub fn play(&self, context: &AudioContext) -> Result<(), JsValue> {
        let source = context.create_buffer_source()?;

        source.set_buffer(Some(&self.audio_buffer));

        source.connect_with_audio_node(&context.destination())?;

        source.start()?;
        Ok(())
    }

    pub fn stop(&self) -> Result<(), JsValue> {
        Ok(())
    }
}
