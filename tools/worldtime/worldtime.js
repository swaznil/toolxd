// City data: real lat/lon (projected onto the map's equirectangular
// image) + real IANA timezone, so offsets stay correct across DST.
const CITIES = [
  { name: "Honolulu", country: "USA", lat: 21.31, lon: -157.86, tz: "Pacific/Honolulu" },
  { name: "Anchorage", country: "USA", lat: 61.22, lon: -149.90, tz: "America/Anchorage" },
  { name: "Los Angeles", country: "USA", lat: 34.05, lon: -118.24, tz: "America/Los_Angeles" },
  { name: "Denver", country: "USA", lat: 39.74, lon: -104.99, tz: "America/Denver" },
  { name: "Mexico City", country: "Mexico", lat: 19.43, lon: -99.13, tz: "America/Mexico_City" },
  { name: "New York", country: "USA", lat: 40.71, lon: -74.01, tz: "America/New_York" },
  { name: "Toronto", country: "Canada", lat: 43.65, lon: -79.38, tz: "America/Toronto" },
  { name: "Bogotá", country: "Colombia", lat: 4.71, lon: -74.07, tz: "America/Bogota" },
  { name: "Lima", country: "Peru", lat: -12.05, lon: -77.04, tz: "America/Lima" },
  { name: "São Paulo", country: "Brazil", lat: -23.55, lon: -46.63, tz: "America/Sao_Paulo" },
  { name: "Buenos Aires", country: "Argentina", lat: -34.60, lon: -58.38, tz: "America/Argentina/Buenos_Aires" },
  { name: "London", country: "UK", lat: 51.51, lon: -0.13, tz: "Europe/London" },
  { name: "Lisbon", country: "Portugal", lat: 38.72, lon: -9.14, tz: "Europe/Lisbon" },
  { name: "Paris", country: "France", lat: 48.85, lon: 2.35, tz: "Europe/Paris" },
  { name: "Berlin", country: "Germany", lat: 52.52, lon: 13.40, tz: "Europe/Berlin" },
  { name: "Rome", country: "Italy", lat: 41.90, lon: 12.50, tz: "Europe/Rome" },
  { name: "Cairo", country: "Egypt", lat: 30.04, lon: 31.24, tz: "Africa/Cairo" },
  { name: "Lagos", country: "Nigeria", lat: 6.52, lon: 3.38, tz: "Africa/Lagos" },
  { name: "Johannesburg", country: "South Africa", lat: -26.20, lon: 28.05, tz: "Africa/Johannesburg" },
  { name: "Nairobi", country: "Kenya", lat: -1.29, lon: 36.82, tz: "Africa/Nairobi" },
  { name: "Moscow", country: "Russia", lat: 55.75, lon: 37.62, tz: "Europe/Moscow" },
  { name: "Istanbul", country: "Turkey", lat: 41.01, lon: 28.98, tz: "Europe/Istanbul" },
  { name: "Dubai", country: "UAE", lat: 25.20, lon: 55.27, tz: "Asia/Dubai" },
  { name: "New Delhi", country: "India", lat: 28.61, lon: 77.21, tz: "Asia/Kolkata" },
  { name: "Kathmandu", country: "Nepal", lat: 27.72, lon: 85.32, tz: "Asia/Kathmandu" },
  { name: "Dhaka", country: "Bangladesh", lat: 23.81, lon: 90.41, tz: "Asia/Dhaka" },
  { name: "Bangkok", country: "Thailand", lat: 13.76, lon: 100.50, tz: "Asia/Bangkok" },
  { name: "Singapore", country: "Singapore", lat: 1.35, lon: 103.82, tz: "Asia/Singapore" },
  { name: "Beijing", country: "China", lat: 39.90, lon: 116.41, tz: "Asia/Shanghai" },
  { name: "Seoul", country: "South Korea", lat: 37.57, lon: 126.98, tz: "Asia/Seoul" },
  { name: "Tokyo", country: "Japan", lat: 35.68, lon: 139.65, tz: "Asia/Tokyo" },
  { name: "Sydney", country: "Australia", lat: -33.87, lon: 151.21, tz: "Australia/Sydney" },
  { name: "Auckland", country: "New Zealand", lat: -36.85, lon: 174.76, tz: "Pacific/Auckland" },
];

const ROBINSON_TABLE = [
  { lat: 0, x: 1.0000, y: 0.0000 },
  { lat: 5, x: 0.9986, y: 0.0620 },
  { lat: 10, x: 0.9954, y: 0.1240 },
  { lat: 15, x: 0.9900, y: 0.1860 },
  { lat: 20, x: 0.9822, y: 0.2480 },
  { lat: 25, x: 0.9730, y: 0.3100 },
  { lat: 30, x: 0.9600, y: 0.3720 },
  { lat: 35, x: 0.9427, y: 0.4340 },
  { lat: 40, x: 0.9216, y: 0.4958 },
  { lat: 45, x: 0.8962, y: 0.5571 },
  { lat: 50, x: 0.8679, y: 0.6176 },
  { lat: 55, x: 0.8350, y: 0.6769 },
  { lat: 60, x: 0.7986, y: 0.7346 },
  { lat: 65, x: 0.7597, y: 0.7903 },
  { lat: 70, x: 0.7186, y: 0.8435 },
  { lat: 75, x: 0.6732, y: 0.8936 },
  { lat: 80, x: 0.6213, y: 0.9394 },
  { lat: 85, x: 0.5722, y: 0.9761 },
  { lat: 90, x: 0.5322, y: 1.0000 },
];

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 800;

function project(lat, lon) {
  const clampedLat = Math.max(-90, Math.min(90, lat));
  const absLat = Math.abs(clampedLat);
  let i = Math.floor(absLat / 5);
  if (i >= ROBINSON_TABLE.length - 1) i = ROBINSON_TABLE.length - 2;
  const t = (absLat - ROBINSON_TABLE[i].lat) / 5;

  const xScale = ROBINSON_TABLE[i].x + (ROBINSON_TABLE[i + 1].x - ROBINSON_TABLE[i].x) * t;
  const yScale = ROBINSON_TABLE[i].y + (ROBINSON_TABLE[i + 1].y - ROBINSON_TABLE[i].y) * t;

  const lonRad = (lon * Math.PI) / 180;
  const xNorm = (lonRad / Math.PI) * xScale;
  const yNorm = (clampedLat < 0 ? -1 : 1) * yScale;

  const x = (MAP_WIDTH / 2) * (1 + xNorm);
  const y = (MAP_HEIGHT / 2) * (1 - yNorm);
  return { x, y };
}

const NS = "http://www.w3.org/2000/svg";
const tzBandsLayer = document.getElementById("tzBands");
const graticule = document.getElementById("graticule");
const cityLayer = document.getElementById("cityLayer");
const tooltip = document.getElementById("tooltip");
const mapWrapper = document.querySelector(".map-wrapper");
const cityNameEl = document.getElementById("cityName");
const timeEl = document.getElementById("time");
const offsetEl = document.getElementById("offset");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

let activeCity = null;
let highlightedIndex = -1;
let currentMatches = [];
const cityEls = [];
const bandEls = [];

function buildGraticule() {
  [0].forEach(() => {
    const top = project(90, 0);
    const bottom = project(-90, 0);
    const meridian = document.createElementNS(NS, "line");
    meridian.setAttribute("x1", top.x);
    meridian.setAttribute("y1", top.y);
    meridian.setAttribute("x2", bottom.x);
    meridian.setAttribute("y2", bottom.y);
    meridian.setAttribute("class", "grat-line");
    graticule.appendChild(meridian);

    const left = project(0, -180);
    const right = project(0, 180);
    const equator = document.createElementNS(NS, "line");
    equator.setAttribute("x1", left.x);
    equator.setAttribute("y1", left.y);
    equator.setAttribute("x2", right.x);
    equator.setAttribute("y2", right.y);
    equator.setAttribute("class", "grat-line");
    graticule.appendChild(equator);
  });
}

function buildTimezoneBands() {
  for (let i = 0; i < 24; i++) {
    const lonStart = -180 + i * 15;
    const lonEnd = lonStart + 15;
    const offset = i - 12;
    const x1 = project(0, lonStart).x;
    const x2 = project(0, lonEnd).x;

    const rect = document.createElementNS(NS, "rect");
    rect.setAttribute("x", x1);
    rect.setAttribute("y", 0);
    rect.setAttribute("width", x2 - x1);
    rect.setAttribute("height", 800);
    rect.setAttribute("class", `tz-band ${offset % 2 !== 0 ? "odd" : ""}`.trim());
    rect.dataset.offset = offset;

    rect.addEventListener("mouseenter", () => highlightBand(offset));
    rect.addEventListener("mouseleave", clearBandHighlight);

    tzBandsLayer.appendChild(rect);
    bandEls[i] = rect;
  }
}

function highlightBand(offset) {
  const el = bandEls[offset + 12];
  if (el) el.classList.add("hovered");
  cityEls.forEach(({ el: cityEl, city }) => {
    if (bandIndexForTz(city.tz) === offset) cityEl.classList.add("band-match");
  });
}

function clearBandHighlight() {
  bandEls.forEach((el) => el && el.classList.remove("hovered"));
  cityEls.forEach(({ el }) => el.classList.remove("band-match"));
}

function offsetHoursForTz(tz) {
  const label = offsetLabel(tz); // e.g. "UTC+5:30"
  const match = label.match(/UTC([+-])(\d+)(?::(\d+))?/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  const hours = parseInt(match[2], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  return sign * (hours + minutes / 60);
}

function bandIndexForTz(tz) {
  const hours = offsetHoursForTz(tz);
  return Math.max(-12, Math.min(11, Math.floor(hours)));
}

function offsetLabel(tz) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(new Date());
    const part = parts.find((p) => p.type === "timeZoneName");
    return part ? part.value.replace("GMT", "UTC") : "UTC";
  } catch (e) {
    return "UTC";
  }
}

function timeLabel(tz) {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function buildCity(city) {
  const { x, y } = project(city.lat, city.lon);

  const g = document.createElementNS(NS, "g");
  g.setAttribute("class", "city");
  g.setAttribute("tabindex", "0");
  g.setAttribute("role", "button");
  g.setAttribute("aria-label", `${city.name}, ${city.country}`);
  g.dataset.name = city.name;
  g.dataset.country = city.country;
  g.dataset.tz = city.tz;

  const halo = document.createElementNS(NS, "circle");
  halo.setAttribute("class", "halo");
  halo.setAttribute("cx", x);
  halo.setAttribute("cy", y);
  halo.setAttribute("r", 11);

  const dot = document.createElementNS(NS, "circle");
  dot.setAttribute("class", "dot");
  dot.setAttribute("cx", x);
  dot.setAttribute("cy", y);
  dot.setAttribute("r", 4);

  const label = document.createElementNS(NS, "text");
  const labelRight = x < 1420;
  label.setAttribute("x", labelRight ? x + 12 : x - 12);
  label.setAttribute("y", y + 4);
  label.setAttribute("text-anchor", labelRight ? "start" : "end");
  label.textContent = city.name;

  g.appendChild(halo);
  g.appendChild(dot);
  g.appendChild(label);
  cityLayer.appendChild(g);

  g.addEventListener("click", () => activateCity(g, city));
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activateCity(g, city);
    }
  });
  g.addEventListener("mouseenter", (e) => {
    showTooltip(e, city);
    const el = bandEls[bandIndexForTz(city.tz) + 12];
    if (el) el.classList.add("hovered");
  });
  g.addEventListener("mousemove", (e) => positionTooltip(e));
  g.addEventListener("mouseleave", () => {
    hideTooltip();
    bandEls.forEach((el) => el && el.classList.remove("hovered"));
  });
  g.addEventListener("focus", (e) => showTooltip(e, city, true));
  g.addEventListener("blur", hideTooltip);

  cityEls.push({ el: g, city });
}

function showTooltip(e, city, fromFocus) {
  tooltip.textContent = `${city.name} • ${city.country}`;
  tooltip.classList.add("visible");
  if (fromFocus) {
    const rect = e.target.closest(".city").querySelector(".dot").getBoundingClientRect();
    const wrapRect = mapWrapper.getBoundingClientRect();
    tooltip.style.left = `${rect.left - wrapRect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - wrapRect.top}px`;
  } else {
    positionTooltip(e);
  }
}

function positionTooltip(e) {
  const wrapRect = mapWrapper.getBoundingClientRect();
  tooltip.style.left = `${e.clientX - wrapRect.left}px`;
  tooltip.style.top = `${e.clientY - wrapRect.top}px`;
}

function hideTooltip() {
  tooltip.classList.remove("visible");
}

function activateCity(el, city) {
  cityEls.forEach(({ el: other }) => other.classList.remove("active"));
  el.classList.add("active");
  activeCity = city;

  cityNameEl.textContent = `${city.name}, ${city.country}`;
  timeEl.textContent = timeLabel(city.tz);
  offsetEl.textContent = offsetLabel(city.tz);
}

buildTimezoneBands();
buildGraticule();
CITIES.forEach(buildCity);

function renderResults(matches) {
  currentMatches = matches;
  highlightedIndex = -1;
  searchResults.innerHTML = "";

  if (matches.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No cities match.";
    searchResults.appendChild(empty);
    searchResults.classList.add("visible");
    return;
  }

  matches.forEach(({ city }, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.index = i;

    const name = document.createElement("span");
    name.textContent = city.name;

    const country = document.createElement("span");
    country.className = "country";
    country.textContent = city.country;

    btn.appendChild(name);
    btn.appendChild(country);
    btn.addEventListener("click", () => selectMatch(i));
    searchResults.appendChild(btn);
  });

  searchResults.classList.add("visible");
}

function selectMatch(i) {
  const match = currentMatches[i];
  if (!match) return;
  activateCity(match.el, match.city);
  searchInput.value = match.city.name;
  closeResults();
}

function closeResults() {
  searchResults.classList.remove("visible");
  currentMatches = [];
  highlightedIndex = -1;
}

function updateHighlight() {
  const buttons = searchResults.querySelectorAll("button");
  buttons.forEach((b, i) => b.classList.toggle("highlighted", i === highlightedIndex));
  if (highlightedIndex >= 0 && buttons[highlightedIndex]) {
    buttons[highlightedIndex].scrollIntoView({ block: "nearest" });
  }
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim().toLowerCase();

  const matches = [];
  cityEls.forEach(({ el, city }) => {
    const haystack = `${city.name} ${city.country}`.toLowerCase();
    const isMatch = value.length === 0 || haystack.includes(value);
    el.classList.toggle("dimmed", !isMatch);
    if (isMatch && value.length > 0) matches.push({ el, city });
  });

  if (value.length === 0) {
    closeResults();
  } else {
    renderResults(matches);
  }
});

searchInput.addEventListener("focus", () => {
  if (searchInput.value.trim().length > 0 && currentMatches.length > 0) {
    searchResults.classList.add("visible");
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (!searchResults.classList.contains("visible") || currentMatches.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    highlightedIndex = Math.min(highlightedIndex + 1, currentMatches.length - 1);
    updateHighlight();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    highlightedIndex = Math.max(highlightedIndex - 1, 0);
    updateHighlight();
  } else if (e.key === "Enter") {
    e.preventDefault();
    selectMatch(highlightedIndex >= 0 ? highlightedIndex : 0);
  } else if (e.key === "Escape") {
    closeResults();
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrap")) {
    closeResults();
  }
});

setInterval(() => {
  if (activeCity) {
    timeEl.textContent = timeLabel(activeCity.tz);
    offsetEl.textContent = offsetLabel(activeCity.tz);
  }
}, 1000);

function pickDefaultCity() {
  let browserTz;
  try {
    browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    browserTz = null;
  }

  if (browserTz) {
    const exact = cityEls.find((c) => c.city.tz === browserTz);
    if (exact) return exact;

    const browserOffset = offsetHoursForTz(browserTz);
    let closest = null;
    let closestDiff = Infinity;
    cityEls.forEach((c) => {
      const diff = Math.abs(offsetHoursForTz(c.city.tz) - browserOffset);
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = c;
      }
    });
    if (closest) return closest;
  }

  return cityEls.find((c) => c.city.name === "London") || cityEls[0];
}

const defaultCity = pickDefaultCity();
activateCity(defaultCity.el, defaultCity.city);