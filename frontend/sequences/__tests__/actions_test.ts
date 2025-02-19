jest.mock("../../history", () => ({ push: jest.fn(), getPathArray: () => [] }));

jest.mock("../../api/crud", () => ({
  init: jest.fn(),
  edit: jest.fn(),
  overwrite: jest.fn(),
}));

jest.mock("../set_active_sequence_by_name", () => ({
  setActiveSequenceByName: jest.fn()
}));

let mockPost = Promise.resolve();
jest.mock("axios", () => ({
  post: jest.fn(() => mockPost),
}));

import {
  copySequence, editCurrentSequence, selectSequence, pushStep, pinSequenceToggle,
  publishSequence,
  upgradeSequence,
  installSequence,
  unpublishSequence,
} from "../actions";
import { fakeSequence } from "../../__test_support__/fake_state/resources";
import { init, edit, overwrite } from "../../api/crud";
import { push } from "../../history";
import { Actions } from "../../constants";
import { setActiveSequenceByName } from "../set_active_sequence_by_name";
import { TakePhoto, Wait } from "farmbot";
import axios from "axios";
import { API } from "../../api";
import { error, success } from "../../toast/toast";

describe("copySequence()", () => {
  it("copies sequence", () => {
    const sequence = fakeSequence();
    sequence.body.body = [{ kind: "wait", args: { milliseconds: 100 } }];
    const { body } = sequence.body;
    copySequence(sequence)(jest.fn());
    expect(init).toHaveBeenCalledWith("Sequence",
      expect.objectContaining({ name: "fake copy 1", body }));
  });

  it("updates current path", () => {
    copySequence(fakeSequence())(jest.fn());
    expect(push).toHaveBeenCalledWith("/app/sequences/fake_copy_2");
  });

  it("selects sequence", () => {
    copySequence(fakeSequence())(jest.fn());
    expect(setActiveSequenceByName).toHaveBeenCalled();
  });
});

describe("editCurrentSequence()", () => {
  it("prepares update payload", () => {
    const fake = fakeSequence();
    editCurrentSequence(jest.fn, fake, { color: "red" });
    expect(edit).toHaveBeenCalledWith(
      expect.objectContaining({ uuid: fake.uuid }),
      { color: "red" });
  });
});

describe("selectSequence()", () => {
  it("prepares payload", () => {
    expect(selectSequence("Sequence.fake.uuid")).toEqual({
      type: Actions.SELECT_SEQUENCE,
      payload: "Sequence.fake.uuid"
    });
  });
});

describe("pushStep()", () => {
  const step = (n: number): Wait => ({ kind: "wait", args: { milliseconds: n } });
  const NEW_STEP: TakePhoto = { kind: "take_photo", args: {} };

  it("adds step at 2", () => {
    const sequence = fakeSequence();
    sequence.body.body = [
      step(1),
      step(2),
      step(3),
    ];
    pushStep(NEW_STEP, jest.fn(), sequence, 2);
    expect(overwrite).toHaveBeenCalledWith(sequence, expect.objectContaining({
      body: [
        step(1),
        step(2),
        NEW_STEP,
        step(3),
      ]
    }));
  });

  it("adds step at end", () => {
    const sequence = fakeSequence();
    sequence.body.body = [
      step(1),
      step(2),
      step(3),
    ];
    pushStep(NEW_STEP, jest.fn(), sequence);
    expect(overwrite).toHaveBeenCalledWith(sequence, expect.objectContaining({
      body: [
        step(1),
        step(2),
        step(3),
        NEW_STEP,
      ]
    }));
  });

  it("handles missing body", () => {
    const sequence = fakeSequence();
    sequence.body.body = undefined;
    pushStep(NEW_STEP, jest.fn(), sequence);
    expect(overwrite).toHaveBeenCalledWith(sequence,
      expect.objectContaining({ body: [NEW_STEP] }));
  });
});

describe("pinSequenceToggle()", () => {
  it("pins sequence", () => {
    const sequence = fakeSequence();
    sequence.body.pinned = false;
    pinSequenceToggle(sequence)(jest.fn());
    expect(edit).toHaveBeenCalledWith(sequence, { pinned: true });
  });
});

describe("publishSequence()", () => {
  API.setBaseUrl("");

  it("publishes sequence", async () => {
    mockPost = Promise.resolve();
    await publishSequence(123)();
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost/api/sequences/123/publish");
    expect(success).toHaveBeenCalledWith("Sequence published.");
    expect(error).not.toHaveBeenCalled();
  });

  it("errors while publishing sequence", async () => {
    mockPost = Promise.reject();
    await publishSequence(123)();
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost/api/sequences/123/publish");
    expect(success).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith("Publish error.");
  });
});

describe("unpublishSequence()", () => {
  API.setBaseUrl("");

  it("unpublishes sequence", async () => {
    mockPost = Promise.resolve();
    await unpublishSequence(123)();
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost/api/sequences/123/unpublish");
    expect(success).toHaveBeenCalledWith("Sequence unpublished.");
    expect(error).not.toHaveBeenCalled();
  });

  it("errors while unpublishing sequence", async () => {
    mockPost = Promise.reject();
    await unpublishSequence(123)();
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost/api/sequences/123/unpublish");
    expect(success).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith("Unpublish error.");
  });
});

describe("installSequence()", () => {
  it("installs sequence", async () => {
    mockPost = Promise.resolve();
    await installSequence(123)();
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost/api/sequences/123/install");
    expect(success).toHaveBeenCalledWith("Sequence installed.");
    expect(error).not.toHaveBeenCalled();
  });

  it("errors while installing sequence", async () => {
    mockPost = Promise.reject();
    await installSequence(123)();
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost/api/sequences/123/install");
    expect(success).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith("Install error.");
  });
});

describe("upgradeSequence()", () => {
  API.setBaseUrl("");

  it("upgrades sequence", async () => {
    mockPost = Promise.resolve();
    await upgradeSequence(123, 1)();
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost/api/sequences/123/upgrade/1");
    expect(success).toHaveBeenCalledWith("Sequence upgraded.");
    expect(error).not.toHaveBeenCalled();
  });

  it("errors while publishing sequence", async () => {
    mockPost = Promise.reject();
    await upgradeSequence(123, 1)();
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost/api/sequences/123/upgrade/1");
    expect(success).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith("Upgrade error.");
  });
});
