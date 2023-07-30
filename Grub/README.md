## Grub Configs

This folder consists of a custom theme, night, that I mixed and matched from Tela and some other Grub Themes to make it **mine**

![image](https://github.com/HohShenYien/dotfiles/assets/55322546/caa6c014-b08d-4f28-a934-8eda114f8d37)

- Also included the `/etc/default/grub` default configuration file
- The default configuration has enabled os-prober because I am dual-booting
- The other two files are to get the icons working for uefi & additional submenus

Run the following line after moving the night theme to `/boot/grub/themes`

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

Reference: https://github.com/VandalByte/grub-tweaks
