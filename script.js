const add_btn = document.getElementById("add-btn");
const form = document.getElementById("entry-form");
const amount_list = document.getElementById("amount-list");
const select_amount = document.getElementById("select-amount");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const total_income = document.getElementById("total-income");
const total_expenses = document.getElementById("total-expenses");
const net_balance = document.getElementById("net-balance");
const filter_group = document.getElementById("filter-group");

let entry_list = JSON.parse(localStorage.getItem("entries")) || [];
let editId = null;
function validation(input) {
  input.addEventListener("input", () => {
    if (input.checkValidity()) {
      input.classList.remove("border-red-500");
    } else {
      input.classList.add("border-red-500");
    }
  });
}
validation(description);
validation(amount);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const entryValue = {
    description: description.value.trim(),
    amount: amount.value,
    selected_value: select_amount.value,
  };

  if (!entryValue.description || !entryValue.amount) return;

  if (editId !== null) {
    entry_list[editId] = entryValue;
    editId = null;
  } else {
    entry_list.push(entryValue);
  }

  localStorage.setItem("entries", JSON.stringify(entry_list));
  renterEntryList();
  updateAmount();

  form.reset();
});

function updateAmount() {
  let totalIncome = 0;
  let totalExpenses = 0;

  entry_list.forEach((entry) => {
    const amount = parseFloat(entry.amount);
    if (entry.selected_value.toLowerCase() === "income") totalIncome += amount;
    else totalExpenses += amount;
  });

  
  total_income.textContent = totalIncome;
  total_expenses.textContent = totalExpenses;
  net_balance.textContent = totalIncome - totalExpenses;
}

const renterEntryList = () => {
  const filter = document
    .querySelector('input[name="filter"]:checked')
    .value.toLowerCase();
  amount_list.innerHTML = "";
  form.reset();

  entry_list.filter((e, index) => {
    if (filter == "all" || e.selected_value.toLowerCase() == filter) {
      const li = document.createElement("li");
      li.className =
        "flex justify-between sm:flex-row flex-col border border-1 sm:px-3 py-2 rounded-lg sm:items-center bg-gray-50 gap-2 sm:gap-3 px-3 ";

      li.innerHTML = `
        <div class="flex justify-between items-center sm:w-1/2">
        <div class="text-sm md:text-lg">${e.description}- <span class="text-sm md:text-lg px-1">₹${e.amount}</span></div>
        <div class="rounded-full bg-green-100 md:px-3 md:py-1 text-center px-2 py-1 text-sm md:text-lg">${e.selected_value}</div>
        </div>
        <div class="flex gap-3 sm:w-1/2 sm:justify-end justify-between">
            <button class="md:px-5 md:py-2 px-2 py-1 bg-yellow-300 rounded-md text-sm md:text-lg" id="edit-${index}">Edit</button>
            <button class="md:px-5 md:py-2 px-2 py-1 bg-red-400 rounded-md text-white text-sm md:text-lg" id="delete-${index}">Delete</button>

        </div>
`;
      amount_list.append(li);

      const edit_btn = document.getElementById(`edit-${index}`);
      edit_btn.addEventListener("click", () => {
        const entry = entry_list[index];

        description.value = entry.description;
        amount.value = entry.amount;
        select_amount.value = entry.selected_value;
        editId = index;
      });

      const delete_btn = document.getElementById(`delete-${index}`);
      delete_btn.addEventListener("click", () => {
        entry_list.splice(index, 1);
        localStorage.setItem("entries", JSON.stringify(entry_list));
        renterEntryList();
        updateAmount();
      });
    }
  });
  if (entry_list.length > 0) {
    filter_group.classList.remove("hidden");
  } else {
    filter_group.classList.add("hidden");
  }
};

const radioFilter = document.querySelectorAll('input[name="filter"]');
radioFilter.forEach((value) => {
  value.addEventListener("change", renterEntryList);
});
renterEntryList();
updateAmount();
