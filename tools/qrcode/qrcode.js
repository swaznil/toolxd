(() => {
  const tabs = document.querySelectorAll(".tab");
  const formArea = document.getElementById("formArea");
  const generateBtn = document.getElementById("generateBtn");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const qrEl = document.getElementById("qrcode");
  const hintText = document.getElementById("hintText");

  let currentType = "text";
  let lastData = "";

  const state = {
    text: "",
    url: "",
    emailTo: "",
    emailSubject: "",
    emailBody: "",
    phone: "",
    wifiSsid: "",
    wifiPassword: "",
    wifiSecurity: "WPA",
    wifiHidden: false,
  };

  function setHint(text) {
    hintText.textContent = text;
  }

  function markDirty() {
    setHint("Changes made. Click Generate.");
  }

  function wifiEscape(v) {
    return String(v)
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/:/g, "\\:");
  }

  function getQRData() {
    switch (currentType) {
      case "url":
        return state.url.trim();

      case "email": {
        const params = new URLSearchParams();

        if (state.emailSubject.trim())
          params.set("subject", state.emailSubject);

        if (state.emailBody.trim()) params.set("body", state.emailBody);

        return `mailto:${state.emailTo.trim()}${params.toString() ? "?" + params.toString() : ""}`;
      }

      case "phone":
        return `tel:${state.phone.trim()}`;

      case "wifi":
        return `WIFI:T:${state.wifiSecurity};S:${wifiEscape(state.wifiSsid)};P:${wifiEscape(state.wifiPassword)};H:${state.wifiHidden};;`;

      default:
        return state.text.trim();
    }
  }

  function generateQR() {
    const data = getQRData();

    if (!data) {
      qrEl.innerHTML = "";
      lastData = "";
      setHint("Enter some data first.");
      return;
    }

    qrEl.innerHTML = "";

    new QRCode(qrEl, {
      text: data,
      width: 280,
      height: 280,
      colorDark: "#111",
      colorLight: "#fff",
      correctLevel: QRCode.CorrectLevel.M,
    });

    lastData = data;
    setHint("QR code generated.");
  }

  function renderForm() {
    switch (currentType) {
      case "url":
        formArea.innerHTML = `
        <div class="field">
          <label>URL</label>
          <input id="urlInput" type="url" placeholder="https://example.com" value="${state.url}">
        </div>
      `;

        document.getElementById("urlInput").addEventListener("input", (e) => {
          state.url = e.target.value;
          markDirty();
        });

        break;

      case "email":
        formArea.innerHTML = `
        <div class="field">
          <label>Email</label>
          <input id="emailTo" type="email" value="${state.emailTo}">
        </div>

        <div class="field">
          <label>Subject</label>
          <input id="emailSubject" value="${state.emailSubject}">
        </div>

        <div class="field">
          <label>Body</label>
          <textarea id="emailBody">${state.emailBody}</textarea>
        </div>
      `;

        document.getElementById("emailTo").addEventListener("input", (e) => {
          state.emailTo = e.target.value;
          markDirty();
        });

        document
          .getElementById("emailSubject")
          .addEventListener("input", (e) => {
            state.emailSubject = e.target.value;
            markDirty();
          });

        document.getElementById("emailBody").addEventListener("input", (e) => {
          state.emailBody = e.target.value;
          markDirty();
        });

        break;

      case "phone":
        formArea.innerHTML = `
        <div class="field">
          <label>Phone</label>
          <input id="phoneInput" type="tel" value="${state.phone}">
        </div>
      `;

        document.getElementById("phoneInput").addEventListener("input", (e) => {
          state.phone = e.target.value;
          markDirty();
        });

        break;

      case "wifi":
        formArea.innerHTML = `
        <div class="field">
          <label>Network</label>
          <input id="ssid" value="${state.wifiSsid}">
        </div>

        <div class="field">
          <label>Password</label>
          <input id="pass" value="${state.wifiPassword}">
        </div>

        <div class="field">
          <label>Security</label>
          <select id="security">
            <option>WPA</option>
            <option>WEP</option>
            <option>nopass</option>
          </select>
        </div>

        <div class="field">
          <label>Hidden</label>
          <select id="hidden">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      `;

        document.getElementById("security").value = state.wifiSecurity;
        document.getElementById("hidden").value = String(state.wifiHidden);

        document.getElementById("ssid").addEventListener("input", (e) => {
          state.wifiSsid = e.target.value;
          markDirty();
        });

        document.getElementById("pass").addEventListener("input", (e) => {
          state.wifiPassword = e.target.value;
          markDirty();
        });

        document.getElementById("security").addEventListener("change", (e) => {
          state.wifiSecurity = e.target.value;
          markDirty();
        });

        document.getElementById("hidden").addEventListener("change", (e) => {
          state.wifiHidden = e.target.value === "true";
          markDirty();
        });

        break;

      default:
        formArea.innerHTML = `
        <div class="field">
          <label>Text</label>
          <textarea id="textInput">${state.text}</textarea>
        </div>
      `;

        document.getElementById("textInput").addEventListener("input", (e) => {
          state.text = e.target.value;
          markDirty();
        });
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentType = tab.dataset.type;
      renderForm();
      setHint("Fill the fields and click Generate.");
    });
  });

  generateBtn.addEventListener("click", generateQR);

  copyBtn.addEventListener("click", () => {
    if (!lastData) return;

    navigator.clipboard.writeText(lastData);
    setHint("Copied.");
  });

  downloadBtn.addEventListener("click", () => {
    const canvas = qrEl.querySelector("canvas");
    if (!canvas) return;

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "toolxd-qrcode.png";
    a.click();
  });

  renderForm();
  setHint("Fill the fields and click Generate.");
})();
