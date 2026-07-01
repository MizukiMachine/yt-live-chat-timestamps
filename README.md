# YouTube Live Chat Timestamps

Chrome extension that adds `HH:mm:ss` timestamps to YouTube live chat messages.

## Load locally

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select this repository directory.
5. Open a YouTube live stream with chat.

## Scope

- Targets YouTube live chat frames on `youtube.com`.
- Shows the timestamp to the left of the author name.
- Prefers timestamp data exposed by YouTube's chat renderer.
- Falls back to the local time when the message was observed if YouTube does not expose timestamp data.

## Development notes

The extension is intentionally build-free for the first version. Edit files under `src/`, then reload the extension from `chrome://extensions`.
