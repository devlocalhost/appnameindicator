import St from 'gi://St'
import Clutter from 'gi://Clutter'
import GioUnix from 'gi://GioUnix'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import Shell from 'gi://Shell'
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'

export default class AppNameIndicator extends Extension {
    enable() {
        this.settings = this.getSettings()
        this.lastWindow = null
        this.titleSignal = 0

        this.box = new St.BoxLayout({
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.START,
            style_class: 'panel-button',
        })

        this.icon = new St.Icon({ style_class: 'system-status-icon' })
        this.label = new St.Label()

        this.box.add_child(this.icon)
        this.box.add_child(this.label)

        Main.panel._leftBox.insert_child_at_index(this.box, 1)

        this.focusSignal = global.display.connect('notify::focus-window', () => this.update())
        this.settingsSignal = this.settings.connect('changed', () => this.update())

        this.update()
    }

    disable() {
        if (this.focusSignal) {
            global.display.disconnect(this.focusSignal)
            this.focusSignal = 0
        }

        if (this.settingsSignal) {
            this.settings.disconnect(this.settingsSignal)
            this.settingsSignal = 0
        }

        this.disconnectWindowSignal()

        if (this.box)
            Main.panel._leftBox.remove_child(this.box)

        this.lastWindow = null
        this.box = null
        this.icon = null
        this.label = null
        this.settings = null
    }

    disconnectWindowSignal() {
        if (this.lastWindow && this.titleSignal) {
            this.lastWindow.disconnect(this.titleSignal)
            this.titleSignal = 0
        }

        this.lastWindow = null
    }

    getWindowData(w) {
        const app = Shell.WindowTracker.get_default().get_window_app(w)
        let name = ''
        let gicon = null

        if (app) {
            const id = app.get_id()
            const info = id ? GioUnix.DesktopAppInfo.new(id) : null

            if (info) {
                name = info.get_display_name() || info.get_name() || ''
                gicon = info.get_icon()
            } else {
                name = app.get_name() || ''
                gicon = app.get_app_info()?.get_icon?.() || null
            }
        }

        if (!name)
            name = w.get_wm_class() || w.get_title() || ''

        return { name, gicon }
    }

    update() {
        const w = global.display.focus_window

        if (!w) {
            this.box.visible = false
            this.disconnectWindowSignal()
            return
        }

        this.box.visible = true

        if (this.lastWindow !== w) {
            this.disconnectWindowSignal()
            this.lastWindow = w
            this.titleSignal = w.connect('notify::title', () => this.update())
        }

        const { name, gicon } = this.getWindowData(w)
        const fmt = this.settings.get_string('format')
        const cls = w.get_wm_class() || ''
        const title = w.get_title() || ''
        const showIcon = this.settings.get_boolean('show-icon')
        const showText = this.settings.get_boolean('show-text')

        this.icon.visible = showIcon && !!gicon
        if (showIcon && gicon)
            this.icon.gicon = gicon

        if (showText) {
            this.label.text = fmt
                .replace('{class}', cls)
                .replace('{title}', title)
                .replace('{name}', name)
        } else {
            this.label.text = ''
        }

        this.box.visible = showIcon || showText
    }
}
