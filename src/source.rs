use wasm_bindgen::prelude::*;
use web_sys::js_sys::ArrayBuffer;

use crate::bank::Bank;

// really only functions as an arraybuffer holder

#[wasm_bindgen]
pub struct Source {
    buf: ArrayBuffer,
}

#[wasm_bindgen]
impl Source {
    #[wasm_bindgen(constructor)]
    pub fn new(buf: ArrayBuffer) -> Source {
        Source { buf }
    }
}

impl Source {
    pub fn lease(&self) -> &ArrayBuffer {
        &self.buf
    }
}
