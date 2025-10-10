import Adw from 'gi://Adw'
import Gtk from 'gi://Gtk'
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js'

export default class AppNamePrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings()
        const page = new Adw.PreferencesPage()
        const group = new Adw.PreferencesGroup({ title: 'Format' })

        const row = new Adw.EntryRow({
            title: 'Display format',
            text: settings.get_string('format'),
        })
        row.connect('changed', () => settings.set_string('format', row.text))
        group.add(row)
        page.add(group)
        window.add(page)
    }
}

