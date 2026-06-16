/**
 * Image utilities for user/profile media.
 *
 * Includes:
 * - Downloading images from URLs
 * - Saving/resizing images to `public/`
 * - Deleting images/folders
 */
const axios = require("axios");
const dns = require("dns").promises;
const net = require("net");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Hosts we trust to serve user-provided profile pictures (signup social-login
// flow). Extend via IMAGE_DOWNLOAD_ALLOWED_HOSTS (comma-separated suffixes).
const DEFAULT_ALLOWED_HOST_SUFFIXES = [
  ".googleusercontent.com",
  ".ggpht.com",
  ".fbcdn.net",
  ".cdninstagram.com",
];
const ALLOWED_HOST_SUFFIXES = (
  process.env.IMAGE_DOWNLOAD_ALLOWED_HOSTS || ""
)
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)
  .concat(DEFAULT_ALLOWED_HOST_SUFFIXES);

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const DOWNLOAD_TIMEOUT_MS = 5000;
const SHARP_PIXEL_LIMIT = 24_000_000; // 24 MP

sharp.cache(false);

function isHostAllowed(hostname) {
  const h = hostname.toLowerCase();
  return ALLOWED_HOST_SUFFIXES.some((suffix) => h.endsWith(suffix));
}

// Loopback, link-local, private, multicast, unspecified, reserved.
function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true;
    return false;
  }
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v === "::" || v === "::1") return true;
    if (v.startsWith("fe80:") || v.startsWith("fc") || v.startsWith("fd")) return true;
    if (v.startsWith("ff")) return true;
    if (v.startsWith("::ffff:")) {
      return isPrivateIp(v.slice("::ffff:".length));
    }
    return false;
  }
  return true; // Unknown literal — reject by default.
}

// Function to download image from URL.
//
// Hardened against SSRF: HTTPS only, hostname allow-list, DNS resolution with
// private-IP rejection (best-effort against rebinding), size cap, timeout,
// content-type check, no TLS-verify bypass.
async function downloadImage(imageUrl) {
  let parsed;
  try {
    parsed = new URL(imageUrl);
  } catch {
    throw new Error("invalid_image_url");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("image_url_not_https");
  }
  if (!isHostAllowed(parsed.hostname)) {
    throw new Error("image_host_not_allowed");
  }

  const records = await dns.lookup(parsed.hostname, { all: true });
  if (!records.length || records.some((r) => isPrivateIp(r.address))) {
    throw new Error("image_host_resolves_to_private_ip");
  }

  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
    timeout: DOWNLOAD_TIMEOUT_MS,
    maxContentLength: MAX_IMAGE_BYTES,
    maxBodyLength: MAX_IMAGE_BYTES,
    validateStatus: (s) => s >= 200 && s < 300,
  });

  const contentType = String(response.headers["content-type"] || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error("image_content_type_not_allowed");
  }

  const buffer = Buffer.from(response.data, "binary");
  if (buffer.length === 0) throw new Error("image_empty");
  if (buffer.length > MAX_IMAGE_BYTES) throw new Error("image_too_large");
  return buffer;
}

function extractIdFromGoogleUrl(url) {
  const lastIndex = url.lastIndexOf("/");
  const id = url.substring(lastIndex + 1);
  return id;
}

// Function to save image
async function saveImage(imageName, imageBuffer, folder, resize = true) {
  const destinationDirectory = path.join(__dirname, `../../public/${folder}`);
  fs.mkdirSync(destinationDirectory, { recursive: true });

  const imagePath = path.join(destinationDirectory, imageName);

  let imageSaved = imageBuffer;
  if (resize) {
    imageSaved = await sharp(imageBuffer, {
      limitInputPixels: SHARP_PIXEL_LIMIT,
      failOn: "error",
    })
      .resize({ width: 800 })
      .toBuffer();
  }
  fs.writeFileSync(imagePath, imageSaved);

  return imagePath.replace(__dirname + "/public", "");
}

function deleteImages() {
  deleteFolderRecursive("../../public/images/client");
  deleteFolderRecursive("../../public/properties/hd");
  deleteFolderRecursive("../../public/properties");
  deleteFolderRecursive("../../public/pdf");
}
function deleteImage(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
function deleteFolderRecursive(folderPathString) {
  folderPath = path.join(__dirname, folderPathString);
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file, index) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // Recursive call if it's a directory
        deleteFolderRecursive(curPath);
      } else {
        // Delete the file
        fs.unlinkSync(curPath);
      }
    });
    // Delete the folder itself
    fs.rmdirSync(folderPath);
  }
}
module.exports = {
  downloadImage,
  saveImage,
  deleteImage,
  extractIdFromGoogleUrl,
  deleteFolderRecursive,
  deleteImages,
};
