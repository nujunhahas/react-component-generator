import { useEffect, useRef, useState } from 'react';
import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from 'react-live';

export type Viewport = 'mobile' | 'tablet' | 'desktop';

export const VIEWPORT_WIDTHS: Record<Viewport, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
};

interface LivePreviewProps {
  code: string;
  viewportSize?: Viewport;
  onResizeChange?: (width: number | null) => void;
}

export function LivePreview({ code, viewportSize = 'desktop', onResizeChange }: LivePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);
  const [resizedWidth, setResizedWidth] = useState<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!innerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      setInnerHeight(entries[0].contentRect.height);
    });

    resizeObserver.observe(innerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setResizedWidth(null);
    onResizeChange?.(null);
  }, [viewportSize, onResizeChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartXRef.current;
      // preview-render이 center-aligned이므로, 오른쪽 드래그는 양쪽 확장 (dx * 2)
      const newWidth = Math.max(320, Math.min(containerWidth, dragStartWidthRef.current + dx * 2));
      setResizedWidth(newWidth);
      onResizeChange?.(newWidth);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [containerWidth, onResizeChange]);

  const vpWidth = resizedWidth ?? VIEWPORT_WIDTHS[viewportSize];
  const scale = containerWidth > 0 ? Math.min(1, containerWidth / vpWidth) : 1;
  const heightOffset = innerHeight > 0 ? innerHeight * scale - innerHeight : 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = resizedWidth ?? VIEWPORT_WIDTHS[viewportSize];
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>미리보기</h3>
      </div>
      <div className="preview-content">
        <LiveProvider code={code} noInline>
          <div className={`preview-render preview-render--${viewportSize}`} ref={containerRef}>
            <div className="preview-resize-container">
              <div className={`device-frame device-frame--${viewportSize}`}>
                <div className="device-screen">
                  <div
                    className="preview-scale-inner"
                    ref={innerRef}
                    style={{
                      width: vpWidth,
                      transform: `scale(${scale})`,
                      transformOrigin: 'top center',
                      marginBottom: heightOffset > 0 ? heightOffset : 0,
                    }}
                  >
                    <ReactLivePreview />
                  </div>
                </div>
              </div>
              <div className="resize-handle" onMouseDown={handleMouseDown} title="드래그하여 너비 조절" />
            </div>
          </div>
          <LiveError className="preview-error" />
        </LiveProvider>
      </div>
    </div>
  );
}
