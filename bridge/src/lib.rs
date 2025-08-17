mod chrome_api;

use std::process::{Command, Stdio};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            launch_browser,
            fetch_chrome_version,
            fetch_chrome_tabs
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/**
 * Launches a chrome browser instance with remote debugging enabled
 */
#[tauri::command]
async fn launch_browser() -> Result<(), String> {
    Command::new("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        .args(&[
            "--remote-debugging-port=9222",
            // TODO: Make this not a tmp profile
            "--user-data-dir=/tmp/chrome-tauri-profile",
            "--no-first-run",
            "--no-default-browser-check",
            "--new-window",
            "--disable-logging",
            "--log-level=3",
        ])
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| format!("Failed to launch Chrome: {}", e))?;

    Ok(())
}

/**
 * Execute a HTTP request to get the websocket debugger URL, since we are blocked
 * from making this req in the browser, by browser security
 */
#[tauri::command]
fn fetch_chrome_version() -> Result<serde_json::Value, String> {
    chrome_api::get_chrome_version().map_err(|e| e.to_string())
}

/**
 * Execute a HTTP request to get the websocket debugger URL for an individual tab, since we are blocked
 * from making this req in the browser, by browser security
 */
#[tauri::command]
fn fetch_chrome_tabs() -> Result<serde_json::Value, String> {
    chrome_api::get_chrome_tabs().map_err(|e| e.to_string())
}
