mod chrome_api;

use once_cell::sync::OnceCell;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use tauri::async_runtime::spawn;
use tauri::Emitter;

static CHROME_PROCESS: OnceCell<Mutex<Child>> = OnceCell::new();

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
            close_chrome,
            is_chrome_running,
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
async fn launch_browser(app_handle: tauri::AppHandle) -> Result<(), String> {
    // Launch Chrome
    let child = Command::new("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
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

    // Wrap in Mutex and store
    CHROME_PROCESS
        .set(Mutex::new(child))
        .map_err(|_| "Chrome is already running.".to_string())?;

    // Spawn background task to detect exit
    if let Some(mutex) = CHROME_PROCESS.get() {
        let app_handle_clone = app_handle.clone();
        spawn(async move {
            let mut child = mutex.lock().unwrap();
            if let Ok(status) = child.wait() {
                println!("Chrome exited with status: {:?}", status);
                let _ = app_handle_clone.emit("chrome-exited", ());
            }
        });
    }

    Ok(())
}

/**
 * Closes the running chrome instance
 */
#[tauri::command]
async fn close_chrome() -> Result<(), String> {
    if let Some(mutex) = CHROME_PROCESS.get() {
        let mut child = mutex.lock().unwrap();
        child
            .kill()
            .map_err(|e| format!("Failed to kill Chrome: {}", e))?;
        let _ = child.wait();
        Ok(())
    } else {
        Err("Chrome is not running.".to_string())
    }
}

/**
 * Checks if we currently have a chrome process running that was spawned
 * by this app
 */
#[tauri::command]
fn is_chrome_running() -> bool {
    if let Some(mutex) = CHROME_PROCESS.get() {
        let mut child = mutex.lock().unwrap();
        match child.try_wait() {
            Ok(Some(_)) => false, // process has exited
            Ok(None) => true,     // still running
            Err(_) => false,      // error reading process
        }
    } else {
        false
    }
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
