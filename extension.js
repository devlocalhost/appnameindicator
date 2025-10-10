import St from 'gi://St'
import Clutter from 'gi://Clutter'
import Meta from 'gi://Meta'
import Gio from 'gi://Gio'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import Shell from 'gi://Shell'
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'

export default class AppNameIndicator extends Extension {
    enable() {
        this.settings = this.getSettings()
        this.box = new St.BoxLayout({
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.START,
            style_class: 'panel-button'
        })
        this.icon = new St.Icon({ style_class: 'system-status-icon' })
        this.label = new St.Label()
        this.box.add_child(this.icon)
        this.box.add_child(this.label)
        Main.panel._leftBox.insert_child_at_index(this.box, 1)

        this.winSignal = global.display.connect('notify::focus-window', () => this.update())
        this.settSignal = this.settings.connect('changed::format', () => this.update())
        this.update()
    }

    disable() {
        if (this.winSignal) global.display.disconnect(this.winSignal)
        if (this.settSignal) this.settings.disconnect(this.settSignal)
        if (this.box) Main.panel._leftBox.remove_child(this.box)
        this.box = this.icon = this.label = null
        this.settings = null
    }

    update() {
        const w = global.display.focus_window
        if (!w) { this.box.visible = false; return }
        this.box.visible = true

        // Resolve app info
        const app = Shell.WindowTracker.get_default().get_window_app(w)
        let name = '', gicon = null
        if (app) {
            const id = app.get_id()
            const info = Gio.DesktopAppInfo.new(id)
            if (info) {
                name = info.get_display_name() || info.get_name() || ''
                gicon = info.get_icon()
            } else {
                name = app.get_name() || ''
                gicon = app.get_app_info()?.get_icon?.() || null
            }
        } else {
            name = w.get_wm_class() || ''
        }

        // Fallbacks
        if (!name) name = w.get_title() || ''

        const fmt = this.settings.get_string('format')
        const cls = w.get_wm_class() || ''
        const title = w.get_title() || ''
        this.label.text = fmt
            .replace('{class}', cls)
            .replace('{title}', title)
            .replace('{name}', name)

        this.icon.visible = !!gicon
        if (gicon) this.icon.gicon = gicon
    }
}

