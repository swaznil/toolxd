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

// Projection matched to the map <image> placed at x0 y110 w1600 h520
// inside a 1600x760 viewBox (equirectangular, full lon -180..180, lat -90..90).
function project(lat, lon) {
  const x = ((lon + 180) / 360) * 1600;
  const y = 110 + ((90 - lat) / 180) * 520;
  return { x, y };
}

const NS = "http://www.w3.org/2000/svg";
const cityLayer = document.getElementById("cityLayer");
const tooltip = document.getElementById("tooltip");
const mapWrapper = document.querySelector(".map-wrapper");
const cityNameEl = document.getElementById("cityName");
const timeEl = document.getElementById("time");
const offsetEl = document.getElementById("offset");
const searchInput = document.getElementById("searchInput");

let activeCity = null;
const cityEls = [];

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
  g.addEventListener("mouseenter", (e) => showTooltip(e, city));
  g.addEventListener("mousemove", (e) => positionTooltip(e));
  g.addEventListener("mouseleave", hideTooltip);
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

CITIES.forEach(buildCity);

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim().toLowerCase();
  const matches = [];

  cityEls.forEach(({ el, city }) => {
    const haystack = `${city.name} ${city.country}`.toLowerCase();
    const isMatch = value.length === 0 || haystack.includes(value);
    el.classList.toggle("dimmed", !isMatch);
    if (isMatch && value.length > 0) matches.push({ el, city });
  });

  if (matches.length === 1) {
    activateCity(matches[0].el, matches[0].city);
  }
});

setInterval(() => {
  if (activeCity) {
    timeEl.textContent = timeLabel(activeCity.tz);
    offsetEl.textContent = offsetLabel(activeCity.tz);
  }
}, 1000);

// Default selection on load
const defaultCity = cityEls.find((c) => c.city.name === "London") || cityEls[0];
activateCity(defaultCity.el, defaultCity.city);