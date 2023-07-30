## Pinyin

It's still a pain for me after setting it up for several times.

I'll be using Ibus here, just because it works

1. Enable Chinese locales, edit `/etc/locale.gen`, uncomment `zh_CN.UTF-8 UTF-8`
2. Install ibus and required stuffs (fonts)
   ```bash
   yay -S ibus adobe-source-han-sans-cn-fonts ibus-sunpinyin
   ```
3. Add these into `/etc/profile` to set environment variables
    ```bash
    export GTK_IM_MODULE=ibus
    export QT_IM_MODULE=ibus
    export XMODIFIERS=@im=ibus
    ```
4. Add `/usr/bin/ibus-daemon` to startup application so that the daemon starts
5. Probably restart (Logout kinda didn't work)
6. Run `ibus-setup` and add Chinese to input methods
7. Finger crossed, it should work
