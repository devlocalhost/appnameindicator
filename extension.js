import St from 'gi://St'
import Clutter from 'gi://Clutter'
import Meta from 'gi://Meta'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import Gio from 'gi://Gio'
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'

export default class AppNameIndicator extends Extension {
    enable() {
        this.settings = this.getSettings()
        this.label = new St.Label({
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.START
        })
        Main.panel._leftBox.insert_child_at_index(this.label, 1)
        this.signal = global.display.connect('notify::focus-window', () => this.update())
        this.settingsSignal = this.settings.connect('changed::format', () => this.update())
        this.update()
    }

    disable() {
        if (this.signal) global.display.disconnect(this.signal)
        if (this.settingsSignal) this.settings.disconnect(this.settingsSignal)
        if (this.label) Main.panel._leftBox.remove_child(this.label)
        this.label = null
        this.settings = null
    }

    update() {
        const w = global.display.focus_window
        if (!w) { this.label.visible = false; return }
        this.label.visible = true
        const fmt = this.settings.get_string('format')
        const cls = w.get_wm_class() || ''
        const title = w.get_title() || ''
        this.label.text = fmt.replace('{class}', cls).replace('{title}', title)
    }
}

