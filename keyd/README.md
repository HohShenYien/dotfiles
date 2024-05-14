## Custom Keyboard Remapping

A custom keyboard remaps based on my AHK file from Windows, it does the following

- Remap ALT + ijkl into arrow keys (like wasd but on the right side)
- Remap ALT + h to home
- Remap ALT + ; to end
- ALT + x to backspace
- ALT + z to ENTER
- ALT will be ALT + 1 instead, because some apps act weirdly with ALT

Basically simplifying my life.

The file should be placed in `/etc/keyd/`

Note: Get the id from device id or just simply put `*` and enable the app through `systemctl enable keyd`
