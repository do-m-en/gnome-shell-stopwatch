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

const Mainloop = imports.mainloop;
const Lang = imports.lang;
const St = imports.gi.St;
const PanelMenu = imports.ui.panelMenu;

const Stopwatch = new Lang.Class( {
  Name: 'Stopwatch',
  Extends: PanelMenu.Button,

  setDisplayMilliseconds: function( display ) {
    this._displayMilliseconds = display;
    this._stopwatchStartTimeLabel = '0:00:00';

    if( display ) {
      this._stopwatchStartTimeLabel += '.000';
    }

    if( !this._running ) {
      this._stopwatch.set_text( this._stopwatchStartTimeLabel );
    }
  },

  destruct: function() {
    // close menu and hide stopwatch
    this.menu.close();
    this.container.hide();

    this._startPauseButton.disconnect( this._startPauseButtonConnection );
    this._restartButton.disconnect( this._restartButtonConnection );
  },

  _init: function( displayMilliseconds ) {
    let menuAlignment = 0.25;
    this.parent( menuAlignment );

    this.actor.add_actor( new St.Icon( { icon_name: 'alarm-symbolic', style_class: 'system-status-icon' } ) );

    let bin = new St.Bin( { x_align: St.Align.MIDDLE, style_class: 'stopwatch-bin' } );

    this.menu.addActor( bin );

    let box = new St.BoxLayout();
    bin.set_child( box );

    this._running = false;
    this._startTime = false;
    this._elapsedTime = new Date( 0 );

    this._stopwatch = new St.Label( { style_class: 'stopwatch-label' } );
    box.add( this._stopwatch );

    this.setDisplayMilliseconds( displayMilliseconds );

    // add start/pause button
    this._startPauseButton = new St.Button( { style_class: 'stopwatch-button', reactive: true } );

    this._startIcon = new St.Icon( { icon_name: 'media-playback-start-symbolic', style_class: 'stopwatch-button-icon' } );
    this._pauseIcon = new St.Icon( { icon_name: 'media-playback-pause-symbolic', style_class: 'stopwatch-button-icon' } );

    this._startPauseButton.set_child( this._startIcon );
    this._startPauseButtonConnection = this._startPauseButton.connect( 'button-press-event', Lang.bind( this, this._startPause ) );
    box.add( this._wrapButtonIntoBin( this._startPauseButton ) );

    // add restart button
    this._restartButton = new St.Button( { style_class: 'stopwatch-button' } );

    this._restartButton.set_child( new St.Icon( { icon_name: 'view-refresh-symbolic', style_class: 'stopwatch-button-icon' } ) );
    this._restartButtonConnection = this._restartButton.connect( 'button-press-event', Lang.bind( this, this._restartStopwatch ) );
    box.add( this._wrapButtonIntoBin( this._restartButton ) );

    Mainloop.timeout_add( 1, Lang.bind( this, this._redrawStopwatch ) );

    // show stopwatch
    this.container.show();
  },

  _wrapButtonIntoBin: function( button ) {
    let buttonBin = new St.Bin( { style_class: 'stopwatch-bin' } );
    buttonBin.set_child( button );

    return buttonBin;
  },

  _startPause: function() {
    if( this._running == true ) {
      this._startPauseButton.set_child( this._startIcon );
      this._elapsedTime = new Date( new Date().getTime() - this._startTime.getTime() + this._elapsedTime.getTime() );
    } else {
      this._startPauseButton.set_child( this._pauseIcon );
      this._startTime = new Date();
    }

    this._running = !this._running;
  },

  _restartStopwatch: function() {
    this._elapsedTime = new Date( 0 );
    this._startTime = false;
    this._running = false;
    this._stopwatch.set_text( this._stopwatchStartTimeLabel );
    this._startPauseButton.set_child( this._startIcon );
  },

  _redrawStopwatch: function() {
    if( this._startTime ) {
      if( this._running == true ) {
        let renderTime = new Date( new Date().getTime() - this._startTime.getTime() + this._elapsedTime.getTime() );
        let text = String( ~~( renderTime.getTime() / 3600000 ) ) + ':' + renderTime.toLocaleFormat( '%M:%S' );

        if( this._displayMilliseconds ) {
          text += '.' + this._formatMilliseconds( renderTime.getMilliseconds() );
        }

        this._stopwatch.set_text( text );
      }
    } else {
      this._stopwatch.set_text( this._stopwatchStartTimeLabel );
    }

    return true;
  },

  _formatMilliseconds: function( num ) {
    var r = num.toString();

    while( r.length < 3 ) {
      r = '0' + r;
    }

    return r;
  }
} );
