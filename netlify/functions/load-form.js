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
        role: "self",
        relationship: "other",
        full_name: "Коген Мордехай",
        last_name: "Коген",
        first_name: "Мордехай",
        middle_name: "",
        iin: "860314450921",
        require_iin: true,
        gender: "M",
        birth_date: "14.03.1986",
        will_be_in_city: "",
        show_parent_fields: false,
        contacts: [
          {
            number: "77012345678",
            owner_type: "self",
            whatsapp: "yes",
            status: "active"
          }
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
        role: "mother",
        relationship: "mother",
        full_name: "Коэн Ривка",
        last_name: "Коэн",
        first_name: "Ривка",
        middle_name: "",
        iin: "830421550912",
        require_iin: true,
        gender: "F",
        birth_date: "21.04.1983",
        will_be_in_city: "",
        show_parent_fields: false,
        contacts: [
          {
            number: "77071234567",
            owner_type: "self",
            whatsapp: "yes",
            status: "active"
          }
        ]
      },
      {
        role: "child",
        relationship: "son",
        full_name: "Коэн Ицхак",
        last_name: "Коэн",
        first_name: "Ицхак",
        middle_name: "",
        iin: "120101500001",
        require_iin: true,
        gender: "M",
        birth_date: "01.01.2012",
        will_be_in_city: "",
        show_parent_fields: false,
        contacts: [
          {
            number: "77071234567",
            owner_type: "parent",
            whatsapp: "yes",
            status: "active"
          }
        ]
      },
      {
        role: "child",
        relationship: "daughter",
        full_name: "Коэн Сара",
        last_name: "Коэн",
        first_name: "Сара",
        middle_name: "",
        iin: "150505500002",
        require_iin: true,
        gender: "F",
        birth_date: "05.05.2015",
        will_be_in_city: "",
        show_parent_fields: false,
        contacts: [
          {
            number: "77071234567",
            owner_type: "parent",
            whatsapp: "yes",
            status: "active"
          }
        ]
      },
      {
        role: "child",
        relationship: "son",
        full_name: "Коэн Меир",
        last_name: "Коэн",
        first_name: "Меир",
        middle_name: "",
        iin: "180808500003",
        require_iin: true,
        gender: "M",
        birth_date: "08.08.2018",
        will_be_in_city: "",
        show_parent_fields: false,
        contacts: [
          {
            number: "",
            owner_type: "parent",
            whatsapp: "",
            status: ""
          }
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
          {
            number: "",
            owner_type: "",
            whatsapp: "",
            status: ""
          }
        ]
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
  tokenField: "token",
  tokenStatusField: "token_status",
  expiresAtField: "expires_at",
  formIdField: "form_id",
  groupFormIdField: "group_form_id",
  requestIdField: "RECORD ID (from קישור לפגישה)",
  modeField: "form_mode",
  memberCodeField: "member_code",
  addressCodeField: "address_code",
  addressField: "Домашний адрес",
  roleField: "form_role",
  relationshipField: "relationship",
  fullNameField: "full_name",
  lastNameField: "Фамилия",
  firstNameField: "Имя",
  middleNameField: "Отчество",
  iinField: "ИИН",
  genderField: "Род",
  birthDateField: "Григор дата рождения",
  inCityField: "Нахожусь в Казахстане:",
  motherNationalityField: "национальность матери",
  fatherNationalityField: "национальность отца",
  contactsJsonField: "contacts_json",
  sourceFullNameField: "",
  sourceLastNameField: "Фамилия",
  sourceFirstNameField: "Имя",
  sourceMiddleNameField: "Отчество",
  sourceIinField: "",
  sourceGenderField: "Род",
  sourceBirthDateField: "Григор год рождения",
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

  return {
    apiToken,
    baseId,
    executionTable
  };
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
    headers: {
      Authorization: `Bearer ${config.apiToken}`
    }
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
    headers: {
      Authorization: `Bearer ${config.apiToken}`
    }
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

function firstNonEmpty(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "") || "";
}

function sourceFieldOrFallback(sourceKey, fallbackKey) {
  return process.env[`AIRTABLE_${sourceKey}`] || fieldName(fallbackKey);
}

async function getLinkedMemberRecord(executionFields) {
  const memberLinkField = fieldName("memberLinkField");
  const memberTable = fieldName("memberTable");

  if (!memberLinkField) {
    return null;
  }

  const linked = executionFields[memberLinkField];
  const memberRecordId = Array.isArray(linked) ? linked[0] : linked;

  if (!memberRecordId) {
    return null;
  }

  return airtableGetRecord({
    table: memberTable,
    recordId: memberRecordId
  });
}

function isActiveContact(activityValue) {
  const value = String(activityValue || "").toLowerCase();
  if (!value) {
    return true;
  }

  return !value.includes("неакт") && !value.includes("inactive") && !value.includes("ошиб");
}

async function getContactsForMember(memberRecordId) {
  if (!memberRecordId) {
    return [];
  }

  const table = fieldName("contactTable");
  const memberField = fieldName("contactMemberLinkField");
  const formula = `FIND("${escapeFormulaValue(memberRecordId)}", ARRAYJOIN({${memberField}}))`;
  const rows = await airtableListRecords({
    table,
    filterByFormula: formula,
    maxRecords: 50
  });

  return rows
    .map((row) => row.fields || {})
    .filter((fields) => isActiveContact(fields[fieldName("contactActivityField")]))
    .map((fields) => ({
      number: String(fields[fieldName("contactNumberField")] || "").replace(/\D+/g, ""),
      owner_type: fields[fieldName("contactOwnerField")] || "",
      whatsapp: fields[fieldName("contactWhatsappField")] ? "yes" : "no"
    }))
    .filter((contact) => contact.number || contact.owner_type || contact.whatsapp === "yes");
}

async function buildPersonFromRecord(record) {
  const fields = record.fields || {};
  const memberRecord = await getLinkedMemberRecord(fields);
  const memberFields = memberRecord?.fields || {};
  const memberRecordId = memberRecord?.id;
  const role = fields[fieldName("roleField")] || "self";
  const firstName = firstNonEmpty(
    fields[fieldName("firstNameField")],
    memberFields[sourceFieldOrFallback("sourceFirstNameField", "firstNameField")]
  );
  const lastName = firstNonEmpty(
    fields[fieldName("lastNameField")],
    memberFields[sourceFieldOrFallback("sourceLastNameField", "lastNameField")]
  );
  const middleName = firstNonEmpty(
    fields[fieldName("middleNameField")],
    memberFields[sourceFieldOrFallback("sourceMiddleNameField", "middleNameField")]
  );

  const contacts = parseContacts(fields[fieldName("contactsJsonField")]);
  const resolvedContacts = contacts.length ? contacts : await getContactsForMember(memberRecordId);

  return {
    execution_record_id: record.id,
    role,
    relationship: fields[fieldName("relationshipField")] || "",
    member_code: firstNonEmpty(
      fields[fieldName("memberCodeField")],
      memberFields[sourceFieldOrFallback("sourceMemberCodeField", "memberCodeField")]
    ),
    full_name: firstNonEmpty(
      fields[fieldName("fullNameField")],
      memberFields[sourceFieldOrFallback("sourceFullNameField", "fullNameField")],
      `${lastName} ${firstName} ${middleName}`.trim()
    ),
    last_name: lastName,
    first_name: firstName,
    middle_name: middleName,
    iin: firstNonEmpty(
      fields[fieldName("iinField")],
      memberFields[sourceFieldOrFallback("sourceIinField", "iinField")]
    ),
    require_iin: true,
    gender: firstNonEmpty(
      fields[fieldName("genderField")],
      memberFields[sourceFieldOrFallback("sourceGenderField", "genderField")]
    ),
    birth_date: firstNonEmpty(
      fields[fieldName("birthDateField")],
      memberFields[sourceFieldOrFallback("sourceBirthDateField", "birthDateField")]
    ),
    will_be_in_city: fields[fieldName("inCityField")] || "",
    show_parent_fields: Boolean(
      fields[fieldName("motherNationalityField")] ||
      fields[fieldName("fatherNationalityField")] ||
      memberFields[sourceFieldOrFallback("sourceMotherNationalityField", "motherNationalityField")] ||
      memberFields[sourceFieldOrFallback("sourceFatherNationalityField", "fatherNationalityField")] ||
      role === "new_member"
    ),
    parent_mother_nationality: firstNonEmpty(
      fields[fieldName("motherNationalityField")],
      memberFields[sourceFieldOrFallback("sourceMotherNationalityField", "motherNationalityField")]
    ),
    parent_father_nationality: firstNonEmpty(
      fields[fieldName("fatherNationalityField")],
      memberFields[sourceFieldOrFallback("sourceFatherNationalityField", "fatherNationalityField")]
    ),
    address_code: firstNonEmpty(
      fields[fieldName("addressCodeField")],
      memberFields[sourceFieldOrFallback("sourceAddressCodeField", "addressCodeField")]
    ),
    address: firstNonEmpty(
      fields[fieldName("addressField")],
      memberFields[sourceFieldOrFallback("sourceAddressField", "addressField")]
    ),
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
      member_code: primaryPerson.member_code || first[fieldName("memberCodeField")] || "",
      address_code: primaryPerson.address_code || first[fieldName("addressCodeField")] || ""
    },
    address: {
      full: firstNonEmpty(
        primaryPerson.address,
        first[fieldName("addressField")],
        records[0]?.fields?.[fieldName("addressField")]
      )
    },
    persons
  };
}

async function loadRealTokenPayload(token) {
  const tokenField = fieldName("tokenField");
  const tokenStatusField = fieldName("tokenStatusField");
  const expiresAtField = fieldName("expiresAtField");
  const formIdField = fieldName("formIdField");
  const groupFormIdField = fieldName("groupFormIdField");
  const executionTable = getEnvConfig().executionTable;

  const tokenFormula = `{${tokenField}} = "${escapeFormulaValue(token)}"`;
  const matchingRows = await airtableListRecords({
    table: executionTable,
    filterByFormula: tokenFormula,
    maxRecords: 50
  });

  if (!matchingRows.length) {
    throw new Error("Invalid or expired token");
  }

  const firstRecord = matchingRows[0];
  const firstFields = firstRecord.fields || {};
  const tokenStatus = firstFields[tokenStatusField] || "";
  const expiresAt = firstFields[expiresAtField];

  if (tokenStatus === "submitted" || tokenStatus === "expired") {
    throw new Error("This form link is no longer active");
  }

  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
    throw new Error("This form link has expired");
  }

  const groupFormId = firstFields[groupFormIdField];
  const formId = firstFields[formIdField];

  let allRows = matchingRows;
  if (groupFormId) {
    allRows = await airtableListRecords({
      table: executionTable,
      filterByFormula: `{${groupFormIdField}} = "${escapeFormulaValue(groupFormId)}"`,
      maxRecords: 100
    });
  } else if (formId) {
    allRows = await airtableListRecords({
      table: executionTable,
      filterByFormula: `{${formIdField}} = "${escapeFormulaValue(formId)}"`,
      maxRecords: 100
    });
  }

  if (tokenStatus !== "opened") {
    await airtableUpdateRecord({
      table: executionTable,
      recordId: firstRecord.id,
      fields: {
        [tokenStatusField]: "opened"
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

    const config = getEnvConfig();
    if (!config) {
      return {
        ...jsonHeaders(503),
        body: JSON.stringify({
          error: "Airtable environment variables are not configured yet"
        })
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
