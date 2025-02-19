import React from "react";
import { getLinks } from "./nav/nav_links";
import { sync } from "./devices/actions";
import { push, getPathArray } from "./history";
import { HotkeyConfig, useHotkeys } from "@blueprintjs/core";
import { unselectPlant } from "./farm_designer/map/actions";
import { getPanelPath, PANEL_BY_SLUG } from "./farm_designer/panel_header";
import {
  showHotkeysDialog,
} from "@blueprintjs/core/lib/esm/components/hotkeys/hotkeysDialog";
import { t } from "./i18next_wrapper";
import { store } from "./redux/store";
import { save } from "./api/crud";
import { cropSearchUrl } from "./plants/crop_catalog";

type HotkeyConfigs = Record<HotKey, HotkeyConfig>;

export interface HotKeysProps {
  dispatch: Function;
}

export enum HotKey {
  save = "save",
  sync = "sync",
  navigateRight = "navigateRight",
  navigateLeft = "navigateLeft",
  addPlant = "addPlant",
  addEvent = "addEvent",
  backToPlantOverview = "backToPlantOverview",
  openGuide = "openGuide",
}

const HOTKEY_BASE_MAP = (): HotkeyConfigs => ({
  [HotKey.save]: {
    combo: "ctrl + s",
    label: t("Save"),
  },
  [HotKey.sync]: {
    combo: "ctrl + shift + s",
    label: t("Sync"),
  },
  [HotKey.navigateRight]: {
    combo: "ctrl + shift + right",
    label: t("Navigate Right"),
  },
  [HotKey.navigateLeft]: {
    combo: "ctrl + shift + left",
    label: t("Navigate Left"),
  },
  [HotKey.addPlant]: {
    combo: "ctrl + shift + p",
    label: t("Add Plant"),
  },
  [HotKey.addEvent]: {
    combo: "ctrl + shift + e",
    label: t("Add Event"),
  },
  [HotKey.backToPlantOverview]: {
    combo: "esc",
    label: t("Back to plant overview"),
  },
  [HotKey.openGuide]: {
    combo: "shift + ?",
    label: t("Open Guide"),
  },
});

export const hotkeysWithActions = (dispatch: Function, slug: string) => {
  const links = getLinks();
  const idx = links.indexOf(PANEL_BY_SLUG[slug]);
  const panelPlus = links[idx + 1] || links[0];
  const panelMinus = links[idx - 1] || links[links.length - 1];
  const hotkeysBase = HOTKEY_BASE_MAP();
  const list: HotkeyConfigs = {
    [HotKey.save]: {
      ...hotkeysBase[HotKey.save],
      onKeyDown: () => {
        const sequence = store.getState().resources.consumers.sequences.current;
        if (sequence && slug == "sequences") {
          dispatch(save(sequence));
        }
      },
      allowInInput: true,
      preventDefault: true,
    },
    [HotKey.sync]: {
      ...hotkeysBase[HotKey.sync],
      onKeyDown: () => dispatch(sync()),
    },
    [HotKey.navigateRight]: {
      ...hotkeysBase[HotKey.navigateRight],
      onKeyDown: () => push(getPanelPath(panelPlus)),
    },
    [HotKey.navigateLeft]: {
      ...hotkeysBase[HotKey.navigateLeft],
      onKeyDown: () => push(getPanelPath(panelMinus)),
    },
    [HotKey.addPlant]: {
      ...hotkeysBase[HotKey.addPlant],
      onKeyDown: () => push(cropSearchUrl()),
    },
    [HotKey.addEvent]: {
      ...hotkeysBase[HotKey.addEvent],
      onKeyDown: () => push("/app/designer/events/add"),
    },
    [HotKey.backToPlantOverview]: {
      ...hotkeysBase[HotKey.backToPlantOverview],
      onKeyDown: () => {
        push("/app/designer/plants");
        dispatch(unselectPlant(dispatch));
      },
    },
    [HotKey.openGuide]: hotkeysBase[HotKey.openGuide],
  };
  return list;
};

export const openHotkeyHelpOverlay = () =>
  showHotkeysDialog(Object.values(HOTKEY_BASE_MAP())
    .map(hotkey => ({ ...hotkey, global: true })));

export const HotKeys = (props: HotKeysProps) => {
  const slug = getPathArray()[3];
  const hotkeys = React.useMemo(() =>
    Object.values(hotkeysWithActions(props.dispatch, slug))
      .map(hotkey => ({ ...hotkey, global: true })), [props.dispatch, slug]);
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys,
    { showDialogKeyCombo: undefined });
  return <div className={"hotkeys"}
    onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />;
};
