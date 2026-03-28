const tokenInput = document.getElementById("tokenInput");
const loadBtn = document.getElementById("loadBtn");
const healthBtn = document.getElementById("healthBtn");
const healthOutput = document.getElementById("healthOutput");
const submitOutput = document.getElementById("submitOutput");
const payloadSummary = document.getElementById("payloadSummary");
const modeBadge = document.getElementById("modeBadge");
const form = document.getElementById("form");
const personsContainer = document.getElementById("personsContainer");
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
  address: document.getElementById("address"),
  addressConfirmed: document.getElementById("addressConfirmed"),
  newAddress: document.getElementById("newAddress"),
  detailsConfirmed: document.getElementById("detailsConfirmed"),
  chametz: document.getElementById("chametz")
};

let currentPayload = null;
let currentExpandedPersonIndex = 0;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDisplayDate(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  const text = String(raw || "").trim();
  if (!text) return "";

  const dotMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotMatch) return text;

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
  if (isoMatch) return `${isoMatch[3]}.${isoMatch[2]}.${isoMatch[1]}`;

  const slashMatch = text.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (slashMatch) return `${slashMatch[3]}.${slashMatch[2]}.${slashMatch[1]}`;

  const dayFirstSlashMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dayFirstSlashMatch) return `${dayFirstSlashMatch[1]}.${dayFirstSlashMatch[2]}.${dayFirstSlashMatch[3]}`;

  const dayFirstDashMatch = text.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dayFirstDashMatch) return `${dayFirstDashMatch[1]}.${dayFirstDashMatch[2]}.${dayFirstDashMatch[3]}`;

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getUTCDate()).padStart(2, "0");
    const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
    const year = String(parsed.getUTCFullYear());
    return `${day}.${month}.${year}`;
  }

  return text;
}

function parseDateParts(value) {
  const formatted = formatDisplayDate(value);
  const match = formatted.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  return { day: Number(match[1]), month: Number(match[2]), year: Number(match[3]) };
}

function calculateAge(value) {
  const parts = parseDateParts(value);
  if (!parts) return null;
  const today = new Date();
  let age = today.getFullYear() - parts.year;
  const monthDelta = today.getMonth() + 1 - parts.month;
  const dayDelta = today.getDate() - parts.day;
  if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) age -= 1;
  return age;
}

function isMinor(person) {
  const age = calculateAge(person?.birth_date);
  return age !== null && age < 18;
}

function isFilled(value) {
  return String(value ?? "").trim() !== "";
}

function isContactComplete(contact) {
  if (!contact || !isFilled(contact.number) || !isFilled(contact.owner_type)) return false;
  if ((contact.kind || "phone") !== "email" && !["yes", "no"].includes(contact.whatsapp)) return false;
  if (contact.is_existing_source && !["yes", "no"].includes(contact.active)) return false;
  return true;
}

function isPersonComplete(person, index) {
  const isPrimaryApplicant = index === 0 && (person.role === "self" || person.role === "mother");
  if (!isFilled(person.last_name) || !isFilled(person.first_name)) return false;
  if (!isFilled(person.gender) || !isFilled(person.birth_date)) return false;
  if (!["yes", "no"].includes(person.will_be_in_city)) return false;
  if (!isPrimaryApplicant && !isFilled(person.relationship)) return false;
  if ((person.role === "child" || person.role === "new_member")) {
    if (!["yes", "no"].includes(person.same_as_primary_address)) return false;
    if (person.same_as_primary_address === "no" && !isFilled(person.child_address)) return false;
  }
  if (person.role === "child" && !isFilled(person.school_number)) return false;
  return (person.contacts || []).every(isContactComplete);
}

function getPreferredExpandedPersonIndex(persons) {
  if (!Array.isArray(persons) || !persons.length) return 0;
  const firstIncompleteIndex = persons.findIndex((person, index) => !isPersonComplete(person, index));
  if (firstIncompleteIndex !== -1) return firstIncompleteIndex;
  return Math.min(currentExpandedPersonIndex, persons.length - 1);
}

function translateError(message) {
  const text = String(message || "");
  if (text.includes("Token is required")) return "Не найден токен формы.";
  if (text.includes("Form ID is required")) return "Не найден идентификатор формы.";
  if (text.includes("At least one person is required")) return "В форме должен быть хотя бы один человек.";
  if (text.includes("Each person must answer whether they will be in the city on Pesach")) return "Для каждого человека нужно отдельно указать, будет ли он(а) в городе Алматы в период 1-9.4.2026.";
  if (text.includes("Details confirmation is required")) return "Нужно подтвердить правильность данных.";
  if (text.includes("Chametz authorization is required")) return "Нужно подтвердить продажу хамеца.";
  if (text.includes("All contact fields must be completed")) return "Нужно заполнить все обязательные поля в контактных данных.";
  if (text.includes("Invalid or expired token")) return "Ссылка недействительна или срок её действия истёк.";
  if (text.includes("This form has already been submitted")) return "Эта форма уже была отправлена.";
  if (text.includes("Form ID does not match the token")) return "Ссылка не соответствует этой форме.";
  if (text.includes("Airtable environment variables are not configured yet")) return "Интеграция сайта ещё не завершена.";
  if (text.includes("New family member must be age 12 or younger")) return "Нового члена семьи можно добавить только если ему или ей не больше 12 лет.";
  return text || "Произошла ошибка.";
}

async function callJson(url, payload = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const rawText = await response.text();
  let data;

  try {
    data = JSON.parse(rawText);
  } catch {
    const fallbackMessage = rawText.trim().startsWith("<")
      ? "Сервер вернул HTML вместо JSON. Скорее всего, функция Netlify сейчас недоступна или deploy завершился с ошибкой."
      : rawText || "Request failed";
    throw new Error(translateError(fallbackMessage));
  }

  if (!response.ok) throw new Error(translateError(data.error || "Request failed"));
  return data;
}

function roleLabel(role) {
  return {
    self: "Основной заявитель",
    mother: "Мама",
    child: "Ребёнок",
    new_member: "Новая запись",
    spouse: "Супруг / супруга"
  }[role] || role;
}

function relationshipOptions(selected = "") {
  const values = [["father", "Отец"],["mother", "Мать"],["spouse_male", "Супруг"],["spouse_female", "Супруга"],["son", "Сын"],["daughter", "Дочь"],["grandson", "Внук"],["granddaughter", "Внучка"],["other", "Другое"]];
  return values.map(([value, label]) => `<option value="${value}"${selected === value ? " selected" : ""}>${label}</option>`).join("");
}

function contactTypeOptions(selected = "phone") {
  return [["phone", "Телефон"], ["email", "Email"]].map(([value, label]) => `<option value="${value}"${selected === value ? " selected" : ""}>${label}</option>`).join("");
}

function contactActivityOptions(selected = "") {
  return [["", "Выберите"], ["yes", "Да, активен"], ["no", "Нет, не активен"]].map(([value, label]) => `<option value="${value}"${selected === value ? " selected" : ""}>${label}</option>`).join("");
}

function contactInputType(kind) { return kind === "email" ? "email" : "text"; }
function contactPlaceholder(kind) { return kind === "email" ? "Например: name@example.com" : "Например: 77015888488"; }
function safeFullName(person) { return person.full_name || `${person.last_name || ""} ${person.first_name || ""}`.trim() || "Без имени"; }

function renderContactItem(contact, person, personIndex, contactIndex) {
  const kind = contact.kind || "phone";
  const canDelete = !contact.is_existing_source;
  const whatsappBlock = kind === "email" ? "" : `<label><span>WhatsApp</span><select data-person-index="${personIndex}" data-contact-index="${contactIndex}" data-field="whatsapp" required><option value="">Выберите</option><option value="yes"${contact.whatsapp === "yes" ? " selected" : ""}>Да</option><option value="no"${contact.whatsapp === "no" ? " selected" : ""}>Нет</option></select></label>`;
  const activeBlock = contact.is_existing_source ? `<label><span>Активен ли этот контакт</span><select data-person-index="${personIndex}" data-contact-index="${contactIndex}" data-field="active" required>${contactActivityOptions(contact.active || "")}</select></label>` : "";
  return `
    <div class="contact-item">
      <div class="contact-grid">
        <label><span>Тип контакта</span><select data-person-index="${personIndex}" data-contact-index="${contactIndex}" data-field="kind" required>${contactTypeOptions(kind)}</select></label>
        <label><span>${kind === "email" ? "Email" : `Номер ${contactIndex + 1}`}</span><input type="${contactInputType(kind)}" value="${escapeHtml(contact.number || "")}" placeholder="${contactPlaceholder(kind)}" ${kind === "email" ? "" : 'inputmode="numeric" minlength="11" pattern="[0-9]{11,}"'} data-person-index="${personIndex}" data-contact-index="${contactIndex}" data-field="number" required></label>
        <label><span>Кому принадлежит контакт</span><select data-person-index="${personIndex}" data-contact-index="${contactIndex}" data-field="owner_type" required><option value="">Выберите</option><option value="self"${contact.owner_type === "self" ? " selected" : ""}>Ему самому / ей самой</option><option value="parent"${contact.owner_type === "parent" ? " selected" : ""}>Родителям</option><option value="family"${contact.owner_type === "family" ? " selected" : ""}>Члену семьи</option></select></label>
        ${whatsappBlock}
        ${activeBlock}
      </div>
      <div class="inline-actions">${canDelete ? `<button type="button" class="secondary remove-contact-btn" data-person-index="${personIndex}" data-contact-index="${contactIndex}">Удалить контакт</button>` : '<span class="contact-lock-note">Контакт из системы нельзя удалить из формы. Его можно только отметить как неактивный.</span>'}</div>
    </div>
  `;
}

function renderPersonCard(person, index) {
  const contacts = person.contacts || [];
  const isPrimaryApplicant = index === 0 && (person.role === "self" || person.role === "mother");
  const isExpanded = index === currentExpandedPersonIndex;
  const isComplete = isPersonComplete(person, index);
  const codeBadges = [person.member_code ? `<div class="role-badge">${escapeHtml(person.member_code)}</div>` : "", person.address_code ? `<div class="role-badge">${escapeHtml(person.address_code)}</div>` : ""].filter(Boolean).join("");
  const iinBlock = isPrimaryApplicant ? "" : `<label><span>ИИН</span><input type="text" value="${escapeHtml(person.iin || "")}" data-person-index="${index}" data-field="iin"></label>`;
  const relationshipBlock = isPrimaryApplicant ? "" : `<label><span>Кем этот человек приходится основному заявителю</span><select data-person-index="${index}" data-field="relationship"><option value="">Выберите</option>${relationshipOptions(person.relationship)}</select></label>`;
  const showChildEducation = person.role !== "child";
  const childAddressBlock = (person.role === "child" || person.role === "new_member") ? `
    <div class="subsection-title">Адрес этого человека</div>
    <div class="person-grid">
      <label class="full-span"><span>Этот человек проживает по тому же адресу, что и указанный выше?</span><select data-person-index="${index}" data-field="same_as_primary_address"><option value="">Выберите</option><option value="yes"${person.same_as_primary_address === "yes" ? " selected" : ""}>Да</option><option value="no"${person.same_as_primary_address === "no" ? " selected" : ""}>Нет</option></select></label>
      ${person.same_as_primary_address === "no" ? `<label class="full-span"><span>Адрес проживания этого человека</span><textarea rows="3" data-person-index="${index}" data-field="child_address">${escapeHtml(person.child_address || "")}</textarea></label>` : ""}
    </div>
  ` : "";
  const profileExtraBlock = person.show_profile_extra_fields ? `
    <div class="subsection-title">Дополнительные личные данные</div>
    <div class="person-grid">
      <label><span>Девичья фамилия</span><input type="text" value="${escapeHtml(person.maiden_name || "")}" data-person-index="${index}" data-field="maiden_name"></label>
      <label><span>Еврейское имя</span><input type="text" value="${escapeHtml(person.hebrew_name || "")}" data-person-index="${index}" data-field="hebrew_name"></label>
      <label><span>Место рождения</span><input type="text" value="${escapeHtml(person.birth_place || "")}" data-person-index="${index}" data-field="birth_place"></label>
      ${showChildEducation ? `<label><span>Образование</span><input type="text" value="${escapeHtml(person.education || "")}" data-person-index="${index}" data-field="education"></label>` : `<label><span>Номер школы</span><input type="text" value="${escapeHtml(person.school_number || "")}" data-person-index="${index}" data-field="school_number"></label>`}
      ${showChildEducation ? `<label class="full-span"><span>Род занятий / специальность</span><input type="text" value="${escapeHtml(person.specialty || "")}" data-person-index="${index}" data-field="specialty"></label>` : ""}
    </div>
  ` : "";
  const parentBlock = person.show_parent_fields ? `
    <div class="subsection-title">Данные о родителях</div>
    <div class="person-grid">
      <label><span>Национальность матери</span><input type="text" value="${escapeHtml(person.parent_mother_nationality || "")}" data-person-index="${index}" data-field="parent_mother_nationality"></label>
      <label><span>Национальность отца</span><input type="text" value="${escapeHtml(person.parent_father_nationality || "")}" data-person-index="${index}" data-field="parent_father_nationality"></label>
      <label><span>Фамилия матери</span><input type="text" value="${escapeHtml(person.mother_last_name || "")}" data-person-index="${index}" data-field="mother_last_name"></label>
      <label><span>Имя матери</span><input type="text" value="${escapeHtml(person.mother_first_name || "")}" data-person-index="${index}" data-field="mother_first_name"></label>
      <label><span>Еврейское имя матери</span><input type="text" value="${escapeHtml(person.mother_hebrew_name || "")}" data-person-index="${index}" data-field="mother_hebrew_name"></label>
      <label><span>Отчество матери</span><input type="text" value="${escapeHtml(person.mother_middle_name || "")}" data-person-index="${index}" data-field="mother_middle_name"></label>
      <label><span>Дата рождения матери</span><input type="text" value="${escapeHtml(formatDisplayDate(person.mother_birth_date) || "")}" placeholder="ДД.ММ.ГГГГ" data-person-index="${index}" data-field="mother_birth_date"></label>
      <label><span>Место рождения матери</span><input type="text" value="${escapeHtml(person.mother_birth_place || "")}" data-person-index="${index}" data-field="mother_birth_place"></label>
      <label><span>Фамилия отца</span><input type="text" value="${escapeHtml(person.father_last_name || "")}" data-person-index="${index}" data-field="father_last_name"></label>
      <label><span>Имя отца</span><input type="text" value="${escapeHtml(person.father_first_name || "")}" data-person-index="${index}" data-field="father_first_name"></label>
      <label><span>Еврейское имя отца</span><input type="text" value="${escapeHtml(person.father_hebrew_name || "")}" data-person-index="${index}" data-field="father_hebrew_name"></label>
      <label><span>Отчество отца</span><input type="text" value="${escapeHtml(person.father_middle_name || "")}" data-person-index="${index}" data-field="father_middle_name"></label>
      <label><span>Дата рождения отца</span><input type="text" value="${escapeHtml(formatDisplayDate(person.father_birth_date) || "")}" placeholder="ДД.ММ.ГГГГ" data-person-index="${index}" data-field="father_birth_date"></label>
      <label><span>Место рождения отца</span><input type="text" value="${escapeHtml(person.father_birth_place || "")}" data-person-index="${index}" data-field="father_birth_place"></label>
    </div>
  ` : "";

  return `
    <article class="person-card${isExpanded ? " is-expanded" : " is-collapsed"}" data-person-index="${index}">
      <button type="button" class="person-toggle" data-person-toggle="${index}" aria-expanded="${isExpanded ? "true" : "false"}">
        <div class="person-top"><div><strong>${escapeHtml(safeFullName(person))}</strong><div class="role-badge">${roleLabel(person.role)}</div></div><div class="person-badges">${codeBadges || '<div class="role-badge">Новая запись</div>'}${isComplete ? '<div class="role-badge role-badge-success">Заполнено</div>' : ''}</div></div>
      </button>
      <div class="person-body"${isExpanded ? "" : ' hidden'}>
      <div class="person-grid">
        <label><span>Фамилия</span><input type="text" value="${escapeHtml(person.last_name || "")}" data-person-index="${index}" data-field="last_name"></label>
        <label><span>Имя</span><input type="text" value="${escapeHtml(person.first_name || "")}" data-person-index="${index}" data-field="first_name"></label>
        <label><span>Отчество</span><input type="text" value="${escapeHtml(person.middle_name || "")}" data-person-index="${index}" data-field="middle_name"></label>
        ${iinBlock}
        <label><span>Пол</span><select data-person-index="${index}" data-field="gender"><option value="">Выберите</option><option value="М"${person.gender === "М" || person.gender === "M" ? " selected" : ""}>М</option><option value="Ж"${person.gender === "Ж" || person.gender === "F" ? " selected" : ""}>Ж</option></select></label>
        <label><span>Дата рождения</span><input type="text" value="${escapeHtml(formatDisplayDate(person.birth_date) || "")}" placeholder="ДД.ММ.ГГГГ" data-person-index="${index}" data-field="birth_date"></label>
        <label><span>Будет ли он(а) в городе Алматы на Песах, в период 1-9.4.2026? *</span><select data-person-index="${index}" data-field="will_be_in_city" required><option value="">Выберите</option><option value="yes"${person.will_be_in_city === "yes" ? " selected" : ""}>Да</option><option value="no"${person.will_be_in_city === "no" ? " selected" : ""}>Нет</option></select></label>
        ${relationshipBlock}
      </div>
      ${childAddressBlock}
      ${profileExtraBlock}
      ${parentBlock}
      <div class="requirement">Без отдельного ответа о нахождении в городе Алматы в период 1-9.4.2026 нельзя завершить форму.</div>
      <div class="contact-list">${contacts.map((contact, contactIndex) => renderContactItem(contact, person, index, contactIndex)).join("")}</div>
        <div class="inline-actions"><button type="button" class="secondary add-contact-btn" data-person-index="${index}">Добавить личный контакт</button>${person.is_newly_added ? `<button type="button" class="secondary remove-member-btn" data-person-index="${index}">Удалить этого человека</button>` : ""}</div>
      </div>
    </article>
    `;
}

function renderPersons(persons, mode) {
  currentExpandedPersonIndex = getPreferredExpandedPersonIndex(persons);
  personsContainer.innerHTML = persons.map((person, index) => renderPersonCard(person, index)).join("");
  addMemberWrap.classList.toggle("hidden", mode === "single_update");
}

function fillForm(data) {
  currentPayload = structuredClone(data);
  const primaryAddress = data.address?.full || "";
  currentPayload.persons = (currentPayload.persons || []).map((person, index) => {
    const isPrimaryApplicant = index === 0 && (person.role === "self" || person.role === "mother");
    const sameAsPrimary = isPrimaryApplicant || !person.address || person.address === primaryAddress ? "yes" : "no";
    return {
      ...person,
      birth_date: formatDisplayDate(person.birth_date),
      mother_birth_date: formatDisplayDate(person.mother_birth_date),
      father_birth_date: formatDisplayDate(person.father_birth_date),
      same_as_primary_address: person.same_as_primary_address || sameAsPrimary,
      child_address: sameAsPrimary === "no" ? (person.child_address || person.address || "") : "",
      contacts: Array.isArray(person.contacts) ? person.contacts : [],
      school_number: person.school_number || ""
    };
  });
  fields.formId.value = data.form_id || "";
  fields.requestId.value = data.request_id || "";
  fields.groupFormId.value = data.group_form_id || "";
  fields.modeField.value = data.mode || "";
  fields.address.value = data.address?.full || "";
  fields.addressConfirmed.value = "";
  fields.newAddress.value = "";
  fields.detailsConfirmed.checked = false;
  fields.chametz.checked = false;
  modeBadge.textContent = `mode: ${data.mode || "unknown"}`;
  payloadSummary.textContent = data.summary || `Loaded form ${data.form_id || ""}`.trim();
  newAddressWrap.classList.add("hidden");
  renderPersons(currentPayload.persons, currentPayload.mode);
}

function ensureAllCityAnswers() { return (currentPayload?.persons || []).every((person) => ["yes", "no"].includes(person.will_be_in_city)); }

function syncFieldFromEvent(target) {
  const personIndex = target.dataset.personIndex;
  const contactIndex = target.dataset.contactIndex;
  const field = target.dataset.field;
  if (personIndex === undefined || !currentPayload) return;

  const person = currentPayload.persons[Number(personIndex)];

  if (contactIndex !== undefined) {
    const contact = person.contacts[Number(contactIndex)];
    contact[field] = target.value;
    if (field === "kind") {
      contact.number = "";
      if (contact.kind === "email") contact.whatsapp = "no";
      renderPersons(currentPayload.persons, currentPayload.mode);
      return;
    }
    return;
  }

  person[field] = target.value;
  if ((field === "relationship") && (person.role === "child" || person.role === "new_member") && ["son", "daughter"].includes(target.value)) {
    const primary = currentPayload.persons?.[0];
    if (primary) {
      person.mother_last_name = primary.last_name || person.mother_last_name || "";
      person.mother_first_name = primary.first_name || person.mother_first_name || "";
      person.mother_middle_name = primary.middle_name || person.mother_middle_name || "";
      person.mother_birth_date = primary.birth_date || person.mother_birth_date || "";
      person.mother_birth_place = primary.birth_place || person.mother_birth_place || "";
      person.mother_hebrew_name = primary.hebrew_name || person.mother_hebrew_name || "";
    }
    renderPersons(currentPayload.persons, currentPayload.mode);
    return;
  }
  if (field === "same_as_primary_address") {
    if (target.value === "yes") person.child_address = "";
    renderPersons(currentPayload.persons, currentPayload.mode);
  }
}

function normalizePhone(value) { return String(value || "").replace(/\D+/g, ""); }
function normalizeContactValue(contact) { return (contact.kind || "phone") === "email" ? String(contact.number || "").trim() : normalizePhone(contact.number); }

function addContactToPerson(personIndex) {
  if (!currentPayload?.persons?.[personIndex]) return;
  currentPayload.persons[personIndex].contacts ||= [];
  currentPayload.persons[personIndex].contacts.push({ number: "", kind: "phone", owner_type: "", whatsapp: "", active: "", is_existing_source: false, contact_record_id: "" });
  renderPersons(currentPayload.persons, currentPayload.mode);
}

function removeContactFromPerson(personIndex, contactIndex) {
  const person = currentPayload?.persons?.[personIndex];
  if (!person?.contacts || person.contacts[contactIndex]?.is_existing_source) return;
  if (person.contacts.length <= 1) {
    if (isMinor(person) || person.role === "new_member") {
      person.contacts = [];
    } else {
      person.contacts[0] = { number: "", kind: "phone", owner_type: "", whatsapp: "", active: "", is_existing_source: false, contact_record_id: "" };
    }
  } else {
    person.contacts.splice(contactIndex, 1);
  }
  renderPersons(currentPayload.persons, currentPayload.mode);
}

function removeMemberFromForm(personIndex) {
  const person = currentPayload?.persons?.[personIndex];
  if (!person?.is_newly_added) return;
  currentPayload.persons.splice(personIndex, 1);
  renderPersons(currentPayload.persons, currentPayload.mode);
}

function buildSubmitPayload() {
  const resolvedMainAddress = fields.addressConfirmed.value === "no" ? fields.newAddress.value || fields.address.value : fields.address.value;
  const normalizedPersons = (currentPayload?.persons || []).map((person) => ({
    ...person,
    birth_date: formatDisplayDate(person.birth_date),
    mother_birth_date: formatDisplayDate(person.mother_birth_date),
    father_birth_date: formatDisplayDate(person.father_birth_date),
    school_number: person.school_number || "",
    address: (person.role === "child" || person.role === "new_member") ? (person.same_as_primary_address === "no" ? person.child_address || "" : resolvedMainAddress) : (person.address || resolvedMainAddress),
    contacts: (person.contacts || []).map((contact) => ({ ...contact, number: normalizeContactValue(contact) }))
  }));

  return {
    token: tokenInput.value.trim(),
    form_id: fields.formId.value,
    request_id: fields.requestId.value,
    group_form_id: fields.groupFormId.value,
    mode: fields.modeField.value,
    address: { full: fields.address.value, confirmed: fields.addressConfirmed.value, new_address: fields.newAddress.value },
    details_confirmed: fields.detailsConfirmed.checked,
    chametz_sale_confirmation: fields.chametz.checked,
    persons: normalizedPersons
  };
}

async function loadCurrentToken() {
  submitOutput.textContent = "Нет отправки.";
  payloadSummary.textContent = "Загружаем данные формы...";
  const data = await callJson("/.netlify/functions/load-form", { token: tokenInput.value.trim() });
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
  newAddressWrap.classList.toggle("hidden", fields.addressConfirmed.value !== "no");
});

personsContainer.addEventListener("input", (event) => { syncFieldFromEvent(event.target); });
personsContainer.addEventListener("change", (event) => { syncFieldFromEvent(event.target); });

personsContainer.addEventListener("click", (event) => {
  const toggleButton = event.target.closest("[data-person-toggle]");
  if (toggleButton) {
    currentExpandedPersonIndex = Number(toggleButton.dataset.personToggle);
    renderPersons(currentPayload.persons, currentPayload.mode);
    return;
  }
  const addButton = event.target.closest(".add-contact-btn");
  if (addButton) {
    addContactToPerson(Number(addButton.dataset.personIndex));
    return;
  }
  const removeContactButton = event.target.closest(".remove-contact-btn");
  if (removeContactButton) {
    removeContactFromPerson(Number(removeContactButton.dataset.personIndex), Number(removeContactButton.dataset.contactIndex));
    return;
  }
  const removeMemberButton = event.target.closest(".remove-member-btn");
  if (removeMemberButton) removeMemberFromForm(Number(removeMemberButton.dataset.personIndex));
});

addMemberBtn.addEventListener("click", () => {
  if (!currentPayload) return;
  currentPayload.persons.push({
    role: "new_member",
    is_newly_added: true,
    relationship: "son",
    full_name: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    iin: "",
    gender: "",
    birth_date: "",
    same_as_primary_address: "yes",
    child_address: "",
    will_be_in_city: "",
    show_parent_fields: true,
    show_profile_extra_fields: true,
    maiden_name: "",
    hebrew_name: "",
    birth_place: "",
    education: "",
    specialty: "",
    school_number: "",
    parent_mother_nationality: "",
    parent_father_nationality: "",
    mother_last_name: "",
    mother_first_name: "",
    mother_hebrew_name: "",
    mother_middle_name: "",
    mother_birth_date: "",
    mother_birth_place: "",
    father_last_name: "",
    father_first_name: "",
    father_hebrew_name: "",
    father_middle_name: "",
    father_birth_date: "",
    father_birth_place: "",
    contacts: [{ number: "", kind: "phone", owner_type: "", whatsapp: "", active: "", is_existing_source: false, contact_record_id: "" }]
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
    submitOutput.textContent = "Для каждого человека нужно отдельно указать, будет ли он(а) в городе Алматы в период 1-9.4.2026.";
    return;
  }
  if (!fields.detailsConfirmed.checked || !fields.chametz.checked) {
    submitOutput.textContent = "Перед отправкой нужно подтвердить данные и продажу хамеца.";
    return;
  }
  const invalidPhone = (currentPayload?.persons || []).some((person) => (person.contacts || []).some((contact) => {
    if ((contact.kind || "phone") === "email") return false;
    const normalized = normalizePhone(contact.number);
    return normalized && normalized.length < 11;
  }));
  if (invalidPhone) {
    submitOutput.textContent = "Номер телефона нужно указывать с кодом страны, например: 77015888488.";
    return;
  }
  const invalidNewMemberAge = (currentPayload?.persons || []).some((person) => {
    if (person.role !== "new_member") return false;
    const age = calculateAge(person.birth_date);
    return age !== null && age > 12;
  });
  if (invalidNewMemberAge) {
    submitOutput.textContent = "Нового члена семьи можно добавить только если ему или ей не больше 12 лет.";
    return;
  }
  submitOutput.textContent = "Отправляем форму...";
  try {
    const data = await callJson("/.netlify/functions/submit-form", buildSubmitPayload());
    submitOutput.textContent = "Форма успешно отправлена. Переходим к странице завершения...";
    if (data.ok) {
      currentPayload = null;
      setTimeout(() => { window.location.replace("./success.html"); }, 700);
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
