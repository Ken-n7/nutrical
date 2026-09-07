import React from 'react';
import styled from 'styled-components';

const Tooltip = ({ text, children }) => {
  return (
    <StyledWrapper>
      <div className="tooltip-container">
        <div className="icon">{children}</div>
        <div className="tooltip">
          <p>{text}</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.span`
  .tooltip-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  .icon svg {
    transition: transform 0.5s ease-in-out;
  }

  .icon:hover svg {
    transform: rotate(360deg) scale(1.2);
  }

  .tooltip {
    visibility: hidden;
    width: max-content;
    max-width: 200px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 0.25rem 0.5rem;
    font-size: 0.6875rem;
    font-weight: 600;
    white-space: nowrap;
    position: absolute;
    bottom: calc(100% + 0.5rem);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    opacity: 0;
    z-index: 30;
    transition: opacity 0.15s ease, visibility 0.15s ease, transform 0.15s ease;
    pointer-events: none;
  }

  .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -4px;
    border: 4px solid transparent;
    border-top-color: #333;
  }

  .tooltip-container:hover .tooltip {
    visibility: visible;
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    animation: tooltip-bounce 0.5s ease;
  }

  @keyframes tooltip-bounce {
    0%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    30% {
      transform: translateX(-50%) translateY(-8px);
    }
    60% {
      transform: translateX(-50%) translateY(-3px);
    }
  }
`;

export default Tooltip;