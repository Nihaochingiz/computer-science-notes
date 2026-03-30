// Конфигурация
const GITHUB_REPO = "Nihaochingiz/computer-science-notes";
const CATEGORIES = [
  { name: "Основные заметки", path: "notes/", icon: "📘" },
  { name: "JavaScript", path: "js/", icon: "⚡" },
];

let allNotes = [];
let currentNote = null;
let searchIndex = [];

// Инициализация
document.addEventListener("DOMContentLoaded", async () => {
  await loadNotesList();
  setupEventListeners();
});

// Загрузка списка заметок из всех категорий
async function loadNotesList() {
  allNotes = [];

  for (const category of CATEGORIES) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${category.path}`,
      );

      if (!response.ok) {
        console.warn(`Failed to load ${category.path}: ${response.status}`);
        continue;
      }

      const files = await response.json();

      const categoryNotes = files
        .filter(
          (file) => file.name.endsWith(".md") && file.name !== "README.md",
        )
        .map((file) => {
          let id = file.name
            .replace(".md", "")
            .toLowerCase()
            .replace(/[^а-яa-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

          const title = file.name.replace(".md", "");

          return {
            id: id,
            title: title,
            file: file.name,
            path: category.path,
            category: category.name,
            categoryIcon: category.icon,
          };
        });

      allNotes.push(...categoryNotes);
    } catch (error) {
      console.error(`Error loading ${category.path}:`, error);
    }
  }

  // Сортируем сначала по категории, потом по названию
  allNotes.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });

  console.log(`Found ${allNotes.length} notes:`, allNotes);

  renderNavigation();
  await buildSearchIndex();

  // Загружаем первую заметку или из URL
  const hash = window.location.hash.slice(1);
  if (hash && allNotes.find((n) => n.id === hash)) {
    loadNote(hash);
  } else if (allNotes.length > 0) {
    loadNote(allNotes[0].id);
  } else {
    document.getElementById("markdownContent").innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <p>📁 Нет доступных заметок</p>
                <p style="font-size: 14px; color: #57606a; margin-top: 12px;">
                    Добавьте .md файлы в папки <code>notes/</code> и <code>js/</code>
                </p>
            </div>
        `;
    document.getElementById("pageTitle").textContent = "Нет заметок";
  }
}

// Построение навигации с категориями
function renderNavigation() {
  const navList = document.getElementById("navList");

  if (allNotes.length === 0) {
    navList.innerHTML =
      '<li class="nav-item"><div class="nav-item-title">Загрузка заметок...</div></li>';
    return;
  }

  // Группируем заметки по категориям
  const grouped = {};
  for (const note of allNotes) {
    if (!grouped[note.category]) {
      grouped[note.category] = [];
    }
    grouped[note.category].push(note);
  }

  let html = "";
  for (const [category, notes] of Object.entries(grouped)) {
    const icon = notes[0]?.categoryIcon || "📄";
    html += `
            <li class="nav-category">
                <div class="nav-category-header">
                    <span class="nav-category-icon">${icon}</span>
                    <span class="nav-category-title">${escapeHtml(category)}</span>
                </div>
                <ul class="nav-category-items">
        `;

    for (const note of notes) {
      html += `
                <li class="nav-item" data-id="${note.id}">
                    <div class="nav-item-title">${escapeHtml(note.title)}</div>
                </li>
            `;
    }

    html += `</ul></li>`;
  }

  navList.innerHTML = html;

  // Добавляем обработчики кликов
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;
      loadNote(id);
      closeSidebarOnMobile();
    });
  });
}

// Закрытие сайдбара на мобильных устройствах
function closeSidebarOnMobile() {
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById("sidebar");
    if (sidebar && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
    }
  }
}

// Загрузка заметки
async function loadNote(id) {
  currentNote = allNotes.find((n) => n.id === id);
  if (!currentNote) {
    console.error("Note not found:", id);
    return;
  }

  // Обновляем активный пункт в меню
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.id === id);
  });

  // Обновляем заголовок
  document.getElementById("pageTitle").textContent = currentNote.title;

  // Обновляем URL
  window.location.hash = id;

  // Показываем индикатор загрузки
  const contentDiv = document.getElementById("markdownContent");
  contentDiv.innerHTML =
    '<div style="text-align: center; padding: 60px;">📖 Загрузка...</div>';

  // Кодируем имя файла для URL (поддержка русских символов и пробелов)
  const encodedFileName = encodeURIComponent(currentNote.file);
  const fileUrl = `${currentNote.path}${encodedFileName}`;

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const markdown = await response.text();

    // Настройка marked
    if (typeof marked !== "undefined") {
      marked.setOptions({
        breaks: true,
        gfm: true,
      });
    }

    const html = marked.parse(markdown);
    contentDiv.innerHTML = html;

    // Подсветка кода
    if (typeof hljs !== "undefined") {
      document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });
    }

    // Обработка изображений
    document.querySelectorAll("#markdownContent img").forEach((img) => {
      const src = img.getAttribute("src");
      if (
        src &&
        !src.startsWith("http") &&
        !src.startsWith("/") &&
        !src.startsWith("data:")
      ) {
        const encodedSrc = encodeURIComponent(src);
        img.src = `${currentNote.path}${encodedSrc}`;
      }
    });

    // Обработка ссылок на другие md файлы
    document.querySelectorAll("#markdownContent a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.endsWith(".md")) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          // Ищем заметку по имени файла
          const targetNote = allNotes.find((n) => n.file === href);
          if (targetNote) {
            loadNote(targetNote.id);
          } else {
            // Если не нашли, пробуем открыть как есть
            window.open(href, "_blank");
          }
        });
      }
    });
  } catch (error) {
    console.error("Error loading note:", error);
    contentDiv.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: #fff3f3; border-radius: 8px; border: 1px solid #ffccc7;">
                <p style="color: #cf222e;">❌ Ошибка загрузки заметки</p>
                <p style="color: #57606a; font-size: 14px; margin-top: 8px;">Файл: ${escapeHtml(currentNote.file)}</p>
                <p style="color: #57606a; font-size: 12px; margin-top: 8px;">${error.message}</p>
                <p style="font-size: 12px; margin-top: 16px;">Путь: ${escapeHtml(fileUrl)}</p>
            </div>
        `;
  }
}

// Построение поискового индекса
async function buildSearchIndex() {
  searchIndex = [];
  for (const note of allNotes) {
    try {
      const encodedFileName = encodeURIComponent(note.file);
      const response = await fetch(`${note.path}${encodedFileName}`);
      if (response.ok) {
        const content = await response.text();
        const plainText = content.replace(/[#*`_\[\]()]/g, "").slice(0, 500);
        searchIndex.push({
          id: note.id,
          title: note.title,
          content: content,
          excerpt: plainText.trim(),
          category: note.category,
        });
      }
    } catch (error) {
      console.error(`Error indexing ${note.file}:`, error);
    }
  }
  console.log(`Search index built: ${searchIndex.length} notes`);
}

// Поиск
function searchNotes(query) {
  if (!query.trim() || query.length < 2) return [];

  const searchTerm = query.toLowerCase().trim();
  const results = [];

  for (const note of searchIndex) {
    let score = 0;
    const titleLower = note.title.toLowerCase();
    const contentLower = note.content.toLowerCase();

    if (titleLower.includes(searchTerm)) {
      score += 20;
    }

    const occurrences = (contentLower.match(new RegExp(searchTerm, "g")) || [])
      .length;
    score += Math.min(occurrences, 15);

    if (score > 0) {
      let excerpt = note.excerpt;
      const index = contentLower.indexOf(searchTerm);
      if (index !== -1) {
        const start = Math.max(0, index - 60);
        const end = Math.min(contentLower.length, index + 100);
        excerpt =
          "..." + contentLower.slice(start, end).replace(/\n/g, " ") + "...";
      }

      results.push({
        ...note,
        score,
        excerpt: excerpt.length > 150 ? excerpt.slice(0, 150) + "..." : excerpt,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 8);
}

// Отображение результатов поиска
function showSearchResults(query) {
  const resultsContainer = document.getElementById("searchResults");
  const results = searchNotes(query);

  if (results.length === 0 || !query.trim() || query.length < 2) {
    resultsContainer.classList.remove("show");
    return;
  }

  resultsContainer.innerHTML = results
    .map(
      (result) => `
            <div class="search-result-item" data-id="${result.id}">
                <div class="search-result-title">${escapeHtml(result.title)}</div>
                <div class="search-result-excerpt">${escapeHtml(result.excerpt)}</div>
            </div>
        `,
    )
    .join("");

  resultsContainer.classList.add("show");

  document.querySelectorAll(".search-result-item").forEach((item) => {
    item.addEventListener("click", () => {
      loadNote(item.dataset.id);
      document.getElementById("searchInput").value = "";
      resultsContainer.classList.remove("show");
      closeSidebarOnMobile();
    });
  });
}

// Настройка обработчиков событий
function setupEventListeners() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");

  let searchTimeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      showSearchResults(e.target.value);
    }, 300);
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove("show");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchResults.classList.remove("show");
      searchInput.blur();
      closeSidebarOnMobile();
    }
  });

  // Бургер-меню - основной обработчик
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("open");
    });
  }

  // Закрываем меню при клике на контент на мобильных
  if (content) {
    content.addEventListener("click", () => {
      closeSidebarOnMobile();
    });
  }

  // Закрываем меню при изменении размера окна (если стало >768)
  window.addEventListener("resize", () => {
    if (
      window.innerWidth > 768 &&
      sidebar &&
      sidebar.classList.contains("open")
    ) {
      sidebar.classList.remove("open");
    }
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
