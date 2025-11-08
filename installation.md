## Installation

Not a super geek here, gave up manual installation after trying it once (successful, but took more than 1 hour)

Installing using `archinstall`, mainly only 2 things need to do:
- Setup wifi with `iwctl`:
  ```
  iwctl station wlan0 scan
  iwctl station wlan0 get-networks
  iwctl station wlan0 connect "network name"  
  ```
- Setup disk using cfdisk:
  - 512MB for `/boot/efi` (FAT32)
  - The rest goes to `/`

Some other must do configurations:
- Update Pacman mirrors to Singapore
- In disk configuration, must wipe out the partitions created in above
