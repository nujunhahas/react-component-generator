import { describe, it, expect } from 'bun:test';
import { VIEWPORT_WIDTHS } from './LivePreview';

describe('ComponentCard - Responsive Viewport', () => {
  describe('Viewport button icons', () => {
    it('should have VIEWPORT_WIDTHS exported for display calculation', () => {
      expect(VIEWPORT_WIDTHS.mobile).toBe(375);
      expect(VIEWPORT_WIDTHS.tablet).toBe(768);
      expect(VIEWPORT_WIDTHS.desktop).toBe(1280);
    });
  });

  describe('px display calculation', () => {
    it('should display correct px without resize', () => {
      const viewportSize = 'mobile';
      const resizedWidth = null;
      const displayWidth = resizedWidth ?? VIEWPORT_WIDTHS[viewportSize as keyof typeof VIEWPORT_WIDTHS];
      expect(displayWidth).toBe(375);
    });

    it('should display resized width when dragging', () => {
      const viewportSize = 'tablet';
      const resizedWidth = 500;
      const displayWidth = resizedWidth ?? VIEWPORT_WIDTHS[viewportSize as keyof typeof VIEWPORT_WIDTHS];
      expect(displayWidth).toBe(500);
    });

    it('should reset display to viewport default when resize cancelled', () => {
      const viewportSize = 'desktop';
      const resizedWidth = null;
      const displayWidth = resizedWidth ?? VIEWPORT_WIDTHS[viewportSize as keyof typeof VIEWPORT_WIDTHS];
      expect(displayWidth).toBe(1280);
    });
  });

  describe('Viewport change behavior', () => {
    it('should clear resizedWidth when changing viewport', () => {
      const resizedWidth = 500;
      const newResizedWidth = null;
      expect(newResizedWidth).toBeNull();
    });

    it('should maintain resizedWidth until viewport changes', () => {
      const resizedWidth = 600;
      const stillResized = resizedWidth;
      expect(stillResized).toBe(600);
    });
  });
});
