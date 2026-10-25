// Input Manager: Keyboard, Mouse Look (Pointer Lock + Seamless Unlocked Cursor Aim), and Combat Triggers
export class InputManager {
  constructor(canvasElement, onRequestLock) {
    this.canvas = canvasElement;
    this.onRequestLock = onRequestLock;

    this.keys = {};
    this.mouseButtons = {};
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    this.isLocked = false;
    this.lastClientX = null;
    this.lastClientY = null;

    // Live cursor position for seamless aiming even when Pointer Lock is not active
    this.cursorPx = {
      x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 720,
      y: typeof window !== 'undefined' ? window.innerHeight * 0.49 : 400
    };
    this.cursorNDC = { x: 0, y: 0.02 };

    this.sensitivity = 0.0022;
    this.onToggleCamera = null;
    this.onToggleMapOverview = null;

    this._setupListeners();
  }

  _isInteractiveUI(target) {
    if (!target || !target.closest) return false;
    return Boolean(
      target.closest(
        'button, input, select, textarea, a, .cam-pill, .slot, #ability-card, #hud-minimap-container, .roster-card, .briefing-zone-pin, .briefing-loadout-card'
      )
    );
  }

  _setupListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'KeyV' && this.onToggleCamera) {
        this.onToggleCamera();
      }
      if (e.code === 'KeyM') {
        if (this.onToggleMapOverview) this.onToggleMapOverview();
        if (this.onToggleMapCamera) this.onToggleMapCamera();
      }
      if (e.code === 'KeyL' && this.onRequestLock) {
        try {
          this.onRequestLock();
        } catch (_) {}
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('mousedown', (e) => {
      // Ignore clicks on interactive HUD/menu buttons or inputs
      if (this._isInteractiveUI(e.target)) {
        return;
      }
      this.mouseButtons[e.button] = true;
      this.lastClientX = e.clientX;
      this.lastClientY = e.clientY;
      this._updateCursorCoords(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', (e) => {
      this.mouseButtons[e.button] = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === this.canvas || this.isLocked) {
        this.mouseDeltaX += e.movementX;
        this.mouseDeltaY += e.movementY;
        this.cursorPx.x = window.innerWidth * 0.5;
        this.cursorPx.y = window.innerHeight * 0.49;
        this.cursorNDC.x = 0;
        this.cursorNDC.y = 0.02;
      } else {
        this._updateCursorCoords(e.clientX, e.clientY);

        let dx = 0;
        let dy = 0;
        if (typeof e.movementX === 'number' && (Math.abs(e.movementX) > 0 || Math.abs(e.movementY) > 0)) {
          dx = e.movementX;
          dy = e.movementY;
        } else if (this.lastClientX !== null && this.lastClientY !== null) {
          dx = e.clientX - this.lastClientX;
          dy = e.clientY - this.lastClientY;
        }
        this.lastClientX = e.clientX;
        this.lastClientY = e.clientY;

        // Smooth camera turning when dragging OR moving mouse across the arena viewport
        const turnScale = (this.mouseButtons[0] || this.mouseButtons[2]) ? 0.85 : 0.42;
        this.mouseDeltaX += dx * turnScale;
        this.mouseDeltaY += dy * turnScale * 0.65;
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isLocked = (document.pointerLockElement === this.canvas);
      if (this.isLocked) {
        this.cursorPx.x = window.innerWidth * 0.5;
        this.cursorPx.y = window.innerHeight * 0.49;
        this.cursorNDC.x = 0;
        this.cursorNDC.y = 0.02;
      }
    });

    window.addEventListener('blur', () => {
      this.keys = {};
      this.mouseButtons = {};
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  _updateCursorCoords(clientX, clientY) {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    this.cursorPx.x = clientX;
    this.cursorPx.y = clientY;
    this.cursorNDC.x = (clientX / w) * 2 - 1;
    this.cursorNDC.y = -(clientY / h) * 2 + 1;
  }

  isKeyDown(code) {
    return !!this.keys[code];
  }

  isMouseDown(button) {
    return !!this.mouseButtons[button];
  }

  getAndResetMouseDelta() {
    // Also allow continuous smooth turning when unlocked and cursor is near left/right screen edges
    let edgeTurnX = 0;
    if (!this.isLocked && Math.abs(this.cursorNDC.x) > 0.72) {
      const sign = Math.sign(this.cursorNDC.x);
      const strength = (Math.abs(this.cursorNDC.x) - 0.72) / 0.28;
      edgeTurnX = sign * strength * 14.0;
    }

    const delta = {
      x: (this.mouseDeltaX + edgeTurnX) * this.sensitivity,
      y: this.mouseDeltaY * this.sensitivity
    };
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    return delta;
  }
}
