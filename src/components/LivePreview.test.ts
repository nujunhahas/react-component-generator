import { describe, it, expect } from 'bun:test';
import { VIEWPORT_WIDTHS } from './LivePreview';

describe('LivePreview', () => {
  describe('VIEWPORT_WIDTHS', () => {
    it('should export VIEWPORT_WIDTHS constant', () => {
      expect(VIEWPORT_WIDTHS).toBeDefined();
    });

    it('should have correct widths for each viewport', () => {
      expect(VIEWPORT_WIDTHS.mobile).toBe(375);
      expect(VIEWPORT_WIDTHS.tablet).toBe(768);
      expect(VIEWPORT_WIDTHS.desktop).toBe(1280);
    });

    it('should have all three viewport sizes', () => {
      const viewports = Object.keys(VIEWPORT_WIDTHS);
      expect(viewports.length).toBe(3);
      expect(viewports).toContain('mobile');
      expect(viewports).toContain('tablet');
      expect(viewports).toContain('desktop');
    });
  });
});
