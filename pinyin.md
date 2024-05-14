## Pinyin

It's still a pain for me after setting it up for several times.

Following mainly this: https://wiki.archlinux.org/title/Fcitx5
and here https://fcitx-im.org/wiki/Setup_Fcitx_5

I'll be using  here, just because it works

1. Enable Chinese locales, edit `/etc/locale.gen`, uncomment `zh_CN.UTF-8 UTF-8`
2. Install fcitx5 and required stuffs (fonts)
   ```bash
   yay -S ibus adobe-source-han-sans-cn-fonts fcitx5 fcitx5-chinese-addons fcitx5-configtool
   ```
3. Add these into `/etc/profile` to set environment variables
    ```bash
    export XMODIFIERS=@im=fcitx
    export QT_IM_MODULES="wayland;fcitx;ibus"
    unset QT_IM_MODULE
    ```
4. Add this to `~/.gtkrc-2.0`
   ```ini
   gtk-im-module="fcitx"
   ```
5. Add this to `~/.config/gtk-3.0/settings.ini`
   ```ini
   gtk-im-module=fcitx
   ```
6. Add this to `~/.config/gtk-4.0/settings.ini`
   ```ini
   gtk-im-module=fcitx
   ```
7. Start fcitx by selecting Fcitx 5 as the keyboard in Settings > Keyboard > Virtual Keyboard
8. Run config tool
   ```bash
   fcitx5-config-qt
   ```
9. Add pinyin into one of the Input Method (not keyboard Chinese)
10. It should work now
11. Can add custom theme e.g., https://github.com/Reverier-Xu/Fluent-fcitx5, by editing `~/.config/fcitx5/conf/classicui.conf` and add the following entry: (whatever the name of the theme in `/usr/share/fcitx5/themes/`)
   ```
   Theme=FluentDark
   ```

DONE
