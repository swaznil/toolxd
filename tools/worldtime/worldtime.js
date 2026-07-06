const cityList = document.getElementById("cityList");
const cityName = document.getElementById("cityName");
const timezoneChip = document.getElementById("timezoneChip");
const timezoneName = document.getElementById("timezoneName");
const digitalTime = document.getElementById("digitalTime");
const dayPeriod = document.getElementById("dayPeriod");
const heroClock = document.getElementById("heroClock");
const heroDate = document.getElementById("heroDate");

const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");

const compareA = document.getElementById("compareA");
const compareB = document.getElementById("compareB");
const compareATime = document.getElementById("compareATime");
const compareBTime = document.getElementById("compareBTime");
const compareAName = document.getElementById("compareAName");
const compareBName = document.getElementById("compareBName");

const timeDifference = document.getElementById("timeDifference");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const cityCount = document.getElementById("cityCount");

const cities = [
  { city: "Kathmandu", country: "Nepal", tz: "Asia/Kathmandu" },
  { city: "Tokyo", country: "Japan", tz: "Asia/Tokyo" },
  { city: "London", country: "United Kingdom", tz: "Europe/London" },
  { city: "New York", country: "United States", tz: "America/New_York" },
  { city: "Los Angeles", country: "United States", tz: "America/Los_Angeles" },
  { city: "Paris", country: "France", tz: "Europe/Paris" },
  { city: "Sydney", country: "Australia", tz: "Australia/Sydney" },
  { city: "Dubai", country: "United Arab Emirates", tz: "Asia/Dubai" },
  { city: "Singapore", country: "Singapore", tz: "Asia/Singapore" },
  { city: "Bangkok", country: "Thailand", tz: "Asia/Bangkok" },
  { city: "Berlin", country: "Germany", tz: "Europe/Berlin" },
  { city: "Toronto", country: "Canada", tz: "America/Toronto" },
  { city: "Auckland", country: "New Zealand", tz: "Pacific/Auckland" },
  { city: "São Paulo", country: "Brazil", tz: "America/Sao_Paulo" },
  { city: "Cairo", country: "Egypt", tz: "Africa/Cairo" },
  { city: "Seoul", country: "South Korea", tz: "Asia/Seoul" },
  { city: "Mumbai", country: "India", tz: "Asia/Kolkata" },
  { city: "Moscow", country: "Russia", tz: "Europe/Moscow" },
  { city: "Rome", country: "Italy", tz: "Europe/Rome" },
  { city: "Hong Kong", country: "China", tz: "Asia/Hong_Kong" },
];

let activeCity = cities[0];

function buildTicks() {
  const oldTicks = document.querySelectorAll(".tick");

  oldTicks.forEach((tick) => tick.remove());

  const face = document.getElementById("clockFace");

  for (let i = 0; i < 60; i++) {
    const tick = document.createElement("div");

    tick.className = `tick ${i % 5 === 0 ? "major" : ""}`;

    const radius = i % 5 === 0 ? 132 : 142;

    tick.style.transform = `translate(-50%,-100%) rotate(${i * 6}deg) translateY(-${radius}px)`;

    face.appendChild(tick);
  }
}

buildTicks();

function formatTime(tz) {
  return moment().tz(tz).format("HH:mm:ss");
}
function formatDate(tz) {
  return moment().tz(tz).format("dddd, MMMM D");
}
function getOffset(tz) {
  return moment.tz(tz).format("Z");
}

function getPeriod(hour) {
  if (hour < 5) return "Night";
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  if (hour < 21) return "Evening";
  return "Night";
}

function updateClock() {
  const now = moment().tz(activeCity.tz);

  const hour = now.hours();
  const minute = now.minutes();
  const second = now.seconds();

  const hourDeg = ((hour % 12) + minute / 60) * 30;
  const minuteDeg = (minute + second / 60) * 6;
  const secondDeg = second * 6;

  hourHand.style.transform = `rotate(${hourDeg}deg) translateY(8px)`;
  minuteHand.style.transform = `rotate(${minuteDeg}deg) translateY(10px)`;
  secondHand.style.transform = `rotate(${secondDeg}deg) translateY(14px)`;

  digitalTime.textContent = now.format("HH:mm:ss");
  heroClock.textContent = now.format("HH:mm:ss");
  heroDate.textContent = formatDate(activeCity.tz);

  dayPeriod.textContent = getPeriod(hour);

  timezoneChip.textContent = `UTC${getOffset(activeCity.tz)}`;
  timezoneName.textContent = activeCity.tz;
}

function renderCities(list) {
  cityList.innerHTML = "";

  cityCount.textContent = `${list.length} Cities`;

  list.forEach((city) => {
    const card = document.createElement("div");
    card.className = "city-card";

    if (city.city === activeCity.city) {
      card.classList.add("active");
    }

    card.innerHTML = `
<div class="city-card-top">
<div>
<h3>${city.city}</h3>
<small>${city.country}</small>
</div>

<div class="city-card-time">
${formatTime(city.tz)}
</div>
</div>
`;

    card.addEventListener("click", () => {
      activeCity = city;
      cityName.textContent = city.city;

      document.querySelectorAll(".city-card").forEach((el) => {
        el.classList.remove("active");
      });

      card.classList.add("active");

      updateClock();
    });

    cityList.appendChild(card);
  });
}

function populateCompare() {
  cities.forEach((city) => {
    const optionA = document.createElement("option");
    optionA.value = city.tz;
    optionA.textContent = `${city.city} (${city.country})`;

    const optionB = optionA.cloneNode(true);

    compareA.appendChild(optionA);
    compareB.appendChild(optionB);
  });

  compareA.value = "Asia/Kathmandu";
  compareB.value = "Europe/London";
}

function updateComparison() {
  const tzA = compareA.value;
  const tzB = compareB.value;

  const cityA = cities.find((c) => c.tz === tzA);
  const cityB = cities.find((c) => c.tz === tzB);
  const timeA = moment().tz(tzA);
  const timeB = moment().tz(tzB);

  compareATime.textContent = timeA.format("HH:mm");
  compareBTime.textContent = timeB.format("HH:mm");
  compareAName.textContent = cityA.city;
  compareBName.textContent = cityB.city;

  const offsetA = timeA.utcOffset();
  const offsetB = timeB.utcOffset();

  const diff = (offsetA - offsetB) / 60;

  if (diff === 0) {
    timeDifference.textContent = "Same";
  } else {
    timeDifference.textContent = `${Math.abs(diff)}h ${diff > 0 ? "ahead" : "behind"}`;
  }
}

compareA.addEventListener("change", updateComparison);
compareB.addEventListener("change", updateComparison);

function searchCities(value) {
  const query = value.toLowerCase();

  const filtered = cities.filter(
    (city) =>
      city.city.toLowerCase().includes(query) ||
      city.country.toLowerCase().includes(query) ||
      city.tz.toLowerCase().includes(query),
  );

  renderCities(filtered);

  searchResults.innerHTML = "";

  if (!query) {
    searchResults.classList.remove("visible");
    return;
  }

  filtered.slice(0, 6).forEach((city) => {
    const item = document.createElement("div");
    item.className = "search-item";

    item.innerHTML = `
<div>
<strong>${city.city}</strong>
</div>

<small>${city.country}</small>
`;

    item.addEventListener("click", () => {
      activeCity = city;

      cityName.textContent = city.city;

      updateClock();

      renderCities(cities);

      searchInput.value = city.city;

      searchResults.classList.remove("visible");
    });

    searchResults.appendChild(item);
  });

  searchResults.classList.add("visible");
}

searchInput.addEventListener("input", (e) => {
  searchCities(e.target.value);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrap")) {
    searchResults.classList.remove("visible");
  }
});

function autoDetect() {
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const found = cities.find((city) => city.tz === userTz);

  if (found) {
    activeCity = found;
    cityName.textContent = found.city;
  }
}

autoDetect();
populateCompare();
renderCities(cities);
updateClock();
updateComparison();

setInterval(() => {
  updateClock();

  updateComparison();

  document.querySelectorAll(".city-card-time").forEach((el, index) => {
    el.textContent = formatTime(cities[index].tz);
  });
}, 1000);