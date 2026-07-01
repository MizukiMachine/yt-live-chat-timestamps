(() => {
  const MESSAGE_SELECTORS = [
    "yt-live-chat-text-message-renderer",
    "yt-live-chat-paid-message-renderer",
    "yt-live-chat-membership-item-renderer"
  ];

  const MESSAGE_SELECTOR = MESSAGE_SELECTORS.join(",");
  const TIMESTAMP_CLASS = "ylct-timestamp";
  const OBSERVED_ATTRIBUTE = "data-ylct-observed-at";

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  function formatTime(date) {
    return timeFormatter.format(date);
  }

  function textFromRuns(value) {
    if (!value || !Array.isArray(value.runs)) {
      return "";
    }

    return value.runs.map((run) => run.text || "").join("").trim();
  }

  function normalizeText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function timestampTextFromValue(value) {
    if (!value) {
      return "";
    }

    if (typeof value === "string") {
      return value.trim();
    }

    if (typeof value.simpleText === "string") {
      return value.simpleText.trim();
    }

    return textFromRuns(value);
  }

  function timestampFromUsec(value) {
    const usec = Number(value);

    if (!Number.isFinite(usec) || usec <= 0) {
      return "";
    }

    return formatTime(new Date(usec / 1000));
  }

  function readRendererData(root) {
    const stack = [root.data, root.__data, root.__dataHost?.data].filter(Boolean);
    const seen = new WeakSet();
    let steps = 0;

    while (stack.length > 0 && steps < 200) {
      const current = stack.shift();
      steps += 1;

      if (!current || typeof current !== "object") {
        continue;
      }

      if (seen.has(current)) {
        continue;
      }

      seen.add(current);

      const fromUsec = timestampFromUsec(current.timestampUsec);
      if (fromUsec) {
        return fromUsec;
      }

      const fromTimestampText = timestampTextFromValue(current.timestampText);
      if (fromTimestampText) {
        return fromTimestampText;
      }

      for (const key of Object.keys(current)) {
        if (/timestamp/i.test(key)) {
          const timestamp = timestampTextFromValue(current[key]) || timestampFromUsec(current[key]);
          if (timestamp) {
            return timestamp;
          }
        }

        const next = current[key];
        if (next && typeof next === "object") {
          stack.push(next);
        }
      }
    }

    return "";
  }

  function readDomTimestamp(root) {
    const timestamp = root.querySelector("#timestamp");
    return normalizeText(timestamp?.textContent);
  }

  function readFallbackTimestamp(root) {
    if (!root.hasAttribute(OBSERVED_ATTRIBUTE)) {
      root.setAttribute(OBSERVED_ATTRIBUTE, String(Date.now()));
    }

    return formatTime(new Date(Number(root.getAttribute(OBSERVED_ATTRIBUTE))));
  }

  function readTimestamp(root) {
    return readRendererData(root) || readDomTimestamp(root) || readFallbackTimestamp(root);
  }

  function getAuthorAnchor(root) {
    return root.querySelector("#author-name, #header-content-primary-column, #content");
  }

  function decorateMessage(root) {
    const anchor = getAuthorAnchor(root);

    if (!anchor || !anchor.parentNode) {
      return;
    }

    const timestamp = readTimestamp(root);
    if (!timestamp) {
      return;
    }

    let badge = root.querySelector(`.${TIMESTAMP_CLASS}`);
    if (!badge) {
      badge = document.createElement("span");
      badge.className = TIMESTAMP_CLASS;
      badge.setAttribute("aria-label", `Chat time ${timestamp}`);
      anchor.parentNode.insertBefore(badge, anchor);
    }

    if (badge.textContent !== timestamp) {
      badge.textContent = timestamp;
      badge.setAttribute("aria-label", `Chat time ${timestamp}`);
    }
  }

  function decorateExistingMessages() {
    document.querySelectorAll(MESSAGE_SELECTOR).forEach(decorateMessage);
  }

  function watchMessages() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) {
            continue;
          }

          if (node.matches(MESSAGE_SELECTOR)) {
            decorateMessage(node);
          }

          node.querySelectorAll?.(MESSAGE_SELECTOR).forEach(decorateMessage);
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  decorateExistingMessages();
  watchMessages();
})();
