import './Tooltip.css';

const Tooltip = ({ text, children }) => (
  <span className="tooltip-container">
    <span className="tooltip-icon">{children}</span>
    <span className="tooltip">{text}</span>
  </span>
);

export default Tooltip;
