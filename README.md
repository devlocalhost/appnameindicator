# App Name Indicator
A GNOME Shell extension that shows the active app's name and icon on the left side of the top panel, like it used to, before version 49.0.   
![Image preview](preview.png)

# Note
1. This extension does NOT restore the old, App Menu behavior. This extension simply adds the app's name and/or label, nothing else.
2. I am not a JavaScript, or GNOME Shell Extensions developer. I made this with chatGPT, since GNOME removed it on later versions. I will try my best to keep it up to date and fix issues, but don't expect much.

# Installation
- Get it from the GNOME Extensions website: [extensions.gnome.org](https://extensions.gnome.org/extension/8667/app-name-indicator/) (pending review, link will be up soon).
- Or install it manually:
    1. Change current working directory to ~/.local/share/gnome-shell/extensions/: `cd ~/.local/share/gnome-shell/extensions/`
    2. Clone the repo: `git clone https://github.com/devlocalhost/appnameindicator-extension`
    3. Activate the extension using Extensions app, or gnome-extensions command: `gnome-extensions enable appnameindicator@dev64.xyz`. A log-out might be required.
