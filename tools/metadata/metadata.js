const fileInput = document.getElementById("fileInput");
const metadataOutput = document.getElementById("metadataOutput");
const fileName = document.getElementById("fileName");
const fileType = document.getElementById("fileType");
const fileSize = document.getElementById("fileSize");
const fileModified = document.getElementById("fileModified");


function add(data, key, value) {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "Empty"
  )
    return;

  data[key] = value;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function hex(buffer, limit = 128) {
  return [...new Uint8Array(buffer)]
    .slice(0, limit)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join(" ");
}

function entropy(buffer) {
  const bytes = new Uint8Array(buffer);
  const freq = new Array(256).fill(0);

  bytes.forEach((b) => freq[b]++);

  let e = 0;

  for (let f of freq) {
    if (!f) continue;

    const p = f / bytes.length;

    e -= p * Math.log2(p);
  }

  return e.toFixed(6);
}

async function hash(buffer, type) {
  const digest = await crypto.subtle.digest(type, buffer);

  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getImageData(file) {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image")) {
      resolve({});
      return;
    }

    const img = new Image();

    img.src = URL.createObjectURL(file);

    img.onload = () => {
      resolve({
        Width: img.width,

        Height: img.height,

        AspectRatio: (img.width / img.height).toFixed(5),

        TotalPixels: (img.width * img.height).toLocaleString(),
      });
    };
  });
}

async function getMediaData(file) {
  return new Promise((resolve) => {
    if (!file.type.startsWith("video") && !file.type.startsWith("audio")) {
      resolve({});
      return;
    }

    const media = document.createElement(
      file.type.startsWith("video") ? "video" : "audio",
    );

    media.preload = "metadata";
    media.src = URL.createObjectURL(file);

    media.onloadedmetadata = () => {
      resolve({
        Duration: `${media.duration.toFixed(2)} seconds`,

        VideoWidth: media.videoWidth || undefined,

        VideoHeight: media.videoHeight || undefined,
      });
    };
  });
}

async function getTextData(file) {
  if (
    !file.type.startsWith("text") &&
    !file.type.includes("json") &&
    !file.type.includes("xml") &&
    !file.type.includes("javascript")
  ) {
    return {};
  }

  const text = await file.text();

  return {
    CharacterCount: text.length,
    LineCount: text.split("\n").length,
    WordCount: text.trim().split(/\s+/).filter(Boolean).length,
    First1000Characters: text.slice(0, 1000),
  };
}

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  metadataOutput.textContent = "Extracting forensic metadata...";

  const buffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(buffer);

  fileName.textContent = file.name;
  fileType.textContent = file.type || "Unknown";
  fileSize.textContent = formatBytes(file.size);

  fileModified.textContent = new Date(file.lastModified).toLocaleString();

  const dump = {};

  add(dump, "FileName", file.name);

  add(
    dump,
    "Extension",
    file.name.includes(".") ? file.name.split(".").pop() : undefined,
  );

  add(dump, "MimeType", file.type);
  add(dump, "FileSizeBytes", file.size);
  add(dump, "FormattedSize", formatBytes(file.size));
  add(dump, "LastModifiedTimestamp", file.lastModified);
  add(dump, "LastModifiedLocal", new Date(file.lastModified).toString());
  add(dump, "LastModifiedUTC", new Date(file.lastModified).toUTCString());
  add(dump, "ByteLength", buffer.byteLength);
  add(dump, "TotalBytes", uint8.length);
  add(dump, "Entropy", entropy(buffer));
  add(dump, "MagicBytes", hex(buffer, 32));
  add(dump, "FileSignature", hex(buffer, 12));
  add(dump, "First512Hex", hex(buffer, 512));
  add(dump, "ContainsNullBytes", uint8.includes(0));
  add(dump, "SHA1", await hash(buffer, "SHA-1"));
  add(dump, "SHA256", await hash(buffer, "SHA-256"));
  add(dump, "SHA384", await hash(buffer, "SHA-384"));
  add(dump, "SHA512", await hash(buffer, "SHA-512"));

  const imageData = await getImageData(file);

  Object.entries(imageData).forEach(([k, v]) => add(dump, k, v));
  const mediaData = await getMediaData(file);

  Object.entries(mediaData).forEach(([k, v]) => add(dump, k, v));
  const textData = await getTextData(file);

  Object.entries(textData).forEach(([k, v]) => add(dump, k, v));

  add(dump, "UserAgent", navigator.userAgent);
  add(dump, "Platform", navigator.platform);
  add(dump, "Language", navigator.language);
  add(dump, "HardwareConcurrency", navigator.hardwareConcurrency);
  add(dump, "DeviceMemory", navigator.deviceMemory);
  add(dump, "TimeZone", Intl.DateTimeFormat().resolvedOptions().timeZone);

  if (file.type.startsWith("image")) {
    try {
      const tags = await ExifReader.load(buffer);

      Object.entries(tags).forEach(([key, value]) => {
        if (value && value.description) {
          add(dump, `EXIF_${key}`, value.description);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  metadataOutput.textContent = JSON.stringify(dump, null, 2);
});