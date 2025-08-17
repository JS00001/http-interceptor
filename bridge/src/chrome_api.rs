use reqwest::blocking::get;
use serde_json::Value;
use std::error::Error;

// Fetch /json/version from Chrome
pub fn get_chrome_version() -> Result<Value, Box<dyn Error>> {
    let resp: Value = get("http://localhost:9222/json/version")?.json()?;
    Ok(resp)
}

// Fetch /json (list of pages/tabs) from Chrome
pub fn get_chrome_tabs() -> Result<Value, Box<dyn Error>> {
    let resp: Value = get("http://localhost:9222/json")?.json()?;
    Ok(resp)
}
