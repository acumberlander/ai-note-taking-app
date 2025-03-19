// @ts-nocheck

import React, { useState } from "react";
import { Slider, Typography, Tooltip } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useNoteStore } from "@/store/useNoteStore";

const SensitivitySlider = () => {
  const { semanticSensitivity, setSemanticSensitivity } = useNoteStore();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSemanticSensitivity(value);
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <Typography variant="h6" color="blue-gray" className="text-sm">
          Semantic Sensitivity: {semanticSensitivity.toFixed(2)}
        </Typography>
        <Tooltip
          content="Lower values return fewer, more relevant results. Higher values return more results."
          open={tooltipOpen}
          handler={setTooltipOpen}
          placement="top"
          className="bg-gray-900 text-white p-2 rounded text-sm max-w-xs"
        >
          <InformationCircleIcon
            className="h-5 w-5 ml-2 text-blue-500 cursor-pointer"
            onClick={() => setTooltipOpen(!tooltipOpen)}
          />
        </Tooltip>
      </div>

      <Slider
        value={semanticSensitivity}
        onChange={handleChange}
        min={0.2}
        max={0.5}
        step={0.01}
        className="h-1.5"
      />

      <div className="flex justify-between mt-1">
        <Typography variant="small" color="gray" className="text-xs">
          More Relevant
        </Typography>
        <Typography variant="small" color="gray" className="text-xs">
          More Results
        </Typography>
      </div>
    </div>
  );
};

export default SensitivitySlider;
