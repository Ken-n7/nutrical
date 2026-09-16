import { CircleAlert, CircleCheck } from 'lucide-react';
import Tooltip from './Tooltip';

export function OkBadge() {
  return (
    <Tooltip text="Within tolerance">
      <span
        className="fel-ok-badge"
        role="img"
        aria-label="Within tolerance"
        tabIndex={0}
      >
        <CircleCheck size={18} strokeWidth={2} aria-hidden="true" />
      </span>
    </Tooltip>
  );
}

export function WarnBadge() {
  return (
    <Tooltip text="Needs review">
      <span
        className="fel-warn-badge"
        role="img"
        aria-label="Review needed"
        tabIndex={0}
      >
        <CircleAlert size={18} strokeWidth={2} aria-hidden="true" />
      </span>
    </Tooltip>
  );
}