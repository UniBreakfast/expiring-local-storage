const [saveForm, loadForm] = document.forms;

prefillForm(saveForm, { key: 'discount-code', value: 'SAVE10', 'max-age': 10 });
prefillForm(loadForm, { key: 'discount-code' });

saveForm.addEventListener('submit', handleSave);
loadForm.addEventListener('submit', handleLoad);

function handleSave(event) {
  event.preventDefault();

  const data = new FormData(saveForm);
  const { key, ...record } = Object.fromEntries(data);

  record.timestamp = Date.now();
  localStorage.setItem(key, JSON.stringify(record));

  saveForm.result.value = `Saved ${key} at ${new Date(record.timestamp).toLocaleString()}`;
}

function handleLoad(event) {
  event.preventDefault();

  const key = loadForm.key.value;
  const record = JSON.parse(localStorage.getItem(key));

  if (record) {
    const expired = record && Date.now() - record.timestamp > 1000 * record['max-age'];

    if (expired) {
      localStorage.removeItem(key);
      loadForm.result.value = `Expired ${key}`;
      loadForm.value.value = '';
      return;
    }

    loadForm.value.value = record.value;
    loadForm.result.value = `Loaded ${key}`;
    
    return;
  }

  loadForm.result.value = `No record found for ${key}`;

}

function prefillForm(form, data) {
  for (const key in data) {
    try {
      form.elements[key].value = data[key];
    } catch (error) { }
  }
}