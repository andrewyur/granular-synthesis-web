pub struct Grain {
    pub amp: Vec<f32>,
    pub size: usize,
    // frequency array will come later
}

impl Grain {
    pub fn new(amp_slice: &[f32]) -> Self {
        Grain {
            amp: Vec::from(amp_slice),
            size: amp_slice.len(),
        }
    }
}
