import { useState, type ReactNode } from 'react';
import type { GeneratedComponent } from '../types';
import { LivePreview, type Viewport, VIEWPORT_WIDTHS } from './LivePreview';
import { CodeView } from './CodeView';

interface ComponentCardProps {
  component: GeneratedComponent;
  onRemove: (id: string) => void;
  onRegenerate: (prompt: string) => void;
  isLoading: boolean;
}

type Tab = 'preview' | 'code';

const VIEWPORT_ICONS: Record<Viewport, ReactNode> = {
  mobile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="1" width="14" height="22" rx="3" ry="3" />
      <line x1="9" y1="4.5" x2="15" y2="4.5" />
      <circle cx="12" cy="20" r="1" />
    </svg>
  ),
  tablet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <circle cx="21" cy="12" r="1" />
    </svg>
  ),
  desktop: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="2" width="22" height="15" rx="1" />
      <polyline points="8 21 12 17 16 21" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  ),
};

export function ComponentCard({ component, onRemove, onRegenerate, isLoading }: ComponentCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [previewKey, setPreviewKey] = useState(0);
  const [viewportSize, setViewportSize] = useState<Viewport>('desktop');
  const [resizedWidth, setResizedWidth] = useState<number | null>(null);
  const createdAt = component.createdAt.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const displayWidth = resizedWidth ?? VIEWPORT_WIDTHS[viewportSize];

  const handleViewportChange = (v: Viewport) => {
    setViewportSize(v);
    setResizedWidth(null);
  };

  return (
    <div className="component-card">
      <div className="card-header">
        <div className="card-title-group">
          <span>{createdAt}</span>
          <p className="card-prompt">{component.prompt}</p>
        </div>
        <div className="card-actions">
          <button
            className="btn-refresh"
            onClick={() => setPreviewKey((k) => k + 1)}
            title="미리보기 새로고침"
            aria-label="미리보기 새로고침"
          >
            ↻
          </button>
          <button
            className="btn-regenerate"
            onClick={() => onRegenerate(component.prompt)}
            disabled={isLoading}
          >
            {isLoading ? '생성 중...' : '재생성'}
          </button>
          <button
            className="btn-remove"
            onClick={() => onRemove(component.id)}
          >
            삭제
          </button>
        </div>
      </div>
      <div className="card-tabs">
        <div className="card-tabs-left">
          <button
            className={`tab ${activeTab === 'preview' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            미리보기
          </button>
          <button
            className={`tab ${activeTab === 'code' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            코드
          </button>
        </div>
        {activeTab === 'preview' && (
          <div className="viewport-controls">
            {(['mobile', 'tablet', 'desktop'] as Viewport[]).map((v) => (
              <button
                key={v}
                className={`viewport-btn ${viewportSize === v ? 'viewport-btn--active' : ''}`}
                onClick={() => handleViewportChange(v)}
                title={`${v === 'mobile' ? '모바일' : v === 'tablet' ? '태블릿' : '데스크톱'} (${VIEWPORT_WIDTHS[v]}px)`}
              >
                {VIEWPORT_ICONS[v]}
              </button>
            ))}
            <span className="viewport-px-label">{displayWidth}px</span>
          </div>
        )}
      </div>
      <div className="card-content">
        {activeTab === 'preview' ? (
          <LivePreview key={previewKey} code={component.code} viewportSize={viewportSize} onResizeChange={setResizedWidth} />
        ) : (
          <CodeView code={component.code} />
        )}
      </div>
    </div>
  );
}
