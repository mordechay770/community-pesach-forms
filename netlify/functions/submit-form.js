const defaults = {
  executionTable: "РґР»СЏ РЅРµР·Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°РЅРЅС‹С… РІ РѕР±С‰РёРЅРµ",
  tokenField: "token",
  tokenStatusField: "token_status",
  expiresAtField: "expires_at",
  formIdField: "form_id",
  groupFormIdField: "group_form_id",
  requestIdField: "RECORD ID (from Ч§Ч™Ч©Ч•ЧЁ ЧњЧ¤Ч’Ч™Ч©Ч”)",
  modeField: "form_mode",
  addressField: "Р”РѕРјР°С€РЅРёР№ Р°РґСЂРµСЃ",
  lastNameField: "Р¤Р°РјРёР»РёСЏ",
  firstNameField: "РРјСЏ",
  middleNameField: "РћС‚С‡РµСЃС‚РІРѕ",
  iinField: "РРРќ",
  genderField: "Р РѕРґ",
  birthDateField: "Р“СЂРёРіРѕСЂ РґР°С‚Р° СЂРѕР¶РґРµРЅРёСЏ",
  inCityField: "РЅР° РїРµСЃР°С… Р±СѓРґСѓ РІ РіРѕСЂРѕРґРµ",
  relationshipField: "Ч§ЧЁЧ‘Ч” ЧњЧћЧћЧњЧђ Ч”ЧЧ•Ч¤ЧЎ",
  roleField: "form_role",
  motherNationalityField: "РЅР°С†РёРѕРЅР°Р»СЊРЅРѕСЃС‚СЊ РјР°С‚РµСЂРё",
  fatherNationalityField: "РЅР°С†РёРѕРЅР°Р»СЊРЅРѕСЃС‚СЊ РѕС‚С†Р°",
  contactsJsonField: "contacts_json",
  maidenNameField: "Р”РµРІРёС‡СЊСЏ С„Р°РјРёР»РёСЏ",
  hebrewNameField: "Р•РІСЂРµР№СЃРєРѕРµ РёРјСЏ",
  birthPlaceField: "РњРµСЃС‚Рѕ СЂРѕР¶РґРµРЅРёСЏ",
  educationField: "РћР±СЂР°Р·РѕРІР°РЅРёРµ",
  specialtyField: "РЎРїРµС†РёР°Р»СЊРЅРѕСЃС‚СЊ",
  schoolField: "№ школы д\\с",
  mobilePhoneField: "Мобильный телефон",
  motherLastNameField: "Р¤Р°РјРёР»РёСЏ РњР°С‚РµСЂРё",
  motherFirstNameField: "РРјСЏ РјР°С‚РµСЂРё",
  motherHebrewNameField: "Р•РІСЂ РРјСЏ РњР°С‚РµСЂРё",
  motherMiddleNameField: "РћС‚С‡РµСЃС‚РІРѕ РњР°С‚РµСЂРё",
  motherBirthDateField: "Р”Р°С‚Р°Р РѕР¶РґРµРЅРёСЏРњР°С‚РµСЂРё",
  motherBirthPlaceField: "РњРµСЃС‚Рѕ Р РѕР¶РґРµРЅРёСЏ РњР°С‚РµСЂРё",
  fatherLastNameField: "Р¤Р°РјРёР»РёСЏ РћС‚С†Р°",
  fatherFirstNameField: "РРјСЏ РѕС‚С†Р°",
  fatherHebrewNameField: "Р•РІСЂ РРјСЏ РћС‚С†Р°",
  fatherMiddleNameField: "РћС‚С‡РµСЃС‚РІРѕ РћС‚С†Р°",
  fatherBirthDateField: "Р”Р°С‚Р° Р РѕР¶РґРµРЅРёСЏ РћС‚С†Р°",
  fatherBirthPlaceField: "РњРµСЃС‚Рѕ Р РѕР¶РґРµРЅРёСЏ РћС‚С†Р°",
  onlineStatusField: "РЎС‚Р°С‚СѓСЃ - РѕРЅР»Р°Р№РЅ-С„РѕСЂРјР°",
  detailsConfirmedField: "РЇ РїРѕРґС‚РІРµСЂР¶РґР°СЋ, С‡С‚Рѕ РґР°РЅРЅС‹Рµ Р·Р°РїРѕР»РЅСЏСЋС‚СЃСЏ РїСЂР°РІРёР»СЊРЅРѕ.",
  chametzConfirmedField: "РЇ РїСЂРѕС€Сѓ СЂР°РІРІРёРЅР° РїСЂРѕРґР°С‚СЊ РјРѕР№ С…Р°РјРµС† РІ РєР°РЅСѓРЅ РїСЂР°Р·РґРЅРёРєР° РІ СЌС‚РѕРј РіРѕРґСѓ.",
  submittedAtField: "submitted_at",
  payloadJsonField: "last_payload_json"
};

defaults.contactTable = "РљРѕРЅС‚Р°РєС‚РЅС‹РµР”Р°РЅРЅС‹Рµ";
defaults.contactNumberField = "РџРѕР»РЅС‹Р№ РЅРѕРјРµСЂ";
defaults.contactWhatsappField = "Whatsapp";
defaults.contactActivityField = "РђРєС‚РёРІРЅРѕСЃС‚СЊ РЅРѕРјРµСЂР°";
defaults.contactOwnerField = "РљРѕРјСѓ РїСЂРёРЅР°РґР»РµР¶РёС‚ РЅРѕРјРµСЂ";
defaults.contactMemberLinkField = "Label";

Object.assign(defaults, {
  executionTable: "для незарегистрированных в общине",
  requestIdField: "RECORD ID (from קישור לפגישה)",
  addressField: "Домашний адрес",
  lastNameField: "Фамилия",
  firstNameField: "Имя",
  middleNameField: "Отчество",
  iinField: "ИИН",
  genderField: "Род",
  birthDateField: "Григор дата рождения",
  inCityField: "на песах буду в городе",
  relationshipField: "קרבה לממלא הטופס",
  motherNationalityField: "национальность матери",
  fatherNationalityField: "национальность отца",
  maidenNameField: "Девичья фамилия",
  hebrewNameField: "Еврейское имя",
  birthPlaceField: "Место рождения",
  educationField: "Образование",
  specialtyField: "Специальность",
  schoolField: "№ школы д\\с",
  mobilePhoneField: "Мобильный телефон",
  motherLastNameField: "Фамилия Матери",
  motherFirstNameField: "Имя матери",
  motherHebrewNameField: "Евр Имя Матери",
  motherMiddleNameField: "Отчество Матери",
  motherBirthDateField: "ДатаРожденияМатери",
  motherBirthPlaceField: "Место Рождения Матери",
  fatherLastNameField: "Фамилия Отца",
  fatherFirstNameField: "Имя отца",
  fatherHebrewNameField: "Евр Имя Отца",
  fatherMiddleNameField: "Отчество Отца",
  fatherBirthDateField: "Дата Рождения Отца",
  fatherBirthPlaceField: "Место Рождения Отца",
  onlineStatusField: "Статус - онлайн-форма",
  detailsConfirmedField: "Я подтверждаю, что данные заполняются правильно.",
  chametzConfirmedField: "Я прошу раввина продать мой хамец в канун праздника в этом году.",
  contactTable: "КонтактныеДанные",
  contactNumberField: "Полный номер",
  contactActivityField: "Активность номера",
  contactOwnerField: "Кому принадлежит номер"
});

function fieldName(key) {
  return process.env[`AIRTABLE_${key}`] || defaults[key];
}

function getEnvConfig() {
  const apiToken = process.env.AIRTABLE_API_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const executionTable = fieldName("executionTable");
  if (!apiToken || !baseId) return null;
  return { apiToken, baseId, executionTable };
}

function jsonHeaders(statusCode = 200) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" }
  };
}

function escapeFormulaValue(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function toAirtableDate(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const dotMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotMatch) return `${dotMatch[3]}-${dotMatch[2]}-${dotMatch[1]}`;
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  const slashIsoMatch = text.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (slashIsoMatch) return `${slashIsoMatch[1]}-${slashIsoMatch[2]}-${slashIsoMatch[3]}`;
  const slashDayFirstMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashDayFirstMatch) return `${slashDayFirstMatch[3]}-${slashDayFirstMatch[2]}-${slashDayFirstMatch[1]}`;
  return text;
}
function normalizeWhatsappValue(value) {
  if (value === "yes" || value === true) return "yes";
  if (value === "no" || value === false) return "no";
  return "";
}
function toContactActivityValue(value) {
  if (value === "yes") return "Активный";
  if (value === "no") return "Не активный";
  return "";
}

function getPrimaryMobilePhone(person) {
  const contacts = Array.isArray(person?.contacts) ? person.contacts : [];
  const phoneContact = contacts.find((contact) => (contact.kind || "phone") !== "email" && String(contact.number || "").trim());
  return phoneContact ? phoneContact.number || "" : "";
}

async function airtableListRecords({ table, filterByFormula, maxRecords = 100 }) {
  const config = getEnvConfig();
  const url = new URL(`https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(table)}`);
  url.searchParams.set("maxRecords", String(maxRecords));
  if (filterByFormula) url.searchParams.set("filterByFormula", filterByFormula);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${config.apiToken}` }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Airtable request failed");
  return data.records || [];
}

async function airtableUpdateRecord({ table, recordId, fields }) {
  const config = getEnvConfig();
  const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(table)}/${recordId}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Airtable update failed");
  return data;
}

async function airtableCreateRecord({ table, fields }) {
  const config = getEnvConfig();
  const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(table)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Airtable create failed");
  return data;
}

function validatePayload(body) {
  if (!body.token) throw new Error("Token is required");
  if (!body.form_id) throw new Error("Form ID is required");
  if (!Array.isArray(body.persons) || !body.persons.length) {
    throw new Error("At least one person is required");
  }
  if (body.persons.some((person) => !["yes", "no"].includes(person.will_be_in_city))) {
    throw new Error("Each person must answer whether they will be in the city on Pesach");
  }
  if (!body.details_confirmed) throw new Error("Details confirmation is required");
  if (!body.chametz_sale_confirmation) throw new Error("Chametz authorization is required");
  if (
    body.persons.some((person) =>
      (person.contacts || []).some((contact) => {
        if (!contact.number || !contact.owner_type) return true;
        if ((contact.kind || "phone") !== "email" && !["yes", "no"].includes(contact.whatsapp)) return true;
        if (contact.is_existing_source && !["yes", "no"].includes(contact.active)) return true;
        return false;
      })
    )
  ) {
    throw new Error("All contact fields must be completed");
  }
}

function buildPersonUpdate(person, fullPayload) {
  const resolvedMainAddress =
    fullPayload.address?.confirmed === "no"
      ? fullPayload.address.new_address || fullPayload.address.full || ""
      : fullPayload.address?.full || "";

    const fields = {
      [fieldName("lastNameField")]: person.last_name || "",
      [fieldName("firstNameField")]: person.first_name || "",
      [fieldName("middleNameField")]: person.middle_name || "",
      [fieldName("genderField")]: person.gender || "",
      [fieldName("birthDateField")]: toAirtableDate(person.birth_date),
    [fieldName("inCityField")]: person.will_be_in_city || "",
    [fieldName("roleField")]: person.role || "",
    [fieldName("relationshipField")]: person.relationship || "",
    [fieldName("motherNationalityField")]: person.parent_mother_nationality || "",
    [fieldName("fatherNationalityField")]: person.parent_father_nationality || "",
    [fieldName("maidenNameField")]: person.maiden_name || "",
      [fieldName("hebrewNameField")]: person.hebrew_name || "",
      [fieldName("birthPlaceField")]: person.birth_place || "",
      [fieldName("educationField")]: person.education || "",
      [fieldName("specialtyField")]: person.specialty || "",
      [fieldName("schoolField")]: person.school_number || "",
    [fieldName("mobilePhoneField")]: getPrimaryMobilePhone(person),
    [fieldName("motherLastNameField")]: person.mother_last_name || "",
    [fieldName("motherFirstNameField")]: person.mother_first_name || "",
    [fieldName("motherHebrewNameField")]: person.mother_hebrew_name || "",
    [fieldName("motherMiddleNameField")]: person.mother_middle_name || "",
    [fieldName("motherBirthDateField")]: toAirtableDate(person.mother_birth_date),
    [fieldName("motherBirthPlaceField")]: person.mother_birth_place || "",
    [fieldName("fatherLastNameField")]: person.father_last_name || "",
    [fieldName("fatherFirstNameField")]: person.father_first_name || "",
    [fieldName("fatherHebrewNameField")]: person.father_hebrew_name || "",
    [fieldName("fatherMiddleNameField")]: person.father_middle_name || "",
    [fieldName("fatherBirthDateField")]: toAirtableDate(person.father_birth_date),
    [fieldName("fatherBirthPlaceField")]: person.father_birth_place || "",
    [fieldName("contactsJsonField")]: JSON.stringify(person.contacts || []),
    [fieldName("detailsConfirmedField")]: Boolean(fullPayload.details_confirmed),
    [fieldName("chametzConfirmedField")]: Boolean(fullPayload.chametz_sale_confirmation),
    [fieldName("submittedAtField")]: new Date().toISOString(),
    [fieldName("tokenStatusField")]: "submitted",
    [fieldName("onlineStatusField")]: "РћС‚РІРµС‚ РїРѕР»СѓС‡РµРЅ РІ РѕРЅР»Р°Р№РЅ-С„РѕСЂРјРµ.",
    [fieldName("addressField")]:
      person.role === "child" || person.role === "new_member"
        ? person.same_as_primary_address === "no"
          ? person.child_address || person.address || ""
          : resolvedMainAddress
        : person.address || resolvedMainAddress
  };

  if (fieldName("payloadJsonField")) {
    fields[fieldName("payloadJsonField")] = JSON.stringify(fullPayload);
  }

  return fields;
}

function stripOptionalSubmitFields(fields) {
  const reduced = { ...fields };
  delete reduced[fieldName("detailsConfirmedField")];
  delete reduced[fieldName("chametzConfirmedField")];
  delete reduced[fieldName("payloadJsonField")];
  delete reduced[fieldName("submittedAtField")];
  delete reduced[fieldName("schoolField")];
  return reduced;
}

function stripUnknownField(fields, errorMessage) {
  const match = String(errorMessage || "").match(/Unknown field name:\s*"([^"]+)"/);
  if (!match) return null;
  const reduced = { ...fields };
  delete reduced[match[1]];
  return Object.keys(reduced).length ? reduced : null;
}
function buildExistingContactUpdate(contact) {
  return {
    [fieldName("contactNumberField")]: contact.number || "",
    [fieldName("contactWhatsappField")]: normalizeWhatsappValue(contact.whatsapp),
    [fieldName("contactActivityField")]: toContactActivityValue(contact.active),
    [fieldName("contactOwnerField")]: contact.owner_type || ""
  };
}

function buildNewContactFields(contact, person) {
  const fields = {
    [fieldName("contactNumberField")]: contact.number || "",
    [fieldName("contactOwnerField")]: contact.owner_type || "",
    [fieldName("contactActivityField")]: "Активный"
  };

  if ((contact.kind || "phone") !== "email") {
    fields[fieldName("contactWhatsappField")] = normalizeWhatsappValue(contact.whatsapp);
  }

  if (person.member_record_id) {
    fields[fieldName("contactMemberLinkField")] = [person.member_record_id];
  }

  return fields;
}

async function updateExistingContacts(persons) {
  const updates = [];
  for (const person of persons || []) {
    for (const contact of person.contacts || []) {
      if (!contact?.contact_record_id || !contact.is_existing_source) continue;
      updates.push(
        airtableUpdateRecord({
          table: fieldName("contactTable"),
          recordId: contact.contact_record_id,
          fields: buildExistingContactUpdate(contact)
        })
      );
    }
  }
  await Promise.all(updates);
  return updates.length;
}

async function createNewContacts(persons) {
  const creates = [];
  for (const person of persons || []) {
    for (const contact of person.contacts || []) {
      if (contact?.contact_record_id || contact.is_existing_source || !contact.number || !person.member_record_id) continue;
      creates.push(
        airtableCreateRecord({
          table: fieldName("contactTable"),
          fields: buildNewContactFields(contact, person)
        })
      );
    }
  }
  await Promise.all(creates);
  return creates.length;
}

async function updateRecordWithFallback(recordId, fields) {
  try {
    const result = await airtableUpdateRecord({
      table: getEnvConfig().executionTable,
      recordId,
      fields
    });
    return { result, appliedFields: fields, fallbackApplied: false };
  } catch (error) {
    const message = String(error.message || "");
    const unknownFieldReduced = stripUnknownField(fields, message);
    if (unknownFieldReduced) {
      try {
        const result = await airtableUpdateRecord({
          table: getEnvConfig().executionTable,
          recordId,
          fields: unknownFieldReduced
        });
        return { result, appliedFields: unknownFieldReduced, fallbackApplied: true };
      } catch (unknownFieldRetryError) {
        throw unknownFieldRetryError;
      }
    }

    const optionalFieldNames = [
      fieldName("detailsConfirmedField"),
      fieldName("chametzConfirmedField"),
      fieldName("payloadJsonField"),
      fieldName("submittedAtField")
    ];

    if (optionalFieldNames.some((name) => name && message.includes(name))) {
      const reducedFields = stripOptionalSubmitFields(fields);
      try {
        const result = await airtableUpdateRecord({
          table: getEnvConfig().executionTable,
          recordId,
          fields: reducedFields
        });
        return { result, appliedFields: reducedFields, fallbackApplied: true };
      } catch (fallbackError) {
        throw fallbackError;
      }
    }

    throw error;
  }
}

async function loadRowsByToken(token) {
  return airtableListRecords({
    table: getEnvConfig().executionTable,
    filterByFormula: `{${fieldName("tokenField")}} = "${escapeFormulaValue(token)}"`,
    maxRecords: 100
  });
}

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || "{}");
    validatePayload(body);

    if (!getEnvConfig()) {
      return {
        ...jsonHeaders(503),
        body: JSON.stringify({ error: "Airtable environment variables are not configured yet" })
      };
    }

    const matchingRows = await loadRowsByToken(body.token);
    if (!matchingRows.length) {
      return {
        ...jsonHeaders(404),
        body: JSON.stringify({ error: "Invalid or expired token" })
      };
    }

    if (
      matchingRows.some(
        (record) => (record.fields || {})[fieldName("tokenStatusField")] === "submitted"
      )
    ) {
      return {
        ...jsonHeaders(409),
        body: JSON.stringify({ error: "This form has already been submitted" })
      };
    }

    const expectedFormId = (matchingRows[0].fields || {})[fieldName("formIdField")];
    if (expectedFormId && expectedFormId !== body.form_id) {
      return {
        ...jsonHeaders(409),
        body: JSON.stringify({ error: "Form ID does not match the token" })
      };
    }

    const personsByExecutionId = new Map(
      body.persons
        .filter((person) => person.execution_record_id)
        .map((person) => [person.execution_record_id, person])
    );

    let updatedCount = 0;
    let updatedContacts = 0;
    let createdContacts = 0;

    for (const record of matchingRows) {
      const person = personsByExecutionId.get(record.id);
      if (!person) continue;

      const updateResult = await updateRecordWithFallback(record.id, buildPersonUpdate(person, body));
      updatedCount += 1;
    }

    updatedContacts = await updateExistingContacts(body.persons);
    createdContacts = await createNewContacts(body.persons);

    return {
      ...jsonHeaders(200),
      body: JSON.stringify({
        ok: true,
        message: "Form submitted successfully",
        request_id: body.request_id,
        form_id: body.form_id,
        updated_rows: updatedCount,
        token_status: "submitted"
      })
    };
  } catch (error) {
    console.error("submit-form failed", error);
    return {
      ...jsonHeaders(500),
      body: JSON.stringify({ error: error.message || "Submit failed" })
    };
  }
};
