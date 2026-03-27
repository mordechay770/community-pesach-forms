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

function translateError(message) {
  const text = String(message || "");

  if (text.includes('Field "ИИН" cannot accept the provided value')) {
    return 'Поле "ИИН" сейчас не принимает такое значение. Скорее всего, нужно сохранять ИИН в отдельное редактируемое поле, а не в lookup или формулу.';
  }

  if (text.includes("Token is required")) return "Не найден токен формы.";
  if (text.includes("Form ID is required")) return "Не найден идентификатор формы.";
  if (text.includes("At least one person is required")) return "В форме должен быть хотя бы один человек.";
  if (text.includes("Each person must answer whether they will be in the city on Pesach")) return "Для каждого человека нужно указать, будет ли он в городе на Песах.";
  if (text.includes("Details confirmation is required")) return "Нужно подтвердить, что данные проверены.";
  if (text.includes("Chametz authorization is required")) return "Нужно подтвердить продажу хамеца.";
  if (text.includes("Invalid or expired token")) return "Ссылка недействительна или срок её действия истёк.";
  if (text.includes("This form has already been submitted")) return "Эта форма уже была отправлена.";
  if (text.includes("Form ID does not match the token")) return "Ссылка не соответствует этой форме.";
  if (text.includes("Airtable environment variables are not configured yet")) return "Интеграция сайта ещё не завершена.";

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
  const contactsMarkup = contacts.map((contact, contactIndex) => `
    <div class="contact-item">
      <div class="contact-grid">
        <label>
          <span>Номер ${contactIndex + 1}</span>
          <input type="text" value="${contact.number || ""}" data-person-index="${index}" data-contact-index="${contactIndex}" data-field="number">
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
        <label>
          <span>Статус номера</span>
          <select data-person-index="${index}" data-contact-index="${contactIndex}" data-field="status">
            <option value="">Выберите</option>
            <option value="active"${contact.status === "active" ? " selected" : ""}>Активный</option>
            <option value="inactive"${contact.status === "inactive" ? " selected" : ""}>Неактивный</option>
            <option value="unknown"${contact.status === "unknown" ? " selected" : ""}>Нужно уточнить</option>
          </select>
        </label>
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
        <div class="role-badge">${person.member_code || "Новая запись"}</div>
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
            <option value="M"${person.gender === "M" ? " selected" : ""}>М</option>
            <option value="F"${person.gender === "F" ? " selected" : ""}>Ж</option>
          </select>
        </label>
        <label>
          <span>Дата рождения</span>
          <input type="text" value="${person.birth_date || ""}" data-person-index="${index}" data-field="birth_date">
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
        ${person.contacts?.length ? `Количество номеров: ${person.contacts.length}` : "Контактные данные еще не заполнены."}
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
  fields.formId.value = data.form_id || "";
  fields.requestId.value = data.request_id || "";
  fields.groupFormId.value = data.group_form_id || "";
  fields.modeField.value = data.mode || "";
  fields.memberCode.value = data.meta?.member_code || "";
  fields.addressCode.value = data.meta?.address_code || "";
  fields.address.value = data.address?.full || "";
  fields.addressConfirmed.value = "";
  fields.newAddress.value = "";
  fields.detailsConfirmed.checked = false;
  fields.chametz.checked = false;
  modeBadge.textContent = `mode: ${data.mode || "unknown"}`;
  payloadSummary.textContent = data.summary || `Loaded form ${data.form_id || ""}`.trim();
  renderPersons(data.persons || [], data.mode);
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
    return;
  }

  currentPayload.persons[Number(personIndex)][field] = target.value;
}

function addContactToPerson(personIndex) {
  if (!currentPayload?.persons?.[personIndex]) {
    return;
  }

  currentPayload.persons[personIndex].contacts ||= [];
  currentPayload.persons[personIndex].contacts.push({
    number: "",
    owner_type: "",
    whatsapp: "",
    status: ""
  });

  renderPersons(currentPayload.persons, currentPayload.mode);
}

function buildSubmitPayload() {
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
    persons: currentPayload?.persons || []
  };
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
  submitOutput.textContent = "No submit yet.";
  payloadSummary.textContent = "Загружаем данные формы...";
  try {
    const data = await callJson("/.netlify/functions/load-form", {
      token: tokenInput.value.trim()
    });
    fillForm(data);
  } catch (error) {
    payloadSummary.textContent = `Load failed: ${error.message}`;
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
  const button = event.target.closest(".add-contact-btn");
  if (!button) {
    return;
  }

  addContactToPerson(Number(button.dataset.personIndex));
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
      { number: "", owner_type: "", whatsapp: "", status: "" }
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
    submitOutput.textContent = `Submit failed: ${error.message}`;
  }
});

const queryToken = new URLSearchParams(window.location.search).get("t");
if (queryToken) {
  tokenInput.value = queryToken;
}
