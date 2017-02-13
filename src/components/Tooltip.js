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
  padding: '0 5px'
};

const TooltipInnerStyle = {
  padding: '3px 8px',
  color: '#fff',
  textAlign: 'center',
  borderRadius: 3,
  backgroundColor: '#000',
  opacity: .75
};

const TooltipArrowStyle = {
  position: 'absolute',
  width: 0, height: 0,
  borderRightColor: 'transparent',
  borderLeftColor: 'transparent',
  borderTopColor: 'transparent',
  borderBottomColor: 'transparent',
  borderStyle: 'solid',
  opacity: .75
};

const PlacementStyles = {
  left: {
    tooltip: { marginLeft: -3, padding: '0 5px' },
    arrow: {
      right: 0, marginTop: -5, borderWidth: '5px 0 5px 5px', borderLeftColor: '#000'
    }
  },
  right: {
    tooltip: { marginRight: 3, padding: '0 5px' },
    arrow: { left: 0, marginTop: -5, borderWidth: '5px 5px 5px 0', borderRightColor: '#000' }
  },
  top: {
    tooltip: { marginTop: -3, padding: '5px 0' },
    arrow: { bottom: 0, marginLeft: -5, borderWidth: '5px 5px 0', borderTopColor: '#000' }
  },
  bottom: {
    tooltip: { marginBottom: 3, padding: '5px 0' },
    arrow: { top: 0, marginLeft: -5, borderWidth: '0 5px 5px', borderBottomColor: '#000' }
  }
};

export default props => {
  let placementStyle = PlacementStyles[props.placement];

  let {
    style,
    arrowOffsetLeft: left = placementStyle.arrow.left,
    arrowOffsetTop: top = placementStyle.arrow.top,
    children
  } = props;

  return (
    <div style={{...TooltipStyle, ...placementStyle.tooltip, ...style}}>
      <div style={{...TooltipArrowStyle, ...placementStyle.arrow, left, top }}/>
      <div style={TooltipInnerStyle}>
        {children}
      </div>
    </div>
  );
};
