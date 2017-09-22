import * as React from "react";
import { SlotWithTool } from "../../../resources/interfaces";
import { ToolSlotPoint } from "../tool_slot_point";
import { MapTransformProps } from "../interfaces";
import { history } from "../../../history";

export interface ToolSlotLayerProps {
  visible: boolean;
  slots: SlotWithTool[];
  mapTransformProps: MapTransformProps;
  dispatch: Function;
}

export function ToolSlotLayer(props: ToolSlotLayerProps) {
  const pathArray = location.pathname.split("/");
  const canClickTool = !(pathArray[3] === "plants" && pathArray.length > 4);
  function goToToolsPage() {
    if (canClickTool) {
      props.dispatch({ type: "SELECT_PLANT", payload: undefined });
      return Promise.resolve().then(() => history.push("/app/tools"))
    }
  }
  const { slots, visible, mapTransformProps } = props;
  const cursor = canClickTool ? "pointer" : "default";
  return <g
    id="toolslot-layer"
    onClick={goToToolsPage}
    style={{ cursor: cursor }}>
    {visible &&
      slots.map(slot =>
        <ToolSlotPoint
          key={slot.toolSlot.uuid}
          slot={slot}
          mapTransformProps={mapTransformProps} />
      )}
  </g>;
}
