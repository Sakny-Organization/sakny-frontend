import React from 'react';

const SkeletonLine = ({ className = '' }) => <div className={`skeleton-block ${className}`} />;

const SkeletonCard = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="skeleton-card skeleton-card--compact">
        <div className="skeleton-card__header">
          <SkeletonLine className="skeleton-avatar" />
          <div className="skeleton-card__header-copy">
            <SkeletonLine className="skeleton-line skeleton-line--lg" />
            <SkeletonLine className="skeleton-line skeleton-line--sm" />
          </div>
        </div>
        <SkeletonLine className="skeleton-line" />
        <SkeletonLine className="skeleton-line skeleton-line--short" />
      </div>
    );
  }

  return (
    <div className="skeleton-card">
      <div className="skeleton-card__media" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__header">
          <div className="skeleton-card__header-copy">
            <SkeletonLine className="skeleton-line skeleton-line--lg" />
            <SkeletonLine className="skeleton-line skeleton-line--sm" />
          </div>
          <SkeletonLine className="skeleton-pill" />
        </div>
        <div className="skeleton-card__tags">
          <SkeletonLine className="skeleton-pill skeleton-pill--small" />
          <SkeletonLine className="skeleton-pill skeleton-pill--small" />
          <SkeletonLine className="skeleton-pill skeleton-pill--small" />
        </div>
        <SkeletonLine className="skeleton-line" />
        <SkeletonLine className="skeleton-line skeleton-line--short" />
        <div className="skeleton-card__footer">
          <div>
            <SkeletonLine className="skeleton-line skeleton-line--xs" />
            <SkeletonLine className="skeleton-line skeleton-line--sm" />
          </div>
          <SkeletonLine className="skeleton-button" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;