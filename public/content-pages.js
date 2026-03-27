async function loadSiteContent() {
  const response = await fetch("./content/site-content.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load content");
  }

  return response.json();
}

function renderSuccessPage(content) {
  const page = content.successPage || {};
  const eyebrow = document.querySelector("[data-content='success-eyebrow']");
  const title = document.querySelector("[data-content='success-title']");
  const description = document.querySelector("[data-content='success-description']");
  const cardsContainer = document.querySelector("[data-content='success-cards']");

  if (eyebrow) eyebrow.textContent = page.eyebrow || "";
  if (title) title.textContent = page.title || "";
  if (description) description.textContent = page.description || "";

  if (cardsContainer) {
    cardsContainer.innerHTML = (page.cards || []).map((card) => `
      <article class="link-card">
        <h2>${card.title || ""}</h2>
        <p>${card.description || ""}</p>
        <a href="${card.buttonHref || "#"}">${card.buttonLabel || "Открыть"}</a>
      </article>
    `).join("");
  }
}

function renderCommunityPage(content) {
  const page = content.communityPage || {};
  const eyebrow = document.querySelector("[data-content='community-eyebrow']");
  const title = document.querySelector("[data-content='community-title']");
  const description = document.querySelector("[data-content='community-description']");
  const navContainer = document.querySelector("[data-content='community-nav']");
  const sectionsContainer = document.querySelector("[data-content='community-sections']");

  if (eyebrow) eyebrow.textContent = page.eyebrow || "";
  if (title) title.textContent = page.title || "";
  if (description) description.textContent = page.description || "";

  if (navContainer) {
    navContainer.innerHTML = (page.navLinks || []).map((item) => `
      <a href="${item.href || "#"}">${item.label || ""}</a>
    `).join("");
  }

  if (sectionsContainer) {
    sectionsContainer.innerHTML = (page.sections || []).map((section) => `
      <section id="${section.id || ""}" class="section-panel">
        <h2>${section.title || ""}</h2>
        <p>${section.description || ""}</p>
        ${(section.items || []).length ? `
          <div class="bullet-list">
            ${(section.items || []).map((item) => `
              <div class="bullet">
                <strong>${item.title || ""}</strong>
                <span>${item.text || ""}</span>
              </div>
            `).join("")}
          </div>
        ` : ""}
      </section>
    `).join("");
  }
}

loadSiteContent()
  .then((content) => {
    const pageType = document.body.dataset.pageType;
    if (pageType === "success") renderSuccessPage(content);
    if (pageType === "community") renderCommunityPage(content);
  })
  .catch((error) => {
    console.error("Content load failed", error);
  });
