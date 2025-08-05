// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

fn main() {
    vulnerability_toolkit_lib::run()
}

#[tauri::command]
async fn launchInterceptor() -> Result<(), String> {
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

    Ok(())
}
