use std::process::Command;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
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
            "--no-first-run",
            "--no-default-browser-check",
            "--new-window",
            "--disable-logging",
            "--log-level=3",
        ])
        .spawn()
        .map_err(|e| format!("Failed to launch Chrome: {}", e))?;


    Command::new("npm")
        .args(["run", "start-interceptor"])
        .current_dir("../")
        .spawn()
        .map_err(|e| format!("Failed to launch node interceptor: {}", e))?;

    Ok(())
}
