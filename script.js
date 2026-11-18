"use strict";
const CURRENT_YEAR = 2026; 
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
function styleButton(button)
 {
  button.style.background = "var(--bg-panel2)";
  button.style.color = "var(--bone)";
  button.style.border = "1px solid var(--line)";
  button.style.padding = ".4rem .9rem";
  button.style.fontFamily = "var(--font-mono)";
  button.style.cursor = "pointer";
  button.style.marginRight = ".5rem";
}
function makeLabel(forId, text)
 {
  const label = document.createElement("label");
  label.setAttribute("for", forId);
  label.textContent = text;
  return label;
}
let isDarkMode = true; 
function setupThemeSwitcher() 
{
  const button = document.createElement("button");
  button.type = "button";
  button.id = "theme-toggle";
  button.textContent = "Toggle Light/Dark Mode";
  styleButton(button);
  const bar = document.createElement("div");
  bar.style.textAlign = "center";
  bar.style.padding = ".6rem 0 0";
  bar.append(button);
  document.body.prepend(bar); 
  $$("thead th, input[type='submit']").forEach((item) =>
     {
    item.style.color = "#e9e4d3";
  });
  button.addEventListener("click", function () 
  {
    isDarkMode = !isDarkMode;
    const root = document.documentElement;
    const nav = $("nav");
    if (isDarkMode)
       {
      document.body.style.backgroundColor = "#0d100c";
      document.body.style.color = "#e9e4d3";
      ["--bg", "--bg-panel", "--bg-panel2", "--bone", "--bone-dim",
       "--rot-light", "--blood-lt", "--line"].forEach((name) => root.style.removeProperty(name));
      nav.style.background = "";
    } else {
      document.body.style.backgroundColor = "#f4f1e6";
      document.body.style.color = "#1d2218";
      root.style.setProperty("--bg", "#f4f1e6");
      root.style.setProperty("--bg-panel", "#ffffff");
      root.style.setProperty("--bg-panel2", "#e8e4d2");
      root.style.setProperty("--bone", "#1d2218");
      root.style.setProperty("--bone-dim", "#4b5042");
      root.style.setProperty("--rot-light", "#3d5a1f");
      root.style.setProperty("--blood-lt", "#9e2a20");
      root.style.setProperty("--line", "#c9c4ae");
      nav.style.background = "rgba(244,241,230,.95)";
    }
  });
}
function setupOpeningStatus() 
{
  const banner = document.createElement("p");
  banner.id = "status-banner";
  banner.style.fontWeight = "700";
  banner.style.margin = ".6rem 0";
  $("header h1").after(banner); 
  function updateStatus() 
  {
    const hour = new Date().getHours(); 
    if (hour >= 8 && hour < 20) {
      banner.textContent = "We are Open!";
      banner.style.color = "green";
    } else {
      banner.textContent = "Closed - Open at 8 AM";
      banner.style.color = "red";
    }
  }
  updateStatus();
  setInterval(updateStatus, 60 * 1000); 
}
function setupRowHighlight() 
{
  const rows = $$("#table tbody tr");
  rows.forEach(function (row)
   {
    row.addEventListener("mouseover", function ()
     {
      row.style.backgroundColor = isDarkMode ? "#3d5a1f" : "#cfe3b0";
    });
    row.addEventListener("mouseout", function () {
      row.style.backgroundColor = ""; 
    });
  });
}
const SUPPLIES = 
{
  "Drinking water":        { price: 2,  category: "essentials" },
  "Non-perishable food":   { price: 6,  category: "essentials" },
  "First-aid kit":         { price: 15, category: "essentials" },
  "Flashlight":            { price: 8,  category: "gear" },
  "Batteries":             { price: 4,  category: "gear" },
  "Warm clothing":         { price: 20, category: "gear" },
  "Blanket":               { price: 12, category: "gear" },
  "Phone and charger":     { price: 25, category: "gear" },
  "Important documents":   { price: 3,  category: "essentials" },
};
function setupSuppliesList() 
{
  const list = $("#survival ul");
  const items = $$("li", list);
  const totalText = document.createElement("p");
  totalText.id = "total";
  totalText.style.fontWeight = "700";
  list.after(totalText);
  function updateTotal()
   {
    let total = 0;
    $$("input[type='checkbox']", list).forEach(function (box)
     {
      if (box.checked) {
        total += Number(box.dataset.price); 
      }
    });
    totalText.textContent = "Total: $" + total;
  }

  items.forEach(function (item) {
    const name = item.textContent.trim();
    const info = SUPPLIES[name] || { price: 0, category: "gear" };

    const box = document.createElement("input");
    box.type = "checkbox";
    box.dataset.price = info.price;

    const priceTag = document.createElement("span");
    priceTag.textContent = " - $" + info.price;

    item.dataset.category = info.category;
    item.prepend(box);
    item.append(priceTag);

    box.addEventListener("change", updateTotal); 
  });
  updateTotal(); 
  const filterBar = document.createElement("div");
  filterBar.style.margin = ".5rem 0";
  const filters = [
    { text: "All",        value: "all" },
    { text: "Essentials", value: "essentials" },
    { text: "Gear",       value: "gear" },
  ];

  filters.forEach(function (filter) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = filter.text;
    styleButton(button);
    filterBar.append(button);

    button.addEventListener("click", function () {
      items.forEach(function (item) {
        const matches = filter.value === "all" || item.dataset.category === filter.value;
        item.style.display = matches ? "" : "none"; // hide non-matching items
      });
      // highlight the active filter button
      $$("button", filterBar).forEach((b) => (b.style.borderColor = "var(--line)"));
      button.style.borderColor = "var(--rot)";
    });
  });

  list.before(filterBar);
  filterBar.firstElementChild.style.borderColor = "var(--rot)"; 
}
function setupReadMore()
 {
  const articles = $$("#types article");

  articles.forEach(function (article) {
    const paragraphs = $$("p", article);
    const extra = paragraphs.slice(1);
    if (extra.length === 0) return;

    extra.forEach((p) => (p.style.display = "none")); 

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Read More";
    styleButton(button);
    article.append(button);

    button.addEventListener("click", function () {
      const isHidden = extra[0].style.display === "none";
      extra.forEach((p) => (p.style.display = isHidden ? "block" : "none"));
      button.textContent = isHidden ? "Read Less" : "Read More";
    });
  });
}
function setupContactForm() 
{
  const form = $("#contact form");
  const nameInput = $("#contact-name");
  const emailInput = $("#contact-email");
  const birthYearInput = document.createElement("input");
  birthYearInput.type = "text";
  birthYearInput.id = "birth-year";
  birthYearInput.name = "birth-year";
  birthYearInput.placeholder = "e.g. 2002";
  const birthBreak1 = document.createElement("br");
  const birthBreak2 = document.createElement("br");

  const messageLabel = $("label[for='message']", form);
  messageLabel.before(
    makeLabel("birth-year", "Birth Year (for our student/senior discount):"),
    document.createElement("br"),
    birthYearInput,
    birthBreak1,
    birthBreak2
  );
  const notesBox = document.createElement("textarea");
  notesBox.id = "special-notes";
  notesBox.name = "special-notes";
  notesBox.rows = 3;
  notesBox.cols = 50;
  notesBox.maxLength = 100;
  notesBox.placeholder = "Any special requests?";

  const counter = document.createElement("p");
  counter.id = "notes-counter";
  counter.textContent = "100 characters remaining";
  counter.style.fontSize = ".85rem";
  counter.style.color = "var(--bone-dim)";

  const submitButton = $("input[type='submit']", form);
  submitButton.before(
    makeLabel("special-notes", "Special Requests:"),
    document.createElement("br"),
    notesBox,
    counter
  );
  notesBox.addEventListener("input", function ()
   {
    const remaining = notesBox.maxLength - notesBox.value.length;
    counter.textContent =
      remaining + (remaining === 1 ? " character remaining" : " characters remaining");
    counter.style.color = remaining <= 10 ? "red" : "var(--bone-dim)";
  });

  const messageArea = document.createElement("div");
  messageArea.id = "form-message";
  messageArea.style.marginTop = ".8rem";
  form.after(messageArea);

  function showMessage(text, color) {
    const line = document.createElement("p");
    line.textContent = text; 
    line.style.color = color;
    messageArea.append(line);
  }

  form.addEventListener("submit", function (e) 
  {
    e.preventDefault(); 
    messageArea.textContent = ""; 

    const username = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (username === "" || email === "") 
      {
      showMessage("Please fill in both your name and your email.", "red");
      return;
    }
    const birthText = birthYearInput.value.trim();
    let discountMessage = "";

    if (birthText !== "")
       {
      const birthYear = parseInt(birthText, 10); 
      if (isNaN(birthYear) || birthYear < 1900 || birthYear > CURRENT_YEAR)
         {
        showMessage("Please enter a valid birth year, like 2002.", "red");
        return;
      }

      const age = CURRENT_YEAR - birthYear;
      if (age >= 60)
         {
        discountMessage = "Senior discount confirmed! You are " + age + " years old.";
      } else if (age >= 18 && age <= 25)
         {
        discountMessage = "Student discount confirmed! You are " + age + " years old.";
      } else
         {
        discountMessage = "You are " + age + " years old, so no age discount applies.";
      }
    }

    showMessage(
      "Thank you for visiting, " + username + "! We will contact you at " + email + ".",
      "var(--rot-light)"
    );
    if (discountMessage !== "")
       {
      showMessage(discountMessage, "var(--rot-light)");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () 
{
  setupThemeSwitcher();   // Task 3
  setupOpeningStatus();   // Task 8
  setupRowHighlight();    // Task 2
  setupSuppliesList();    // Tasks 4 and 7
  setupReadMore();        // Task 6
  setupContactForm();     // Tasks 1, 5 and 9
});
