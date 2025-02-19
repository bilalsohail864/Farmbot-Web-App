import React from "react";
import { Position } from "@blueprintjs/core";
import { Popover, Saucer } from "../ui";
import { ResourceColor } from "../interfaces";
import { colors } from "../util";
import { t } from "../i18next_wrapper";

export interface ColorPickerProps {
  position?: Position;
  current: ResourceColor;
  onChange: (color: ResourceColor) => void;
  saucerIcon?: string;
}

export interface ColorPickerClusterProps {
  onChange: (color: ResourceColor) => void;
  current: ResourceColor;
  saucerIcon?: string;
}

interface ColorPickerItemProps extends ColorPickerClusterProps {
  color: ResourceColor;
}

const ColorPickerItem = (props: ColorPickerItemProps) => {
  return <div className="color-picker-item-wrapper"
    title={t(props.color)}
    onClick={() => props.onChange(props.color)}>
    {props.saucerIcon
      ? <i className={`icon-saucer fa ${props.saucerIcon} ${props.color}`} />
      : <Saucer color={props.color} active={false} />}
  </div>;
};

export const ColorPickerCluster = (props: ColorPickerClusterProps) => {
  return <div className="color-picker-cluster">
    {colors.map((color) => {
      return <ColorPickerItem
        key={color}
        onChange={props.onChange}
        saucerIcon={props.saucerIcon}
        current={props.current}
        color={color} />;
    })}
  </div>;
};
export class ColorPicker extends React.Component<ColorPickerProps, {}> {

  public render() {
    const classes = [
      "icon-saucer fa",
      this.props.saucerIcon,
      this.props.current,
    ];
    return <Popover className="color-picker"
      position={this.props.position || Position.BOTTOM}
      popoverClassName="colorpicker-menu gray"
      target={this.props.saucerIcon
        ? <i className={classes.join(" ")} title={t("select color")} />
        : <Saucer color={this.props.current} title={t("select color")} />}
      content={<ColorPickerCluster
        onChange={this.props.onChange}
        current={this.props.current}
        saucerIcon={this.props.saucerIcon} />} />;
  }
}
