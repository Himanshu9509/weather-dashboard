// client/src/components/ToggleSwitch.js

import React from 'react';

// The component receives the current unit ('metric' or 'imperial')
// and an onToggle function to be called when it's clicked.
function ToggleSwitch({ unit, onToggle }) {
  // We determine if the switch should be in the "checked" state (Fahrenheit)
  // based on the current unit prop.
  const isChecked = unit === 'imperial';

  return (
    <div className="toggle-switch-container">
      <span>°C</span>
      <label className="toggle-switch">
        {/* The underlying input is a checkbox. It's hidden by CSS,
            but it provides all the accessibility and functionality. */}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
        />
        {/* This span is the visible part of the switch that we style with CSS. */}
        <span className="slider round"></span>
      </label>
      <span>°F</span>
    </div>
  );
}

export default ToggleSwitch;