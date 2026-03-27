const DEMO_FORMS = {
  "demo-single": {
    form_id: "FORM-recREQ001",
    request_id: "recREQ001",
    group_form_id: "GF-recREQ001",
    mode: "single_update",
    summary: "Single update form for one known community member.",
    meta: {
      member_code: "CM-10294",
      address_code: "AD-7781"
    },
    address: {
      full: "Алматы, ул. Абая 123, кв. 45"
    },
    persons: [
      {
        execution_record_id: "demo-self-1",
        role: "self",
        relationship: "",
        member_code: "CM-10294",
        address_code: "AD-7781",
        full_name: "Коген Мордехай",
        last_name: "Коген",
        first_name: "Мордехай",
        middle_name: "",
        iin: "860314450921",
        gender: "М",
        birth_date: "14.03.1986",
        will_be_in_city: "",
        show_parent_fields: false,
        parent_mother_nationality: "",
        parent_father_nationality: "",
        contacts: [
          { number: "77012345678", owner_type: "self", whatsapp: "yes" }
        ]
      }
    ]
  },
  "demo-family": {
    form_id: "FORM-recREQ002",
    request_id: "recREQ002",
    group_form_id: "GF-recREQ002",
    mode: "mother_children_update",
    summary: "Family form with one mother and three children.",
    meta: {
      member_code: "CM-20511",
      address_code: "AD-5532"
    },
    address: {
      full: "Алматы, мкр. Самал 8, дом 19"
    },
    persons: [
      {
        execution_record_id: "demo-mother-1",
        role: "mother",
        relationship: "",
        member_code: "CM-20511",
        address_code: "AD-5532",
        full_name: "Коэн Ривка",
        last_name: "Коэн",
        first_name: "Ривка",
        middle_name: "",
        iin: "830421550912",
        gender: "Ж",
        birth_date: "21.04.1983",
        will_be_in_city: "",
        show_parent_fields: false,
        parent_mother_nationality: "",
        parent_father_nationality: "",
        contacts: [
          { number: "77071234567", owner_type: "self", whatsapp: "yes" }
        ]
      }
    ]
  },
  "demo-new": {
    form_id: "FORM-recREQ003",
    request_id: "recREQ003",
    group_form_id: "GF-recREQ003",
    mode: "new_member_registration",
    summary: "New member registration with missing parent nationality fields.",
    meta: {
      member_code: "NEW",
      address_code: "AD-NEW"
    },
    address: {
      full: ""
    },
    persons: [
      {
        execution_record_id: "demo-new-1",
        role: "new_member",
        relationship: "other",
        member_code: "",
        address_code: "",
        full_name: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        iin: "",
        gender: "",
        birth_date: "",
        will_be_in_city: "",
        show_parent_fields: true,
        parent_mother_nationality: "",
        parent_father_nationality: "",
        contacts: [{ number: "", owner_type: "", whatsapp: "" }]
      }
    ]
  }
};

const defaults = {
  executionTable: "для незарегистрированных в общине",
  memberTable: "Члены_семьи",
  memberLinkField: "כרטיס אישי של חבר קהילה",
  contactTable: "КонтактныеДанные",
  contactMemberLinkField: "Label",
  contactNumberField: "Полный номер",
  contactWhatsappField: "Whatsapp",
  contactActivityField: "Активность номера",
  contactOwnerField: "Кому принадлежит номер",
  sourceContactsField: "КонтактныеДанные",
  tokenField: "token",
  tokenStatusField: "token_status",
  expiresAtField: "expires_at",
  formIdField: "form_id",
  groupFormIdField: "group_form_id",
  requestIdField: "RECORD ID (from קישור לפגישה)",
  modeField: "form_mode",
  memberCodeField: "КодЧлены семьи (from כרטיס אישי של חבר קהילה)",
  addressCodeField: "Код (from Код адреса) (from כרטיס אישי של חבר קהילה)",
  addressField: "Домашний адрес",
  roleField: "form_role",
  relationshipField: "קרבה לממלא הטופס",
  fullNameField: "full_name",
  lastNameField: "Фамилия",
  firstNameField: "Имя",
  middleNameField: "Отчество",
  iinField: "ИИН",
  genderField: "Род",
  birthDateField: "Григор дата рождения",
  inCityField: "на песах буду в городе",
  motherNationalityField: "национальность матери",
  fatherNationalityField: "национальность отца",
  contactsJsonField: "contacts_json",
  sourceFullNameField: "",
  sourceLastNameField: "Фамилия",
  sourceFirstNameField: "Имя",
  sourceMiddleNameField: "Отчество",
  sourceIinField: "ИИН",
  sourceGenderField: "Род",
  sourceBirthDateField: "Григор год рождения",
  sourceAltBirthDateField: "Григор дата рождения",
  sourceAddressField: "כתובת מלאה (from Код адреса)",
  sourceMemberCodeField: "КодЧлены семьи",
  sourceAddressCodeField: "Код (from Код адреса)",
  sourceMotherNationalityField: "Нац мамы",
  sourceFatherNationalityField: "Нац папы"
};

function fieldName(key) {
  return process.env[`AIRTABLE_${key}`] || defaults[key];
}

function getEnvConfig() {
  const apiToken = process.env.AIRTABLE_API_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const executionTable = fieldName("executionTable");

  if (!apiToken || !baseId) {
    return null;
  }

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

async function airtableListRecords({ table, filterByFormula, maxRecords = 100 }) {
  const config = getEnvConfig();
  const url = new URL(`https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(table)}`);
  url.searchParams.set("maxRecords", String(maxRecords));
  if (filterByFormula) {
    url.searchParams.set("filterByFormula", filterByFormula);
  }

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${config.apiToken}` }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Airtable request failed");
  }

  return data.records || [];
}

async function airtableGetRecord({ table, recordId }) {
  const config = getEnvConfig();
  const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(table)}/${recordId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiToken}` }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Airtable record request failed");
  }

  return data;
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
  if (!response.ok) {
    throw new Error(data.error?.message || "Airtable update failed");
  }

  return data;
}

function firstNonEmpty(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "") || "";
}

function parseContacts(rawValue) {
  if (!rawValue) {
    return [];
  }

  if (Array.isArray(rawValue)) {
    return rawValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return [];
  }
}

function formatBirthDate(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  const text = String(raw || "").trim();
  if (!text) {
    return "";
  }

  const dotMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotMatch) {
    return text;
  }

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[3]}.${isoMatch[2]}.${isoMatch[1]}`;
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

function normalizeGender(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) {
    return "";
  }
  if (text === "m" || text === "м") {
    return "М";
  }
  if (text === "f" || text === "ж") {
    return "Ж";
  }
  return String(value || "");
}

function isActiveContact(activityValue) {
  const value = String(activityValue || "").toLowerCase();
  if (!value) {
    return true;
  }
  return !value.includes("неакт") && !value.includes("inactive") && !value.includes("ошиб");
}

function normalizeWhatsapp(value) {
  if (value === true) {
    return "yes";
  }
  const text = String(value || "").trim().toLowerCase();
  if (!text) {
    return "";
  }
  if (["yes", "да", "true", "1"].includes(text)) {
    return "yes";
  }
  if (["no", "нет", "false", "0"].includes(text)) {
    return "no";
  }
  return "";
}

function normalizeContact(fields) {
  const number = String(firstNonEmpty(
    fields[fieldName("contactNumberField")],
    fields["Мобильный телефон"]
  ) || "").replace(/\D+/g, "");

  return {
    number,
    owner_type: fields[fieldName("contactOwnerField")] || "",
    whatsapp: normalizeWhatsapp(fields[fieldName("contactWhatsappField")])
  };
}

async function getLinkedMemberRecord(executionFields) {
  const linked = executionFields[fieldName("memberLinkField")];
  const memberRecordId = Array.isArray(linked) ? linked[0] : linked;
  if (!memberRecordId) {
    return null;
  }

  return airtableGetRecord({
    table: fieldName("memberTable"),
    recordId: memberRecordId
  });
}

async function getContactsFromIds(contactIds) {
  const records = await Promise.all(
    contactIds.map((contactId) =>
      airtableGetRecord({
        table: fieldName("contactTable"),
        recordId: contactId
      }).catch(() => null)
    )
  );

  return records
    .filter(Boolean)
    .map((record) => record.fields || {})
    .filter((fields) => isActiveContact(fields[fieldName("contactActivityField")]))
    .map(normalizeContact)
    .filter((contact) => contact.number || contact.owner_type || contact.whatsapp === "yes");
}

async function getContactsForMember(memberRecordId, memberFields) {
  const linkedContacts = memberFields[fieldName("sourceContactsField")];
  if (Array.isArray(linkedContacts) && linkedContacts.length) {
    return getContactsFromIds(linkedContacts);
  }

  if (!memberRecordId) {
    return [];
  }

  const formula = `FIND("${escapeFormulaValue(memberRecordId)}", ARRAYJOIN({${fieldName("contactMemberLinkField")}}))`;
  const rows = await airtableListRecords({
    table: fieldName("contactTable"),
    filterByFormula: formula,
    maxRecords: 50
  });

  return rows
    .map((row) => row.fields || {})
    .filter((fields) => isActiveContact(fields[fieldName("contactActivityField")]))
    .map(normalizeContact)
    .filter((contact) => contact.number || contact.owner_type || contact.whatsapp === "yes");
}

function roleRank(role) {
  const order = {
    self: 1,
    mother: 1,
    spouse: 2,
    child: 3,
    new_member: 4
  };

  return order[role] || 99;
}

async function buildPersonFromRecord(record) {
  const fields = record.fields || {};
  const memberRecord = await getLinkedMemberRecord(fields);
  const memberFields = memberRecord?.fields || {};
  const memberRecordId = memberRecord?.id;
  const role = fields[fieldName("roleField")] || "self";

  const lastName = firstNonEmpty(fields[fieldName("lastNameField")], memberFields[fieldName("sourceLastNameField")]);
  const firstName = firstNonEmpty(fields[fieldName("firstNameField")], memberFields[fieldName("sourceFirstNameField")]);
  const middleName = firstNonEmpty(fields[fieldName("middleNameField")], memberFields[fieldName("sourceMiddleNameField")]);

  const savedContacts = parseContacts(fields[fieldName("contactsJsonField")]);
  const resolvedContacts = savedContacts.length ? savedContacts : await getContactsForMember(memberRecordId, memberFields);

  return {
    execution_record_id: record.id,
    role,
    relationship: fields[fieldName("relationshipField")] || "",
    member_code: firstNonEmpty(fields[fieldName("memberCodeField")], memberFields[fieldName("sourceMemberCodeField")]),
    address_code: firstNonEmpty(fields[fieldName("addressCodeField")], memberFields[fieldName("sourceAddressCodeField")]),
    full_name: firstNonEmpty(
      fields[fieldName("fullNameField")],
      memberFields[fieldName("sourceFullNameField")],
      `${lastName} ${firstName} ${middleName}`.trim()
    ),
    last_name: lastName,
    first_name: firstName,
    middle_name: middleName,
    iin: firstNonEmpty(fields[fieldName("iinField")], memberFields[fieldName("sourceIinField")]),
    require_iin: true,
    gender: normalizeGender(firstNonEmpty(fields[fieldName("genderField")], memberFields[fieldName("sourceGenderField")])),
    birth_date: formatBirthDate(firstNonEmpty(
      fields[fieldName("birthDateField")],
      memberFields[fieldName("sourceBirthDateField")],
      memberFields[fieldName("sourceAltBirthDateField")],
      memberFields[fieldName("birthDateField")]
    )),
    will_be_in_city: fields[fieldName("inCityField")] || "",
    show_parent_fields: Boolean(
      fields[fieldName("motherNationalityField")] ||
      fields[fieldName("fatherNationalityField")] ||
      memberFields[fieldName("sourceMotherNationalityField")] ||
      memberFields[fieldName("sourceFatherNationalityField")] ||
      role === "new_member"
    ),
    parent_mother_nationality: firstNonEmpty(fields[fieldName("motherNationalityField")], memberFields[fieldName("sourceMotherNationalityField")]),
    parent_father_nationality: firstNonEmpty(fields[fieldName("fatherNationalityField")], memberFields[fieldName("sourceFatherNationalityField")]),
    address: firstNonEmpty(fields[fieldName("addressField")], memberFields[fieldName("sourceAddressField")]),
    contacts: resolvedContacts
  };
}

async function buildPayloadFromRecords(records) {
  if (!records.length) {
    throw new Error("No execution rows found for this token");
  }

  const first = records[0].fields || {};
  const persons = (await Promise.all(records.map(buildPersonFromRecord)))
    .sort((a, b) => roleRank(a.role) - roleRank(b.role));
  const primaryPerson = persons[0] || {};

  return {
    form_id: first[fieldName("formIdField")] || "",
    request_id: first[fieldName("requestIdField")] || "",
    group_form_id: first[fieldName("groupFormIdField")] || "",
    mode: first[fieldName("modeField")] || "single_update",
    summary: `Loaded ${persons.length} person record(s) for this form.`,
    meta: {
      member_code: primaryPerson.member_code || "",
      address_code: primaryPerson.address_code || ""
    },
    address: {
      full: firstNonEmpty(primaryPerson.address, first[fieldName("addressField")])
    },
    persons
  };
}

async function loadRealTokenPayload(token) {
  const matchingRows = await airtableListRecords({
    table: getEnvConfig().executionTable,
    filterByFormula: `{${fieldName("tokenField")}} = "${escapeFormulaValue(token)}"`,
    maxRecords: 100
  });

  if (!matchingRows.length) {
    throw new Error("Invalid or expired token");
  }

  const firstRecord = matchingRows[0];
  const firstFields = firstRecord.fields || {};
  const tokenStatus = firstFields[fieldName("tokenStatusField")] || "";
  const expiresAt = firstFields[fieldName("expiresAtField")];

  if (tokenStatus === "submitted" || tokenStatus === "expired") {
    throw new Error("This form link is no longer active");
  }

  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
    throw new Error("This form link has expired");
  }

  let allRows = matchingRows;
  const groupFormId = firstFields[fieldName("groupFormIdField")];
  const formId = firstFields[fieldName("formIdField")];

  if (groupFormId) {
    allRows = await airtableListRecords({
      table: getEnvConfig().executionTable,
      filterByFormula: `{${fieldName("groupFormIdField")}} = "${escapeFormulaValue(groupFormId)}"`,
      maxRecords: 100
    });
  } else if (formId) {
    allRows = await airtableListRecords({
      table: getEnvConfig().executionTable,
      filterByFormula: `{${fieldName("formIdField")}} = "${escapeFormulaValue(formId)}"`,
      maxRecords: 100
    });
  }

  if (tokenStatus !== "opened") {
    await airtableUpdateRecord({
      table: getEnvConfig().executionTable,
      recordId: firstRecord.id,
      fields: {
        [fieldName("tokenStatusField")]: "opened"
      }
    });
  }

  return buildPayloadFromRecords(allRows);
}

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const token = body.token;

    if (!token) {
      return {
        ...jsonHeaders(400),
        body: JSON.stringify({ error: "Token is required" })
      };
    }

    if (DEMO_FORMS[token]) {
      return {
        ...jsonHeaders(200),
        body: JSON.stringify(DEMO_FORMS[token])
      };
    }

    if (!getEnvConfig()) {
      return {
        ...jsonHeaders(503),
        body: JSON.stringify({ error: "Airtable environment variables are not configured yet" })
      };
    }

    const payload = await loadRealTokenPayload(token);
    return {
      ...jsonHeaders(200),
      body: JSON.stringify(payload)
    };
  } catch (error) {
    return {
      ...jsonHeaders(500),
      body: JSON.stringify({ error: error.message })
    };
  }
};
