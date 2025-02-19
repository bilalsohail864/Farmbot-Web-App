import { SequenceBodyItem, TaggedSequence } from "farmbot";
import { SelectSequence } from "./interfaces";
import { edit, init, overwrite } from "../api/crud";
import { defensiveClone, urlFriendly } from "../util";
import { push } from "../history";
import { Actions } from "../constants";
import { setActiveSequenceByName } from "./set_active_sequence_by_name";
import { t } from "../i18next_wrapper";
import { isNumber } from "lodash";
import { sequencesUrlBase } from "../folders/component";
import { error, success } from "../toast/toast";
import { API } from "../api";
import axios from "axios";

export function pushStep(step: SequenceBodyItem,
  dispatch: Function,
  sequence: TaggedSequence,
  index?: number | undefined) {
  const next = defensiveClone(sequence);
  next.body.body = next.body.body || [];
  next.body.body.splice(isNumber(index) ? index : Infinity, 0,
    defensiveClone(step));
  dispatch(overwrite(sequence, next.body));
}

export function editCurrentSequence(dispatch: Function, seq: TaggedSequence,
  update: Partial<typeof seq.body>) {
  dispatch(edit(seq, update));
}

let count = 1;

export const copySequence = (payload: TaggedSequence) =>
  (dispatch: Function) => {
    const copy = defensiveClone(payload);
    copy.body.id = undefined;
    copy.body.name = copy.body.name + t(" copy ") + (count++);
    dispatch(init(copy.kind, copy.body));
    push(sequencesUrlBase() + urlFriendly(copy.body.name));
    setActiveSequenceByName();
  };

export const pinSequenceToggle = (sequence: TaggedSequence) =>
  (dispatch: Function) => {
    const pinned = sequence.body.pinned;
    editCurrentSequence(dispatch, sequence, { pinned: !pinned });
  };

export function selectSequence(uuid: string): SelectSequence {
  return {
    type: Actions.SELECT_SEQUENCE,
    payload: uuid
  };
}

export const unselectSequence = () => {
  push(sequencesUrlBase());
  return { type: Actions.SELECT_SEQUENCE, payload: undefined };
};

export const closeCommandMenu = () => ({
  type: Actions.SET_SEQUENCE_STEP_POSITION,
  payload: undefined,
});

export const publishSequence = (id: number | undefined) => () =>
  axios.post(`${API.current.sequencesPath}${id}/publish`)
    .then(() => success(t("Sequence published.")),
      () => error(t("Publish error.")));

export const unpublishSequence = (id: number | undefined) => () =>
  axios.post(`${API.current.sequencesPath}${id}/unpublish`)
    .then(() => success(t("Sequence unpublished.")),
      () => error(t("Unpublish error.")));

export const installSequence = (id: number | undefined) => () =>
  axios.post(`${API.current.sequencesPath}${id}/install`)
    .then(() => success(t("Sequence installed.")),
      () => error(t("Install error.")));

export const upgradeSequence = (
  id: number | undefined,
  sequenceVersionId: number | undefined,
) =>
  () =>
    axios.post(`${API.current.sequencesPath}${id}/upgrade/${sequenceVersionId}`)
      .then(() => success(t("Sequence upgraded.")),
        () => error(t("Upgrade error.")));
