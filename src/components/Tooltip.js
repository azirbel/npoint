/*
 * COPIED FROM THE EXAMPLES AT
 * https://react-bootstrap.github.io/react-overlays/#overlay.
 *
 * The Overlay injects props to its child component, and there are no plans
 * to change/fix this.
 * (See https://github.com/react-bootstrap/react-overlays/issues/103).
 *
 * As a workaround, we need to create a component that receives these props.
 */

import React from 'react'

const TooltipStyle = {
  position: 'absolute',
  padding: '0 5px',
  zIndex: 5,
};

const TooltipInnerStyle = {
  borderRadius: 3,
  backgroundColor: '#FFF',
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: '#D7D8DE', // light gray
};

const PlacementStyles = {
  left: {
    tooltip: { marginLeft: -3, padding: '0 5px' },
  },
  right: {
    tooltip: { marginRight: 3, padding: '0 5px' },
  },
  top: {
    tooltip: { marginTop: -3, padding: '5px 0' },
  },
  bottom: {
    tooltip: { marginBottom: 3, padding: '5px 0' },
  }
};

export default props => {
  let placementStyle = PlacementStyles[props.placement];

  let {
    style,
    children
  } = props;

  return (
    <div style={{...TooltipStyle, ...placementStyle.tooltip, ...style}}>
      <div style={TooltipInnerStyle}>
        {children}
      </div>
    </div>
  );
};
