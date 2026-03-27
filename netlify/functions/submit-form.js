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
  onlineStatusField: "Статус - онлайн-форма",
  detailsConfirmedField: "Я подтверждаю, что данные заполняются правильно.",
  chametzConfirmedField: "Я прошу раввина продать мой хамец в канун праздника в этом году.",
  submittedAtField: "submitted_at",
  payloadJsonField: "last_payload_json"
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

function validatePayload(body) {
  if (!body.token) {
    throw new Error("Token is required");
  }

  if (!body.form_id) {
    throw new Error("Form ID is required");
  }

  if (!Array.isArray(body.persons) || !body.persons.length) {
    throw new Error("At least one person is required");
  }

  if (body.persons.some((person) => !["yes", "no"].includes(person.will_be_in_city))) {
    throw new Error("Each person must answer whether they will be in the city on Pesach");
  }

  if (!body.details_confirmed) {
    throw new Error("Details confirmation is required");
  }

  if (!body.chametz_sale_confirmation) {
    throw new Error("Chametz authorization is required");
  }
}

function buildPersonUpdate(person, fullPayload) {
  const fields = {
    [fieldName("lastNameField")]: person.last_name || "",
    [fieldName("firstNameField")]: person.first_name || "",
    [fieldName("middleNameField")]: person.middle_name || "",
    [fieldName("genderField")]: person.gender || "",
    [fieldName("birthDateField")]: person.birth_date || "",
    [fieldName("inCityField")]: person.will_be_in_city || "",
    [fieldName("roleField")]: person.role || "",
    [fieldName("motherNationalityField")]: person.parent_mother_nationality || "",
    [fieldName("fatherNationalityField")]: person.parent_father_nationality || "",
    [fieldName("contactsJsonField")]: JSON.stringify(person.contacts || []),
    [fieldName("detailsConfirmedField")]: Boolean(fullPayload.details_confirmed),
    [fieldName("chametzConfirmedField")]: Boolean(fullPayload.chametz_sale_confirmation),
    [fieldName("submittedAtField")]: new Date().toISOString(),
    [fieldName("tokenStatusField")]: "submitted",
    [fieldName("onlineStatusField")]: "Ответ получен в онлайн-форме."
  };

  if (person.relationship) {
    fields[fieldName("relationshipField")] = person.relationship;
  } else {
    fields[fieldName("relationshipField")] = "";
  }

  if (fullPayload.address?.confirmed === "yes") {
    fields[fieldName("addressField")] = fullPayload.address.full || "";
  } else if (fullPayload.address?.confirmed === "no") {
    fields[fieldName("addressField")] = fullPayload.address.new_address || fullPayload.address.full || "";
  }

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
  return reduced;
}

async function updateRecordWithFallback(recordId, fields) {
  try {
    return await airtableUpdateRecord({
      table: getEnvConfig().executionTable,
      recordId,
      fields
    });
  } catch (error) {
    error.debugFields = buildDebugFieldPreview(fields);
    const message = String(error.message || "");
    const optionalFieldNames = [
      fieldName("detailsConfirmedField"),
      fieldName("chametzConfirmedField"),
      fieldName("payloadJsonField")
    ];

    if (optionalFieldNames.some((name) => name && message.includes(name))) {
      const reducedFields = stripOptionalSubmitFields(fields);
      try {
        return await airtableUpdateRecord({
          table: getEnvConfig().executionTable,
          recordId,
          fields: reducedFields
        });
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

    if (matchingRows.some((record) => (record.fields || {})[fieldName("tokenStatusField")] === "submitted")) {
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
    for (const record of matchingRows) {
      const person = personsByExecutionId.get(record.id);
      if (!person) {
        continue;
      }

      await updateRecordWithFallback(record.id, buildPersonUpdate(person, body));
      updatedCount += 1;
    }

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
    return {
      ...jsonHeaders(500),
      body: JSON.stringify({
        error: error.message,
        debug_fields: error.debugFields || null
      })
    };
  }
};
