import React from "react";
import { PopoverInteractionKind, Position } from "@blueprintjs/core";
import { Popover } from "./popover";

interface InputErrorProps {
  error?: string;
}

export const InputError = (props: InputErrorProps) =>
  props.error
    ? <Popover
      minimal={true}
      usePortal={false}
      position={Position.TOP_LEFT}
      modifiers={{ offset: { offset: "[0, 20]" } }}
      interactionKind={PopoverInteractionKind.HOVER}
      className="input-error-wrapper"
      target={<i className="fa fa-exclamation-circle input-error" />}
      content={<p>{props.error}</p>} />
    : <div className={"no-input-error"} />;
