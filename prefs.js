import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js'
import Adw from 'gi://Adw'
import Gio from 'gi://Gio'
import Gtk from 'gi://Gtk'

export default class AppNamePrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings()

        const page = new Adw.PreferencesPage()
        const group = new Adw.PreferencesGroup({
            title: 'Window Label Format',
            description: 'Customize how the active app is displayed on the panel.',
        })
        page.add(group)

        const formatRow = new Adw.ActionRow({ title: 'Format string' })
        const entry = new Gtk.Entry({
            text: settings.get_string('format'),
            placeholder_text: '{name} - {title}',
            hexpand: true,
            valign: Gtk.Align.CENTER,
            halign: Gtk.Align.END,
        })
        
        entry.connect('changed', () =>
            settings.set_string('format', entry.get_text())
        )
        
        formatRow.add_suffix(entry)
        formatRow.activatable_widget = entry

        const infoRow = new Adw.ActionRow({
            title: 'Placeholders',
            subtitle:
                '{name}: App name (Extensions)\n' +
                '{class}: Application class (org.gnome.Shell.Extensions)\n' +
                '{title}: Window title (App Name Indicator)',
            activatable: false,
        })
        
        group.add(formatRow)
        group.add(infoRow)

        const iconRow = new Adw.ActionRow({ title: 'Show icon' })
        const iconSwitch = new Gtk.Switch({
            active: settings.get_boolean('show-icon'),
            valign: Gtk.Align.CENTER,
        })
        settings.bind('show-icon', iconSwitch, 'active', Gio.SettingsBindFlags.DEFAULT)
        iconRow.add_suffix(iconSwitch)
        iconRow.activatable_widget = iconSwitch
        group.add(iconRow)

        const textRow = new Adw.ActionRow({ title: 'Show text' })
        const textSwitch = new Gtk.Switch({
            active: settings.get_boolean('show-text'),
            valign: Gtk.Align.CENTER,
        })
        settings.bind('show-text', textSwitch, 'active', Gio.SettingsBindFlags.DEFAULT)
        textRow.add_suffix(textSwitch)
        textRow.activatable_widget = textSwitch
        group.add(textRow)

        window.add(page)
    }
}

