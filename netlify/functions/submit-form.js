const defaults = {
  executionTable: "для незарегистрированных в общине",
  tokenField: "token",
  tokenStatusField: "token_status",
  expiresAtField: "expires_at",
  formIdField: "form_id",
  groupFormIdField: "group_form_id",
  requestIdField: "RECORD ID (from קישור לפגישה)",
  modeField: "form_mode",
  addressField: "Домашний адрес",
  lastNameField: "Фамилия",
  firstNameField: "Имя",
  middleNameField: "Отчество",
  iinField: "ИИН",
  genderField: "Род",
  birthDateField: "Григор дата рождения",
  inCityField: "на песах буду в городе",
  relationshipField: "קרבה לממלא הטופס",
  roleField: "form_role",
  motherNationalityField: "национальность матери",
  fatherNationalityField: "национальность отца",
  contactsJsonField: "contacts_json",
  maidenNameField: "Девичья фамилия",
  hebrewNameField: "Еврейское имя",
  birthPlaceField: "Место рождения",
  educationField: "Образование",
  specialtyField: "Специальность",
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
  submittedAtField: "submitted_at",
  payloadJsonField: "last_payload_json"
};

defaults.contactTable = "КонтактныеДанные";
defaults.contactNumberField = "Полный номер";
defaults.contactWhatsappField = "Whatsapp";
defaults.contactActivityField = "Активность номера";
defaults.contactOwnerField = "Кому принадлежит номер";

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
  if (value === "yes") return "????????";
  if (value === "no") return "??????????";
  return "";
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
    body.persons.some((person) => {
      if (person.role !== "new_member") return false;
      const match = String(person.birth_date || "").match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
      if (!match) return false;
      const today = new Date();
      let age = today.getFullYear() - Number(match[3]);
      const monthDelta = today.getMonth() + 1 - Number(match[2]);
      const dayDelta = today.getDate() - Number(match[1]);
      if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) age -= 1;
      return age > 12;
    })
  ) {
    throw new Error("New family member must be age 12 or younger");
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
    [fieldName("iinField")]: person.iin || "",
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
    [fieldName("onlineStatusField")]: "Ответ получен в онлайн-форме.",
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

function buildDebugFieldPreview(fields) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      {
        value,
        type: typeof value
      }
    ])
  );
}

function stripOptionalSubmitFields(fields) {
  const reduced = { ...fields };
  delete reduced[fieldName("detailsConfirmedField")];
  delete reduced[fieldName("chametzConfirmedField")];
  delete reduced[fieldName("payloadJsonField")];
  delete reduced[fieldName("submittedAtField")];
  return reduced;
}
function buildExistingContactUpdate(contact) {
  return {
    [fieldName("contactNumberField")]: contact.number || "",
    [fieldName("contactWhatsappField")]: normalizeWhatsappValue(contact.whatsapp),
    [fieldName("contactActivityField")]: toContactActivityValue(contact.active),
    [fieldName("contactOwnerField")]: contact.owner_type || ""
  };
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

async function updateRecordWithFallback(recordId, fields) {
  try {
    const result = await airtableUpdateRecord({
      table: getEnvConfig().executionTable,
      recordId,
      fields
    });
    return { result, appliedFields: fields, fallbackApplied: false };
  } catch (error) {
    error.debugFields = buildDebugFieldPreview(fields);
    const message = String(error.message || "");
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
        fallbackError.debugFields = buildDebugFieldPreview(reducedFields);
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

function createDemoSubmitResponse(body) {
  return {
    ok: true,
    message: "Submit received successfully",
    submitted_people: body.persons.length,
    request_id: body.request_id,
    form_id: body.form_id
  };
}

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || "{}");
    validatePayload(body);

    if ((body.token || "").startsWith("demo-")) {
      return {
        ...jsonHeaders(200),
        body: JSON.stringify(createDemoSubmitResponse(body))
      };
    }

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
    const updatedFieldNames = new Set();
    let fallbackApplied = false;
    let updatedContacts = 0;

    for (const record of matchingRows) {
      const person = personsByExecutionId.get(record.id);
      if (!person) continue;

      const updateResult = await updateRecordWithFallback(record.id, buildPersonUpdate(person, body));
      Object.keys(updateResult.appliedFields || {}).forEach((field) => updatedFieldNames.add(field));
      fallbackApplied = fallbackApplied || Boolean(updateResult.fallbackApplied);
      updatedCount += 1;
    }

    updatedContacts = await updateExistingContacts(body.persons);

    return {
      ...jsonHeaders(200),
      body: JSON.stringify({
        ok: true,
        message: "Form submitted successfully",
        request_id: body.request_id,
        form_id: body.form_id,
        updated_rows: updatedCount,
        token_status: "submitted",
        updated_fields: Array.from(updatedFieldNames),
        fallback_applied: fallbackApplied,
        updated_contacts: updatedContacts
      })
    };
  } catch (error) {
    return {
      ...jsonHeaders(500),
      body: JSON.stringify({
        error: error.message,
        debug_fields: error.debugFields || null
      })
    };
  }
};
