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

const Main = imports.ui.main;

const CurrentExtension = imports.misc.extensionUtils.getCurrentExtension();
const Stopwatch = CurrentExtension.imports.stopwatch.Stopwatch;
const Settings = CurrentExtension.imports.settings.Settings;

const extensionId = 'stopwatch';

let stopwatch;
let settings;

function init() {}

function enable() {
  settings = new Settings( extensionId );
  stopwatch = new Stopwatch( settings.getSettings( extensionId ).get_boolean( 'display-milliseconds' ) );
  settings.addSettingsChangedEventHandler( stopwatch, 'setDisplayMilliseconds', 'display-milliseconds' );

  Main.panel._centerBox.insert_child_at_index( stopwatch.container, 1 );
  Main.panel.menuManager.addMenu( stopwatch.menu );
}

function disable() {
  Main.panel._centerBox.remove_child( stopwatch.container );
  Main.panel.menuManager.removeMenu( stopwatch.menu );

  stopwatch.destruct();
  delete stopwatch;

  settings.destruct();
  delete settings;
}
