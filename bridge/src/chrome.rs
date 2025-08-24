use dirs;
use reqwest::blocking::get;
use serde_json::Value;
use std::error::Error;
use std::path::{Path, PathBuf};
use std::process::Command;

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

/**
 * Based on the OS, returns the common path for the chrome executable
 */
pub fn get_chrome_path() -> Option<String> {
    if cfg!(target_os = "macos") {
        let paths = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            &format!(
                "{}/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                std::env::var("HOME").unwrap_or_default()
            ),
        ];

        paths
            .iter()
            .find(|path| Path::new(path).exists())
            .map(|s| s.to_string())
    } else if cfg!(target_os = "windows") {
        let paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        ];
        paths
            .iter()
            .find(|p| Path::new(p).exists())
            .map(|s| s.to_string())
    } else if cfg!(target_os = "linux") {
        let output = Command::new("which").arg("google-chrome").output().ok()?;
        if output.status.success() {
            Some(String::from_utf8_lossy(&output.stdout).trim().to_string())
        } else {
            None
        }
    } else {
        None
    }
}

/**
 * Get the path we want to store the users chrome profile under
 */
pub fn get_chrome_profile_path() -> PathBuf {
    let profile_name = "http_interceptor";

    if cfg!(target_os = "windows") {
        let mut path =
            dirs::data_local_dir().unwrap_or_else(|| PathBuf::from("C:\\HttpInterceptor"));
        path.push(profile_name);
        path
    } else if cfg!(target_os = "macos") {
        let mut path = dirs::home_dir().unwrap_or_else(|| PathBuf::from("/tmp"));
        path.push("Library");
        path.push("Application Support");
        path.push(profile_name);
        path
    } else {
        let mut path = dirs::home_dir().unwrap_or_else(|| PathBuf::from("/tmp"));
        path.push(format!(".{}", profile_name));
        path
    }
}
