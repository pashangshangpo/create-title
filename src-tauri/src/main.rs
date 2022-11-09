#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{ Menu, Submenu, MenuItem };

fn main() {
  let submenu_app = Submenu::new(
    "menu",
    Menu::new()
      .add_native_item(MenuItem::Undo)
      .add_native_item(MenuItem::Redo)
      .add_native_item(MenuItem::Cut)
      .add_native_item(MenuItem::Copy)
      .add_native_item(MenuItem::Paste)
      .add_native_item(MenuItem::SelectAll)
  );

  let menus = Menu::new()
    .add_submenu(submenu_app);

  tauri::Builder::default()
    .menu(menus)
    .run(tauri::generate_context!())
    .expect("error while running app application");
}
