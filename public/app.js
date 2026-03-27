const tokenInput = document.getElementById("tokenInput");
const loadBtn = document.getElementById("loadBtn");
const healthBtn = document.getElementById("healthBtn");
const healthOutput = document.getElementById("healthOutput");
const submitOutput = document.getElementById("submitOutput");
const payloadSummary = document.getElementById("payloadSummary");
const modeBadge = document.getElementById("modeBadge");
const form = document.getElementById("form");
const personsContainer = document.getElementById("personsContainer");
const contactsContainer = document.getElementById("contactsContainer");
const addMemberWrap = document.getElementById("addMemberWrap");
const addMemberBtn = document.getElementById("addMemberBtn");
const newAddressWrap = document.getElementById("newAddressWrap");
const tokenBox = document.getElementById("tokenBox");
const healthPanel = document.getElementById("healthPanel");
const techBox = document.getElementById("techBox");

const fields = {
  formId: document.getElementById("formId"),
  requestId: document.getElementById("requestId"),
  groupFormId: document.getElementById("groupFormId"),
  modeField: document.getElementById("modeField"),
  memberCode: document.getElementById("memberCode"),
  addressCode: document.getElementById("addressCode"),
  address: document.getElementById("address"),
  addressConfirmed: document.getElementById("addressConfirmed"),
  newAddress: document.getElementById("newAddress"),
  detailsConfirmed: document.getElementById("detailsConfirmed"),
  chametz: document.getElementById("chametz")
};

let currentPayload = null;

function formatDisplayDate(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  const text = String(raw || "").trim();
  if (!text) {
    return "";
  }

  const dotMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotMatch) {
    return text;
  }

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return `${isoMatch[3]}.${isoMatch[2]}.${isoMatch[1]}`;
  }

  const isoDateTimeMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (isoDateTimeMatch) {
    return `${isoDateTimeMatch[3]}.${isoDateTimeMatch[2]}.${isoDateTimeMatch[1]}`;
  }

  const slashMatch = text.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (slashMatch) {
    return `${slashMatch[3]}.${slashMatch[2]}.${slashMatch[1]}`;
  }

  const dayFirstSlashMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dayFirstSlashMatch) {
    return `${dayFirstSlashMatch[1]}.${dayFirstSlashMatch[2]}.${dayFirstSlashMatch[3]}`;
  }

  const dayFirstDashMatch = text.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dayFirstDashMatch) {
    return `${dayFirstDashMatch[1]}.${dayFirstDashMatch[2]}.${dayFirstDashMatch[3]}`;
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getUTCDate()).padStart(2, "0");
    const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
    const year = String(parsed.getUTCFullYear());
    return `${day}.${month}.${year}`;
  }

  return text;
}

function translateError(message) {
  const text = String(message || "");

  if (text.includes('Field "ИИН" cannot accept the provided value')) {
    return 'Поле "ИИН" сейчас не принимает такое значение. Нужен отдельный редактируемый столбец для записи данных из формы.';
  }

  if (text.includes('Unknown field name: "relationship"')) {
    return 'Поле родства в Airtable пока настроено неверно. Мы уже переводим форму на правильное поле.';
  }

  if (text.includes("Token is required")) return "Не найден токен формы.";
  if (text.includes("Form ID is required")) return "Не найден идентификатор формы.";
  if (text.includes("At least one person is required")) return "В форме должен быть хотя бы один человек.";
  if (text.includes("Each person must answer whether they will be in the city on Pesach")) return "Для каждого человека нужно отдельно указать, будет ли он в городе на Песах.";
  if (text.includes("Details confirmation is required")) return "Нужно подтвердить, что данные проверены.";
  if (text.includes("Chametz authorization is required")) return "Нужно подтвердить продажу хамеца.";
  if (text.includes("Invalid or expired token")) return "Ссылка недействительна или срок ее действия истек.";
  if (text.includes("This form has already been submitted")) return "Эта форма уже была отправлена.";
  if (text.includes("Form ID does not match the token")) return "Ссылка не соответствует этой форме.";
  if (text.includes("Airtable environment variables are not configured yet")) return "Интеграция сайта еще не завершена.";

  return text || "Произошла ошибка.";
}

async function callJson(url, payload = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(translateError(data.error || "Request failed"));
  }

  return data;
}

function roleLabel(role) {
  const labels = {
    self: "Основной заявитель",
    mother: "Мама",
    child: "Ребенок",
    new_member: "Новый участник",
    spouse: "Супруг / супруга"
  };

  return labels[role] || role;
}

function relationshipOptions(selected = "") {
  const values = [
    ["father", "Отец"],
    ["mother", "Мать"],
    ["spouse_male", "Супруг"],
    ["spouse_female", "Супруга"],
    ["son", "Сын"],
    ["daughter", "Дочь"],
    ["grandson", "Внук"],
    ["granddaughter", "Внучка"],
    ["other", "Другое"]
  ];

  return values.map(([value, label]) => (
    `<option value="${value}"${selected === value ? " selected" : ""}>${label}</option>`
  )).join("");
}

function renderPersonCard(person, index) {
  const contacts = person.contacts || [];
  const isPrimaryApplicant = index === 0 && (person.role === "self" || person.role === "mother");
  const codeBadges = [
    person.member_code ? `<div class="role-badge">${person.member_code}</div>` : "",
    person.address_code ? `<div class="role-badge">${person.address_code}</div>` : ""
  ].filter(Boolean).join("");

  const contactsMarkup = contacts.map((contact, contactIndex) => `
    <div class="contact-item">
      <div class="contact-grid">
        <label>
          <span>Номер ${contactIndex + 1}</span>
          <input type="text" value="${contact.number || ""}" placeholder="Например: 77015888488" inputmode="numeric" minlength="11" pattern="[0-9]{11,}" data-person-index="${index}" data-contact-index="${contactIndex}" data-field="number">
        </label>
        <label>
          <span>Кому принадлежит номер</span>
          <select data-person-index="${index}" data-contact-index="${contactIndex}" data-field="owner_type">
            <option value="">Выберите</option>
            <option value="self"${contact.owner_type === "self" ? " selected" : ""}>Ему самому / ей самой</option>
            <option value="parent"${contact.owner_type === "parent" ? " selected" : ""}>Родителям</option>
            <option value="family"${contact.owner_type === "family" ? " selected" : ""}>Члену семьи</option>
          </select>
        </label>
        <label>
          <span>WhatsApp</span>
          <select data-person-index="${index}" data-contact-index="${contactIndex}" data-field="whatsapp">
            <option value="">Выберите</option>
            <option value="yes"${contact.whatsapp === "yes" ? " selected" : ""}>Да</option>
            <option value="no"${contact.whatsapp === "no" ? " selected" : ""}>Нет</option>
          </select>
        </label>
      </div>
      <div class="inline-actions">
        <button type="button" class="secondary remove-contact-btn" data-person-index="${index}" data-contact-index="${contactIndex}">Удалить номер</button>
      </div>
    </div>
  `).join("");

  const iinBlock = isPrimaryApplicant ? "" : `
        <label>
          <span>ИИН</span>
          <input type="text" value="${person.iin || ""}" data-person-index="${index}" data-field="iin">
        </label>
  `;

  const relationshipBlock = isPrimaryApplicant ? "" : `
        <label>
          <span>Кем этот человек приходится основному заявителю</span>
          <select data-person-index="${index}" data-field="relationship">
            <option value="">Выберите</option>
            ${relationshipOptions(person.relationship)}
          </select>
        </label>
  `;

  const parentBlock = person.show_parent_fields ? `
    <div class="person-grid">
      <label>
        <span>Национальность матери</span>
        <input type="text" value="${person.parent_mother_nationality || ""}" data-person-index="${index}" data-field="parent_mother_nationality">
      </label>
      <label>
        <span>Национальность отца</span>
        <input type="text" value="${person.parent_father_nationality || ""}" data-person-index="${index}" data-field="parent_father_nationality">
      </label>
    </div>
  ` : "";

  return `
    <article class="person-card" data-person-index="${index}">
      <div class="person-top">
        <div>
          <strong>${person.full_name || "Без имени"}</strong>
          <div class="role-badge">${roleLabel(person.role)}</div>
        </div>
        <div class="person-badges">${codeBadges || '<div class="role-badge">Новая запись</div>'}</div>
      </div>

      <div class="person-grid">
        <label>
          <span>Фамилия</span>
          <input type="text" value="${person.last_name || ""}" data-person-index="${index}" data-field="last_name">
        </label>
        <label>
          <span>Имя</span>
          <input type="text" value="${person.first_name || ""}" data-person-index="${index}" data-field="first_name">
        </label>
        <label>
          <span>Отчество</span>
          <input type="text" value="${person.middle_name || ""}" data-person-index="${index}" data-field="middle_name">
        </label>
        ${iinBlock}
        <label>
          <span>Пол</span>
          <select data-person-index="${index}" data-field="gender">
            <option value="">Выберите</option>
            <option value="М"${person.gender === "М" || person.gender === "M" ? " selected" : ""}>М</option>
            <option value="Ж"${person.gender === "Ж" || person.gender === "F" ? " selected" : ""}>Ж</option>
          </select>
        </label>
        <label>
          <span>Дата рождения</span>
          <input type="text" value="${formatDisplayDate(person.birth_date) || ""}" placeholder="ДД.ММ.ГГГГ" data-person-index="${index}" data-field="birth_date">
        </label>
        <label>
          <span>Будет в городе на Песах *</span>
          <select data-person-index="${index}" data-field="will_be_in_city" required>
            <option value="">Выберите</option>
            <option value="yes"${person.will_be_in_city === "yes" ? " selected" : ""}>Да</option>
            <option value="no"${person.will_be_in_city === "no" ? " selected" : ""}>Нет</option>
          </select>
        </label>
        ${relationshipBlock}
      </div>

      ${parentBlock}

      <div class="requirement">Без отдельного ответа о нахождении в городе нельзя завершить форму.</div>

      <div class="contact-list">
        ${contactsMarkup}
      </div>
      <div class="inline-actions">
        <button type="button" class="secondary add-contact-btn" data-person-index="${index}">Добавить номер</button>
      </div>
    </article>
  `;
}

function renderContactsSummary(persons) {
  contactsContainer.innerHTML = persons.map((person) => `
    <article class="contact-card">
      <div class="contact-top">
        <strong>${person.full_name || `${person.first_name || ""} ${person.last_name || ""}`.trim()}</strong>
        <div class="role-badge">${roleLabel(person.role)}</div>
      </div>
      <div class="summary">
        ${person.contacts?.length
          ? person.contacts.map((contact) => {
              const owner = contact.owner_type ? ` · ${contact.owner_type}` : "";
              const whatsapp = contact.whatsapp === "yes" ? " · WhatsApp" : "";
              return `<div>${contact.number || "Без номера"}${owner}${whatsapp}</div>`;
            }).join("")
          : "Контактные данные еще не заполнены."}
      </div>
    </article>
  `).join("");
}

function renderPersons(persons, mode) {
  personsContainer.innerHTML = persons.map((person, index) => renderPersonCard(person, index)).join("");
  renderContactsSummary(persons);
  addMemberWrap.classList.toggle("hidden", mode === "single_update");
}

function fillForm(data) {
  currentPayload = structuredClone(data);
  currentPayload.persons = (currentPayload.persons || []).map((person) => ({
    ...person,
    birth_date: formatDisplayDate(person.birth_date)
  }));
  fields.formId.value = data.form_id || "";
  fields.requestId.value = data.request_id || "";
  fields.groupFormId.value = data.group_form_id || "";
  fields.modeField.value = data.mode || "";
  fields.memberCode.textContent = data.meta?.member_code || "—";
  fields.addressCode.textContent = data.meta?.address_code || "—";
  fields.address.value = data.address?.full || "";
  fields.addressConfirmed.value = "";
  fields.newAddress.value = "";
  fields.detailsConfirmed.checked = false;
  fields.chametz.checked = false;
  modeBadge.textContent = `mode: ${data.mode || "unknown"}`;
  payloadSummary.textContent = data.summary || `Loaded form ${data.form_id || ""}`.trim();
  renderPersons(currentPayload.persons || [], data.mode);
}

function ensureAllCityAnswers() {
  const persons = currentPayload?.persons || [];
  return persons.every((person) => person.will_be_in_city === "yes" || person.will_be_in_city === "no");
}

function syncFieldFromEvent(target) {
  const personIndex = target.dataset.personIndex;
  const contactIndex = target.dataset.contactIndex;
  const field = target.dataset.field;

  if (personIndex === undefined || !currentPayload) {
    return;
  }

  if (contactIndex !== undefined) {
    currentPayload.persons[Number(personIndex)].contacts[Number(contactIndex)][field] = target.value;
    renderContactsSummary(currentPayload.persons);
    return;
  }

  currentPayload.persons[Number(personIndex)][field] = target.value;
}

function normalizeContactNumber(value) {
  return String(value || "").replace(/\D+/g, "");
}

function addContactToPerson(personIndex) {
  if (!currentPayload?.persons?.[personIndex]) {
    return;
  }

  currentPayload.persons[personIndex].contacts ||= [];
  currentPayload.persons[personIndex].contacts.push({
    number: "",
    owner_type: "",
    whatsapp: ""
  });

  renderPersons(currentPayload.persons, currentPayload.mode);
}

function removeContactFromPerson(personIndex, contactIndex) {
  const person = currentPayload?.persons?.[personIndex];
  if (!person?.contacts) {
    return;
  }

  if (person.contacts.length <= 1) {
    person.contacts[0] = {
      number: "",
      owner_type: "",
      whatsapp: ""
    };
  } else {
    person.contacts.splice(contactIndex, 1);
  }

  renderPersons(currentPayload.persons, currentPayload.mode);
}

function buildSubmitPayload() {
  const normalizedPersons = (currentPayload?.persons || []).map((person) => ({
    ...person,
    birth_date: formatDisplayDate(person.birth_date),
    contacts: (person.contacts || []).map((contact) => ({
      ...contact,
      number: normalizeContactNumber(contact.number)
    }))
  }));

  return {
    token: tokenInput.value.trim(),
    form_id: fields.formId.value,
    request_id: fields.requestId.value,
    group_form_id: fields.groupFormId.value,
    mode: fields.modeField.value,
    address: {
      full: fields.address.value,
      confirmed: fields.addressConfirmed.value,
      new_address: fields.newAddress.value
    },
    details_confirmed: fields.detailsConfirmed.checked,
    chametz_sale_confirmation: fields.chametz.checked,
    persons: normalizedPersons
  };
}

async function loadCurrentToken() {
  submitOutput.textContent = "Нет отправки.";
  payloadSummary.textContent = "Загружаем данные формы...";
  const data = await callJson("/.netlify/functions/load-form", {
    token: tokenInput.value.trim()
  });
  fillForm(data);
}

function enableLiveMode() {
  tokenBox?.classList.add("hidden");
  healthPanel?.classList.add("hidden");
  techBox?.classList.add("hidden");
}

healthBtn.addEventListener("click", async () => {
  healthOutput.textContent = "Checking...";
  try {
    const data = await callJson("/.netlify/functions/health-check", {});
    healthOutput.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    healthOutput.textContent = error.message;
  }
});

loadBtn.addEventListener("click", async () => {
  try {
    await loadCurrentToken();
  } catch (error) {
    payloadSummary.textContent = `Ошибка загрузки: ${error.message}`;
  }
});

fields.addressConfirmed.addEventListener("change", () => {
  const showNewAddress = fields.addressConfirmed.value === "no";
  newAddressWrap.classList.toggle("hidden", !showNewAddress);
});

personsContainer.addEventListener("input", (event) => {
  syncFieldFromEvent(event.target);
});

personsContainer.addEventListener("change", (event) => {
  syncFieldFromEvent(event.target);
});

personsContainer.addEventListener("click", (event) => {
  const addButton = event.target.closest(".add-contact-btn");
  if (addButton) {
    addContactToPerson(Number(addButton.dataset.personIndex));
    return;
  }

  const removeButton = event.target.closest(".remove-contact-btn");
  if (removeButton) {
    removeContactFromPerson(
      Number(removeButton.dataset.personIndex),
      Number(removeButton.dataset.contactIndex)
    );
  }
});

addMemberBtn.addEventListener("click", () => {
  if (!currentPayload) {
    return;
  }

  currentPayload.persons.push({
    role: "new_member",
    relationship: "other",
    full_name: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    iin: "",
    require_iin: true,
    gender: "",
    birth_date: "",
    will_be_in_city: "",
    show_parent_fields: true,
    parent_mother_nationality: "",
    parent_father_nationality: "",
    contacts: [
      { number: "", owner_type: "", whatsapp: "" }
    ]
  });

  renderPersons(currentPayload.persons, currentPayload.mode);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentPayload) {
    submitOutput.textContent = "Сначала откройте форму по ссылке.";
    return;
  }

  if (!ensureAllCityAnswers()) {
    submitOutput.textContent = "Для каждого человека нужно отдельно указать, будет ли он в городе на Песах.";
    return;
  }

  if (!fields.detailsConfirmed.checked || !fields.chametz.checked) {
    submitOutput.textContent = "Перед отправкой нужно подтвердить данные и продажу хамеца.";
    return;
  }

  const invalidPhone = (currentPayload?.persons || []).some((person) =>
    (person.contacts || []).some((contact) => {
      const normalized = normalizeContactNumber(contact.number);
      return normalized && normalized.length < 11;
    })
  );

  if (invalidPhone) {
    submitOutput.textContent = "Номер телефона нужно указывать с кодом страны, например: 77015888488.";
    return;
  }

  submitOutput.textContent = "Отправляем форму...";
  try {
    const data = await callJson("/.netlify/functions/submit-form", buildSubmitPayload());
    submitOutput.textContent = JSON.stringify(data, null, 2);
    if (data.ok) {
      setTimeout(() => {
        window.location.href = "./success.html";
      }, 700);
    }
  } catch (error) {
    submitOutput.textContent = `Ошибка отправки: ${error.message}`;
  }
});

const queryToken = new URLSearchParams(window.location.search).get("t");
if (queryToken) {
  tokenInput.value = queryToken;
  enableLiveMode();
  loadCurrentToken().catch((error) => {
    payloadSummary.textContent = `Ошибка загрузки: ${error.message}`;
  });
}
