/*
 * Copyright (C) 2012  Domen Vrankar  <domen gamabit com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301,
 * USA.
 */

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;

const Settings = imports.misc.extensionUtils.getCurrentExtension().imports.settings.Settings;

const extensionId = 'stopwatch';

const _ = imports.gettext.domain( extensionId ).gettext;

let settings;

function init() {
  settings = new Settings( extensionId, true );
}

function _createBoolSetting( settings, setting ) {
  let hbox = new Gtk.Box( { 'orientation': Gtk.Orientation.HORIZONTAL } );

  let settingLabel = new Gtk.Label( { 'label': setting.label, xalign: 0 } );

  let settingSwitch = new Gtk.Switch( { active: settings.get_boolean( setting.name ) } );
  settingSwitch.connect( 'notify::active', function( button ) { settings.set_boolean( setting.name, button.active ) } );

  hbox.pack_start( settingLabel, true, true, 0 );
  hbox.add( settingSwitch );

  return hbox;
}

function buildPrefsWidget() {
  let vbox  = new Gtk.Box( { orientation: Gtk.Orientation.VERTICAL, margin: 20, margin_top: 10 } );

  vbox.add( _createBoolSetting( settings.getSettings(), { name: 'display-milliseconds', label: _( 'Display milliseconds' ) } ) );
  vbox.show_all();

  return vbox
}
