enum Org {
  FarmBot = "FarmBot",
  FarmBotLabs = "FarmBot-Labs",
}

export enum FarmBotRepo {
  FarmBotWebApp = "Farmbot-Web-App",
  FarmBotOS = "farmbot_os",
  FarmBotArduinoFirmware = "farmbot-arduino-firmware",
}

enum FbosFile {
  featureMinVersions = "FEATURE_MIN_VERSIONS.json",
  osReleaseNotes = "RELEASE_NOTES.md",
}

export namespace ExternalUrl {
  const GITHUB = "https://github.com";
  const GITHUB_RAW = "https://raw.githubusercontent.com";
  const GITHUB_API = "https://api.github.com";
  const OPENFARM = "https://openfarm.cc";
  const GENESIS_DOCS = "https://genesis.farm.bot";
  const EXPRESS_DOCS = "https://express.farm.bot";
  const META_DOCS = "https://meta.farm.bot";
  const EDU_DOCS = "https://oer.farm.bot";
  const SOFTWARE_DOCS = "https://software.farm.bot";
  const DEVELOPER_DOCS = "https://developer.farm.bot";
  const FORUM = "https://forum.farmbot.org";
  const SHOPIFY_CDN = "https://cdn.shopify.com/s/files/1/2040/0289/files";
  const YOUTUBE = "https://www.youtube.com/embed/";
  const FARMBOT = "https://farm.bot";
  const MY_FARMBOT_WEB_APP = "https://my.farm.bot";
  const OPEN_STREET_MAP = "https://www.openstreetmap.org";

  /**  const GITHUB = "";
  const GITHUB_RAW = "";
  const GITHUB_API = "";
  const OPENFARM = "";
  const GENESIS_DOCS = "";
  const EXPRESS_DOCS = "";
  const META_DOCS = "";
  const EDU_DOCS = "";
  const SOFTWARE_DOCS = "";
  const DEVELOPER_DOCS = "";
  const FORUM = "";
  const SHOPIFY_CDN = "";
  const YOUTUBE = "";
  const FARMBOT = "";
  const MY_FARMBOT_WEB_APP = "";
  const OPEN_STREET_MAP = ""; */

  export const openStreetMap = (latitude: number, longitude: number) =>
    `${OPEN_STREET_MAP}/?mlat=${latitude}&mlon=${longitude}&zoom=10`;

  export const myFarmBot = MY_FARMBOT_WEB_APP;

  const FBOS_RAW =
    `${GITHUB_RAW}/${Org.FarmBot}/${FarmBotRepo.FarmBotOS}/staging`;
  export const featureMinVersions = `${FBOS_RAW}/${FbosFile.featureMinVersions}`;
  export const osReleaseNotes = `${FBOS_RAW}/${FbosFile.osReleaseNotes}`;

  export const latestRelease =
    `${GITHUB_API}/repos/${Org.FarmBot}/${FarmBotRepo.FarmBotOS}/releases/latest`;

  export const gitHubFarmBot = `${GITHUB}/${Org.FarmBot}`;
  export const webAppRepo = `${gitHubFarmBot}/${FarmBotRepo.FarmBotWebApp}`;

  export const genesisDocs = `${GENESIS_DOCS}/docs`;
  export const genesisAssembly = `${GENESIS_DOCS}/docs/assembly-preparation`;
  export const expressDocs = `${EXPRESS_DOCS}/docs`;
  export const expressAssembly = `${EXPRESS_DOCS}/docs/assembly`;
  export const metaDocs = `${META_DOCS}/docs`;
  export const eduDocs = `${EDU_DOCS}/docs`;

  export const softwareDocs = `${SOFTWARE_DOCS}/docs`;
  export const developerDocs = `${DEVELOPER_DOCS}/docs`;
  export const softwareForum = `${FORUM}/c/software`;

  export namespace OpenFarm {
    export const cropApi = `${OPENFARM}/api/v1/crops/`;
    export const cropBrowse = `${OPENFARM}/crops/`;
    export const newCrop = `${OPENFARM}/en/crops/new`;
  }

  export namespace Video {
    export const desktop =
      `${SHOPIFY_CDN}/Farm_Designer_Loop.mp4?9552037556691879018`;
    export const mobile = `${SHOPIFY_CDN}/Controls.png?9668345515035078097`;
    const match = `${YOUTUBE}koIVQTDEgXM`;
    export const mapOrientation = `${match}?end=64`;
    export const manualControls = `${match}?start=64`;
    const motorMovement = `${YOUTUBE}HGuoD23s30A`;
    export const movements = `${motorMovement}?end=107`;
    export const motorTuning = `${motorMovement}?start=107`;
  }

  const PRODUCTS = `${FARMBOT}/products`;
  export namespace Store {
    export const home = FARMBOT;
    export const cameraCalibrationCard = `${PRODUCTS}/camera-calibration-card`;
    export const cameraReplacement =
      `${PRODUCTS}/genesis-v1-5-express-v1-0-camera-free-replacement`;
  }
}
