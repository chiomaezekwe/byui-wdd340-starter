/*const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    }) */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#updateForm")
  const updateBtn = document.querySelector("#updateButton")

  if (!form || !updateBtn) return;

  // Store original form data
  const initialData = new FormData(form)
  const initialValues = {}

  initialData.forEach((value, key) => {
    initialValues[key] = value
  })

  form.addEventListener("input", function () {
    const currentData = new FormData(form)
    let changed = false

    currentData.forEach((value, key) => {
      if (initialValues[key] !== value) {
        changed = true
      }
    })

    updateBtn.disabled = !changed
  })
})