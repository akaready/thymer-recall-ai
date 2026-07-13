"use strict";
var plugins = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // plugin.js
  var plugin_exports = {};
  __export(plugin_exports, {
    Plugin: () => Plugin
  });

  // ../../shared/settings-ui/tokens.css
  var tokens_default = `/*
 * Thymer Plugin Settings UI \u2014 Design Tokens
 *
 * Canonical CSS custom properties for the plugin settings panel system.
 * Plugins consume this verbatim; component CSS reads from these vars.
 *
 * See shared/settings-ui/DESIGN.md for rationale.
 *
 * Thymer var names verified against library/css-tokens/ (ripped from shipped CSS).
 * Fallbacks use color-mix(currentColor) so panels work when a token is absent.
 *
 * SCOPE IS DOUBLED ON PURPOSE (.tps-panel.tps-panel, specificity 0,2,0).
 * Every plugin bundles its own copy of this file and injects it into the same
 * document, all declaring the same global .tps-panel class. At equal specificity
 * the last stylesheet injected wins for EVERY panel in the app, so one plugin
 * running an outdated bundle silently redefines these tokens for all the others.
 * That shipped: pre-1f753f6 builds set --tps-accent from --accent-color, a var
 * Thymer never defines, which collapsed the accent to currentColor (white text)
 * across every installed plugin's panel. Doubling the class lets a current copy
 * outrank any stale plain-.tps-panel copy regardless of injection order.
 * Do not "simplify" this back to a single class.
 */

.tps-panel.tps-panel {
  /* \u2500\u2500 Color: text \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --tps-text:           var(--text-default,   currentColor);
  --tps-text-muted:     var(--text-muted,     color-mix(in srgb, currentColor 62%, transparent));
  --tps-text-faint:     var(--text-subtle,    color-mix(in srgb, currentColor 48%, transparent));
  --tps-text-whisper:   var(--text-disabled,  color-mix(in srgb, currentColor 34%, transparent));

  /* \u2500\u2500 Color: surfaces \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --tps-bg-input:       var(--input-bg-color,
                        color-mix(in srgb, currentColor 6%, transparent));
  --tps-bg-hover:       var(--hover-subtle,
                        var(--sidebar-bg-hover,
                        color-mix(in srgb, currentColor 8%, transparent)));
  --tps-bg-active:      var(--active-bg-color,
                        color-mix(in srgb, currentColor 12%, transparent));

  /* \u2500\u2500 Color: borders / dividers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --tps-divider:        var(--divider-color,
                        var(--thin-divider-color,
                        color-mix(in srgb, currentColor 14%, transparent)));
  --tps-border:         var(--input-border-color,
                        var(--divider-color,
                        color-mix(in srgb, currentColor 22%, transparent)));
  --tps-border-strong:  var(--titlebar-border-color,
                        var(--selection-border,
                        color-mix(in srgb, currentColor 32%, transparent)));

  /* \u2500\u2500 Color: accent (Thymer uses --logo-color) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  /* Fallback is a real color, never currentColor: an accent that degrades into
     the text color fails invisibly. Deliberately the brand mark, not the theme's
     --color-primary-500 \u2014 that one is a muted slate on themes like
     basalt-bedrock, which would make checked rows harder to read, not easier. */
  --tps-accent:         var(--logo-color, #04d1ab);
  --tps-accent-soft:    color-mix(in srgb, var(--tps-accent) 15%, transparent);
  --tps-accent-strong:  color-mix(in srgb, var(--tps-accent) 80%, var(--tps-text));

  /* \u2500\u2500 Color: semantic \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --tps-danger:         var(--enum-red-fg, #ef4444);
  --tps-danger-soft:    color-mix(in srgb, var(--tps-danger) 15%, transparent);
  --tps-warning:        var(--text-warning,
                        var(--enum-yellow-fg, #f59e0b));
  --tps-success:        var(--enum-green-fg, #10b981);
  --tps-success-soft:   color-mix(in srgb, var(--tps-success) 12%, transparent);

  --tps-on-accent:      var(--text-on-accent, light-dark(#111111, #fafafa));

  /* Panel chrome */
  --tps-panel-bg:       var(--panel-bg-color, transparent);
  --tps-swatch-inset:   color-mix(in srgb, var(--tps-text) 8%, transparent);

  /* \u2500\u2500 Typography \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  /* Font is INHERITED from Thymer's panel chrome (see components.css). */

  --tps-fs-title:       18px;
  --tps-fs-lede:        13px;
  --tps-fs-section:     11px;
  --tps-fs-hint:        12px;
  --tps-fs-label:       13px;
  --tps-fs-desc:        12px;
  --tps-fs-body:        13px;
  --tps-fs-value:       12px;
  --tps-fs-button:      12px;
  --tps-fs-list-header: 10px;

  --tps-lh-tight:       1;
  --tps-lh-snug:        1.2;
  --tps-lh-base:        1.4;
  --tps-lh-loose:       1.5;

  --tps-fw-regular:     400;
  --tps-fw-medium:      500;
  --tps-fw-semibold:    600;
  --tps-fw-bold:        700;

  --tps-ls-section:     0.06em;
  --tps-ls-list:        0.08em;
  --tps-ls-title:       0;

  /* \u2500\u2500 Spacing (8px scale) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --tps-space-1:        4px;
  --tps-space-2:        8px;
  --tps-space-3:        12px;
  --tps-space-4:        16px;
  --tps-space-5:        24px;
  --tps-space-6:        32px;
  --tps-space-7:        48px;

  /* \u2500\u2500 Radii \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --tps-radius-sm:      4px;
  --tps-radius-md:      6px;
  --tps-radius-lg:      8px;
  --tps-radius-pill:    999px;
  --tps-radius-circle:  50%;

  /* \u2500\u2500 Motion \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --tps-ease-out:       cubic-bezier(0.2, 0.6, 0.2, 1);
  --tps-ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1);
  --tps-dur-fast:       80ms;
  --tps-dur-base:       160ms;

  --tps-shadow-thumb:   0 1px 3px color-mix(in srgb, var(--tps-text) 28%, transparent);

  /* \u2500\u2500 Component dimensions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  --tps-control-h-sm:   28px;
  --tps-control-h-md:   32px;
  --tps-input-w:        64px;
  --tps-num-step-w:     28px;
  --tps-swatch-size:    22px;
  --tps-thumb-size:     16px;
  --tps-track-h:        6px;

  --tps-slider-track:   color-mix(in srgb, var(--tps-text) 22%, transparent);
  --tps-slider-thumb-border: color-mix(in srgb, var(--tps-text) 28%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .tps-panel.tps-panel {
    --tps-dur-fast:     1ms;
    --tps-dur-base:     1ms;
  }
}
`;

  // ../../shared/settings-ui/components.css
  var components_default = `/*
 * Thymer Plugin Panel \u2014 Component Primitives
 *
 * All primitives scope under .tps-panel. Plugin-specific styles live elsewhere.
 * Reads tokens from tokens.css.
 */

/* \u2500\u2500 Panel root \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

/* Inherit Thymer's font + sizing \u2014 DO NOT override. plugin-collection-icons
   demonstrates the right approach: simply \`font-family: inherit\`. Forcing a
   custom var fights both Thymer's body font AND the .ti icon font. */
.tps-panel {
  font-family: inherit;
  font-size: var(--tps-fs-body);
  line-height: var(--tps-lh-base);
  color: var(--tps-text);
  padding: 0 var(--tps-space-5) var(--tps-space-7);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}

.tps-panel *,
.tps-panel *::before,
.tps-panel *::after {
  box-sizing: border-box;
}

/* Mono opt-ins are explicit per-element, never via a panel-wide override. */
.tps-panel .tps-num-input,
.tps-panel .tps-slider-value,
.tps-panel .tps-mono,
.tps-panel .tps-mono * {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New", monospace;
}

/* \u2500\u2500 Title block \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.tps-title {
  font-size: var(--tps-fs-title);
  line-height: var(--tps-lh-snug);
  font-weight: var(--tps-fw-semibold);
  letter-spacing: var(--tps-ls-title);
  color: var(--tps-text);
  margin: 0 0 var(--tps-space-1);
}

.tps-lede {
  font-size: var(--tps-fs-lede);
  line-height: var(--tps-lh-loose);
  color: var(--tps-text-muted);
  margin: 0 0 var(--tps-space-3);
}

/* \u2500\u2500 Canonical plugin header \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.tps-plugin-header {
  position: relative;
  margin: var(--tps-space-5) 0 var(--tps-space-5);
  padding: 18px var(--tps-space-4);
  overflow: hidden;
  background:
    linear-gradient(to right,
      #f26548  8%, #f26548 28%,
      #fbac56 28%, #fbac56 48%,
      #fff460 48%, #fff460 68%,
      #f067a6 68%, #f067a6 88%,
      #03bdf2 88%
    ) top left / 100% 1px no-repeat,
    linear-gradient(to right,
      #f26548  0%, #f26548 12%,
      #fbac56 12%, #fbac56 32%,
      #fff460 32%, #fff460 52%,
      #f067a6 52%, #f067a6 72%,
      #03bdf2 72%, #03bdf2 92%
    ) bottom left / 100% 1px no-repeat,
    var(--tps-panel-bg, var(--panel-bg-color, var(--plg-ci-theme-bg, transparent)));
  border-left: 1px solid #f26548;
  border-right: 1px solid #03bdf2;
}

.tps-plugin-header-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--tps-space-2, 8px);
  margin: 0 0 var(--tps-space-3, 12px);
  background: var(--tps-bg-hover);
  border-radius: var(--tps-radius-md, 6px);
}

.tps-plugin-header-logo-icon {
  flex: 0 0 auto;
  font-size: 34px;
  line-height: 1;
  color: var(--tps-text, currentColor);
}

.tps-plugin-header-title {
  font-size: 22px;
  line-height: var(--tps-lh-snug, 1.2);
  font-weight: var(--tps-fw-semibold, 600);
  letter-spacing: 0;
  color: var(--tps-text, var(--text-default, currentColor));
  margin: 0 0 var(--tps-space-3, 12px);
}

.tps-panel .tps-plugin-header-version {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  font-size: 11px;
  line-height: inherit;
  font-weight: var(--tps-fw-medium, 500);
  letter-spacing: 0;
  color: var(--tps-text-faint) !important;
  white-space: nowrap;
}

.tps-plugin-header-lede {
  font-size: 14px;
  line-height: var(--tps-lh-base, 1.4);
  color: var(--tps-text-muted);
  margin: 0 0 var(--tps-space-3, 12px);
}

.tps-plugin-header-helper-wrap {
  margin: 0 0 var(--tps-space-3, 12px);
}

.tps-plugin-header-helper-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  color: inherit;
  opacity: 0.28;
  font: inherit;
  font-size: var(--tps-fs-section, 11px);
  font-weight: var(--tps-fw-semibold, 600);
  line-height: var(--tps-lh-tight, 1);
  letter-spacing: var(--tps-ls-section, 0.06em);
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease-out);
}

.tps-plugin-header-helper-toggle:hover {
  opacity: 0.72;
}

.tps-plugin-header-helper-toggle:focus-visible {
  outline: 1px solid color-mix(in srgb, var(--tps-accent, currentColor) 45%, transparent);
  outline-offset: 2px;
}

.tps-plugin-header-helper-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 13px;
  height: 13px;
  font-size: 13px;
  line-height: 1;
  color: inherit;
}

.tps-plugin-header-helper-wrap[data-open="true"] .tps-plugin-header-helper-toggle {
  opacity: 0.72;
}

.tps-plugin-header-helper-wrap[data-open="true"] .tps-plugin-header-helper-toggle:hover {
  opacity: 1;
}

.tps-plugin-header-helper-body {
  display: none;
  margin: 8px 0 0;
  padding-left: 18px;
}

.tps-plugin-header-helper-wrap[data-open="true"] .tps-plugin-header-helper-body {
  display: block;
  cursor: pointer;
}

.tps-plugin-header-helper-line {
  margin: 0;
  font-size: var(--tps-fs-hint, 12px);
  line-height: var(--tps-lh-base, 1.4);
  color: inherit;
  opacity: 0.72;
  transition: opacity var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease-out);
}

.tps-plugin-header-helper-wrap[data-open="true"] .tps-plugin-header-helper-body:hover .tps-plugin-header-helper-line {
  opacity: 1;
}

/* Scoped .tps-panel on purpose: every plugin injects its own copy of this
   file, and older copies baseline-align this row (plus translateY icon
   shims). Higher specificity here makes the newest layout win the cascade
   war regardless of plugin load order. */
.tps-panel .tps-plugin-header-attr {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  width: 100%;
  font-size: 11.5px;
  line-height: var(--tps-lh-base, 1.4);
  color: var(--tps-text-muted);
  margin: var(--tps-space-3, 12px) 0 0;
  padding-top: var(--tps-space-3, 12px);
  border-top: 0;
}

.tps-plugin-header-attr::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: clamp(40%, 50%, 55%);
  height: 1px;
  background: var(--tps-bg-hover);
}

.tps-plugin-header-link-group + .tps-plugin-header-link-group {
  margin-left: var(--tps-space-3, 12px);
  padding-left: var(--tps-space-3, 12px);
  border-left: 1px solid var(--tps-bg-hover);
}

.tps-panel .tps-plugin-header-icon,
.tps-panel .tps-plugin-header-attr .ti {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  font-size: 12px;
  line-height: 1;
  color: var(--tps-text-muted);
  margin-right: var(--tps-space-1, 4px);
}

.tps-plugin-header-iconify {
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.tps-plugin-header-iconify-github {
  --tps-iconify-github: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/%3E%3C/svg%3E");
  -webkit-mask-image: var(--tps-iconify-github);
  mask-image: var(--tps-iconify-github);
}

.tps-plugin-header-link {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, currentColor 42%, transparent);
  transition: color var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease-out),
              text-decoration-color var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease-out),
              filter var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease-out);
}

.tps-plugin-header-link--blue,
.tps-plugin-header-link--blue:hover {
  color: #03bdf2;
  text-decoration-color: #03bdf2;
}

.tps-plugin-header-link--pink,
.tps-plugin-header-link--pink:hover {
  color: #f067a6;
  text-decoration-color: #f067a6;
}

.tps-plugin-header-link--muted,
.tps-plugin-header-link--muted:hover {
  color: var(--tps-text-faint) !important;
  text-decoration-color: color-mix(in srgb, currentColor 42%, transparent);
}

.tps-plugin-header-link:hover {
  text-decoration: none;
  text-decoration-color: transparent;
  filter: brightness(1.2);
}

/* \u2500\u2500 Header controls: scope pill + bug report + kill switch \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

/* Settings-scope cluster. Resting: one dim "All devices" pill. Diverged:
   pill lights amber (full-perimeter border + tint \u2014 never a single-edge
   accent) and the \u2191 push / \u21BA discard icon buttons appear beside it. Amber
   rides Thymer's orange enum tokens so it tracks the theme. */
.tps-scope {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tps-scope-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  padding: 0 8px;
  border: 1px solid var(--tps-border, rgba(127, 127, 127, 0.16));
  border-radius: 999px;
  font-size: 10.5px;
  line-height: 1;
  white-space: nowrap;
  color: var(--tps-text-muted);
  background: transparent;
  user-select: none;
}

.tps-scope-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--tps-text-muted);
  opacity: 0.55;
}

.tps-scope-pill[data-diverged="true"] {
  color: var(--enum-orange-fg, #d98324);
  border-color: var(--enum-orange-border, rgba(217, 131, 36, 0.45));
  background: var(--enum-orange-bg, rgba(217, 131, 36, 0.12));
}

.tps-scope-pill[data-diverged="true"] .tps-scope-dot {
  background: var(--enum-orange-fg, #d98324);
  opacity: 1;
}

.tps-scope-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid var(--tps-border, rgba(127, 127, 127, 0.16));
  border-radius: var(--tps-radius-sm, 4px);
  background: transparent;
  color: var(--tps-text-muted);
  cursor: pointer;
  transition: color var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease-out),
              background-color var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease-out),
              border-color var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease-out);
}

/* Inline-SVG icons: a viewBox-centered vector in a block box has no font
   metrics \u2014 no baseline, no ascent/descent ink drift. The 14px vector in the
   22px button gives an exact 4px inset on every side. */
.tps-panel .tps-scope-svg {
  display: flex;
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
}

.tps-panel .tps-scope-svg svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Optical correction for the (still webfont) bug glyph: near-zero descent
   rides the ink ~1px high of any line-box centering. */
.tps-panel .tps-plugin-header-bug .ti::before {
  display: inline-block;
  transform: translateY(1px);
}

.tps-scope-btn:hover {
  color: var(--tps-text);
  background: var(--tps-bg-hover);
  border-color: var(--tps-border);
}

.tps-scope-btn:focus-visible {
  outline: 2px solid var(--tps-accent);
  outline-offset: 2px;
}

.tps-scope-btn--push:hover {
  color: var(--enum-green-fg, #3fa653);
  border-color: var(--enum-green-border, rgba(63, 166, 83, 0.45));
  background: var(--enum-green-bg, rgba(63, 166, 83, 0.12));
}

/* Armed state must beat the generic :hover recolor (same specificity, order-
   dependent) \u2014 scope it up so the icon reddens with the box, hovered or not. */
.tps-panel .tps-scope-btn--discard[data-armed="true"],
.tps-panel .tps-scope-btn--discard[data-armed="true"]:hover {
  color: var(--enum-red-fg, #d64545);
  border-color: var(--enum-red-border, rgba(214, 69, 69, 0.5));
  background: var(--enum-red-bg, rgba(214, 69, 69, 0.12));
}

.tps-scope-btn[disabled] {
  opacity: 0.5;
  cursor: default;
}

/* \u2500\u2500 Header controls: bug report + kill switch \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

/* Last flex item of the attr row; margin-left:auto pins the group to the
   right edge, align-self:center opts out of the row's baseline alignment. */
.tps-plugin-header-controls {
  display: inline-flex;
  align-items: center;
  gap: var(--tps-space-2, 8px);
  margin-left: auto;
  padding-left: var(--tps-space-3, 12px);
}

/* In-row placement (right of the version link). */
.tps-panel .tps-plugin-header-attr > .tps-plugin-header-bug {
  margin-left: var(--tps-space-2, 8px);
}

.tps-plugin-header-bug {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--tps-radius-sm, 4px);
  background: transparent;
  color: var(--tps-text-muted);
  cursor: pointer;
  transition: color var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease-out),
              background-color var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease-out),
              border-color var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease-out);
}

/* Undo the attr row's generic .ti treatment (translateY + margin) inside the button. */
.tps-panel .tps-plugin-header-bug .ti {
  width: 14px;
  height: 14px;
  font-size: 14px;
  transform: none;
  margin: 0;
}

.tps-plugin-header-bug:hover {
  color: var(--tps-text);
  background: var(--tps-bg-hover);
  border-color: var(--tps-border);
}

.tps-plugin-header-bug:focus-visible {
  outline: 2px solid var(--tps-accent);
  outline-offset: 2px;
}

.tps-switch {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  width: 30px;
  height: 16px;
  padding: 0;
  border: 1px solid var(--tps-border);
  border-radius: var(--tps-radius-pill, 999px);
  background: var(--tps-bg-input);
  cursor: pointer;
  transition: background-color var(--tps-dur-base, 160ms) var(--tps-ease-out, ease-out),
              border-color var(--tps-dur-base, 160ms) var(--tps-ease-out, ease-out);
}

.tps-switch-knob {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 12px;
  height: 12px;
  border-radius: var(--tps-radius-circle, 50%);
  background: var(--tps-text-muted);
  transition: transform var(--tps-dur-base, 160ms) var(--tps-ease-out, ease-out),
              background-color var(--tps-dur-base, 160ms) var(--tps-ease-out, ease-out);
}

.tps-switch[aria-checked="true"] {
  background: var(--tps-accent);
  border-color: var(--tps-accent);
}

.tps-switch[aria-checked="true"] .tps-switch-knob {
  transform: translateX(14px);
  background: var(--tps-on-accent, #fff);
}

.tps-switch:focus-visible {
  outline: 2px solid var(--tps-accent);
  outline-offset: 2px;
}

.tps-switch[data-busy],
.tps-switch:disabled {
  opacity: 0.55;
  pointer-events: none;
}

/* Off-state "safe mode": dim the body, keep it interactive \u2014 edits stage in the
   plugin's local drafts and apply on re-enable. Keyed off the pill's aria state
   so the optimistic flip dims instantly and heal re-renders stay correct with
   no JS. The header (pill, bug button, off-note) stays full opacity \u2014 exclude
   any direct child containing it (collection-icons wraps the header in a row
   element, so exclude by content, not class). */
.tps-panel:has(.tps-plugin-header .tps-switch[aria-checked="false"]) > :not(:has(.tps-plugin-header)) {
  opacity: 0.65;
  transition: opacity var(--tps-dur-base, 160ms) var(--tps-ease-out, ease-out);
}

/* Rendered whenever the header has a kill switch; shown only while it's off. */
.tps-plugin-header-off-note {
  display: none;
  margin: var(--tps-space-2, 8px) 0 0;
  font-size: var(--tps-fs-hint, 12px);
  line-height: var(--tps-lh-base, 1.4);
  color: var(--tps-text-muted);
}

.tps-plugin-header:has(.tps-switch[aria-checked="false"]) .tps-plugin-header-off-note {
  display: block;
}

/* \u2500\u2500 Feedback dialog (panel-scoped modal) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

/* The overlay positions against the .tps-panel root (the scroll container). */
.tps-panel {
  position: relative;
}

.tps-feedback-overlay {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--tps-space-4);
  background: color-mix(in srgb, var(--panel-bg-color, light-dark(#ffffff, #131316)) 55%, transparent);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

@supports not ((backdrop-filter: blur(6px)) or (-webkit-backdrop-filter: blur(6px))) {
  .tps-feedback-overlay {
    background: color-mix(in srgb, var(--panel-bg-color, light-dark(#ffffff, #131316)) 90%, transparent);
  }
}

/* Flex column with a growing description field: the card stretches to the
   available panel height (capped) and the textarea absorbs the difference,
   so the card itself never needs a scrollbar. */
.tps-feedback-card {
  display: flex;
  flex-direction: column;
  width: min(440px, 100%);
  height: min(760px, 100%);
  overflow: auto;
  background: var(--panel-bg-color, light-dark(#ffffff, #17171b));
  border: 1px solid var(--tps-border);
  border-radius: var(--tps-radius-lg);
  padding: var(--tps-space-4);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

/* Rows keep their natural height \u2014 when content doesn't fit (e.g. the system
   report drawer opens in a short panel) the CARD scrolls; rows must never be
   squeezed into overlapping each other. Only the description field flexes. */
.tps-feedback-card > * {
  flex: 0 0 auto;
}

.tps-feedback-card > .tps-feedback-field--grow {
  flex: 1 1 auto;
}

.tps-feedback-field--grow {
  display: flex;
  flex-direction: column;
}

.tps-feedback-field--grow .tps-feedback-textarea {
  flex: 1 1 auto;
  min-height: 72px;
}

.tps-feedback-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 var(--tps-space-2);
}

.tps-feedback-title {
  margin: 0;
  font-size: var(--tps-fs-label, 12.5px);
  font-weight: var(--tps-fw-semibold, 600);
  letter-spacing: var(--tps-ls-section, 0.06em);
  text-transform: uppercase;
  color: var(--tps-text);
}

.tps-feedback-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--tps-radius-sm, 4px);
  background: transparent;
  color: var(--tps-text-muted);
  cursor: pointer;
  font-size: 14px;
}

.tps-feedback-close:hover {
  color: var(--tps-text);
  background: var(--tps-bg-hover);
  border-color: var(--tps-border);
}

.tps-feedback-close:focus-visible {
  outline: 2px solid var(--tps-accent);
  outline-offset: 2px;
}

.tps-feedback-hint {
  margin: 0 0 var(--tps-space-3);
  font-size: var(--tps-fs-hint, 12px);
  line-height: var(--tps-lh-base, 1.4);
  color: var(--tps-text-muted);
}

.tps-feedback-field {
  display: block;
  margin: 0 0 var(--tps-space-3);
}

.tps-feedback-label {
  display: block;
  margin: 0 0 var(--tps-space-1);
  font-size: var(--tps-fs-label, 12.5px);
  font-weight: var(--tps-fw-medium, 500);
  color: var(--tps-text);
}

.tps-feedback-input,
.tps-feedback-textarea {
  width: 100%;
  padding: var(--tps-space-1, 4px) var(--tps-space-2, 8px);
  font-family: inherit;
  font-size: var(--tps-fs-body, 13px);
  line-height: var(--tps-lh-base, 1.4);
  color: var(--tps-text);
  background: var(--tps-bg-input);
  border: 1px solid var(--tps-border);
  border-radius: var(--tps-radius-sm, 4px);
}

.tps-feedback-textarea {
  resize: vertical;
  min-height: 72px;
}

.tps-feedback-input:focus,
.tps-feedback-textarea:focus {
  outline: none;
  border-color: color-mix(in srgb, var(--tps-accent) 60%, transparent);
}

.tps-feedback-input[aria-invalid="true"],
.tps-feedback-textarea[aria-invalid="true"] {
  border-color: var(--tps-danger);
}

.tps-feedback-details {
  margin: 0 0 var(--tps-space-3);
}

.tps-feedback-summary {
  font-size: var(--tps-fs-hint, 12px);
  color: var(--tps-text-muted);
  cursor: pointer;
}

.tps-feedback-summary:hover {
  color: var(--tps-text);
}

.tps-feedback-report {
  margin: var(--tps-space-2) 0 0;
  padding: var(--tps-space-2);
  max-height: 140px;
  overflow: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New", monospace;
  font-size: 11px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--tps-text-muted);
  background: var(--tps-bg-input);
  border: 1px solid var(--tps-divider);
  border-radius: var(--tps-radius-sm, 4px);
}

/* Themed thin scrollbars \u2014 the card (short panels) and the report pre both scroll. */
.tps-feedback-card,
.tps-feedback-report {
  scrollbar-width: thin;
  scrollbar-color: var(--tps-border, rgba(127, 127, 127, 0.25)) transparent;
}

.tps-feedback-card::-webkit-scrollbar,
.tps-feedback-report::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.tps-feedback-card::-webkit-scrollbar-track,
.tps-feedback-report::-webkit-scrollbar-track {
  background: transparent;
}

.tps-feedback-card::-webkit-scrollbar-thumb,
.tps-feedback-report::-webkit-scrollbar-thumb {
  background: var(--tps-border, rgba(127, 127, 127, 0.25));
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.tps-feedback-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--tps-space-2);
}

/* \u2500\u2500 Section \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.tps-section {
  padding: 0;
}

.tps-section + .tps-section {
  border-top: 1px solid var(--tps-divider);
  margin-top: var(--tps-space-4);
  padding-top: var(--tps-space-4);
}

.tps-section-label {
  display: block;
  font-size: var(--tps-fs-section);
  line-height: var(--tps-lh-tight);
  font-weight: var(--tps-fw-semibold);
  letter-spacing: var(--tps-ls-section);
  text-transform: uppercase;
  color: var(--tps-text-muted);
  margin: 0 0 var(--tps-space-2);
}

.tps-section-hint {
  font-size: var(--tps-fs-hint);
  line-height: var(--tps-lh-base);
  color: var(--tps-text-muted);
  margin: 0 0 var(--tps-space-3);
}

.tps-section-body {
  display: flex;
  flex-direction: column;
  gap: var(--tps-space-3);
  margin-top: var(--tps-space-2);
}

.tps-section-body:first-child {
  margin-top: 0;
}

/* When the body is full of list rows (mode rows), drop the gap and the top
   margin entirely so the first row's hover background sits flush under the
   section label and adjacent rows tile with no dead space between them. */
.tps-section-body:has(> .tps-list-row),
.tps-section-body:has(> .tps-opt) {
  margin-top: 0;
  gap: 0;
}

/* Collapsible variant: header is a button, body is hidden when closed */

.tps-section--collapsible > .tps-section-header {
  display: flex;
  align-items: center;
  gap: var(--tps-space-2);
  width: 100%;
  min-height: 34px;
  padding: 0;
  margin: 0 0 var(--tps-space-2);
  background: transparent;
  border: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.tps-section--collapsible > .tps-section-header:hover .tps-section-label {
  color: var(--tps-text);
}

.tps-section--collapsible > .tps-section-header .tps-section-label {
  margin: 0;
}

.tps-section-chev {
  display: inline-block;
  width: 10px;
  font-size: 10px;
  line-height: 1;
  color: var(--tps-text-faint);
  transition: transform var(--tps-dur-base) var(--tps-ease-out);
}

.tps-section--collapsible[data-open="true"] .tps-section-chev {
  transform: rotate(90deg);
}

.tps-section-summary {
  margin-left: auto;
  min-width: 0;
  min-height: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: var(--tps-fs-hint);
  color: var(--tps-text-muted);
  font-weight: var(--tps-fw-regular);
  letter-spacing: 0;
  text-transform: none;
}

/* Reserve header height when expanded; summary text only shows collapsed */
.tps-section--collapsible[data-open="true"] .tps-section-summary {
  visibility: hidden;
}

.tps-section--collapsible[data-open="false"] > .tps-section-body {
  display: none;
}

/* \u2500\u2500 Option row (checkbox / radio + label + desc) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.tps-opt {
  display: grid;
  grid-template-columns: 18px 1fr;
  column-gap: var(--tps-space-3);
  row-gap: 0;
  align-items: start;
  padding: 6px 10px;
  margin: 0 -10px;
  border-radius: var(--tps-radius-md);
  cursor: pointer;
  transition: background-color var(--tps-dur-fast) var(--tps-ease-out);
}

/* Stack option rows tight so the hover background of one meets the next
   without a visible gap above. Outer section gap is handled by the section
   itself, not by spacing between opts. */
.tps-section-body > .tps-opt + .tps-opt {
  margin-top: 0;
}
.tps-section-body:has(> .tps-opt) {
  gap: 0;
}

.tps-opt:hover {
  background: var(--tps-bg-hover);
}

.tps-opt > input[type="checkbox"],
.tps-opt > input[type="radio"] {
  grid-column: 1;
  grid-row: 1;
  align-self: center;
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--tps-accent);
  cursor: pointer;
}

.tps-opt > .tps-opt-label {
  grid-column: 2;
  grid-row: 1;
  font-size: var(--tps-fs-label);
  line-height: var(--tps-lh-base);
  font-weight: var(--tps-fw-medium);
  color: var(--tps-text);
  cursor: pointer;
  transition: color var(--tps-dur-fast) var(--tps-ease-out);
}

.tps-opt > .tps-opt-desc {
  grid-column: 2;
  grid-row: 2;
  margin-top: 1px;
  font-size: var(--tps-fs-desc);
  line-height: var(--tps-lh-base);
  color: var(--tps-text-muted);
  cursor: pointer;
}

.tps-section-body > .tps-opt-note {
  margin: var(--tps-space-2) -10px 0;
  padding: 0 10px 0 calc(10px + 18px + var(--tps-space-3));
  font-size: var(--tps-fs-desc);
  line-height: var(--tps-lh-base);
  color: var(--tps-text-muted);
}

.tps-opt > input:checked ~ .tps-opt-label {
  color: var(--tps-accent);
}

/* Checkbox option + nested number row (e.g. tuned value under a toggle) */
.tps-section-body:has(> .tps-opt-group) {
  margin-top: 0;
  gap: 0;
}

.tps-opt-group {
  display: flex;
  flex-direction: column;
}

.tps-opt-group + .tps-opt-group {
  margin-top: 0;
}

.tps-opt-group .tps-opt-group__value,
.tps-opt-group > .tps-num {
  margin-left: calc(18px + var(--tps-space-3));
  margin-top: var(--tps-space-1);
  margin-bottom: var(--tps-space-3);
  padding-right: 10px;
  max-width: 100%;
  box-sizing: border-box;
}

.tps-opt-group .tps-num-grid {
  margin-left: calc(18px + var(--tps-space-3));
  margin-top: var(--tps-space-1);
  margin-bottom: var(--tps-space-3);
  grid-template-columns: minmax(0, 1fr);
}

/* \u2500\u2500 Numeric stepper \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.tps-num {
  display: flex;
  align-items: center;
  gap: var(--tps-space-1);
}

.tps-num-label {
  flex: 0 0 auto;
  min-width: 0;
  font-size: var(--tps-fs-label);
  color: var(--tps-text);
  margin-right: var(--tps-space-2);
}

.tps-num-step,
.tps-num-input,
.tps-num-reset {
  font-family: inherit;
  font-size: var(--tps-fs-button);
  height: var(--tps-control-h-sm);
  border: 1px solid var(--tps-divider);
  border-radius: var(--tps-radius-sm);
  background: transparent;
  color: var(--tps-text);
  transition: border-color var(--tps-dur-fast) var(--tps-ease-out),
              background-color var(--tps-dur-fast) var(--tps-ease-out),
              color var(--tps-dur-fast) var(--tps-ease-out);
}

.tps-num-step {
  width: var(--tps-num-step-w);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tps-num-step:hover {
  border-color: var(--tps-border);
  background: var(--tps-bg-hover);
}

.tps-num-step:active {
  background: var(--tps-bg-active);
}

.tps-num-input {
  width: var(--tps-input-w);
  padding: 0 var(--tps-space-2);
  background: var(--tps-bg-input);
  text-align: center;
  font-variant-numeric: tabular-nums;
  -moz-appearance: textfield;
}

.tps-num-input::-webkit-outer-spin-button,
.tps-num-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.tps-num-input:focus {
  outline: none;
  border-color: var(--tps-accent);
}

.tps-num-unit {
  font-size: var(--tps-fs-hint);
  color: var(--tps-text-muted);
  margin: 0 var(--tps-space-2);
}

.tps-num-reset {
  font-size: 11px;
  color: var(--tps-text-muted);
  padding: 0 var(--tps-space-2);
  cursor: pointer;
}

.tps-num-reset:hover {
  color: var(--tps-text);
  border-color: var(--tps-border);
}

.tps-num-reset[hidden] {
  display: none !important;
}

/* Stacked layout: label / control row in a 200px / 1fr grid */

.tps-num-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
  column-gap: var(--tps-space-3);
  row-gap: var(--tps-space-2);
}

.tps-num-grid > .tps-num-label {
  margin: 0;
  text-align: left;
}

.tps-num-grid > .tps-num {
  justify-self: start;
}

/* \u2500\u2500 Slider row \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

/* Shared range styling for sliderRow and any other range input in a panel.
   Exclude hue pickers that paint their own gradient track. */
.tps-panel input[type="range"]:not(.plg-collection-colors__hue) {
  width: 100%;
  height: 22px;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  touch-action: pan-y;
}

.tps-panel input[type="range"]:not(.plg-collection-colors__hue)::-webkit-slider-runnable-track {
  height: var(--tps-track-h);
  border-radius: 3px;
  background: var(--tps-slider-track);
}

.tps-panel input[type="range"]:not(.plg-collection-colors__hue)::-moz-range-track {
  height: var(--tps-track-h);
  border-radius: 3px;
  background: var(--tps-slider-track);
}

.tps-panel input[type="range"]:not(.plg-collection-colors__hue)::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--tps-thumb-size);
  height: var(--tps-thumb-size);
  border-radius: var(--tps-radius-circle);
  background: var(--tps-accent);
  border: 2px solid var(--tps-slider-thumb-border);
  box-shadow: var(--tps-shadow-thumb);
  cursor: grab;
  margin-top: -5px;
}

.tps-panel input[type="range"]:not(.plg-collection-colors__hue)::-moz-range-thumb {
  width: var(--tps-thumb-size);
  height: var(--tps-thumb-size);
  border-radius: var(--tps-radius-circle);
  background: var(--tps-accent);
  border: 2px solid var(--tps-slider-thumb-border);
  box-shadow: var(--tps-shadow-thumb);
  cursor: grab;
}

.tps-panel input[type="range"]:not(.plg-collection-colors__hue):active::-webkit-slider-thumb {
  cursor: grabbing;
}

.tps-slider {
  display: grid;
  grid-template-columns: 90px 1fr 56px auto;
  align-items: center;
  gap: var(--tps-space-3);
}

.tps-slider-label {
  font-size: var(--tps-fs-section);
  font-weight: var(--tps-fw-semibold);
  letter-spacing: var(--tps-ls-section);
  text-transform: uppercase;
  color: var(--tps-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tps-slider-input {
  width: 100%;
  height: 22px;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  touch-action: pan-y;
}

.tps-slider-input::-webkit-slider-runnable-track {
  height: var(--tps-track-h);
  border-radius: 3px;
  background: var(--tps-slider-track);
}

.tps-slider-input::-moz-range-track {
  height: var(--tps-track-h);
  border-radius: 3px;
  background: var(--tps-slider-track);
}

.tps-slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--tps-thumb-size);
  height: var(--tps-thumb-size);
  border-radius: var(--tps-radius-circle);
  background: var(--tps-accent);
  border: 2px solid var(--tps-slider-thumb-border);
  box-shadow: var(--tps-shadow-thumb);
  cursor: grab;
  margin-top: -5px;
}

.tps-slider-input::-moz-range-thumb {
  width: var(--tps-thumb-size);
  height: var(--tps-thumb-size);
  border-radius: var(--tps-radius-circle);
  background: var(--tps-accent);
  border: 2px solid var(--tps-slider-thumb-border);
  box-shadow: var(--tps-shadow-thumb);
  cursor: grab;
}

.tps-slider-input:active::-webkit-slider-thumb {
  cursor: grabbing;
}

/* Hue picker keeps its gradient track; only style the thumb. */
.tps-panel input[type="range"].plg-collection-colors__hue {
  width: 100%;
  height: 10px;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;
}

.tps-panel input[type="range"].plg-collection-colors__hue::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: var(--tps-radius-circle);
  background: var(--panel-bg-color, var(--tps-panel-bg, currentColor));
  border: 2px solid var(--tps-slider-thumb-border);
  box-shadow: var(--tps-shadow-thumb);
  cursor: grab;
}

.tps-panel input[type="range"].plg-collection-colors__hue::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: var(--tps-radius-circle);
  background: var(--panel-bg-color, var(--tps-panel-bg, currentColor));
  border: 2px solid var(--tps-slider-thumb-border);
  box-shadow: var(--tps-shadow-thumb);
  cursor: grab;
}

.tps-slider-value {
  font-family: var(--tps-font-mono);
  font-size: var(--tps-fs-value);
  color: var(--tps-text);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* \u2500\u2500 Swatch + grid \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.tps-swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--tps-swatch-size));
  gap: var(--tps-space-2) 6px;
}

.tps-swatch {
  width: var(--tps-swatch-size);
  height: var(--tps-swatch-size);
  border-radius: var(--tps-radius-circle);
  border: 0;
  padding: 0;
  cursor: pointer;
  outline: none;
  box-shadow: inset 0 0 0 1px var(--tps-swatch-inset);
  transition: transform var(--tps-dur-fast) var(--tps-ease-out),
              box-shadow var(--tps-dur-fast) var(--tps-ease-out);
}

.tps-swatch:hover {
  transform: scale(1.1);
}

.tps-swatch[aria-pressed="true"] {
  box-shadow: 0 0 0 2px var(--tps-accent);
}

/* \u2500\u2500 List rows \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.tps-list {
  display: flex;
  flex-direction: column;
}

.tps-list-header {
  display: grid;
  grid-template-columns: 18px 1fr auto;
  align-items: center;
  gap: var(--tps-space-3);
  padding: var(--tps-space-2) var(--tps-space-3);
  border-bottom: 1px solid var(--tps-divider);
  font-size: var(--tps-fs-list-header);
  font-weight: var(--tps-fw-bold);
  letter-spacing: var(--tps-ls-list);
  text-transform: uppercase;
  color: var(--tps-text-faint);
}

.tps-list-row {
  display: grid;
  grid-template-columns: 18px 1fr auto;
  align-items: center;
  gap: var(--tps-space-3);
  padding: var(--tps-space-2) var(--tps-space-3);
  border-bottom: 1px solid var(--tps-divider);
  transition: background-color var(--tps-dur-fast) var(--tps-ease-out);
}

.tps-list-row:last-child {
  border-bottom: 0;
}

.tps-list-row:hover {
  background: var(--tps-bg-hover);
}

.tps-list-name {
  font-size: var(--tps-fs-label);
  color: var(--tps-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* \u2500\u2500 Tabs / segmented control \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.tps-tabs {
  display: inline-flex;
  align-items: center;
  gap: var(--tps-space-1);
  padding: 0;
}

.tps-tab {
  height: var(--tps-control-h-sm);
  padding: 0 var(--tps-space-2);
  font-family: inherit;
  font-size: var(--tps-fs-button);
  font-weight: var(--tps-fw-medium);
  color: var(--tps-text-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--tps-radius-sm);
  cursor: pointer;
  transition: background-color var(--tps-dur-fast) var(--tps-ease-out),
              border-color var(--tps-dur-fast) var(--tps-ease-out),
              color var(--tps-dur-fast) var(--tps-ease-out);
}

.tps-tab:hover {
  background: var(--tps-bg-hover);
  color: var(--tps-text);
}

.tps-tab[aria-pressed="true"],
.tps-tab[aria-selected="true"] {
  background: var(--tps-accent-soft);
  color: var(--tps-accent);
  border-color: color-mix(in srgb, var(--tps-accent) 50%, transparent);
}

/* \u2500\u2500 Buttons \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.tps-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--tps-space-1);
  height: var(--tps-control-h-sm);
  padding: 0 var(--tps-space-3);
  font-family: inherit;
  font-size: var(--tps-fs-button);
  font-weight: var(--tps-fw-medium);
  border-radius: var(--tps-radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color var(--tps-dur-fast) var(--tps-ease-out),
              border-color var(--tps-dur-fast) var(--tps-ease-out),
              color var(--tps-dur-fast) var(--tps-ease-out);
}

.tps-button--md { height: var(--tps-control-h-md); padding: 0 var(--tps-space-4); }

.tps-button--primary {
  background: var(--tps-accent);
  color: var(--tps-on-accent);
}

.tps-button--primary:hover {
  filter: brightness(1.08);
}

.tps-button--ghost {
  background: transparent;
  border-color: var(--tps-divider);
  color: var(--tps-text);
}

.tps-button--ghost:hover {
  background: var(--tps-bg-hover);
  border-color: var(--tps-border);
}

.tps-button--danger {
  background: transparent;
  border-color: var(--tps-divider);
  color: var(--tps-text-muted);
}

.tps-button--danger:hover {
  background: var(--tps-danger-soft);
  border-color: color-mix(in srgb, var(--tps-danger) 40%, transparent);
  color: var(--tps-danger);
}

/* \u2500\u2500 Focus rings (custom controls only \u2014 native inputs use accent-color) \u2500 */

.tps-tab:focus-visible,
.tps-button:focus-visible,
.tps-num-step:focus-visible,
.tps-num-reset:focus-visible,
.tps-swatch:focus-visible {
  outline: 2px solid var(--tps-accent);
  outline-offset: 2px;
}

/* \u2500\u2500 Inset card variant (rare \u2014 for palette-picker body, etc.) \u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.tps-card {
  padding: var(--tps-space-3);
  border-radius: var(--tps-radius-lg);
  background: var(--tps-bg-input);
  border: 1px solid var(--tps-divider);
}
`;

  // ../../shared/settings-ui/color-field.css
  var color_field_default = `/*
 * colorField \u2014 shared color picker (Theme | Tailwind | Custom).
 * Scoped under .tps-panel .tps-color-field; styled through --tps-* tokens.
 * Every selectable swatch is the same .tps-cf-dot across all three tabs.
 */

.tps-panel .tps-color-field { display: block; }

/* \u2500\u2500 Tabs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tps-panel .tps-cf-tabs {
  display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 4px;
  background: var(--tps-bg-input, rgba(127,127,127,0.06));
  border: 1px solid var(--tps-border, rgba(127,127,127,0.14));
  border-radius: var(--tps-radius-md, 8px);
  padding: 4px; margin-bottom: var(--tps-space-3, 12px);
}
.tps-panel .tps-cf-tab {
  cursor: pointer; border: 0; background: transparent;
  border-radius: var(--tps-radius-sm, 6px); padding: 8px 10px; font: inherit;
  font-size: var(--tps-fs-body, 13px); font-weight: var(--tps-fw-semibold, 600);
  color: var(--tps-text-muted, rgba(127,127,127,0.75));
  transition: background var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease),
              color var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease);
}
.tps-panel .tps-cf-tab:hover { color: var(--tps-text, inherit); }
.tps-panel .tps-cf-tab.is-active {
  background: var(--tps-panel-bg, var(--bg-default, #fff));
  color: var(--tps-text, inherit); box-shadow: 0 1px 2px rgba(0,0,0,0.12);
}

/* \u2500\u2500 Panes \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tps-panel .tps-cf-pane { display: none; }
.tps-panel .tps-cf-pane.is-active { display: block; }

/* \u2500\u2500 Featured theme picks \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tps-panel .tps-cf-featured {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  margin-bottom: var(--tps-space-3, 12px);
}
.tps-panel .tps-cf-tile {
  display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; cursor: pointer;
  background: var(--tps-bg-hover, rgba(127,127,127,0.04));
  border: 1px solid var(--tps-border, rgba(127,127,127,0.14));
  border-radius: var(--tps-radius-md, 8px); padding: 10px 12px; color: var(--tps-text, inherit);
  transition: border-color var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease),
              background var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease);
}
.tps-panel .tps-cf-tile:hover { border-color: var(--tps-border-strong, rgba(127,127,127,0.28)); }
.tps-panel .tps-cf-tile.is-sel {
  border-color: var(--tps-accent, currentColor);
  background: var(--tps-accent-soft, rgba(127,127,127,0.08));
}
.tps-panel .tps-cf-tile-dot {
  width: 22px; height: 22px; flex: 0 0 auto; border-radius: var(--tps-radius-sm, 6px);
  box-shadow: inset 0 0 0 1px var(--tps-swatch-inset, rgba(127,127,127,0.18));
}
.tps-panel .tps-cf-tile-label {
  font-size: var(--tps-fs-body, 13px); font-weight: var(--tps-fw-semibold, 600);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* \u2500\u2500 Groups + the universal swatch dot \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tps-panel .tps-cf-group { margin-bottom: var(--tps-space-3, 12px); }
.tps-panel .tps-cf-group-head { display: flex; align-items: baseline; gap: 8px; margin-bottom: var(--tps-space-2, 8px); }
.tps-panel .tps-cf-group-label {
  font-size: var(--tps-fs-section, 11px); letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--tps-text-faint, var(--tps-text-muted, rgba(127,127,127,0.6))); font-weight: var(--tps-fw-semibold, 600);
}
.tps-panel .tps-cf-group-hint { font-size: var(--tps-fs-section, 11px); color: var(--tps-text-faint, rgba(127,127,127,0.5)); }

/* \u2500\u2500 Swatches: square dots that fill the row width (22 across in the Tailwind
 *    hue row); every swatch elsewhere matches that width. \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tps-panel .tps-cf-dots {
  display: grid; grid-template-columns: repeat(22, minmax(0, 1fr)); gap: 5px;
  /* explicit resets so a stale accumulated .tps-cf-dots rule (old edge-to-edge
   * build injected an inset-ring outline) can't linger after a plugin reload. */
  border: 0; border-radius: 0; overflow: visible; box-shadow: none; background: none; padding: 0;
}
.tps-panel .tps-cf-dot {
  aspect-ratio: 1 / 1; min-width: 0; width: 100%; height: auto; border: 0; padding: 0; margin: 0;
  cursor: pointer; position: relative;
  border-radius: var(--tps-radius-sm, 6px);
  box-shadow: inset 0 0 0 1px var(--tps-swatch-inset, rgba(127,127,127,0.18));
  transition: transform var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease),
              box-shadow var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease);
}
.tps-panel .tps-cf-dot:hover { transform: scale(1.12); z-index: 3; }
.tps-panel .tps-cf-dot:focus-visible,
.tps-panel .tps-cf-dot.is-sel,
.tps-panel .tps-cf-dot.is-active {
  outline: none; z-index: 4;
  box-shadow: inset 0 0 0 1px var(--tps-swatch-inset, rgba(127,127,127,0.18)),
              0 0 0 2px var(--tps-panel-bg, #fff), 0 0 0 4px var(--tps-accent, currentColor);
}

/* \u2500\u2500 Lightness "tints": full-width ramp, shade number inside (do not touch) \u2500 */
.tps-panel .tps-cf-ramp {
  display: grid; grid-template-columns: repeat(11, minmax(0, 1fr));
  border-radius: var(--tps-radius-md, 8px); overflow: hidden;
  box-shadow: inset 0 0 0 1px var(--tps-border, rgba(127,127,127,0.14));
}
.tps-panel .tps-cf-ramp-cell {
  border: 0; padding: 0; cursor: pointer; height: 30px; position: relative;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: var(--tps-fw-semibold, 600); font-variant-numeric: tabular-nums; letter-spacing: -0.02em;
  transition: box-shadow var(--tps-dur-fast, 80ms) var(--tps-ease-out, ease);
}
.tps-panel .tps-cf-ramp-cell:hover { z-index: 3; box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--tps-panel-bg, #fff) 60%, transparent); }
.tps-panel .tps-cf-ramp-cell:focus-visible,
.tps-panel .tps-cf-ramp-cell.is-sel {
  outline: none; z-index: 4;
  box-shadow: inset 0 0 0 2px var(--tps-panel-bg, #fff), inset 0 0 0 4px var(--tps-accent, currentColor);
}
/* Faint secondary ring on the inverted ("invert lightness") mirror shade \u2014
   present alongside the prominent ring on the actually-selected shade. */
.tps-panel .tps-cf-ramp-cell.is-sel-mirror {
  z-index: 3;
  box-shadow: inset 0 0 0 2px var(--tps-panel-bg, #fff),
              inset 0 0 0 3px color-mix(in srgb, var(--tps-accent, currentColor) 42%, transparent);
}

/* \u2500\u2500 Invert-lightness toggle \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tps-panel .tps-cf-invert {
  display: flex; align-items: center; gap: 8px; margin-top: var(--tps-space-3, 12px);
  cursor: pointer; font-size: var(--tps-fs-hint, 12px); color: var(--tps-text, inherit); font-weight: var(--tps-fw-medium, 500);
}
.tps-panel .tps-cf-invert-cb { margin: 0; cursor: pointer; accent-color: var(--tps-accent, currentColor); }
.tps-panel .tps-cf-invert-hint { color: var(--tps-text-faint, rgba(127,127,127,0.5)); font-weight: var(--tps-fw-regular, 400); }
/* Dimmed + non-interactive until a real, non-500 shade is picked (500 mirrors
   to itself, so inverting it is a no-op). */
.tps-panel .tps-cf-invert.is-disabled { opacity: 0.42; cursor: default; }
.tps-panel .tps-cf-invert.is-disabled .tps-cf-invert-cb { cursor: default; }

/* \u2500\u2500 Custom palette \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tps-panel .tps-cf-custom-row { min-height: 30px; margin-bottom: var(--tps-space-3, 12px); }
.tps-panel .tps-cf-custom-empty {
  grid-column: 1 / -1; display: flex; align-items: center; padding: 0 10px; min-height: 30px;
  font-size: var(--tps-fs-hint, 12px); font-weight: var(--tps-fw-regular, 400); letter-spacing: 0;
  color: var(--tps-text-faint, rgba(127,127,127,0.55));
}
.tps-panel .tps-cf-custom-dot { cursor: grab; }
.tps-panel .tps-cf-custom-dot.is-dragging { opacity: 0.4; cursor: grabbing; }

.tps-panel .tps-cf-addrow { display: flex; align-items: center; gap: 8px; }
.tps-panel .tps-cf-remove {
  cursor: pointer; border: 1px solid var(--tps-border, rgba(127,127,127,0.14));
  background: var(--tps-bg-input, rgba(127,127,127,0.06)); color: var(--tps-text-muted, rgba(127,127,127,0.75));
  border-radius: var(--tps-radius-md, 8px); height: 32px; padding: 0 14px; font: inherit;
  font-size: var(--tps-fs-hint, 12px); font-weight: var(--tps-fw-medium, 500);
}
.tps-panel .tps-cf-remove[hidden] { display: none; }
.tps-panel .tps-cf-remove:hover { border-color: var(--tps-border-strong, rgba(127,127,127,0.28)); color: var(--tps-text, inherit); }
.tps-panel .tps-cf-add {
  cursor: pointer; border: 1px solid var(--tps-border, rgba(127,127,127,0.14));
  background: var(--tps-bg-input, rgba(127,127,127,0.06)); color: var(--tps-text, inherit);
  border-radius: var(--tps-radius-md, 8px); height: 32px; padding: 0 14px; font: inherit;
  font-size: var(--tps-fs-hint, 12px); font-weight: var(--tps-fw-semibold, 600);
}
.tps-panel .tps-cf-add:hover { border-color: var(--tps-border-strong, rgba(127,127,127,0.28)); }
.tps-panel .tps-cf-custom-count {
  margin-left: auto; font-size: var(--tps-fs-section, 11px);
  color: var(--tps-text-faint, rgba(127,127,127,0.5)); font-variant-numeric: tabular-nums;
}

/* \u2500\u2500 Hex input \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tps-panel .tps-cf-hexbox {
  display: inline-flex; align-items: center; gap: 8px; box-sizing: border-box; height: 32px;
  background: var(--tps-bg-input, rgba(127,127,127,0.06));
  border: 1px solid var(--tps-border, rgba(127,127,127,0.14));
  border-radius: var(--tps-radius-md, 8px); padding: 0 8px 0 10px;
}
.tps-panel .tps-cf-hex-dot {
  width: 15px; height: 15px; border-radius: var(--tps-radius-sm, 5px);
  box-shadow: inset 0 0 0 1px var(--tps-swatch-inset, rgba(127,127,127,0.22));
}
.tps-panel .tps-cf-hex-input {
  border: 0; background: transparent; outline: none;
  font-family: var(--tps-font-mono, ui-monospace, monospace);
  font-size: var(--tps-fs-hint, 12px); color: var(--tps-text, inherit); width: 84px;
  font-variant-numeric: tabular-nums;
}
.tps-panel .tps-cf-hex-input::placeholder { color: var(--tps-text-faint, rgba(127,127,127,0.5)); }

/* \u2500\u2500 Universal: No color \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tps-panel .tps-cf-divider {
  height: 1px; margin: var(--tps-space-3, 12px) 0; background: var(--tps-divider, rgba(127,127,127,0.12));
}
.tps-panel .tps-cf-universal { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.tps-panel .tps-cf-none {
  display: inline-flex; align-items: center; gap: 7px; cursor: pointer; box-sizing: border-box; height: 32px;
  background: var(--tps-bg-input, rgba(127,127,127,0.06));
  border: 1px solid var(--tps-border, rgba(127,127,127,0.14));
  border-radius: var(--tps-radius-md, 8px); padding: 0 12px; font: inherit;
  font-size: var(--tps-fs-hint, 12px); font-weight: var(--tps-fw-medium, 500);
  color: var(--tps-text-muted, rgba(127,127,127,0.7));
}
.tps-panel .tps-cf-none:hover { border-color: var(--tps-border-strong, rgba(127,127,127,0.28)); color: var(--tps-text, inherit); }
.tps-panel .tps-cf-none.is-sel { border-color: var(--tps-accent, currentColor); color: var(--tps-text, inherit); }
.tps-panel .tps-cf-none-sw {
  width: 15px; height: 15px; border-radius: 50%; position: relative; overflow: hidden;
  box-shadow: inset 0 0 0 1px var(--tps-border-strong, rgba(127,127,127,0.3));
}
.tps-panel .tps-cf-none-sw::after {
  content: ""; position: absolute; left: 50%; top: -3px; width: 1.5px; height: 21px;
  background: var(--tps-danger, #e2555f); transform: rotate(45deg);
}

/* \u2500\u2500 Instant tooltip (drawn by the component, not native title delay) \u2500\u2500\u2500 */
.tps-panel .tps-cf-tip {
  position: fixed; z-index: 2147483000; transform: translate(-50%, calc(-100% - 8px));
  padding: 3px 8px; border-radius: var(--tps-radius-sm, 5px);
  background: var(--tps-text, #1a1a1a); color: var(--tps-panel-bg, #fff);
  font-size: var(--tps-fs-section, 11px); font-weight: var(--tps-fw-medium, 500);
  line-height: 1.3; white-space: nowrap; pointer-events: none; opacity: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.35);
}
.tps-panel .tps-cf-tip.is-visible { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .tps-panel .tps-cf-dot,
  .tps-panel .tps-cf-tab,
  .tps-panel .tps-cf-tile,
  .tps-panel .tps-cf-remove { transition: none; }
}
`;

  // ../../shared/settings-ui/feedback.js
  var MAX_URL_LENGTH = 7600;
  function el(tag, props, ...children) {
    const node = document.createElement(tag);
    const dom = (
      /** @type {any} */
      node
    );
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === "class") node.className = v;
        else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k in dom && typeof dom[k] !== "function") {
          try {
            dom[k] = v;
          } catch {
            node.setAttribute(k, v);
          }
        } else node.setAttribute(k, v === true ? "" : String(v));
      }
    }
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      node.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return node;
  }
  __name(el, "el");
  function versionFromConf(conf) {
    if (!conf || typeof conf !== "object") return "";
    if (typeof conf.version === "string" && conf.version) return conf.version;
    const custom = conf.custom;
    if (custom && typeof custom === "object") {
      const v = (
        /** @type {Record<string, unknown>} */
        custom.pluginVersion
      );
      if (typeof v === "string") return v;
    }
    return "";
  }
  __name(versionFromConf, "versionFromConf");
  async function collectSystemReport({ pluginName = "", pluginVersion = "", disabled = false, data } = {}) {
    const ua = navigator.userAgent || "";
    const lines = [];
    lines.push(`Plugin: ${pluginName} v${pluginVersion}${disabled ? " (kill switch: OFF)" : ""}`);
    lines.push(`App: ${/electron/i.test(ua) ? "Thymer desktop app (Electron)" : "Thymer web"}${location && location.host ? ` \xB7 ${location.host}` : ""}`);
    lines.push(`UA: ${ua}`);
    lines.push(`Platform: ${navigator.platform || "?"} \xB7 lang ${navigator.language || "?"} \xB7 tz ${Intl.DateTimeFormat().resolvedOptions().timeZone || "?"}`);
    const dpr = Math.round((window.devicePixelRatio || 1) * 100) / 100;
    lines.push(`Screen (css px): ${screen.width}x${screen.height} @${dpr}x (\u2248${Math.round(screen.width * dpr)}x${Math.round(screen.height * dpr)} device px) \xB7 viewport ${window.innerWidth}x${window.innerHeight}`);
    try {
      const dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const themeClasses = Array.from(document.body.classList).filter((c) => /theme/i.test(c)).join(" ");
      lines.push(`Appearance: ${dark ? "dark" : "light"}${reducedMotion ? " \xB7 reduced-motion" : ""}${themeClasses ? ` \xB7 body: ${themeClasses}` : ""}`);
    } catch {
    }
    try {
      const bits = [];
      if (navigator.hardwareConcurrency) bits.push(`${navigator.hardwareConcurrency} cores`);
      const devMem = (
        /** @type {any} */
        navigator.deviceMemory
      );
      if (devMem) bits.push(devMem >= 8 ? `RAM \u22658GB (API cap)` : `~${devMem}GB RAM`);
      const heap = (
        /** @type {any} */
        performance.memory
      );
      if (heap && heap.usedJSHeapSize) bits.push(`JS heap ${Math.round(heap.usedJSHeapSize / 1048576)}MB of ${Math.round(heap.jsHeapSizeLimit / 1048576)}MB limit`);
      bits.push(navigator.onLine === false ? "OFFLINE" : "online");
      if (typeof performance.now === "function") bits.push(`session up ${Math.round(performance.now() / 6e4)}m`);
      lines.push(`System: ${bits.join(" \xB7 ")}`);
    } catch {
    }
    try {
      if (navigator.storage && typeof navigator.storage.estimate === "function") {
        const est = await navigator.storage.estimate();
        if (est && est.usage != null) {
          lines.push(`Storage: ${Math.round((est.usage || 0) / 1048576)}MB used${est.quota ? ` of ${Math.round(est.quota / 1048576)}MB quota` : ""}`);
        }
      }
    } catch {
    }
    try {
      if (data && typeof data.getAllGlobalPlugins === "function") {
        const plugins = await data.getAllGlobalPlugins();
        const listed = plugins.slice(0, 25).map((p) => {
          let name = "";
          let ver = "";
          try {
            name = p.getName?.() || "";
          } catch {
          }
          try {
            ver = versionFromConf(p.getConfiguration?.());
          } catch {
          }
          return ver ? `${name} v${ver}` : name;
        }).filter(Boolean);
        if (listed.length) {
          lines.push(`Global plugins, all installed (${plugins.length}): ${listed.join(", ")}${plugins.length > 25 ? ", \u2026" : ""}`);
        }
      }
      if (data && typeof /** @type {any} */
      data.getAllCollections === "function") {
        const collections = await /** @type {any} */
        data.getAllCollections();
        if (Array.isArray(collections)) lines.push(`Collection-level plugins: ${collections.length} (names withheld)`);
      }
    } catch {
    }
    return lines.join("\n");
  }
  __name(collectSystemReport, "collectSystemReport");
  function buildIssueUrl({ repository, description, discord, email, report }) {
    const repo = repository.replace(/\/+$/, "");
    const firstLine = description.split("\n")[0].trim();
    const title = `[bug] ${firstLine.length > 60 ? `${firstLine.slice(0, 57)}...` : firstLine}`;
    const bodyFor = /* @__PURE__ */ __name((desc2) => {
      const parts = [`**Describe the bug**

${desc2}`];
      if (discord || email) {
        const contact = [];
        if (discord) contact.push(`- Discord: ${discord}`);
        if (email) contact.push(`- Email: ${email}`);
        parts.push(`**Contact**

${contact.join("\n")}`);
      }
      parts.push(`**System report**

\`\`\`
${report}
\`\`\``);
      parts.push("_Screenshots: paste or drag images directly into this text box._");
      return parts.join("\n\n");
    }, "bodyFor");
    const urlFor = /* @__PURE__ */ __name((desc2) => `${repo}/issues/new?${new URLSearchParams({ title, body: bodyFor(desc2) })}`, "urlFor");
    let desc = description;
    let url = urlFor(desc);
    while (url.length > MAX_URL_LENGTH && desc.length > 200) {
      desc = `${desc.slice(0, Math.max(200, desc.length - 500)).trimEnd()}

[description truncated \u2014 URL length limit]`;
      url = urlFor(desc);
    }
    return url;
  }
  __name(buildIssueUrl, "buildIssueUrl");
  function openFeedbackDialog({ host, opener, pluginName = "", pluginVersion = "", repository = "", disabled = false, data } = {}) {
    const panelHost = host || /** @type {HTMLElement | null} */
    (opener ? opener.closest(".tps-panel") : null);
    if (!panelHost || !repository) return;
    if (panelHost.querySelector(".tps-feedback-overlay")) return;
    const reportPromise = collectSystemReport({ pluginName, pluginVersion, disabled, data });
    const discordInput = el("input", { class: "tps-feedback-input", type: "text", placeholder: "e.g. akaready", autocomplete: "off", spellcheck: "false" });
    const emailInput = el("input", { class: "tps-feedback-input", type: "email", placeholder: "e.g. you@example.com", autocomplete: "off", spellcheck: "false" });
    const descInput = el("textarea", { class: "tps-feedback-textarea", rows: "5", placeholder: "What happened? What did you expect instead?" });
    const reportPre = el("pre", { class: "tps-feedback-report" }, "Collecting\u2026");
    reportPromise.then((text) => {
      reportPre.textContent = text;
    }).catch(() => {
      reportPre.textContent = "Report unavailable.";
    });
    const fieldRow = /* @__PURE__ */ __name((label, field, extraClass) => el(
      "label",
      { class: `tps-feedback-field${extraClass ? ` ${extraClass}` : ""}` },
      el("span", { class: "tps-feedback-label" }, label),
      field
    ), "fieldRow");
    const prevOverflow = panelHost.style.overflow;
    const close = /* @__PURE__ */ __name(() => {
      overlay.remove();
      panelHost.style.overflow = prevOverflow;
      try {
        opener?.focus();
      } catch {
      }
    }, "close");
    const submit = /* @__PURE__ */ __name(async () => {
      const description = descInput.value.trim();
      if (!description) {
        descInput.setAttribute("aria-invalid", "true");
        descInput.focus();
        return;
      }
      let report = "";
      try {
        report = await reportPromise;
      } catch {
      }
      const url = buildIssueUrl({
        repository,
        description,
        discord: discordInput.value.trim(),
        email: emailInput.value.trim(),
        report
      });
      window.open(url, "_blank", "noopener");
      close();
    }, "submit");
    const card = el(
      "div",
      { class: "tps-feedback-card", role: "dialog", "aria-modal": "true", "aria-label": `Report a bug in ${pluginName}` },
      el(
        "div",
        { class: "tps-feedback-head" },
        el("h2", { class: "tps-feedback-title" }, "Report a bug"),
        el(
          "button",
          { type: "button", class: "tps-feedback-close", "aria-label": "Close", onClick: close },
          el("i", { class: "ti ti-x", "aria-hidden": "true" })
        )
      ),
      // Fixed short copy — no variable repo name, so each line stays on one line.
      el(
        "p",
        { class: "tps-feedback-hint" },
        "Opens a prefilled GitHub issue on the repo.",
        el("br"),
        "Please add relevant screenshots to the GitHub issue."
      ),
      fieldRow("Discord username (optional)", discordInput),
      fieldRow("Email (optional)", emailInput),
      fieldRow("What happened?", descInput, "tps-feedback-field--grow"),
      el(
        "details",
        { class: "tps-feedback-details" },
        el("summary", { class: "tps-feedback-summary" }, "System report (included with the issue)"),
        reportPre
      ),
      el(
        "div",
        { class: "tps-feedback-actions" },
        el("button", { type: "button", class: "tps-button tps-button--ghost", onClick: close }, "Cancel"),
        el("button", { type: "button", class: "tps-button tps-button--primary", onClick: submit }, "Open GitHub issue")
      )
    );
    const overlay = el("div", { class: "tps-feedback-overlay" }, card);
    overlay.addEventListener("mousedown", (e) => {
      if (e.target === overlay) close();
    });
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    });
    descInput.addEventListener("input", () => descInput.removeAttribute("aria-invalid"));
    panelHost.style.overflow = "hidden";
    overlay.style.top = `${panelHost.scrollTop}px`;
    overlay.style.height = `${panelHost.clientHeight}px`;
    panelHost.appendChild(overlay);
    descInput.focus();
  }
  __name(openFeedbackDialog, "openFeedbackDialog");

  // ../../shared/settings-ui/helpers.js
  var PANEL_CSS = tokens_default + "\n" + components_default + "\n" + color_field_default;
  function h(tag, props, ...children) {
    const el2 = document.createElement(tag);
    const dom = (
      /** @type {any} */
      el2
    );
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === "class" || k === "className") {
          el2.className = v;
        } else if (k === "style" && typeof v === "object") {
          Object.assign(el2.style, v);
        } else if (k === "dataset" && typeof v === "object") {
          for (const dk in v) el2.dataset[dk] = v[dk];
        } else if (k.startsWith("on") && typeof v === "function") {
          el2.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (k in dom && typeof dom[k] !== "function") {
          try {
            dom[k] = v;
          } catch {
            el2.setAttribute(k, v);
          }
        } else {
          el2.setAttribute(k, v === true ? "" : String(v));
        }
      }
    }
    appendChildren(el2, children);
    return el2;
  }
  __name(h, "h");
  function appendChildren(parent, children) {
    for (const c of children) {
      if (c == null || c === false) continue;
      if (Array.isArray(c)) {
        appendChildren(parent, c);
        continue;
      }
      parent.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    }
  }
  __name(appendChildren, "appendChildren");
  function panel({ pluginClass } = {}, children = []) {
    const cls = ["tps-panel", pluginClass].filter(Boolean).join(" ");
    return h("div", { class: cls }, ...children);
  }
  __name(panel, "panel");
  function pluginHeader({
    title: heading,
    lede: ledeText,
    helper,
    helperOpen,
    helperDefaultOpen = false,
    onHelperToggle,
    icon = "",
    version = "1.0",
    author = "@akaready",
    homepage = "https://akaready.com",
    repository = "https://github.com/akaready",
    coffee = "https://buymeacoffee.com/akaready",
    killSwitch = null,
    feedback = null,
    scope = null
  }) {
    const iconClass = icon ? icon.startsWith("ti-") ? icon : `ti-${icon}` : "";
    const helperLines = normalizeHelperLines(helper);
    const fb = feedback ? {
      pluginName: (feedback === true ? "" : feedback.pluginName) || heading,
      pluginVersion: (feedback === true ? "" : feedback.pluginVersion) || version,
      repository: (feedback === true ? "" : feedback.repository) || repository,
      disabled: (feedback === true ? void 0 : feedback.disabled) ?? (killSwitch ? !killSwitch.on : false),
      data: feedback === true ? void 0 : feedback.data
    } : null;
    const children = [
      iconClass ? h(
        "div",
        { class: "tps-plugin-header-logo", "aria-hidden": "true" },
        h("i", { class: `ti ${iconClass} tps-plugin-header-logo-icon`, "aria-hidden": "true" })
      ) : null,
      h("h1", { class: "tps-plugin-header-title" }, heading),
      ledeText ? h("p", { class: "tps-plugin-header-lede" }, ledeText) : null,
      helperLines.length ? renderPluginHeaderHelper({
        lines: helperLines,
        defaultOpen: helperDefaultOpen,
        open: helperOpen,
        onToggle: onHelperToggle
      }) : null,
      h(
        "p",
        { class: "tps-plugin-header-attr" },
        h(
          "span",
          { class: "tps-plugin-header-link-group" },
          h("i", { class: "ti ti-link tps-plugin-header-icon", "aria-hidden": "true" }),
          h("a", {
            class: "tps-plugin-header-link tps-plugin-header-link--blue",
            href: homepage,
            target: "_blank",
            rel: "noopener noreferrer"
          }, author)
        ),
        h(
          "span",
          { class: "tps-plugin-header-link-group" },
          h("i", { class: "ti ti-coffee tps-plugin-header-icon", "aria-hidden": "true" }),
          h("a", {
            class: "tps-plugin-header-link tps-plugin-header-link--pink",
            href: coffee,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "buy me a coffee")
        ),
        version ? h(
          "span",
          { class: "tps-plugin-header-link-group" },
          h("span", { class: "tps-plugin-header-icon tps-plugin-header-iconify tps-plugin-header-iconify-github", "aria-hidden": "true" }),
          h("a", { class: "tps-plugin-header-link tps-plugin-header-link--muted tps-plugin-header-version", href: repository, target: "_blank", rel: "noopener noreferrer" }, `v${version}`)
        ) : null,
        // Bug report sits with the attribution links (right of the version);
        // the far-right corner is reserved for state toggles (scope pill,
        // kill switch).
        fb ? renderFeedbackButton(fb) : null,
        killSwitch || scope ? h(
          "span",
          { class: "tps-plugin-header-controls" },
          scope ? scopeCluster(scope) : null,
          killSwitch ? renderKillSwitch(killSwitch) : null
        ) : null
      ),
      // Always rendered with a kill switch; CSS shows it only while the pill is
      // off, so it appears instantly on the optimistic flip with no re-render.
      killSwitch ? h(
        "p",
        { class: "tps-plugin-header-off-note" },
        "Plugin is off \u2014 settings stay editable and your changes apply when you switch it back on."
      ) : null
    ];
    return h("div", { class: "tps-plugin-header" }, ...children);
  }
  __name(pluginHeader, "pluginHeader");
  var SCOPE_SVG_NS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  function scopeSvgIcon(paths) {
    const wrap = h("span", { class: "tps-scope-svg", "aria-hidden": "true" });
    wrap.innerHTML = `${SCOPE_SVG_NS}${paths}</svg>`;
    return wrap;
  }
  __name(scopeSvgIcon, "scopeSvgIcon");
  function scopeCluster(scope) {
    const pill = h(
      "span",
      {
        class: "tps-scope-pill tooltip",
        "data-diverged": String(!!scope.diverged),
        "data-tooltip": scope.diverged ? "These settings currently apply to this device only" : "Settings are synced \u2014 changes here start as this-device-only",
        "data-tooltip-dir": "top"
      },
      h("span", { class: "tps-scope-dot", "aria-hidden": "true" }),
      scope.diverged ? "This device" : "All devices"
    );
    if (!scope.diverged) {
      return h("span", { class: "tps-scope" }, pill);
    }
    const push = h("button", {
      type: "button",
      class: "tps-scope-btn tps-scope-btn--push tooltip",
      "data-tooltip": "Apply these settings to all devices",
      "data-tooltip-dir": "top",
      "aria-label": "Apply these settings to all devices",
      onClick: /* @__PURE__ */ __name((e) => {
        const btn = (
          /** @type {HTMLButtonElement} */
          e.currentTarget
        );
        if (btn.disabled) return;
        btn.disabled = true;
        try {
          scope.onPush();
        } catch {
          btn.disabled = false;
        }
      }, "onClick")
    }, scopeSvgIcon('<path d="M12 5v14"/><path d="M18 11l-6-6"/><path d="M6 11l6-6"/>'));
    let disarmTimer = 0;
    const discard = h("button", {
      type: "button",
      class: "tps-scope-btn tps-scope-btn--discard tooltip",
      "data-tooltip": "Discard device changes \u2014 revert to synced settings",
      "data-tooltip-dir": "top",
      "aria-label": "Discard device changes",
      onClick: /* @__PURE__ */ __name((e) => {
        const btn = (
          /** @type {HTMLButtonElement} */
          e.currentTarget
        );
        if (btn.getAttribute("data-armed") !== "true") {
          btn.setAttribute("data-armed", "true");
          btn.setAttribute("data-tooltip", "Tap again to discard device changes");
          clearTimeout(disarmTimer);
          disarmTimer = window.setTimeout(() => {
            btn.removeAttribute("data-armed");
            btn.setAttribute("data-tooltip", "Discard device changes \u2014 revert to synced settings");
          }, 3e3);
          return;
        }
        clearTimeout(disarmTimer);
        try {
          scope.onDiscard();
        } catch {
        }
      }, "onClick")
    }, scopeSvgIcon('<path d="M9 14L5 10l4-4"/><path d="M5 10h11a4 4 0 1 1 0 8h-1"/>'));
    return h("span", { class: "tps-scope" }, pill, push, discard);
  }
  __name(scopeCluster, "scopeCluster");
  function renderFeedbackButton(fb) {
    return h("button", {
      type: "button",
      class: "tps-plugin-header-bug",
      title: "Report a bug",
      "aria-label": "Report a bug",
      onClick: /* @__PURE__ */ __name((e) => {
        const btn = (
          /** @type {HTMLElement} */
          e.currentTarget
        );
        openFeedbackDialog({
          host: (
            /** @type {HTMLElement | null} */
            btn.closest(".tps-panel")
          ),
          opener: btn,
          ...fb
        });
      }, "onClick")
    }, h("i", { class: "ti ti-bug", "aria-hidden": "true" }));
  }
  __name(renderFeedbackButton, "renderFeedbackButton");
  function renderKillSwitch(killSwitch) {
    const sw = h("button", {
      type: "button",
      class: "tps-switch",
      role: "switch",
      "aria-checked": String(!!killSwitch.on),
      "aria-label": killSwitch.label || "Plugin enabled",
      title: killSwitch.on ? "Plugin enabled \u2014 click to disable all of its effects" : "Plugin disabled \u2014 click to re-enable"
    }, h("span", { class: "tps-switch-knob" }));
    const unlock = /* @__PURE__ */ __name(() => {
      sw.removeAttribute("data-busy");
      sw.disabled = false;
    }, "unlock");
    sw.addEventListener("click", () => {
      if (sw.disabled) return;
      const nextOn = sw.getAttribute("aria-checked") !== "true";
      sw.setAttribute("aria-checked", String(nextOn));
      sw.setAttribute("data-busy", "");
      sw.disabled = true;
      setTimeout(unlock, 700);
      try {
        killSwitch.onToggle(nextOn);
      } catch {
        unlock();
        sw.setAttribute("aria-checked", String(!nextOn));
      }
    });
    return sw;
  }
  __name(renderKillSwitch, "renderKillSwitch");
  function normalizeHelperLines(helper) {
    if (!helper) return [];
    if (typeof helper === "string") {
      const text = helper.trim();
      return text ? [text] : [];
    }
    if (Array.isArray(helper)) {
      return helper.map((line) => String(line).trim()).filter(Boolean);
    }
    return [];
  }
  __name(normalizeHelperLines, "normalizeHelperLines");
  function renderPluginHeaderHelper({ lines, defaultOpen = false, open, onToggle }) {
    const initialOpen = open == null ? !!defaultOpen : !!open;
    const wrap = h("div", {
      class: "tps-plugin-header-helper-wrap",
      dataset: { open: String(initialOpen) }
    });
    const icon = h("i", { class: "ti ti-info-circle tps-plugin-header-helper-icon", "aria-hidden": "true" });
    const toggle = h("button", {
      type: "button",
      class: "tps-plugin-header-helper-toggle",
      "aria-expanded": String(initialOpen)
    }, icon, h("span", { class: "tps-plugin-header-helper-toggle-label" }, "Instructions"));
    const body = h(
      "div",
      { class: "tps-plugin-header-helper-body" },
      h("p", { class: "tps-plugin-header-helper-line" }, lines.join(" "))
    );
    const setOpen = /* @__PURE__ */ __name((nextOpen) => {
      wrap.dataset.open = String(nextOpen);
      toggle.setAttribute("aria-expanded", String(nextOpen));
      if (onToggle) onToggle(nextOpen);
    }, "setOpen");
    toggle.addEventListener("click", () => {
      setOpen(wrap.dataset.open !== "true");
    });
    body.addEventListener("click", () => {
      if (wrap.dataset.open === "true") setOpen(false);
    });
    wrap.appendChild(toggle);
    wrap.appendChild(body);
    return wrap;
  }
  __name(renderPluginHeaderHelper, "renderPluginHeaderHelper");
  function pluginHeaderFromConfig(conf, { version, helper, helperOpen, helperDefaultOpen, onHelperToggle, killSwitch, feedback, scope } = {}) {
    const resolvedHelper = helper ?? conf.instructions;
    return pluginHeader({
      title: conf.name || "",
      lede: conf.description,
      helper: resolvedHelper,
      helperOpen,
      helperDefaultOpen,
      onHelperToggle,
      icon: conf.icon,
      version: version ?? conf.version,
      author: conf.author,
      homepage: conf.homepage,
      repository: conf.repository,
      coffee: conf.coffee,
      killSwitch,
      feedback,
      scope
    });
  }
  __name(pluginHeaderFromConfig, "pluginHeaderFromConfig");
  function section({ label, hint, collapsible, defaultOpen = true, open, onToggle, summary, body = [] }) {
    const bodyChildren = Array.isArray(body) ? body : [body];
    const bodyEl = h("div", { class: "tps-section-body" }, ...bodyChildren);
    if (!collapsible) {
      return h(
        "section",
        { class: "tps-section" },
        h("div", { class: "tps-section-label" }, label),
        hint ? h("p", { class: "tps-section-hint" }, hint) : null,
        bodyEl
      );
    }
    const initialOpen = open == null ? !!defaultOpen : !!open;
    const sectionEl = h("section", {
      class: "tps-section tps-section--collapsible",
      dataset: { open: String(initialOpen) }
    });
    const chev = h("span", { class: "tps-section-chev", "aria-hidden": "true" }, "\u25B8");
    const labelEl = h("span", { class: "tps-section-label" }, label);
    const summaryEl = h("span", { class: "tps-section-summary" });
    const paintSummary = /* @__PURE__ */ __name((isOpen) => {
      summaryEl.replaceChildren();
      if (isOpen || summary == null) return;
      const content = typeof summary === "function" ? summary() : summary;
      if (content == null || content === "") return;
      if (typeof content === "string") summaryEl.textContent = content;
      else summaryEl.appendChild(content);
    }, "paintSummary");
    const setOpen = /* @__PURE__ */ __name((nextOpen) => {
      sectionEl.dataset.open = String(nextOpen);
      header.setAttribute("aria-expanded", String(nextOpen));
      paintSummary(nextOpen);
      if (onToggle) onToggle(nextOpen);
    }, "setOpen");
    const header = h("button", {
      type: "button",
      class: "tps-section-header",
      "aria-expanded": String(initialOpen),
      onClick: /* @__PURE__ */ __name(() => setOpen(sectionEl.dataset.open !== "true"), "onClick")
    }, chev, labelEl, summaryEl);
    paintSummary(initialOpen);
    sectionEl.appendChild(header);
    if (hint) sectionEl.appendChild(h("p", { class: "tps-section-hint" }, hint));
    sectionEl.appendChild(bodyEl);
    return sectionEl;
  }
  __name(section, "section");
  function optionRow({ type = "checkbox", name, value, label, desc, checked, onChange }) {
    const input = h("input", {
      type,
      name,
      value,
      checked: !!checked,
      onChange: onChange ? (e) => onChange(e) : null
    });
    const labelEl = h("span", { class: "tps-opt-label" }, label);
    const descEl = desc ? h("span", { class: "tps-opt-desc" }, desc) : null;
    return h("label", { class: "tps-opt" }, input, labelEl, descEl);
  }
  __name(optionRow, "optionRow");

  // ../../shared/plugin-version.js
  function readPluginVersion(conf, fallback = "0.0.1") {
    if (!conf || typeof conf !== "object") return fallback;
    if (typeof conf.version === "string" && conf.version) return conf.version;
    const custom = (
      /** @type {Record<string, unknown> | undefined} */
      conf.custom
    );
    if (custom && typeof custom === "object" && typeof custom.pluginVersion === "string" && custom.pluginVersion) {
      return custom.pluginVersion;
    }
    return fallback;
  }
  __name(readPluginVersion, "readPluginVersion");
  function configWithPluginVersion(conf, customPatch, pluginVersion) {
    const base = conf && typeof conf === "object" ? conf : {};
    const custom = base.custom && typeof base.custom === "object" ? base.custom : {};
    return {
      ...base,
      version: pluginVersion,
      custom: {
        ...custom,
        ...customPatch,
        pluginVersion
      }
    };
  }
  __name(configWithPluginVersion, "configWithPluginVersion");
  async function resolveConfigApi(plugin) {
    if (!plugin) return null;
    if (typeof plugin.saveConfiguration === "function") return plugin;
    try {
      const guid = typeof plugin.getGuid === "function" ? plugin.getGuid() : null;
      const data = plugin.data;
      if (guid && data && typeof data.getPluginByGuid === "function") {
        const byGuid = data.getPluginByGuid(guid);
        if (byGuid && typeof byGuid.saveConfiguration === "function") return byGuid;
      }
      if (data && typeof data.getAllGlobalPlugins === "function") {
        const all = await data.getAllGlobalPlugins();
        const name = plugin.getConfiguration?.()?.name;
        const found = all.find((p) => p && typeof p.getGuid === "function" && p.getGuid() === guid) || (name ? all.find((p) => p && typeof p.getName === "function" && p.getName() === name) : null);
        if (found && typeof found.saveConfiguration === "function") return found;
      }
    } catch {
    }
    return null;
  }
  __name(resolveConfigApi, "resolveConfigApi");
  async function syncPluginVersionOnLoad(plugin, pluginVersion, customPatch = {}) {
    const api = await resolveConfigApi(plugin);
    if (!api) return;
    let conf = {};
    try {
      conf = api.getConfiguration?.() || plugin.getConfiguration?.() || {};
    } catch {
      return;
    }
    if (typeof conf.name !== "string" || !conf.name.trim()) return;
    const custom = conf.custom && typeof conf.custom === "object" ? { .../** @type {Record<string, unknown>} */
    conf.custom, ...customPatch } : { ...customPatch };
    if (readPluginVersion(conf, "") === pluginVersion) return;
    try {
      let ws = "default";
      try {
        ws = plugin.getWorkspaceGuid?.() || "default";
      } catch {
      }
      const guardKey = `tps-version-synced/${ws}/${conf.name}`;
      if (sessionStorage.getItem(guardKey) === pluginVersion) return;
      sessionStorage.setItem(guardKey, pluginVersion);
    } catch {
    }
    try {
      await api.saveConfiguration(configWithPluginVersion(conf, custom, pluginVersion));
    } catch {
    }
  }
  __name(syncPluginVersionOnLoad, "syncPluginVersionOnLoad");

  // ../../shared/plugin-kill-switch.js
  var MARKER_SYNC_HORIZON_MS = 9e4;
  function isPluginDisabled(conf) {
    if (!conf || typeof conf !== "object") return false;
    const custom = conf.custom;
    return !!(custom && typeof custom === "object" && /** @type {Record<string, unknown>} */
    custom.pluginDisabled === true);
  }
  __name(isPluginDisabled, "isPluginDisabled");
  function markerKey(plugin) {
    let ws = "default";
    try {
      ws = plugin.getWorkspaceGuid?.() || "default";
    } catch {
    }
    let name = "plugin";
    try {
      name = plugin.getConfiguration?.()?.name || "plugin";
    } catch {
    }
    return `tps-kill-switch/${ws}/${name}`;
  }
  __name(markerKey, "markerKey");
  function writeKillSwitchMarker(plugin, disabled) {
    try {
      localStorage.setItem(markerKey(plugin), JSON.stringify({ disabled, ts: Date.now() }));
    } catch {
    }
  }
  __name(writeKillSwitchMarker, "writeKillSwitchMarker");
  function clearKillSwitchMarker(plugin) {
    try {
      localStorage.removeItem(markerKey(plugin));
    } catch {
    }
  }
  __name(clearKillSwitchMarker, "clearKillSwitchMarker");
  function readKillSwitch(plugin) {
    let conf = {};
    try {
      conf = plugin.getConfiguration?.() || {};
    } catch {
    }
    const confDisabled = isPluginDisabled(conf);
    try {
      const raw = localStorage.getItem(markerKey(plugin));
      if (raw) {
        const marker = JSON.parse(raw);
        if (marker && typeof marker.disabled === "boolean") {
          if (marker.disabled === confDisabled) {
            clearKillSwitchMarker(plugin);
            return confDisabled;
          }
          if (Date.now() - (Number(marker.ts) || 0) < MARKER_SYNC_HORIZON_MS) {
            return marker.disabled;
          }
          clearKillSwitchMarker(plugin);
        }
      }
    } catch {
    }
    return confDisabled;
  }
  __name(readKillSwitch, "readKillSwitch");
  async function setPluginDisabled(plugin, disabled, pluginVersion, customPatch = {}) {
    const api = await resolveConfigApi(plugin);
    if (!api) return;
    let conf = {};
    try {
      conf = api.getConfiguration?.() || plugin.getConfiguration?.() || {};
    } catch {
      return;
    }
    if (typeof conf.name !== "string" || !conf.name.trim()) return;
    if (readKillSwitch(plugin) === disabled && isPluginDisabled(conf) === disabled) return;
    writeKillSwitchMarker(plugin, disabled);
    try {
      await api.saveConfiguration(configWithPluginVersion(conf, { ...customPatch, pluginDisabled: disabled }, pluginVersion));
    } catch {
      clearKillSwitchMarker(plugin);
    }
  }
  __name(setPluginDisabled, "setPluginDisabled");

  // ../../shared/plugin-settings.js
  function createSettingsStore(plugin, {
    slug,
    key = "settings",
    version,
    normalize = /* @__PURE__ */ __name((raw) => raw && typeof raw === "object" ? raw : {}, "normalize"),
    scopeKey = null,
    readSynced = null,
    pickSynced = null
  }) {
    const readSyncedBlob = readSynced || ((custom) => custom?.[key]);
    const pickSyncedSubset = pickSynced || ((s) => s);
    let current = {};
    let diverged = false;
    let pushInFlight = false;
    const workspaceGuid = /* @__PURE__ */ __name(() => {
      try {
        const guid = plugin.getWorkspaceGuid?.();
        if (guid) return guid;
      } catch {
      }
      return "default";
    }, "workspaceGuid");
    const storageKey = /* @__PURE__ */ __name(() => {
      const scope = scopeKey ? `/${scopeKey()}` : "";
      return `${slug}/${workspaceGuid()}${scope}/settings`;
    }, "storageKey");
    const readCustom = /* @__PURE__ */ __name(() => {
      try {
        const conf = plugin.getConfiguration?.();
        const custom = conf && conf.custom;
        return custom && typeof custom === "object" ? (
          /** @type {Record<string, unknown>} */
          custom
        ) : {};
      } catch {
        return {};
      }
    }, "readCustom");
    const readLocalRaw = /* @__PURE__ */ __name(() => {
      try {
        const raw = localStorage.getItem(storageKey());
        if (raw === null) return null;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch {
        return null;
      }
    }, "readLocalRaw");
    const normalizedStringify = /* @__PURE__ */ __name((raw) => JSON.stringify(normalize(raw)), "normalizedStringify");
    const store = {
      /** Read-only: never writes either store. */
      load() {
        const local = readLocalRaw();
        if (local !== null) {
          current = normalize(local);
          diverged = true;
        } else {
          current = normalize(readSyncedBlob(readCustom()) || {});
          diverged = false;
        }
        return { settings: current, diverged };
      },
      get() {
        return current;
      },
      isDiverged() {
        return diverged;
      },
      /**
       * Every edit is device-local. First edit snapshots the FULL settings
       * (inherited values of untouched keys survive). localStorage throwing
       * (private mode) leaves the edit in memory for the session — still
       * reported diverged so the pill/push UI works, and push still syncs.
       */
      update(patch) {
        current = normalize({ ...current, ...patch });
        if (normalizedStringify(readSyncedBlob(readCustom())) === JSON.stringify(current)) {
          try {
            localStorage.removeItem(storageKey());
          } catch {
          }
          diverged = false;
          return { settings: current, diverged };
        }
        diverged = true;
        try {
          localStorage.setItem(storageKey(), JSON.stringify(current));
        } catch {
        }
        return { settings: current, diverged };
      },
      /**
       * The explicit ↑ "Apply to all devices": ONE saveConfiguration (which
       * reloads the plugin), then the local blob is cleared so this device
       * goes back to following the synced config. Resolves true when the
       * settings are known to be in synced config (pushed or already equal).
       */
      async pushToAll() {
        if (pushInFlight) return false;
        pushInFlight = true;
        try {
          const api = await resolveConfigApi(plugin);
          if (!api || typeof api.saveConfiguration !== "function") return false;
          let conf = {};
          try {
            conf = api.getConfiguration?.() || plugin.getConfiguration?.() || {};
          } catch {
            return false;
          }
          if (typeof conf.name !== "string" || !conf.name.trim()) return false;
          const custom = conf.custom && typeof conf.custom === "object" ? conf.custom : {};
          const subset = pickSyncedSubset(normalize(current));
          try {
            localStorage.removeItem(storageKey());
          } catch {
          }
          diverged = false;
          try {
            if (normalizedStringify(readSyncedBlob(
              /** @type {any} */
              custom
            )) !== normalizedStringify(subset)) {
              await api.saveConfiguration(configWithPluginVersion(conf, { [key]: subset }, version));
            }
          } catch (err) {
            try {
              localStorage.setItem(storageKey(), JSON.stringify(current));
            } catch {
            }
            diverged = true;
            throw err;
          }
          return true;
        } catch {
          return false;
        } finally {
          pushInFlight = false;
        }
      },
      /** The ↺ "Discard device changes": drop local, re-adopt synced. */
      discardLocal() {
        try {
          localStorage.removeItem(storageKey());
        } catch {
        }
        current = normalize(readSyncedBlob(readCustom()) || {});
        diverged = false;
        return current;
      },
      /**
       * For folding into `setPluginDisabled(plugin, off, version, customPatch)`
       * so a kill-switch toggle carries staged device settings in the SAME
       * save (one reload, no race — CLAUDE.md rule). Call markFlushed() after
       * that save succeeds if the fold should count as a push.
       */
      pendingCustomPatch() {
        return diverged ? { [key]: pickSyncedSubset(normalize(current)) } : {};
      },
      markFlushed() {
        try {
          localStorage.removeItem(storageKey());
        } catch {
        }
        diverged = false;
      },
      /**
       * Live-follow for non-diverged devices: when another device pushes,
       * `global-plugin.updated` fires here; re-read the synced blob and, if
       * it changed semantically, hand the fresh settings to the plugin's
       * central apply (which each plugin already guards with its kill
       * switch). Returns a detach function for onUnload.
       */
      attachLifecycle({ onRemoteChange } = {}) {
        const handlerIds = [];
        try {
          const id = plugin.events?.on?.("global-plugin.updated", (event) => {
            try {
              if (diverged) return;
              if (event?.source?.isLocal) return;
              const guid = plugin.getGuid?.();
              const eventGuid = event?.pluginGuid || event?.guid || event?.rootId || null;
              if (eventGuid && guid && eventGuid !== guid) return;
              const next = normalize(readSyncedBlob(readCustom()) || {});
              if (JSON.stringify(next) === JSON.stringify(current)) return;
              current = next;
              onRemoteChange?.(current);
            } catch {
            }
          });
          if (id) handlerIds.push(id);
        } catch {
        }
        return () => {
          for (const id of handlerIds) {
            try {
              plugin.events?.off?.(id);
            } catch {
            }
          }
        };
      }
    };
    return store;
  }
  __name(createSettingsStore, "createSettingsStore");

  // plugin.js
  var PLUGIN_VERSION = "1.3.0";
  var FIELDS = Object.freeze({
    TITLE: "title",
    MEETING_URL: "meeting_url",
    JOIN_AT: "join_at",
    TRANSCRIPT: "transcript",
    SUMMARY: "summary",
    BOT_ID: "recall_bot_id",
    STATUS: "recall_status",
    LAST_ERROR: "last_error"
  });
  var ROOT_CLASS = "plg-recall-ai";
  var PANEL_TYPE = "recall-ai-settings";
  var CONFIG_KEY = "recallAi";
  var INLINE_BUTTON_CLASS = `${ROOT_CLASS}__inline-button`;
  var INLINE_APPLIED_ATTR = "data-recall-ai-inline";
  var EDITOR_SCOPE = ".editor-panel";
  var INLINE_SKIP_SELECTOR = [
    ".sidebar",
    ".tps-panel",
    ".CodeMirror",
    ".cm-editor",
    ".plugin-code-editor",
    ".listview-overlaybuttons",
    // the editor's hover-handle overlay singleton
    ".options-cell-handle",
    // table-view row handle
    ".table-view-cell"
  ].join(", ");
  var INLINE_REF_SELECTOR = ".lineitem-ref, .lineitem-ref-title, .lineitem-lineref";
  var DEFAULT_SETTINGS = Object.freeze({
    version: 1,
    recallApiKey: "",
    recallRegion: "us-east-1",
    anthropicApiKey: "",
    anthropicModel: "claude-sonnet-4-6",
    bridgeUrl: "",
    meetingUrlFieldId: "",
    transcriptFieldId: "",
    summaryFieldId: "",
    botImageUrl: "",
    botImageData: "",
    botImageName: "",
    botName: "Thymer Notetaker",
    joinChatMessage: "This meeting is being recorded and transcribed.",
    sendJoinChatMessage: true,
    pollSeconds: 30,
    autoSummarize: true,
    summaryPrompt: "Summarize this meeting transcript for a Thymer note. Include: 1) a concise overview, 2) decisions made, 3) action items with owners when mentioned, and 4) open questions. Keep the output skimmable and factual."
  });
  var SECRET_KEYS = Object.freeze(["recallApiKey", "anthropicApiKey", "botImageData", "botImageName"]);
  function normalizePrefs(raw) {
    const src = raw && typeof raw === "object" ? raw : {};
    const str = /* @__PURE__ */ __name((key) => typeof src[key] === "string" ? src[key] : DEFAULT_SETTINGS[key], "str");
    const bool = /* @__PURE__ */ __name((key) => typeof src[key] === "boolean" ? src[key] : DEFAULT_SETTINGS[key], "bool");
    return {
      version: 1,
      recallRegion: str("recallRegion"),
      anthropicModel: str("anthropicModel"),
      bridgeUrl: str("bridgeUrl"),
      meetingUrlFieldId: str("meetingUrlFieldId"),
      transcriptFieldId: str("transcriptFieldId"),
      summaryFieldId: str("summaryFieldId"),
      botImageUrl: str("botImageUrl"),
      botName: str("botName"),
      joinChatMessage: str("joinChatMessage"),
      sendJoinChatMessage: bool("sendJoinChatMessage"),
      pollSeconds: clampNumber(src.pollSeconds, 10, 300, DEFAULT_SETTINGS.pollSeconds),
      autoSummarize: bool("autoSummarize"),
      summaryPrompt: str("summaryPrompt")
    };
  }
  __name(normalizePrefs, "normalizePrefs");
  function normalizeSecrets(raw) {
    const src = raw && typeof raw === "object" ? raw : {};
    const str = /* @__PURE__ */ __name((key) => typeof src[key] === "string" ? src[key] : "", "str");
    return {
      recallApiKey: str("recallApiKey"),
      anthropicApiKey: str("anthropicApiKey"),
      botImageData: str("botImageData"),
      botImageName: str("botImageName")
    };
  }
  __name(normalizeSecrets, "normalizeSecrets");
  var RECALL_REGIONS = Object.freeze({
    "us-east-1": "https://us-east-1.recall.ai",
    "us-west-2": "https://us-west-2.recall.ai",
    "eu-central-1": "https://eu-central-1.recall.ai",
    "ap-northeast-1": "https://ap-northeast-1.recall.ai",
    payg: "https://api.recall.ai"
  });
  var CLAUDE_MODELS = Object.freeze([
    ["claude-haiku-4-5", "Claude Haiku 4.5 \u2014 fastest, lowest cost"],
    ["claude-sonnet-4-6", "Claude Sonnet 4.6 \u2014 balanced"],
    ["claude-sonnet-5", "Claude Sonnet 5 \u2014 higher quality"],
    ["claude-opus-4-8", "Claude Opus 4.8 \u2014 most capable"]
  ]);
  var DONE_STATUSES = /* @__PURE__ */ new Set(["done", "bot.done", "recording_done"]);
  var FATAL_STATUSES = /* @__PURE__ */ new Set(["fatal", "bot.fatal", "call_ended_by_host", "bot_rejected"]);
  var TELEMETRY_ENDPOINT = "https://thymer-plugins.goatcounter.com/count";
  var TELEMETRY_SCRIPT_SRC = "https://gc.zgo.at/count.js";
  var _telemetryScriptPromise = null;
  function _loadGoatCounter() {
    if (_telemetryScriptPromise) return _telemetryScriptPromise;
    _telemetryScriptPromise = new Promise((resolve) => {
      window.goatcounter = window.goatcounter || {};
      window.goatcounter.no_onload = true;
      window.goatcounter.allow_local = false;
      if (typeof window.goatcounter.count === "function") {
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.async = true;
      s.src = TELEMETRY_SCRIPT_SRC;
      s.setAttribute("data-goatcounter", TELEMETRY_ENDPOINT);
      s.setAttribute("data-goatcounter-settings", '{"no_onload": true}');
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.head.appendChild(s);
    });
    return _telemetryScriptPromise;
  }
  __name(_loadGoatCounter, "_loadGoatCounter");
  function _fireTelemetry(path) {
    _loadGoatCounter().then(() => {
      try {
        window.goatcounter?.count?.({ path, title: "", event: false });
      } catch (_) {
      }
    });
  }
  __name(_fireTelemetry, "_fireTelemetry");
  function _telemetryBlocked() {
    try {
      if (navigator.doNotTrack === "1") return true;
      if (localStorage.getItem("tps-telemetry-opt-out") === "1") return true;
    } catch (_) {
      return true;
    }
    return false;
  }
  __name(_telemetryBlocked, "_telemetryBlocked");
  function pingInstall(slug) {
    try {
      if (_telemetryBlocked()) return;
      const key = "tps-tcm-" + slug;
      if (localStorage.getItem(key) === "1") return;
      localStorage.setItem(key, "1");
      _fireTelemetry("thymer-" + slug);
    } catch (_) {
    }
  }
  __name(pingInstall, "pingInstall");
  function pingActive(slug) {
    try {
      if (_telemetryBlocked()) return;
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const key = "tps-act-" + slug;
      if (localStorage.getItem(key) === today) return;
      localStorage.setItem(key, today);
      _fireTelemetry("thymer-" + slug + "/active");
    } catch (_) {
    }
  }
  __name(pingActive, "pingActive");
  var Plugin = class extends CollectionPlugin {
    static {
      __name(this, "Plugin");
    }
    onLoad() {
      pingInstall("recall-ai");
      pingActive("recall-ai");
      syncPluginVersionOnLoad(this, PLUGIN_VERSION);
      this._disabled = readKillSwitch(this);
      this._initState();
      this._safe("load settings", () => {
        this._migrateLegacyLocalSettings();
        this._secrets = this._loadSecrets();
        this._prefs = this._settingsStore.load().settings;
        this._recomputeSettings();
      });
      this._safe("inject css", () => {
        this.ui.injectCSS(PANEL_CSS);
        this.ui.injectCSS(this._css());
      });
      this._safe("register settings panel", () => this._registerSettingsPanel());
      this._safe("attach settings lifecycle", () => this._registerSettingsLifecycle());
      this._safe("heal mounted panel", () => {
        const staleRoot = document.querySelector(".plg-recall-ai-panel");
        if (staleRoot && staleRoot.parentElement) {
          this._panelEl = staleRoot.parentElement;
          this._renderPanel();
        }
      });
      if (this._disabled) {
        this._log("loaded (kill switch off \u2014 effects skipped)");
        return;
      }
      this._safe("register nav buttons", () => this._registerNavigationButtons());
      this._safe("register status cell", () => this._registerStatusCellRenderer());
      this._safe("register events", () => this._registerEvents());
      this._safe("attach editor observer", () => this._attachEditorObserver());
      void this._safeAsync("refresh records", async () => {
        await this._refreshRecordIndex();
        await this._restorePolling();
        this._decorateInlineRefs();
      });
      this._log("loaded", { settingsLoaded: !!this._settings });
    }
    _initState() {
      this._handlerIds = [];
      this._panelEl = null;
      this._settingsPanel = null;
      this._commandItem = null;
      this._navButton = null;
      this._syncButton = null;
      this._editorObserver = null;
      this._observedRoot = null;
      this._attachRetryTimer = null;
      this._recordRefreshTimer = null;
      this._detachSettingsLifecycle = null;
      this._recordsByGuid = /* @__PURE__ */ new Map();
      this._pollers = /* @__PURE__ */ new Map();
      this._activeRecordGuid = "";
      this._settingsStore = createSettingsStore(this, {
        slug: "recall-ai",
        key: CONFIG_KEY,
        // synced blob stays at conf.custom.recallAi
        version: PLUGIN_VERSION,
        normalize: /* @__PURE__ */ __name((raw) => normalizePrefs(raw), "normalize"),
        // Per-collection scoping preserved from the legacy key shape.
        scopeKey: /* @__PURE__ */ __name(() => this.collection && this.collection.getGuid ? this.collection.getGuid() : "collection", "scopeKey")
      });
      this._prefs = normalizePrefs(null);
      this._secrets = normalizeSecrets(null);
      this._recomputeSettings();
    }
    /** Runtime + panel read ONE merged view; prefs and secrets are disjoint key sets. */
    _recomputeSettings() {
      this._settings = { ...this._prefs, ...this._secrets };
      this._draft = { ...this._settings };
    }
    _registerNavigationButtons() {
      this._navButton = this.addCollectionNavigationButton({
        label: "Transcribe",
        htmlLabel: navButtonLabel("idle"),
        icon: "microphone",
        tooltip: "Send the Recall.ai transcriber to this meeting",
        onlyWhenExpanded: false,
        onClick: /* @__PURE__ */ __name(({ record }) => {
          this._activeRecordGuid = record && record.guid || "";
          void this._startBot(record);
        }, "onClick")
      });
      this._syncButton = this.addCollectionNavigationButton({
        label: "Sync",
        icon: "refresh",
        tooltip: "Fetch transcript and summarize for this meeting",
        onlyWhenExpanded: true,
        onClick: /* @__PURE__ */ __name(({ record }) => void this._syncRecord(record, { summarize: true }), "onClick")
      });
    }
    /**
     * Renders the per-row Transcribe action inside the Recall Status cell.
     *
     * properties.render() returns a FRESH element and Thymer owns insertion, so this is
     * inherently idempotent — unlike decorating host DOM, it cannot duplicate or orphan a
     * node on re-render. It is also why the button never goes near the row drag handle.
     */
    _registerStatusCellRenderer() {
      if (!this.properties || !this.properties.render) return;
      const render = /* @__PURE__ */ __name(({ record, view }) => this._renderStatusCell(record, view), "render");
      const names = [FIELDS.STATUS];
      const field = this._fieldById(FIELDS.STATUS);
      if (field && field.label && field.label !== FIELDS.STATUS) names.push(field.label);
      for (const name of names) {
        try {
          this.properties.render(name, render);
        } catch {
        }
      }
    }
    /** @returns {HTMLElement|null} null = let Thymer render the property normally. */
    _renderStatusCell(record, view) {
      if (!record) return null;
      if (!view || String(view.type || "").toLowerCase() !== "table") return null;
      const wrap = document.createElement("span");
      wrap.className = `${ROOT_CLASS}__cell`;
      const statusText = this._text(record, FIELDS.STATUS);
      if (statusText) {
        const chip = document.createElement("span");
        chip.className = `${ROOT_CLASS}__cell-status`;
        chip.textContent = statusText;
        wrap.appendChild(chip);
      }
      const state = this._recordVisualState(record);
      if (state.kind === "idle") {
        const btn = this.ui.createButton({
          icon: "microphone",
          label: "Transcribe",
          onClick: /* @__PURE__ */ __name(() => void this._startBot(record), "onClick")
        });
        btn.classList.add(`${ROOT_CLASS}__cell-button`);
        btn.addEventListener("mousedown", (ev) => ev.stopPropagation());
        btn.addEventListener("click", (ev) => ev.stopPropagation());
        wrap.appendChild(btn);
      }
      return wrap;
    }
    _registerSettingsPanel() {
      this._commandItem = this.ui.addCommandPaletteCommand({
        label: "Plugin: Recall.ai Meetings",
        icon: "microphone",
        onSelected: /* @__PURE__ */ __name(() => this._openPanel(), "onSelected")
      });
      this.ui.registerCustomPanelType(PANEL_TYPE, (pluginPanel) => {
        try {
          pluginPanel.setTitle("Recall.ai Meetings Settings");
        } catch {
        }
        const root = pluginPanel.getElement();
        if (!root) return;
        this._settingsPanel = pluginPanel;
        this._panelEl = root;
        this._draft = { ...this._settings };
        this._renderPanel();
      });
    }
    _registerEvents() {
      const on = this.events && this.events.on ? this.events.on.bind(this.events) : null;
      if (!on) return;
      this._handlerIds.push(on("panel.navigated", () => {
        this._attachEditorObserver();
        this._updateNavButtonForActiveRecord();
      }));
      this._handlerIds.push(on("panel.focused", () => {
        this._attachEditorObserver();
        this._updateNavButtonForActiveRecord();
      }));
      this._handlerIds.push(on("record.created", () => this._scheduleRecordRefresh()));
      this._handlerIds.push(on("record.updated", () => {
        this._scheduleRecordRefresh();
        this._updateNavButtonForActiveRecord();
      }));
      this._handlerIds.push(on("record.moved", () => this._scheduleRecordRefresh()));
      this._handlerIds.push(on("reload", () => {
        this._scheduleRecordRefresh();
        this._attachEditorObserver();
      }));
    }
    onUnload() {
      for (const id of this._handlerIds || []) {
        try {
          if (this.events && this.events.off) this.events.off(id);
        } catch {
        }
      }
      this._handlerIds = [];
      if (this._commandItem) {
        this._commandItem.remove();
        this._commandItem = null;
      }
      try {
        if (this._navButton && this._navButton.remove) this._navButton.remove();
      } catch {
      }
      try {
        if (this._syncButton && this._syncButton.remove) this._syncButton.remove();
      } catch {
      }
      if (this._editorObserver) this._editorObserver.disconnect();
      this._editorObserver = null;
      this._settingsPanel = null;
      if (this._attachRetryTimer) clearTimeout(this._attachRetryTimer);
      if (this._recordRefreshTimer) clearTimeout(this._recordRefreshTimer);
      try {
        if (this._detachSettingsLifecycle) this._detachSettingsLifecycle();
      } catch {
      }
      this._detachSettingsLifecycle = null;
      for (const poller of this._pollers && this._pollers.values ? this._pollers.values() : []) clearInterval(poller.timer);
      if (this._pollers && this._pollers.clear) this._pollers.clear();
      this._safe("strip inline buttons", () => this._stripInlineButtons());
    }
    async _openPanel() {
      if (this._panelEl && document.contains(this._panelEl)) return;
      const active = this.ui.getActivePanel && this.ui.getActivePanel();
      const next = await this.ui.createPanel(active ? { afterPanel: active } : void 0);
      if (next) next.navigateToCustomType(PANEL_TYPE);
    }
    /**
     * SECRETS live only in this device's localStorage — intentionally outside
     * the settings store and outside synced config. Do not fold this key into
     * any saveConfiguration payload, ever.
     */
    _secretsStorageKey() {
      let workspace = "";
      try {
        workspace = (this.getWorkspaceGuid ? this.getWorkspaceGuid() : "") || "";
      } catch {
      }
      let collection = "";
      try {
        collection = (this.collection && this.collection.getGuid ? this.collection.getGuid() : "") || "";
      } catch {
      }
      return `recall-ai/${workspace || "default"}/${collection || "collection"}/secrets`;
    }
    _loadSecrets() {
      try {
        const raw = localStorage.getItem(this._secretsStorageKey());
        return normalizeSecrets(raw ? JSON.parse(raw) : null);
      } catch {
        return normalizeSecrets(null);
      }
    }
    _saveSecrets() {
      try {
        localStorage.setItem(this._secretsStorageKey(), JSON.stringify(this._secrets));
      } catch (err) {
        this._toast("Unable to save keys on this device", this._errorMessage(err));
      }
    }
    /**
     * One-time migration (≤1.2.0 → 1.3.0): settings used to live in a single
     * device-local blob at `recallAi/<ws>/<coll>/settings`, secrets included,
     * with nothing synced. Split it — secrets into the local-only secrets
     * entry, prefs into the shared store's device blob (so this device comes
     * up "This device"-diverged with its prior settings intact, losslessly) —
     * then delete the legacy key.
     */
    _migrateLegacyLocalSettings() {
      let workspace = "";
      try {
        workspace = (this.getWorkspaceGuid ? this.getWorkspaceGuid() : "") || "";
      } catch {
      }
      let collection = "";
      try {
        collection = (this.collection && this.collection.getGuid ? this.collection.getGuid() : "") || "";
      } catch {
      }
      const legacyKey = `${CONFIG_KEY}/${workspace || "workspace"}/${collection || "collection"}/settings`;
      let raw = null;
      try {
        raw = localStorage.getItem(legacyKey);
      } catch {
      }
      if (raw === null) return;
      let legacy = null;
      try {
        legacy = JSON.parse(raw);
      } catch {
        return;
      }
      try {
        const secrets = normalizeSecrets(legacy);
        if (Object.values(secrets).some(Boolean) && localStorage.getItem(this._secretsStorageKey()) === null) {
          localStorage.setItem(this._secretsStorageKey(), JSON.stringify(secrets));
        }
        const prefs = normalizePrefs(legacy);
        let synced = null;
        try {
          const conf = this.getConfiguration ? this.getConfiguration() : {};
          synced = conf && conf.custom ? conf.custom[CONFIG_KEY] : null;
        } catch {
        }
        const storeKey = `recall-ai/${workspace || "default"}/${collection || "collection"}/settings`;
        if (JSON.stringify(prefs) !== JSON.stringify(normalizePrefs(synced)) && localStorage.getItem(storeKey) === null) {
          localStorage.setItem(storeKey, JSON.stringify(prefs));
        }
        localStorage.removeItem(legacyKey);
      } catch {
      }
    }
    _updateSetting(key, value, { rerender = false } = {}) {
      if (SECRET_KEYS.includes(key)) {
        this._secrets = normalizeSecrets({ ...this._secrets, [key]: value });
        this._saveSecrets();
        this._recomputeSettings();
        if (rerender) this._renderPanel();
        return;
      }
      const prevPollSeconds = this._prefs.pollSeconds;
      this._prefs = this._settingsStore.update({ [key]: value }).settings;
      this._recomputeSettings();
      if (this._prefs.pollSeconds !== prevPollSeconds) this._restartPollingIntervals();
      if (rerender) this._renderPanel();
      else this._refreshScopePill();
    }
    /**
     * Live-follow for non-diverged devices. The shared store's own lifecycle
     * listens for 'global-plugin.updated', but a CollectionPlugin's config
     * lives on the collection root, whose remote saves fire 'collection.updated'
     * instead — attach both (the store's is a cheap no-op today), same adopt
     * path. Registered BEFORE the kill-switch early-return so a disabled
     * panel still tracks remote pushes.
     */
    _registerSettingsLifecycle() {
      this._detachSettingsLifecycle = this._settingsStore.attachLifecycle({
        onRemoteChange: /* @__PURE__ */ __name((prefs) => this._onRemoteSettingsChange(prefs), "onRemoteChange")
      });
      const on = this.events && this.events.on ? this.events.on.bind(this.events) : null;
      if (!on) return;
      this._handlerIds.push(on("collection.updated", (event) => {
        try {
          if (this._settingsStore.isDiverged()) return;
          if (event && event.source && event.source.isLocal) return;
          const guid = (this.collection && this.collection.getGuid ? this.collection.getGuid() : "") || (this.getGuid ? this.getGuid() : "");
          if (event && event.collectionGuid && guid && event.collectionGuid !== guid) return;
          const next = this._settingsStore.load().settings;
          if (JSON.stringify(next) === JSON.stringify(this._prefs)) return;
          this._onRemoteSettingsChange(next);
        } catch {
        }
      }));
    }
    /** Adopt remotely pushed prefs (secrets stay device-local), re-apply, re-render. */
    _onRemoteSettingsChange(prefs) {
      this._prefs = prefs;
      this._recomputeSettings();
      this._restartPollingIntervals();
      this._renderPanel();
    }
    /**
     * Scope-cluster wiring for the header pill: push = one saveConfiguration
     * (the reload's hot-reload heal re-renders the panel); discard = two-tap
     * armed in the shared cluster, then re-adopt synced values here. The pill
     * reflects synced-prefs divergence only — secrets never influence it.
     */
    _scopeArgs() {
      return {
        diverged: this._settingsStore.isDiverged(),
        onPush: /* @__PURE__ */ __name(() => {
          void this._settingsStore.pushToAll().then((ok) => {
            if (!ok) return;
            this._toast("Recall.ai Meetings", "Settings applied to all devices");
            this._refreshScopePill();
          });
        }, "onPush"),
        onDiscard: /* @__PURE__ */ __name(() => {
          this._prefs = this._settingsStore.discardLocal();
          this._recomputeSettings();
          this._restartPollingIntervals();
          this._renderPanel();
          this._toast("Recall.ai Meetings", "Reverted to synced settings");
        }, "onDiscard")
      };
    }
    /** Swap just the pill cluster — never nukes inputs mid-edit. */
    _refreshScopePill() {
      const el2 = this._panelEl && this._panelEl.querySelector ? this._panelEl.querySelector(".tps-scope") : null;
      if (el2) el2.replaceWith(scopeCluster(this._scopeArgs()));
    }
    async _startBot(record) {
      if (!record) return this._toast("Open a Meeting record first", "The Recall.ai button needs an active record in this collection.");
      if (!this._settings.recallApiKey) return this._toast("Recall API key required", "Open Plugin: Recall.ai Meetings and add a Recall API key.");
      const meetingUrl = this._meetingUrl(record);
      if (!meetingUrl) {
        this._setField(record, FIELDS.LAST_ERROR, "Missing meeting URL.");
        return this._toast("Missing meeting URL", "Add a meeting link, or choose the correct URL field in Plugin: Recall.ai Meetings.");
      }
      try {
        this._activeRecordGuid = record.guid || this._activeRecordGuid;
        this._setField(record, FIELDS.STATUS, "creating bot");
        this._updateNavButtonForRecord(record);
        this._setField(record, FIELDS.LAST_ERROR, "");
        const json = await this._createRecallBot(record, meetingUrl);
        const botId = json.botId || json.id || json.bot_id;
        if (!botId) throw new Error("Recall did not return a bot id.");
        this._setField(record, FIELDS.BOT_ID, botId);
        this._setField(record, FIELDS.STATUS, json.status || latestRecallStatus(json.recall || json) || "bot.created");
        this._log("bot created", { botId, status: json.status || latestRecallStatus(json.recall || json) || "bot.created" });
        this._updateNavButtonForRecord(record);
        this._toast("Recall.ai bot created", botId);
        this._ensurePolling(record, botId);
      } catch (err) {
        this._setField(record, FIELDS.STATUS, "error");
        this._updateNavButtonForRecord(record);
        this._setField(record, FIELDS.LAST_ERROR, this._errorMessage(err));
        this._toast("Unable to send transcriber", this._errorMessage(err));
      }
    }
    async _createRecallBot(record, meetingUrl) {
      const payload = this._createBotPayload(record, meetingUrl);
      if (this._bridgeUrl()) {
        return await this._bridgeJson("/api/recall/bots", {
          recallApiKey: this._settings.recallApiKey,
          recallRegion: this._settings.recallRegion,
          payload,
          bridgeUrl: this._bridgeUrl(),
          botImageUrl: this._settings.botImageUrl || "",
          botImageData: this._settings.botImageData || ""
        });
      }
      const response = await fetchWithBackoff(`${this._recallBaseUrl()}/api/v1/bot/`, {
        method: "POST",
        headers: this._recallHeaders(),
        body: JSON.stringify(payload)
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(recallError(json, response.status));
      return json;
    }
    _createBotPayload(record, meetingUrl) {
      const payload = {
        meeting_url: meetingUrl,
        bot_name: this._settings.botName || DEFAULT_SETTINGS.botName,
        recording_config: {
          transcript: {
            provider: {
              recallai_streaming: {
                mode: "prioritize_low_latency",
                language_code: "en"
              }
            },
            diarization: {
              use_separate_streams_when_available: true
            }
          }
        },
        metadata: {
          source: "thymer-recall-ai-plugin",
          record_guid: record.guid || "",
          collection_guid: this.collection.getGuid ? this.collection.getGuid() : "",
          workspace_guid: this.getWorkspaceGuid ? this.getWorkspaceGuid() : ""
        }
      };
      if (this._bridgeUrl()) {
        payload.recording_config.realtime_endpoints = [{
          type: "webhook",
          url: `${this._bridgeUrl()}/api/recall/realtime`,
          events: ["transcript.data", "transcript.partial_data"]
        }];
      }
      const joinAt = this._joinAtIso(record);
      if (joinAt) payload.join_at = joinAt;
      if (this._settings.sendJoinChatMessage && this._settings.joinChatMessage) {
        payload.chat = {
          on_bot_join: {
            send_to: "everyone",
            message: this._settings.joinChatMessage
          }
        };
      }
      return payload;
    }
    async _syncRecord(record, { summarize = false, quiet = false, botId: knownBotId = "" } = {}) {
      if (!record) {
        if (!quiet) this._toast("Open a Meeting record first", "Sync needs a meeting record with a Recall Bot ID.");
        return false;
      }
      const botId = knownBotId || this._text(record, FIELDS.BOT_ID);
      if (!botId) {
        this._log("sync skipped: missing bot id", { recordGuid: record.guid || "" });
        if (!quiet) this._toast("No Recall bot ID", "Send the transcriber first, or paste an existing Recall Bot ID.");
        return false;
      }
      if (!this._settings.recallApiKey) {
        if (!quiet) this._toast("Recall API key required", "Open Plugin: Recall.ai Meetings and add a Recall API key.");
        return false;
      }
      try {
        const [bot, transcript] = await Promise.all([
          this._fetchRecallJson(`/api/v1/bot/${encodeURIComponent(botId)}/`).catch(() => null),
          this._fetchRecallJson(`/api/v1/bot/${encodeURIComponent(botId)}/transcript/`)
        ]);
        const status = latestRecallStatus(bot) || this._text(record, FIELDS.STATUS) || "syncing";
        this._setField(record, FIELDS.STATUS, status);
        this._updateNavButtonForRecord(record);
        const transcriptText = formatRecallTranscript(transcript);
        this._log("sync poll", {
          botId,
          status,
          pending: !!(transcript && transcript.pending),
          live: !!(transcript && transcript.live),
          rows: transcriptRowCount(transcript),
          debug: transcript && transcript.debug || null
        });
        if (transcriptText) {
          this._setMappedField(record, FIELDS.TRANSCRIPT, transcriptText);
          this._setField(record, FIELDS.LAST_ERROR, "");
          this._log("transcript written", { botId, characters: transcriptText.length });
        } else {
          this._setField(record, FIELDS.LAST_ERROR, describeTranscriptState(transcript, bot));
        }
        const ended = !!bot && isMeetingEndedStatus(status);
        const terminal = !!bot && isTerminalStatus(status);
        const hasSummary = !!this._text(record, this._mappedFieldId(FIELDS.SUMMARY));
        if (ended && summarize && this._settings.autoSummarize && !hasSummary) {
          if (!transcriptText) {
            this._setField(record, FIELDS.STATUS, "processing transcript");
            this._updateNavButtonForRecord(record);
            return false;
          }
          await this._summarize(record, transcriptText);
        }
        if (ended && (transcriptText || !this._settings.autoSummarize || hasSummary)) {
          this._stopPolling(botId);
        }
        this._updateNavButtonForRecord(record);
        if (!quiet) this._toast("Meeting synced", status);
        return ended && (transcriptText || !this._settings.autoSummarize || hasSummary);
      } catch (err) {
        const msg = this._errorMessage(err);
        this._setField(record, FIELDS.LAST_ERROR, msg);
        this._updateNavButtonForRecord(record);
        if (!quiet) this._toast("Unable to sync meeting", msg);
        return false;
      }
    }
    async _fetchRecallJson(path) {
      if (this._bridgeUrl()) {
        const transcriptMatch = path.match(/^\/api\/v1\/bot\/([^/]+)\/transcript\/?$/);
        if (transcriptMatch) {
          return await this._bridgeJson("/api/recall/transcript", {
            recallApiKey: this._settings.recallApiKey,
            recallRegion: this._settings.recallRegion,
            botId: decodeURIComponent(transcriptMatch[1])
          });
        }
        const botMatch = path.match(/^\/api\/v1\/bot\/([^/]+)\/?$/);
        if (botMatch) {
          return await this._bridgeJson("/api/recall/bot", {
            recallApiKey: this._settings.recallApiKey,
            recallRegion: this._settings.recallRegion,
            botId: decodeURIComponent(botMatch[1])
          });
        }
        throw new Error(`Unsupported Recall bridge path: ${path}`);
      }
      const response = await fetchWithBackoff(`${this._recallBaseUrl()}${path}`, {
        method: "GET",
        headers: this._recallHeaders(false)
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(recallError(json, response.status));
      return json;
    }
    async _summarize(record, transcriptText) {
      if (!this._settings.anthropicApiKey) {
        this._setField(record, FIELDS.LAST_ERROR, "Anthropic API key is missing; transcript fetched but summary was skipped.");
        return;
      }
      try {
        this._setField(record, FIELDS.STATUS, "summarizing");
        this._updateNavButtonForRecord(record);
        this._log("summary start", { characters: transcriptText.length });
        const summary = await this._createSummary(transcriptText);
        if (!summary) throw new Error("Claude returned an empty summary.");
        this._setMappedField(record, FIELDS.SUMMARY, summary);
        this._setField(record, FIELDS.STATUS, "summarized");
        this._updateNavButtonForRecord(record);
        this._log("summary written", { characters: summary.length });
      } catch (err) {
        this._setField(record, FIELDS.LAST_ERROR, `Summary failed: ${this._errorMessage(err)}`);
        this._setField(record, FIELDS.STATUS, "summary_failed");
        this._updateNavButtonForRecord(record);
        this._log("summary failed", { error: this._errorMessage(err) });
      }
    }
    async _createSummary(transcriptText) {
      const prompt = this._settings.summaryPrompt || DEFAULT_SETTINGS.summaryPrompt;
      if (this._bridgeUrl()) {
        const json2 = await this._bridgeJson("/api/anthropic/summary", {
          anthropicApiKey: this._settings.anthropicApiKey,
          anthropicModel: this._settings.anthropicModel || DEFAULT_SETTINGS.anthropicModel,
          summaryPrompt: prompt,
          transcriptText
        });
        return json2.summary || "";
      }
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": this._settings.anthropicApiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: this._settings.anthropicModel || DEFAULT_SETTINGS.anthropicModel,
          max_tokens: 1400,
          messages: [{
            role: "user",
            content: `${prompt}

Transcript:
${transcriptText}`
          }]
        })
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(anthropicError(json, response.status));
      return Array.isArray(json.content) ? json.content.map((part) => part && part.type === "text" ? part.text : "").join("\n").trim() : "";
    }
    _ensurePolling(record, botId) {
      if (!this._pollers) this._pollers = /* @__PURE__ */ new Map();
      if (!record || !botId || this._pollers.has(botId)) return;
      let tickCount = 0;
      const tick = /* @__PURE__ */ __name(() => {
        tickCount += 1;
        this._log("poll tick", { botId, tick: tickCount, pollSeconds: this._settings.pollSeconds });
        void this._syncRecord(record, { summarize: true, quiet: true, botId }).then((done) => {
          if (done) {
            this._log("poll complete", { botId, tick: tickCount });
            this._stopPolling(botId);
          }
        }).catch((err) => {
          this._log("poll failed", { botId, tick: tickCount, error: this._errorMessage(err) });
        });
      }, "tick");
      const timer = setInterval(tick, this._settings.pollSeconds * 1e3);
      this._pollers.set(botId, { recordGuid: record.guid, timer });
      this._log("polling started", { botId, pollSeconds: this._settings.pollSeconds });
      setTimeout(tick, 1e3);
    }
    _stopPolling(botId) {
      if (!this._pollers) return;
      const poller = this._pollers.get(botId);
      if (!poller) return;
      clearInterval(poller.timer);
      this._pollers.delete(botId);
    }
    _updateNavButtonForActiveRecord() {
      const panel2 = this.ui.getActivePanel && this.ui.getActivePanel();
      const record = panel2 && panel2.getActiveRecord ? panel2.getActiveRecord() : null;
      if (record && record.guid) this._activeRecordGuid = record.guid;
      this._updateNavButtonForRecord(record);
    }
    _updateNavButtonForRecord(record) {
      if (!this._navButton) return;
      const target = record || this._activeRecordGuid && this._recordsByGuid.get(this._activeRecordGuid) || null;
      const state = this._recordVisualState(target);
      try {
        this._navButton.setIcon(state.icon);
      } catch {
      }
      try {
        this._navButton.setHtmlLabel(navButtonLabel(state.kind));
      } catch {
        try {
          this._navButton.setLabel(state.label);
        } catch {
        }
      }
      try {
        this._navButton.setTooltip(state.tooltip);
      } catch {
      }
    }
    _recordVisualState(record) {
      if (!record) return {
        kind: "idle",
        icon: "microphone",
        label: "Transcribe",
        tooltip: "Send the Recall.ai transcriber to this meeting"
      };
      const status = this._text(record, FIELDS.STATUS).toLowerCase();
      const botId = this._text(record, FIELDS.BOT_ID);
      if (status === "summarizing") return {
        kind: "summarizing",
        icon: "loader-2",
        label: "Summarizing",
        tooltip: "Generating the meeting summary"
      };
      if (status === "processing transcript") return {
        kind: "processing",
        icon: "loader-2",
        label: "Processing",
        tooltip: "Waiting for Recall.ai to finish the transcript"
      };
      if (botId && !isTerminalStatus(status) && status !== "error") return {
        kind: "recording",
        icon: "circle-dot",
        label: "Recording",
        tooltip: "Recall.ai bot is in or joining this meeting"
      };
      return {
        kind: "idle",
        icon: "microphone",
        label: "Transcribe",
        tooltip: "Send the Recall.ai transcriber to this meeting"
      };
    }
    async _restorePolling() {
      const records = this._recordsByGuid && this._recordsByGuid.values ? this._recordsByGuid.values() : [];
      for (const record of records) {
        const botId = this._text(record, FIELDS.BOT_ID);
        const status = this._text(record, FIELDS.STATUS);
        if (botId && !isTerminalStatus(status)) this._ensurePolling(record, botId);
      }
    }
    _restartPollingIntervals() {
      if (this._disabled) return;
      const existing = this._pollers && this._pollers.keys ? Array.from(this._pollers.keys()) : [];
      for (const botId of existing) this._stopPolling(botId);
      void this._restorePolling();
    }
    _recallHeaders(includeContentType = true) {
      const headers = { Authorization: `Token ${this._settings.recallApiKey}` };
      if (includeContentType) headers["Content-Type"] = "application/json";
      return headers;
    }
    _recallBaseUrl() {
      return RECALL_REGIONS[this._settings.recallRegion] || RECALL_REGIONS["us-east-1"];
    }
    _bridgeUrl() {
      return String(this._settings.bridgeUrl || "").trim().replace(/\/+$/, "");
    }
    async _bridgeJson(path, body) {
      const base = this._bridgeUrl();
      if (!base) throw new Error("Bridge URL is not configured.");
      const response = await fetchWithBackoff(`${base}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body || {})
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(formatBridgeError(json, response.status));
      return json;
    }
    _collectionFields() {
      const conf = this.getConfiguration ? this.getConfiguration() : {};
      return Array.isArray(conf.fields) ? conf.fields.filter((field) => field && field.active !== false) : [];
    }
    _fieldById(id) {
      if (!id) return null;
      return this._collectionFields().find((field) => String(field.id) === String(id)) || null;
    }
    _mappingSettingFor(field) {
      if (field === FIELDS.MEETING_URL) return "meetingUrlFieldId";
      if (field === FIELDS.TRANSCRIPT) return "transcriptFieldId";
      if (field === FIELDS.SUMMARY) return "summaryFieldId";
      return "";
    }
    _mappedFieldId(field) {
      const setting = this._mappingSettingFor(field);
      const mapped = setting ? String(this._settings[setting] || "").trim() : "";
      return mapped || field;
    }
    _meetingUrlFieldIds() {
      const fields = this._collectionFields();
      const selected = String(this._settings.meetingUrlFieldId || "").trim();
      const ids = [];
      const add = /* @__PURE__ */ __name((id) => {
        if (id && !ids.includes(id)) ids.push(id);
      }, "add");
      add(selected);
      add(FIELDS.MEETING_URL);
      const normalizedMatches = /* @__PURE__ */ __name((field) => {
        const haystack = `${field.id || ""} ${field.label || ""}`.toLowerCase();
        return haystack.includes("meeting") && (haystack.includes("url") || haystack.includes("link"));
      }, "normalizedMatches");
      for (const field of fields) {
        if (String(field.type || "").toLowerCase() === "url" && normalizedMatches(field)) add(field.id);
      }
      for (const field of fields) {
        if (normalizedMatches(field)) add(field.id);
      }
      for (const field of fields) {
        if (String(field.type || "").toLowerCase() === "url") add(field.id);
      }
      return ids;
    }
    _meetingUrl(record) {
      for (const fieldId of this._meetingUrlFieldIds()) {
        const value = this._text(record, fieldId);
        if (value) return value;
      }
      try {
        const props = record.getAllProperties ? record.getAllProperties() : [];
        for (const prop of props) {
          const value = this._propertyText(prop);
          if (/^https?:\/\//i.test(value)) return value;
        }
      } catch {
      }
      return "";
    }
    _scheduleRecordRefresh() {
      if (this._recordRefreshTimer) clearTimeout(this._recordRefreshTimer);
      this._recordRefreshTimer = setTimeout(() => {
        this._recordRefreshTimer = null;
        void this._refreshRecordIndex().then(() => this._decorateInlineRefs());
      }, 300);
    }
    async _refreshRecordIndex() {
      try {
        const records = await this.collection.getAllRecords();
        this._recordsByGuid = /* @__PURE__ */ new Map();
        for (const record of records) {
          if (record && record.guid) this._recordsByGuid.set(record.guid, record);
        }
      } catch (err) {
        this._toast("Unable to load meeting records", this._errorMessage(err));
      }
    }
    _joinAtIso(record) {
      const prop = record.prop(FIELDS.JOIN_AT);
      if (!prop) return null;
      try {
        const dt = prop.datetime && prop.datetime();
        if (dt && dt.toDate) return dt.toDate().toISOString();
        const date2 = prop.date && prop.date();
        if (date2 instanceof Date) return date2.toISOString();
      } catch {
      }
      const raw = prop.text && prop.text();
      if (!raw) return null;
      const date = new Date(raw);
      return Number.isNaN(date.getTime()) ? raw : date.toISOString();
    }
    _text(record, field) {
      try {
        const prop = this._prop(record, field);
        if (!prop) return "";
        return this._propertyText(prop);
      } catch {
        return "";
      }
    }
    _setField(record, field, value) {
      try {
        const prop = this._prop(record, field);
        if (prop) prop.set(value == null ? "" : value);
      } catch (err) {
        this._toast("Unable to update meeting record", `${field}: ${this._errorMessage(err)}`);
      }
    }
    _setMappedField(record, field, value) {
      return this._setField(record, this._mappedFieldId(field), value);
    }
    _prop(record, fieldIdOrLabel) {
      if (!record || !fieldIdOrLabel) return null;
      let prop = null;
      try {
        prop = record.prop(fieldIdOrLabel);
      } catch {
      }
      if (prop) return prop;
      const field = this._fieldById(fieldIdOrLabel);
      if (field && field.label) {
        try {
          prop = record.prop(field.label);
        } catch {
        }
        if (prop) return prop;
      }
      if (field && field.id) {
        try {
          prop = record.prop(field.id);
        } catch {
        }
        if (prop) return prop;
      }
      return null;
    }
    _propertyText(prop) {
      if (!prop) return "";
      try {
        const value = prop.text ? prop.text() : null;
        if (value != null && String(value).trim()) return String(value).trim();
      } catch {
      }
      try {
        const values = prop.values ? prop.values() : [];
        for (const value of values) {
          const text = propertyValueToText(value);
          if (text) return text;
        }
      } catch {
      }
      try {
        const texts = prop.texts ? prop.texts() : [];
        for (const text of texts) {
          if (text != null && String(text).trim()) return String(text).trim();
        }
      } catch {
      }
      return "";
    }
    _attachEditorObserver() {
      if (this._attachRetryTimer) {
        clearTimeout(this._attachRetryTimer);
        this._attachRetryTimer = null;
      }
      const panel2 = this.ui.getActivePanel && this.ui.getActivePanel();
      const root = panel2 && panel2.getElement ? panel2.getElement() : null;
      if (!root) {
        this._attachRetryTimer = setTimeout(() => this._attachEditorObserver(), 500);
        return;
      }
      if (this._observedRoot === root && this._editorObserver) {
        this._decorateInlineRefs(root);
        return;
      }
      if (this._editorObserver) this._editorObserver.disconnect();
      this._observedRoot = root;
      this._editorObserver = new MutationObserver((mutations) => {
        if (mutations.some((m) => m.type === "childList" || m.attributeName === "data-guid" || m.attributeName === "class")) {
          this._decorateInlineRefs(root);
        }
      });
      this._editorObserver.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-guid", "class"]
      });
      this._decorateInlineRefs(root);
    }
    /**
     * Structural guids are not real inline references: journal date-group headers
     * ("nest-...") and the open page's own title node both carry a data-guid.
     */
    _isStructuralGuid(guid) {
      if (!guid) return true;
      if (guid.startsWith("nest-")) return true;
      if (this._activeRecordGuid && guid === this._activeRecordGuid) return true;
      return false;
    }
    _decorateInlineRefs(root = this._observedRoot || document.body) {
      if (!root || !this._recordsByGuid.size) return;
      const leaves = root.querySelectorAll("span[data-guid]");
      for (const leaf of leaves) {
        if (!(leaf instanceof HTMLElement)) continue;
        if (!leaf.closest(EDITOR_SCOPE)) continue;
        if (leaf.closest(INLINE_SKIP_SELECTOR)) continue;
        if (leaf.querySelector("[data-guid]")) continue;
        const guid = leaf.getAttribute("data-guid");
        if (!guid || !this._recordsByGuid.has(guid)) continue;
        if (this._isStructuralGuid(guid)) continue;
        const anchor = leaf.closest(INLINE_REF_SELECTOR) || leaf;
        const next = anchor.nextElementSibling;
        if (next && next.classList && next.classList.contains(INLINE_BUTTON_CLASS) && next.getAttribute("data-guid") === guid) {
          anchor.setAttribute(INLINE_APPLIED_ATTR, guid);
          continue;
        }
        const record = this._recordsByGuid.get(guid);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = INLINE_BUTTON_CLASS;
        btn.contentEditable = "false";
        btn.setAttribute("data-guid", guid);
        btn.title = `Send Recall.ai transcriber${record ? ` to ${this._recordTitle(record)}` : ""}`;
        btn.setAttribute("aria-label", "Send Recall.ai transcriber");
        btn.innerHTML = '<i class="ti ti-microphone" aria-hidden="true"></i>';
        btn.addEventListener("mousedown", (ev) => ev.preventDefault());
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          void this._startBot(this._recordsByGuid.get(guid));
        });
        anchor.insertAdjacentElement("afterend", btn);
        anchor.setAttribute(INLINE_APPLIED_ATTR, guid);
      }
    }
    _recordTitle(record) {
      return this._text(record, FIELDS.TITLE) || "this meeting";
    }
    _stripInlineButtons() {
      document.querySelectorAll(`.${INLINE_BUTTON_CLASS}`).forEach((el2) => el2.remove());
      document.querySelectorAll(`[${INLINE_APPLIED_ATTR}]`).forEach((el2) => el2.removeAttribute(INLINE_APPLIED_ATTR));
    }
    _renderPanel() {
      if (!this._panelEl) return;
      const draft = this._draft;
      this._panelEl.replaceChildren(panel({ pluginClass: `${ROOT_CLASS}-panel` }, [
        pluginHeaderFromConfig(this.getConfiguration(), {
          version: PLUGIN_VERSION,
          scope: this._scopeArgs(),
          killSwitch: {
            on: !this._disabled,
            onToggle: /* @__PURE__ */ __name((nextOn) => {
              void setPluginDisabled(this, !nextOn, PLUGIN_VERSION);
            }, "onToggle")
          },
          feedback: { data: this.data }
        }),
        section({
          label: "Setup",
          collapsible: true,
          defaultOpen: !this._isConfigured(),
          body: [this._setupSteps()]
        }),
        section({
          label: "Connection",
          hint: "Your two keys and your bridge address. New here? Do Setup above first.",
          body: [
            this._textInput("Bridge URL", "bridgeUrl", "https://your-bridge.example.com", false, "The web address of your bridge, from step 3 above."),
            this._bridgeLink(),
            this._textInput("Recall API key", "recallApiKey", "Token from Recall", true),
            this._textInput("Anthropic API key", "anthropicApiKey", "Claude API key for summaries", true)
          ]
        }),
        section({
          label: "Field Mapping",
          hint: "Choose the properties Recall reads and writes. Leave on auto-detect for the default plugin fields.",
          body: [
            this._fieldSelectInput("Meeting URL field", "meetingUrlFieldId", ["url", "text"]),
            this._fieldSelectInput("Transcript field", "transcriptFieldId", ["text"]),
            this._fieldSelectInput("Summary field", "summaryFieldId", ["text"])
          ]
        }),
        section({
          label: "Recall",
          body: [
            this._selectInput("Region", "recallRegion", [
              ["us-east-1", "US East 1"],
              ["us-west-2", "US West 2"],
              ["eu-central-1", "EU Central 1"],
              ["ap-northeast-1", "Japan"],
              ["payg", "Pay-as-you-go"]
            ]),
            this._textInput("Bot name", "botName", "Thymer Notetaker"),
            this._fileInput("Bot image JPEG upload", "botImageData", "botImageName"),
            this._textInput("Bot image JPEG URL", "botImageUrl", "https://example.com/notetaker.jpg"),
            this._numberInput("Poll every seconds", "pollSeconds", 10, 300),
            optionRow({
              type: "checkbox",
              name: "sendJoinChatMessage",
              label: "Send join chat message",
              desc: "Notify participants when the bot joins, when supported by the meeting platform.",
              checked: !!draft.sendJoinChatMessage,
              onChange: /* @__PURE__ */ __name((event) => this._updateSetting("sendJoinChatMessage", !!event.target.checked, { rerender: true }), "onChange")
            }),
            this._textareaInput("Join chat message", "joinChatMessage", 3)
          ]
        }),
        section({
          label: "Summary",
          body: [
            this._modelSelectInput("Claude model", "anthropicModel"),
            optionRow({
              type: "checkbox",
              name: "autoSummarize",
              label: "Auto summarize after meeting is done",
              desc: "When polling sees a terminal bot status, fetch the final transcript and summarize it.",
              checked: !!draft.autoSummarize,
              onChange: /* @__PURE__ */ __name((event) => this._updateSetting("autoSummarize", !!event.target.checked, { rerender: true }), "onChange")
            }),
            this._textareaInput("Summary prompt", "summaryPrompt", 8)
          ]
        })
      ]));
    }
    _bridgeWorkerUrl() {
      const conf = this.getConfiguration ? this.getConfiguration() : {};
      const repo = String(conf && conf.repository || "https://github.com/akaready/thymer-recall-ai").replace(/\/+$/, "");
      return `${repo}/tree/main/backend`;
    }
    _bridgeLink() {
      return h(
        "div",
        { class: `${ROOT_CLASS}-field` },
        h(
          "span",
          { class: `${ROOT_CLASS}-field-hint` },
          "Get the worker: ",
          h("a", {
            href: this._bridgeWorkerUrl(),
            target: "_blank",
            rel: "noopener noreferrer"
          }, "backend/bridge-worker.js + deploy guide on GitHub \u2192")
        )
      );
    }
    /** Recall API keys are issued per region, so the link has to follow the Region setting. */
    _recallKeyUrl() {
      const region = String(this._draft.recallRegion || DEFAULT_SETTINGS.recallRegion).trim();
      const dashboard = region === "payg" || !region ? "us-west-2" : region;
      return `https://${dashboard}.recall.ai/dashboard/developers/api-keys`;
    }
    /** Once all three are filled in, the Setup section starts collapsed. */
    _isConfigured() {
      const s = this._draft || this._settings || {};
      return !!(String(s.recallApiKey || "").trim() && String(s.anthropicApiKey || "").trim() && String(s.bridgeUrl || "").trim());
    }
    _setupSteps() {
      const link = /* @__PURE__ */ __name((href, text) => h("a", { href, target: "_blank", rel: "noopener noreferrer" }, text), "link");
      return h(
        "ol",
        { class: `${ROOT_CLASS}-steps` },
        h(
          "li",
          {},
          "Get a Recall key from your ",
          link(this._recallKeyUrl(), "Recall dashboard"),
          ". Keys belong to one region, so it has to match the Region you choose below."
        ),
        h(
          "li",
          {},
          "Get a Claude key from the ",
          link("https://console.anthropic.com/settings/keys", "Anthropic console"),
          ". This is what writes the summary."
        ),
        h(
          "li",
          {},
          "Put the bridge online \u2014 it is free, takes about two minutes, and needs no terminal. ",
          link(this._bridgeWorkerUrl(), "Follow the bridge guide"),
          ". Thymer runs inside your browser, and browsers are not allowed to call Recall or Claude directly. The bridge is a tiny helper that passes those requests along for you."
        ),
        h("li", {}, "Paste the bridge address and both keys into Connection, just below."),
        h(
          "li",
          {},
          "Add a meeting link to a Meeting record and click Transcribe. The bot joins, the transcript arrives as people talk, and the summary is written once the meeting ends."
        )
      );
    }
    _textInput(label, key, placeholder = "", password = false, hint = "") {
      return h(
        "label",
        { class: `${ROOT_CLASS}-field` },
        h("span", { class: `${ROOT_CLASS}-field-label` }, label),
        h("input", {
          type: password ? "password" : "text",
          value: this._draft[key] || "",
          placeholder,
          onInput: /* @__PURE__ */ __name((event) => this._updateSetting(key, event.target.value), "onInput")
        }),
        hint ? h("span", { class: `${ROOT_CLASS}-field-hint` }, hint) : null
      );
    }
    _fileInput(label, dataKey, nameKey) {
      const filename = this._draft[nameKey] || "";
      return h(
        "label",
        { class: `${ROOT_CLASS}-field` },
        h("span", { class: `${ROOT_CLASS}-field-label` }, label),
        h("input", {
          type: "file",
          accept: "image/jpeg,image/jpg",
          onChange: /* @__PURE__ */ __name((event) => void this._setBotImageFile(event.target.files && event.target.files[0], dataKey, nameKey), "onChange")
        }),
        filename ? h("span", { class: `${ROOT_CLASS}-field-hint` }, `Using ${filename}`) : null
      );
    }
    async _setBotImageFile(file, dataKey, nameKey) {
      if (!file) return;
      if (!/jpe?g/i.test(file.type || file.name || "")) {
        this._toast("JPEG required", "Choose a .jpg or .jpeg file for the bot image.");
        return;
      }
      if (file.size > 13e5) {
        this._toast("Image too large", "Choose a JPEG under 1.3MB.");
        return;
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      const b64 = bytesToBase64(bytes);
      this._updateSetting(dataKey, b64);
      this._updateSetting(nameKey, file.name || "bot-image.jpg", { rerender: true });
    }
    _numberInput(label, key, min, max) {
      const current = /* @__PURE__ */ __name(() => Number(this._draft[key] || DEFAULT_SETTINGS[key]), "current");
      const clamp = /* @__PURE__ */ __name((value) => Math.max(min, Math.min(max, Math.round(Number.isFinite(value) ? value : current()))), "clamp");
      const apply = /* @__PURE__ */ __name((input, value) => {
        const next = clamp(value);
        input.value = String(next);
        this._updateSetting(key, next);
      }, "apply");
      return h(
        "label",
        { class: `${ROOT_CLASS}-field` },
        h("span", { class: `${ROOT_CLASS}-field-label` }, label),
        h("input", {
          type: "number",
          min,
          max,
          step: 1,
          value: current(),
          onInput: /* @__PURE__ */ __name((event) => this._updateSetting(key, Number(event.target.value)), "onInput"),
          onKeyDown: /* @__PURE__ */ __name((event) => {
            if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
            event.preventDefault();
            const input = event.target;
            const base = Number.isFinite(Number(input.value)) ? Number(input.value) : current();
            apply(input, base + (event.key === "ArrowUp" ? 1 : -1) * (event.shiftKey ? 10 : 1));
          }, "onKeyDown")
        })
      );
    }
    _selectInput(label, key, options) {
      return h(
        "label",
        { class: `${ROOT_CLASS}-field` },
        h("span", { class: `${ROOT_CLASS}-field-label` }, label),
        h("select", {
          value: this._draft[key] || DEFAULT_SETTINGS[key],
          onChange: /* @__PURE__ */ __name((event) => this._updateSetting(key, event.target.value, { rerender: true }), "onChange")
        }, ...options.map(([value, label2]) => h("option", { value, selected: (this._draft[key] || DEFAULT_SETTINGS[key]) === value }, label2)))
      );
    }
    _modelSelectInput(label, key) {
      const options = CLAUDE_MODELS.map(([value, text]) => [value, text]);
      const current = String(this._draft[key] || DEFAULT_SETTINGS.anthropicModel).trim();
      if (current && !options.some(([value]) => value === current)) {
        options.push([current, `${current} (current)`]);
      }
      return this._selectInput(label, key, options);
    }
    _fieldSelectInput(label, key, types) {
      const allowed = new Set((types || []).map((type) => String(type).toLowerCase()));
      const fields = this._collectionFields().filter((field) => !allowed.size || allowed.has(String(field.type || "").toLowerCase()));
      const options = [["", "Auto-detect"]];
      for (const field of fields) {
        options.push([field.id, `${field.label || field.id} (${field.id})`]);
      }
      const current = this._draft[key] || "";
      if (current && !options.some(([value]) => value === current)) options.push([current, current]);
      return this._selectInput(label, key, options);
    }
    _textareaInput(label, key, rows = 4) {
      return h(
        "label",
        { class: `${ROOT_CLASS}-field` },
        h("span", { class: `${ROOT_CLASS}-field-label` }, label),
        h("textarea", {
          rows,
          value: this._draft[key] || "",
          onInput: /* @__PURE__ */ __name((event) => this._updateSetting(key, event.target.value), "onInput")
        })
      );
    }
    _toast(title, message) {
      try {
        this.ui.addToaster({ title, message, dismissible: true, autoDestroyTime: 5e3 });
      } catch {
      }
    }
    _log(message, data = {}) {
      try {
        console.info(`[Recall.ai Meetings] ${message}`, data);
      } catch {
      }
    }
    _safe(label, fn) {
      try {
        return fn();
      } catch (err) {
        this._log(`load step failed: ${label}`, { error: this._errorMessage(err) });
        return null;
      }
    }
    async _safeAsync(label, fn) {
      try {
        return await fn();
      } catch (err) {
        this._log(`load step failed: ${label}`, { error: this._errorMessage(err) });
        return null;
      }
    }
    _errorMessage(err) {
      const message = err && err.message ? err.message : String(err);
      if (/failed to fetch/i.test(message) && !this._bridgeUrl()) {
        return "Browser request was blocked before reaching Recall. Add the hosted Bridge URL in Plugin: Recall.ai Meetings.";
      }
      return message;
    }
    _css() {
      return `
			.${ROOT_CLASS}__inline-button {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 18px;
				height: 18px;
				margin-inline-start: 4px;
				margin-inline-end: 1px;
				padding: 0;
				border: 1px solid var(--tps-divider, color-mix(in srgb, currentColor 18%, transparent));
				border-radius: 4px;
				background: var(--tps-bg-hover, color-mix(in srgb, currentColor 8%, transparent));
				color: var(--text-muted, currentColor);
				font: inherit;
				font-size: 12px;
				line-height: 1;
				vertical-align: -2px;
				cursor: pointer;
				user-select: none;
			}
			.${ROOT_CLASS}__inline-button:hover {
				border-color: var(--tps-accent, currentColor);
				color: var(--tps-accent, currentColor);
			}
			.${ROOT_CLASS}__cell {
				display: inline-flex;
				align-items: center;
				gap: 8px;
				min-width: 0;
			}
			.${ROOT_CLASS}__cell-status {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: var(--text-muted, currentColor);
			}
			.${ROOT_CLASS}__cell-button {
				flex: none;
			}
			.${ROOT_CLASS}__nav-label {
				display: inline-flex;
				align-items: center;
				gap: 6px;
			}
			.${ROOT_CLASS}__nav-dot {
				width: 7px;
				height: 7px;
				border-radius: 999px;
				background: var(--tps-danger);
				box-shadow: 0 0 0 0 color-mix(in srgb, var(--tps-danger) 62%, transparent);
				animation: ${ROOT_CLASS}-recording-pulse 1.15s ease-in-out infinite;
			}
			.${ROOT_CLASS}__nav-spinner {
				width: 12px;
				height: 12px;
				border: 2px solid currentColor;
				border-right-color: transparent;
				border-radius: 999px;
				animation: ${ROOT_CLASS}-spin 0.85s linear infinite;
			}
			@keyframes ${ROOT_CLASS}-recording-pulse {
				0% { opacity: 1; box-shadow: 0 0 0 0 color-mix(in srgb, var(--tps-danger) 52%, transparent); }
				70% { opacity: 0.42; box-shadow: 0 0 0 6px color-mix(in srgb, var(--tps-danger) 0%, transparent); }
				100% { opacity: 1; box-shadow: 0 0 0 0 color-mix(in srgb, var(--tps-danger) 0%, transparent); }
			}
			@keyframes ${ROOT_CLASS}-spin {
				to { transform: rotate(360deg); }
			}
			.${ROOT_CLASS}-panel .${ROOT_CLASS}-field {
				display: grid;
				gap: 6px;
			}
			.${ROOT_CLASS}-panel .${ROOT_CLASS}-field-label {
				color: var(--tps-text);
				font-size: var(--tps-fs-label);
				font-weight: var(--tps-fw-medium);
			}
			.${ROOT_CLASS}-panel .${ROOT_CLASS}-field-hint {
				color: var(--tps-text-muted);
				font-size: var(--tps-fs-hint);
			}
			.${ROOT_CLASS}-panel .${ROOT_CLASS}-field-hint a {
				color: var(--tps-accent);
				text-decoration: underline;
				text-underline-offset: 2px;
			}
			.${ROOT_CLASS}-panel .${ROOT_CLASS}-steps {
				margin: 0;
				padding-left: 20px;
				display: grid;
				gap: 10px;
				color: var(--tps-text-muted);
				font-size: var(--tps-fs-hint);
				line-height: 1.5;
			}
			.${ROOT_CLASS}-panel .${ROOT_CLASS}-steps li::marker {
				color: var(--tps-text);
				font-weight: var(--tps-fw-medium);
			}
			.${ROOT_CLASS}-panel .${ROOT_CLASS}-steps a {
				color: var(--tps-accent);
				text-decoration: underline;
				text-underline-offset: 2px;
			}
			.${ROOT_CLASS}-panel input,
			.${ROOT_CLASS}-panel textarea,
			.${ROOT_CLASS}-panel select {
				width: 100%;
				border: 1px solid var(--tps-divider);
				border-radius: var(--tps-radius-sm);
				background: var(--tps-bg-input);
				color: var(--tps-text);
				font: inherit;
				font-size: var(--tps-fs-body);
				padding: 8px 10px;
			}
			.${ROOT_CLASS}-panel textarea {
				resize: vertical;
				min-height: 76px;
				line-height: 1.4;
			}
			.${ROOT_CLASS}-panel input:focus,
			.${ROOT_CLASS}-panel textarea:focus,
			.${ROOT_CLASS}-panel select:focus {
				outline: none;
				border-color: var(--tps-accent);
			}
		`;
    }
  };
  async function fetchWithBackoff(url, options, maxAttempts = 5) {
    let lastResponse = null;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await fetch(url, options);
      lastResponse = response;
      if (![429, 503, 507].includes(response.status)) return response;
      const retryAfter = Number(response.headers && response.headers.get ? response.headers.get("retry-after") : 0);
      const delayMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1e3 : Math.min(8e3, 500 * 2 ** attempt);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return lastResponse;
  }
  __name(fetchWithBackoff, "fetchWithBackoff");
  function formatRecallTranscript(raw) {
    const rows = Array.isArray(raw) ? raw : Array.isArray(raw && raw.results) ? raw.results : Array.isArray(raw && raw.transcript) ? raw.transcript : [];
    const lines = [];
    for (const row of rows) {
      const nested = row && row.data && row.data.words ? row.data : row;
      const speaker = row.speaker || row.speaker_name || row.participant && row.participant.name || nested && nested.participant && nested.participant.name || "Speaker";
      const words = Array.isArray(row.words) ? row.words : Array.isArray(nested && nested.words) ? nested.words : [];
      const text = row.text || row.transcript || row.sentence || row.phrase || words.map((w) => w.text || w.word || "").join(" ") || "";
      if (!String(text).trim()) continue;
      const firstWord = words[0] || {};
      const start = firstNumber(
        row.start_time,
        row.start_timestamp,
        row.relativeTime,
        firstWord.start_time,
        firstWord.start_timestamp,
        firstWord.start_timestamp && firstWord.start_timestamp.relative
      );
      lines.push(`${start == null ? "" : `[${formatRelativeTime(start)}] `}${speaker}: ${String(text).trim()}`);
    }
    return lines.join("\n");
  }
  __name(formatRecallTranscript, "formatRecallTranscript");
  function transcriptRowCount(raw) {
    if (Array.isArray(raw)) return raw.length;
    if (raw && Array.isArray(raw.results)) return raw.results.length;
    if (raw && Array.isArray(raw.transcript)) return raw.transcript.length;
    return 0;
  }
  __name(transcriptRowCount, "transcriptRowCount");
  function describeTranscriptState(transcript, bot) {
    const debug = transcript && transcript.debug || {};
    const parts = [];
    const status = debug.botStatus || latestRecallStatus(bot);
    if (status) parts.push(`bot=${status}`);
    if (debug.recordings != null) parts.push(`recordings=${debug.recordings}`);
    if (debug.transcriptArtifacts != null) parts.push(`transcripts=${debug.transcriptArtifacts}`);
    if (Array.isArray(debug.transcriptStatuses) && debug.transcriptStatuses.length) parts.push(`transcript_status=${debug.transcriptStatuses.join(",")}`);
    if (debug.hasDownloadUrl != null) parts.push(`download_url=${debug.hasDownloadUrl ? "yes" : "no"}`);
    if (debug.liveRows != null) parts.push(`live_rows=${debug.liveRows}`);
    if (transcript && transcript.pending) return `Transcript not ready yet${parts.length ? ` (${parts.join("; ")})` : ""}.`;
    if (transcript && transcript.live) return `No live transcript rows received yet${parts.length ? ` (${parts.join("; ")})` : ""}.`;
    return `No transcript rows found${parts.length ? ` (${parts.join("; ")})` : ""}.`;
  }
  __name(describeTranscriptState, "describeTranscriptState");
  function latestRecallStatus(bot) {
    if (!bot) return "";
    if (typeof bot.status === "string") return bot.status;
    if (bot.status && typeof bot.status.code === "string") return bot.status.code;
    const changes = Array.isArray(bot.status_changes) ? bot.status_changes : [];
    const last = changes[changes.length - 1];
    return last && (last.code || last.status || last.message) || "";
  }
  __name(latestRecallStatus, "latestRecallStatus");
  function isTerminalStatus(status) {
    const normalized = String(status || "").toLowerCase();
    return DONE_STATUSES.has(normalized) || FATAL_STATUSES.has(normalized) || normalized.includes("done") || normalized.includes("fatal");
  }
  __name(isTerminalStatus, "isTerminalStatus");
  function isMeetingEndedStatus(status) {
    const normalized = String(status || "").toLowerCase();
    return isTerminalStatus(normalized) || normalized === "call_ended" || normalized === "processing transcript";
  }
  __name(isMeetingEndedStatus, "isMeetingEndedStatus");
  function recallError(json, status) {
    if (json && typeof json.detail === "string") return json.detail;
    if (json && typeof json.error === "string") return json.error;
    if (json && json.error && json.error.message) return json.error.message;
    return `Recall returned ${status}`;
  }
  __name(recallError, "recallError");
  function anthropicError(json, status) {
    if (json && json.error && json.error.message) return json.error.message;
    return `Anthropic returned ${status}`;
  }
  __name(anthropicError, "anthropicError");
  function formatBridgeError(json, status) {
    const base = json && (json.error || json.message) || `Bridge returned ${status}`;
    const detail = errorDetail(json && json.detail);
    if (!detail || detail === base) return base;
    return `${base}: ${detail}`;
  }
  __name(formatBridgeError, "formatBridgeError");
  function errorDetail(value) {
    if (!value) return "";
    if (typeof value === "string") return value.trim();
    if (Array.isArray(value)) {
      return value.map(errorDetail).filter(Boolean).join("; ");
    }
    if (typeof value === "object") {
      for (const key of ["detail", "message", "error"]) {
        const nested = errorDetail(value[key]);
        if (nested) return nested;
      }
      try {
        return JSON.stringify(value);
      } catch {
      }
    }
    return "";
  }
  __name(errorDetail, "errorDetail");
  function firstNumber(...values) {
    for (const value of values) {
      const n = Number(value);
      if (Number.isFinite(n)) return n;
    }
    return null;
  }
  __name(firstNumber, "firstNumber");
  function formatRelativeTime(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  __name(formatRelativeTime, "formatRelativeTime");
  function bytesToBase64(bytes) {
    let binary = "";
    const chunk = 32768;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }
  __name(bytesToBase64, "bytesToBase64");
  function clampNumber(value, min, max, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }
  __name(clampNumber, "clampNumber");
  function propertyValueToText(value) {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number") return String(value).trim();
    if (typeof value !== "object") return "";
    for (const key of ["url", "href", "value", "text", "label", "title"]) {
      const nested = value[key];
      if (typeof nested === "string" || typeof nested === "number") {
        const text = String(nested).trim();
        if (text) return text;
      }
    }
    return "";
  }
  __name(propertyValueToText, "propertyValueToText");
  function navButtonLabel(kind) {
    if (kind === "recording") {
      return `<span class="${ROOT_CLASS}__nav-label"><span class="${ROOT_CLASS}__nav-dot" aria-hidden="true"></span><span>Recording</span></span>`;
    }
    if (kind === "summarizing") {
      return `<span class="${ROOT_CLASS}__nav-label"><span class="${ROOT_CLASS}__nav-spinner" aria-hidden="true"></span><span>Summarizing</span></span>`;
    }
    if (kind === "processing") {
      return `<span class="${ROOT_CLASS}__nav-label"><span class="${ROOT_CLASS}__nav-spinner" aria-hidden="true"></span><span>Processing</span></span>`;
    }
    return "Transcribe";
  }
  __name(navButtonLabel, "navButtonLabel");
  return __toCommonJS(plugin_exports);
})();
var Plugin = plugins.Plugin;
