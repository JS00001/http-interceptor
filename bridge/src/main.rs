// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![launch_browser])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn launch_browser() -> Result<(), String> {
    // Launch Chrome in a mode that we can control
    Command::new("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        .args(&[
            "--remote-debugging-port=9222",
            "--user-data-dir=/tmp/chrome-tauri-profile",
            "--disable-web-security",
            "--no-first-run",
            "--no-default-browser-check",
            "--new-window",
        ])
        .spawn()
        .map_err(|e| format!("Failed to launch Chrome: {}", e))?;


    Command::new("node")
        .arg("main.js")
        .current_dir("../interceptor")
        .spawn()
        .map_err(|e| format!("Failed to launch node interceptor: {}", e))?;

    Ok(())
}
