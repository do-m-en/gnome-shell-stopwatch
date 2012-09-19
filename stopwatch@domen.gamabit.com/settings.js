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

const Lang = imports.lang;
const Gettext = imports.gettext;
const Gio = imports.gi.Gio;
const Config = imports.misc.config;

const CurrentExtension = imports.misc.extensionUtils.getCurrentExtension();
const ExtensionDir = CurrentExtension.dir;

const Settings = new Lang.Class( {
  Name: 'Settings',

  getSettings: function( extensionId ) {
    return this._settings;
  },

  addSettingsChangedEventHandler: function( handlerClass, handlerFunction, variable ) {
    this._handlers.push( { 'handlerClass': handlerClass, 'handlerFunction': handlerFunction, 'variable': variable } );
  },

  destruct: function() {
    this._settings.disconnect( this._settingsConnection );
  },

  _init: function( extensionId, initializeTranslations ) {
    this._schemaDir = ExtensionDir.get_child( 'schemas' ).get_path();

    let schemaSource = Gio.SettingsSchemaSource.new_from_directory( this._schemaDir, Gio.SettingsSchemaSource.get_default(), false );
    let schema = schemaSource.lookup( 'org.gnome.shell.extensions.' + extensionId, false );

    this._settings = new Gio.Settings( { settings_schema: schema } );
    this._settingsConnection = this._settings.connect( 'changed', Lang.bind( this, this._dispatchSettingsChangedEvent ) );
    this._handlers = new Array();

    if( initializeTranslations ) {
      this._initTranslations( extensionId );
    }
  },

  _initTranslations: function( domain ) {
    let localeDir = CurrentExtension.dir.get_child( 'locale' );

    Gettext.bindtextdomain( domain, ( localeDir.query_exists( null ) ? localeDir.get_path() : Config.LOCALEDIR ) );
  },

  _dispatchSettingsChangedEvent: function() {
    for( let i=0; i<this._handlers.length; ++i ) {
      let h = this._handlers[ i ];

      h.handlerClass[ h.handlerFunction ]( this._settings.get_boolean( h.variable ) );
    }
  }
} );
