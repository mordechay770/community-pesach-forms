const DEMO_FORMS = {
  "demo-single": {
    form_id: "FORM-recREQ001",
    request_id: "recREQ001",
    group_form_id: "GF-recREQ001",
    mode: "single_update",
    summary: "Single update form for one known community member.",
    meta: {
      member_code: "6378",
      address_code: "3567"
    },
    address: {
      full: "РђР»РјР°С‚С‹, СѓР». РђР±Р°СЏ 123, РєРІ. 45"
    },
    persons: [
      {
        execution_record_id: "demo-self-1",
        role: "self",
        is_newly_added: false,
        relationship: "",
        member_code: "6378",
        address_code: "3567",
        full_name: "РљРѕРіРµРЅ РњРѕСЂРґРµС…Р°Р№",
        last_name: "РљРѕРіРµРЅ",
        first_name: "РњРѕСЂРґРµС…Р°Р№",
        middle_name: "",
        iin: "870309000050",
        gender: "Рњ",
        birth_date: "09.03.1987",
        will_be_in_city: "",
        show_profile_extra_fields: true,
        show_parent_fields: true,
        maiden_name: "",
        hebrew_name: "",
        birth_place: "",
        education: "",
        specialty: "",
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
        contacts: [
          {
            number: "77012345678",
            kind: "phone",
            owner_type: "self",
            whatsapp: "yes",
            active: "yes",
            is_existing_source: true
          }
        ]
      }
    ]
  }
};

const defaults = {
  executionTable: "РґР»СЏ РЅРµР·Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°РЅРЅС‹С… РІ РѕР±С‰РёРЅРµ",
  memberTable: "Р§Р»РµРЅС‹_СЃРµРјСЊРё",
  memberLinkField: "Ч›ЧЁЧЧ™ЧЎ ЧђЧ™Ч©Ч™ Ч©Чњ Ч—Ч‘ЧЁ Ч§Ч”Ч™ЧњЧ”",
  contactTable: "РљРѕРЅС‚Р°РєС‚РЅС‹РµР”Р°РЅРЅС‹Рµ",
  contactMemberLinkField: "Label",
  contactNumberField: "РџРѕР»РЅС‹Р№ РЅРѕРјРµСЂ",
  contactWhatsappField: "Whatsapp",
  contactActivityField: "РђРєС‚РёРІРЅРѕСЃС‚СЊ РЅРѕРјРµСЂР°",
  contactOwnerField: "РљРѕРјСѓ РїСЂРёРЅР°РґР»РµР¶РёС‚ РЅРѕРјРµСЂ",
  sourceContactsField: "РљРѕРЅС‚Р°РєС‚РЅС‹РµР”Р°РЅРЅС‹Рµ",
  tokenField: "token",
  tokenStatusField: "token_status",
  expiresAtField: "expires_at",
  formIdField: "form_id",
  groupFormIdField: "group_form_id",
  requestIdField: "RECORD ID (from Ч§Ч™Ч©Ч•ЧЁ ЧњЧ¤Ч’Ч™Ч©Ч”)",
  modeField: "form_mode",
  memberCodeField: "РљРѕРґР§Р»РµРЅС‹ СЃРµРјСЊРё (from Ч›ЧЁЧЧ™ЧЎ ЧђЧ™Ч©Ч™ Ч©Чњ Ч—Ч‘ЧЁ Ч§Ч”Ч™ЧњЧ”)",
  addressCodeField: "РљРѕРґ (from РљРѕРґ Р°РґСЂРµСЃР°) (from Ч›ЧЁЧЧ™ЧЎ ЧђЧ™Ч©Ч™ Ч©Чњ Ч—Ч‘ЧЁ Ч§Ч”Ч™ЧњЧ”)",
  addressField: "Р”РѕРјР°С€РЅРёР№ Р°РґСЂРµСЃ",
  roleField: "form_role",
  relationshipField: "Ч§ЧЁЧ‘Ч” ЧњЧћЧћЧњЧђ Ч”ЧЧ•Ч¤ЧЎ",
  fullNameField: "full_name",
  lastNameField: "Р¤Р°РјРёР»РёСЏ",
  firstNameField: "РРјСЏ",
  middleNameField: "РћС‚С‡РµСЃС‚РІРѕ",
  iinField: "РРРќ",
  genderField: "Р РѕРґ",
  birthDateField: "Р“СЂРёРіРѕСЂ РґР°С‚Р° СЂРѕР¶РґРµРЅРёСЏ",
  inCityField: "РЅР° РїРµСЃР°С… Р±СѓРґСѓ РІ РіРѕСЂРѕРґРµ",
  motherNationalityField: "РЅР°С†РёРѕРЅР°Р»СЊРЅРѕСЃС‚СЊ РјР°С‚РµСЂРё",
  fatherNationalityField: "РЅР°С†РёРѕРЅР°Р»СЊРЅРѕСЃС‚СЊ РѕС‚С†Р°",
  contactsJsonField: "contacts_json",
  maidenNameField: "Р”РµРІРёС‡СЊСЏ С„Р°РјРёР»РёСЏ",
  hebrewNameField: "Р•РІСЂРµР№СЃРєРѕРµ РёРјСЏ",
  birthPlaceField: "РњРµСЃС‚Рѕ СЂРѕР¶РґРµРЅРёСЏ",
  educationField: "РћР±СЂР°Р·РѕРІР°РЅРёРµ",
  specialtyField: "РЎРїРµС†РёР°Р»СЊРЅРѕСЃС‚СЊ",
  schoolField: "Номер школы",
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
  sourceFullNameField: "",
  sourceLastNameField: "Р¤Р°РјРёР»РёСЏ",
  sourceFirstNameField: "РРјСЏ",
  sourceMiddleNameField: "РћС‚С‡РµСЃС‚РІРѕ",
  sourceIinField: "РРРќ",
  sourceGenderField: "Р РѕРґ",
  sourceBirthDateField: "Р“СЂРёРіРѕСЂ РіРѕРґ СЂРѕР¶РґРµРЅРёСЏ",
  sourceAltBirthDateField: "Р“СЂРёРіРѕСЂ РґР°С‚Р° СЂРѕР¶РґРµРЅРёСЏ",
  sourceAddressField: "Ч›ЧЄЧ•Ч‘ЧЄ ЧћЧњЧђЧ” (from РљРѕРґ Р°РґСЂРµСЃР°)",
  sourceMemberCodeField: "РљРѕРґР§Р»РµРЅС‹ СЃРµРјСЊРё",
  sourceAddressCodeField: "РљРѕРґ (from РљРѕРґ Р°РґСЂРµСЃР°)",
  sourceMotherNationalityField: "РќР°С† РјР°РјС‹",
  sourceFatherNationalityField: "РќР°С† РїР°РїС‹",
  sourceMaidenNameField: "Р”РµРІРёС‡СЊСЏР¤Р°РјРёР»РёСЏ",
  sourceHebrewNameField: "Р•РІСЂРРјСЏ",
  sourceBirthPlaceField: "РњРµСЃС‚РѕР РѕР¶РґРµРЅРёСЏ",
  sourceEducationField: "РћР±СЂР°Р·РѕРІР°РЅРёРµ",
  sourceSpecialtyField: "РЎРїРµС†РёР°Р»СЊРЅРѕСЃС‚СЊ",
  sourceSchoolField: "Номер школы",
  sourceMotherLastNameField: "Р¤Р°РјРёР»РёСЏРњР°С‚РµСЂРё",
  sourceMotherFirstNameField: "РРјСЏ РјР°С‚РµСЂРё",
  sourceMotherHebrewNameField: "Р•РІСЂРРјСЏРњР°С‚РµСЂРё",
  sourceMotherMiddleNameField: "",
  sourceMotherBirthDateField: "Р”Р°С‚Р°Р РѕР¶РґРµРЅРёСЏРњР°С‚РµСЂРё",
  sourceMotherBirthPlaceField: "РњРµСЃС‚РѕР РѕР¶РґРµРЅРёСЏРњР°С‚РµСЂРё",
  sourceFatherLastNameField: "Р¤Р°РјРёР»РёСЏРћС‚С†Р°",
  sourceFatherFirstNameField: "РРјСЏРћС‚С†Р°",
  sourceFatherHebrewNameField: "Р•РІСЂРРјСЏРћС‚С†Р°",
  sourceFatherMiddleNameField: "РћС‚С‡РµСЃС‚РІРѕРћС‚С†Р°",
  sourceFatherBirthDateField: "Р”Р°С‚Р°Р РѕР¶РґРµРЅРёСЏРћС‚С†Р°",
  sourceFatherBirthPlaceField: "РњРµСЃС‚РѕР РѕР¶РґРµРЅРёСЏРћС‚С†Р°"
};

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
  return { statusCode, headers: { "Content-Type": "application/json" } };
}

function escapeFormulaValue(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
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

async function airtableGetRecord({ table, recordId }) {
  const config = getEnvConfig();
  const response = await fetch(
    `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(table)}/${recordId}`,
    {
      headers: { Authorization: `Bearer ${config.apiToken}` }
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Airtable record request failed");
  return data;
}

async function airtableUpdateRecord({ table, recordId, fields }) {
  const config = getEnvConfig();
  const response = await fetch(
    `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(table)}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fields })
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Airtable update failed");
  return data;
}

function firstNonEmpty(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "") || "";
}

function parseContacts(rawValue) {
  if (!rawValue) return [];
  if (Array.isArray(rawValue)) return rawValue;
  try {
    return JSON.parse(rawValue);
  } catch {
    return [];
  }
}

function formatBirthDate(value) {
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

function normalizeGender(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  if (["m", "Рј"].includes(text)) return "Рњ";
  if (["f", "Р¶"].includes(text)) return "Р–";
  return String(value || "");
}

function isActiveContact(activityValue) {
  const value = String(activityValue || "").toLowerCase();
  if (!value) return true;
  return !value.includes("РЅРµР°РєС‚") && !value.includes("inactive") && !value.includes("РѕС€РёР±");
}

function normalizeWhatsapp(value) {
  if (value === true) return "yes";
  const text = String(value || "").trim().toLowerCase();
  if (["yes", "РґР°", "true", "1"].includes(text)) return "yes";
  if (["no", "РЅРµС‚", "false", "0"].includes(text)) return "no";
  return "";
}

function normalizeContact(recordOrFields) {
  const record = recordOrFields && recordOrFields.fields ? recordOrFields : null;
  const fields = record ? record.fields || {} : recordOrFields || {};
  const raw = firstNonEmpty(fields[fieldName("contactNumberField")], fields["РњРѕР±РёР»СЊРЅС‹Р№ С‚РµР»РµС„РѕРЅ"]);
  const text = String(raw || "").trim();
  const kind = text.includes("@") ? "email" : "phone";

  return {
    contact_record_id: record?.id || fields.contact_record_id || "",
    number: kind === "email" ? text : text.replace(/\D+/g, ""),
    kind,
    owner_type: fields[fieldName("contactOwnerField")] || "",
    whatsapp: normalizeWhatsapp(fields[fieldName("contactWhatsappField")]),
    active: isActiveContact(fields[fieldName("contactActivityField")]) ? "yes" : "no",
    is_existing_source: true
  };
}

async function getLinkedMemberRecord(executionFields) {
  const linked = executionFields[fieldName("memberLinkField")];
  const memberRecordId = Array.isArray(linked) ? linked[0] : linked;
  if (!memberRecordId) return null;
  return airtableGetRecord({ table: fieldName("memberTable"), recordId: memberRecordId });
}

async function getContactsFromIds(contactIds) {
  const records = await Promise.all(
    contactIds.map((contactId) =>
      airtableGetRecord({ table: fieldName("contactTable"), recordId: contactId }).catch(() => null)
    )
  );

  return records
    .filter(Boolean)
    .map(normalizeContact)
    .filter((contact) => contact.number);
}

async function getContactsForMember(memberRecordId, memberFields) {
  const linkedContacts = memberFields[fieldName("sourceContactsField")];
  if (Array.isArray(linkedContacts) && linkedContacts.length) {
    return getContactsFromIds(linkedContacts);
  }

  if (!memberRecordId) return [];

  const formula = `FIND("${escapeFormulaValue(memberRecordId)}", ARRAYJOIN({${fieldName("contactMemberLinkField")}}))`;
  const rows = await airtableListRecords({
    table: fieldName("contactTable"),
    filterByFormula: formula,
    maxRecords: 50
  });

  return rows
    .map(normalizeContact)
    .filter((contact) => contact.number);
}

function roleRank(role) {
  return { self: 1, mother: 1, spouse: 2, child: 3, new_member: 4 }[role] || 99;
}

function shouldShowWhenMissing(values, role) {
  return values.some((value) => !String(value || "").trim()) || role === "new_member";
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
  const maidenName = firstNonEmpty(fields[fieldName("maidenNameField")], memberFields[fieldName("sourceMaidenNameField")]);
  const hebrewName = firstNonEmpty(fields[fieldName("hebrewNameField")], memberFields[fieldName("sourceHebrewNameField")]);
  const birthPlace = firstNonEmpty(fields[fieldName("birthPlaceField")], memberFields[fieldName("sourceBirthPlaceField")]);
  const education = firstNonEmpty(fields[fieldName("educationField")], memberFields[fieldName("sourceEducationField")]);
  const specialty = firstNonEmpty(fields[fieldName("specialtyField")], memberFields[fieldName("sourceSpecialtyField")]);
  const motherNationality = firstNonEmpty(fields[fieldName("motherNationalityField")], memberFields[fieldName("sourceMotherNationalityField")]);
  const fatherNationality = firstNonEmpty(fields[fieldName("fatherNationalityField")], memberFields[fieldName("sourceFatherNationalityField")]);
  const motherLastName = firstNonEmpty(fields[fieldName("motherLastNameField")], memberFields[fieldName("sourceMotherLastNameField")]);
  const motherFirstName = firstNonEmpty(fields[fieldName("motherFirstNameField")], memberFields[fieldName("sourceMotherFirstNameField")]);
  const motherHebrewName = firstNonEmpty(fields[fieldName("motherHebrewNameField")], memberFields[fieldName("sourceMotherHebrewNameField")]);
  const motherMiddleName = firstNonEmpty(fields[fieldName("motherMiddleNameField")], memberFields[fieldName("sourceMotherMiddleNameField")]);
  const motherBirthDate = formatBirthDate(firstNonEmpty(fields[fieldName("motherBirthDateField")], memberFields[fieldName("sourceMotherBirthDateField")]));
  const motherBirthPlace = firstNonEmpty(fields[fieldName("motherBirthPlaceField")], memberFields[fieldName("sourceMotherBirthPlaceField")]);
  const fatherLastName = firstNonEmpty(fields[fieldName("fatherLastNameField")], memberFields[fieldName("sourceFatherLastNameField")]);
  const fatherFirstName = firstNonEmpty(fields[fieldName("fatherFirstNameField")], memberFields[fieldName("sourceFatherFirstNameField")]);
  const fatherHebrewName = firstNonEmpty(fields[fieldName("fatherHebrewNameField")], memberFields[fieldName("sourceFatherHebrewNameField")]);
  const fatherMiddleName = firstNonEmpty(fields[fieldName("fatherMiddleNameField")], memberFields[fieldName("sourceFatherMiddleNameField")]);
  const fatherBirthDate = formatBirthDate(firstNonEmpty(fields[fieldName("fatherBirthDateField")], memberFields[fieldName("sourceFatherBirthDateField")]));
  const fatherBirthPlace = firstNonEmpty(fields[fieldName("fatherBirthPlaceField")], memberFields[fieldName("sourceFatherBirthPlaceField")]);

  const savedContacts = parseContacts(fields[fieldName("contactsJsonField")]).map((contact) => ({
    kind: "phone",
    owner_type: "",
    whatsapp: "",
    active: "",
    is_existing_source: false,
    ...contact
  }));

  const resolvedContacts = savedContacts.length
    ? savedContacts
    : await getContactsForMember(memberRecordId, memberFields);

  return {
    execution_record_id: record.id,
    role,
    is_newly_added: false,
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
    gender: normalizeGender(firstNonEmpty(fields[fieldName("genderField")], memberFields[fieldName("sourceGenderField")])),
    birth_date: formatBirthDate(
      firstNonEmpty(
        fields[fieldName("birthDateField")],
        memberFields[fieldName("sourceBirthDateField")],
        memberFields[fieldName("sourceAltBirthDateField")]
      )
    ),
    will_be_in_city: fields[fieldName("inCityField")] || "",
    show_profile_extra_fields: shouldShowWhenMissing(
      [maidenName, hebrewName, birthPlace, education, specialty],
      role
    ),
    show_parent_fields: shouldShowWhenMissing(
      [
        motherNationality,
        fatherNationality,
        motherLastName,
        motherFirstName,
        motherHebrewName,
        motherMiddleName,
        motherBirthDate,
        motherBirthPlace,
        fatherLastName,
        fatherFirstName,
        fatherHebrewName,
        fatherMiddleName,
        fatherBirthDate,
        fatherBirthPlace
      ],
      role
    ),
    maiden_name: maidenName,
    hebrew_name: hebrewName,
    birth_place: birthPlace,
    education,
    specialty,
    school_number: firstNonEmpty(fields[fieldName("schoolField")], memberFields[fieldName("sourceSchoolField")]),
    parent_mother_nationality: motherNationality,
    parent_father_nationality: fatherNationality,
    mother_last_name: motherLastName,
    mother_first_name: motherFirstName,
    mother_hebrew_name: motherHebrewName,
    mother_middle_name: motherMiddleName,
    mother_birth_date: motherBirthDate,
    mother_birth_place: motherBirthPlace,
    father_last_name: fatherLastName,
    father_first_name: fatherFirstName,
    father_hebrew_name: fatherHebrewName,
    father_middle_name: fatherMiddleName,
    father_birth_date: fatherBirthDate,
    father_birth_place: fatherBirthPlace,
    address: firstNonEmpty(fields[fieldName("addressField")], memberFields[fieldName("sourceAddressField")]),
    contacts: resolvedContacts,
    member_record_id: memberRecordId || ""
  };
}

async function buildPayloadFromRecords(records) {
  if (!records.length) throw new Error("No execution rows found for this token");

  const first = records[0].fields || {};
  const persons = (await Promise.all(records.map(buildPersonFromRecord))).sort(
    (a, b) => roleRank(a.role) - roleRank(b.role)
  );
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

  if (!matchingRows.length) throw new Error("Invalid or expired token");

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
      fields: { [fieldName("tokenStatusField")]: "opened" }
    });
  }

  return buildPayloadFromRecords(allRows);
}

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const token = body.token;

    if (!token) {
      return { ...jsonHeaders(400), body: JSON.stringify({ error: "Token is required" }) };
    }

    if (DEMO_FORMS[token]) {
      return { ...jsonHeaders(200), body: JSON.stringify(DEMO_FORMS[token]) };
    }

    if (!getEnvConfig()) {
      return {
        ...jsonHeaders(503),
        body: JSON.stringify({ error: "Airtable environment variables are not configured yet" })
      };
    }

    const payload = await loadRealTokenPayload(token);
    return { ...jsonHeaders(200), body: JSON.stringify(payload) };
  } catch (error) {
    return { ...jsonHeaders(500), body: JSON.stringify({ error: error.message }) };
  }
};
