const VoiceEngine = require('./discord_voice.node');
const ChildProcess = require('child_process');

const isElectronRenderer = typeof window && window && window.process && window.process.type === 'renderer';

const appSettings = isElectronRenderer ? require('electron').remote.getGlobal('appSettings') : global.appSettings;
const features = isElectronRenderer ? require('electron').remote.getGlobal('features') : global.features;
const mainArgv = isElectronRenderer ? require('electron').remote.process.argv : [];
const releaseChannel = isElectronRenderer ? require('electron').remote.getGlobal('releaseChannel') : '';

const useLegacyAudioDevice = appSettings ? appSettings.get('useLegacyAudioDevice') : false;

const logToStderr = mainArgv.slice(1).includes("--log-to-stderr");
const logVerbose = mainArgv.slice(1).includes("--log-verbose");

features.declareSupported('voice_sound_stop_loop');
features.declareSupported('voice_relative_sounds');
features.declareSupported('voice_panning');
features.declareSupported('voice_multiple_connections');
features.declareSupported('media_devices');
features.declareSupported('media_video');

if (process.platform === 'win32') {
  features.declareSupported('voice_legacy_subsystem');
  if (releaseChannel == 'development' || releaseChannel == 'staging' || releaseChannel == 'canary') {
      features.declareSupported('soundshare');
  }
}

VoiceEngine.createTransport = VoiceEngine._createTransport;

if (isElectronRenderer) {
  VoiceEngine.setImageDataAllocator((width, height) => new window.ImageData(width, height));
}

VoiceEngine.setUseLegacyAudioDevice = function(useLegacyAudioDevice_) {
  if (!appSettings) {
    console.warn('Unable to access app settings.');
    return;
  }

  if (useLegacyAudioDevice === useLegacyAudioDevice_) {
    return;
  }

  appSettings.set('useLegacyAudioDevice', useLegacyAudioDevice_);
  appSettings.save();

  if (isElectronRenderer) {
    const app = require('electron').remote.app;
    app.relaunch();
    app.exit(0);
  } else {
    ChildProcess.spawn(process.argv[0], process.argv.splice(1), {detached: true});
    process.exit(0);
  }
};

VoiceEngine.getUseLegacyAudioDevice = function() {
  return useLegacyAudioDevice;
};

console.log(`Initializing voice engine [legacy device: ${useLegacyAudioDevice}]`);
VoiceEngine.initialize({useLegacyAudioDevice, logToStderr, logVerbose});

module.exports = VoiceEngine;
