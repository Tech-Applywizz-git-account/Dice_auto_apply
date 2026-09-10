const crypto = require('crypto');

function asText(value) {
  if (value == null) return null;
  const text = String(value).trim();
  return text === '' ? null : text;
}

function asBoolean(value) {
  if (value == null || value === '') return false;
  if (typeof value === 'boolean') return value;
  const text = String(value).trim().toLowerCase();
  return ['true', 'yes', '1'].includes(text);
}

function unwrapOperatorRecord(item) {
  if (!item || typeof item !== 'object') return null;
  if (item.operator) return item.operator;
  return item;
}

function mapOperatorRecord(item) {
  const record = unwrapOperatorRecord(item);
  if (!record) {
    throw new Error('Record is empty or invalid.');
  }

  const rawEmail = asText(record.email);
  if (!rawEmail || !rawEmail.includes('@')) {
    throw new Error('Operator record missing valid email.');
  }

  const email = rawEmail.toLowerCase();
  const name = asText(record.name || record.full_name) || email.split('@')[0];
  const role = asText(record.role) || 'operator';
  const disabled = asBoolean(record.disabled);

  return {
    email,
    name,
    role,
    disabled,
  };
}

module.exports = {
  mapOperatorRecord,
};
