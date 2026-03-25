// Конфигурация
const NOTES_DIR = "notes/";
const GITHUB_REPO = "Nihaochingiz/computer-science-notes";
let notesList = [];
let currentNote = null;
let searchIndex = [];

// Инициализация
document.addEventListener("DOMContentLoaded", async () => {
  await loadNotesList();
  setupEventListeners();

  // Загружаем первую заметку или из URL
  const hash = window.location.hash.slice(1);
  if (hash && notesList.find((n) => n.id === hash)) {
    loadNote(hash);
  } else if (notesList.length > 0) {
    loadNote(notesList[0].id);
  }
});

// Автоматическое получение списка файлов из репозитория
async function loadNotesList() {
  try {
    // Получаем список файлов из папки notes через GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${NOTES_DIR}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch file list");
    }

    const files = await response.json();

    // Фильтруем только .md файлы и создаем список заметок
    notesList = files
      .filter((file) => file.name.endsWith(".md") && file.name !== "README.md")
      .map((file) => {
        // Генерируем ID из имени файла (убираем расширение и заменяем пробелы)
        let id = file.name
          .replace(".md", "")
          .toLowerCase()
          .replace(/[^а-яa-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        // Название заметки (убираем расширение)
        const title = file.name.replace(".md", "");

        return {
          id: id,
          title: title,
          file: file.name,
        };
      });

    // Сортируем по названию
    notesList.sort((a, b) => a.title.localeCompare(b.title));

    console.log(`Found ${notesList.length} notes:`, notesList);

    renderNavigation();
    await buildSearchIndex();
  } catch (error) {
    console.error("Error loading notes list:", error);
    notesList = [];
    renderNavigation();

    // Показываем сообщение об ошибке
    document.getElementById("markdownContent").innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p>❌ Не удалось загрузить список заметок</p>
                <p style="font-size: 14px; color: #57606a;">Убедитесь, что репозиторий публичный и папка notes существует</p>
                <p style="font-size: 12px; margin-top: 20px;">Ошибка: ${error.message}</p>
            </div>
        `;
  }
}

// Построение навигации
function renderNavigation() {
  const navList = document.getElementById("navList");
  if (notesList.length === 0) {
    navList.innerHTML =
      '<li class="nav-item"><div class="nav-item-title">Загрузка заметок...</div></li>';
    return;
  }

  navList.innerHTML = notesList
    .map(
      (note) => `
        <li class="nav-item" data-id="${note.id}">
            <div class="nav-item-title">${escapeHtml(note.title)}</div>
        </li>
    `,
    )
    .join("");

  // Добавляем обработчики кликов
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;
      loadNote(id);
      if (window.innerWidth <= 768) {
        document.querySelector(".sidebar").classList.remove("open");
      }
    });
  });
}

// Загрузка заметки
async function loadNote(id) {
  currentNote = notesList.find((n) => n.id === id);
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

  // Кодируем имя файла для URL (поддержка русских символов и пробелов)
  const encodedFileName = encodeURIComponent(currentNote.file);
  const fileUrl = `${NOTES_DIR}${encodedFileName}`;

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const markdown = await response.text();

    // Настройка marked
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const html = marked.parse(markdown);
    document.getElementById("markdownContent").innerHTML = html;

    // Подсветка кода
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });

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
        img.src = `${NOTES_DIR}${encodedSrc}`;
      }
    });

    // Обработка ссылок на другие md файлы
    document.querySelectorAll("#markdownContent a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.endsWith(".md")) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          // Ищем заметку по имени файла
          const targetNote = notesList.find((n) => n.file === href);
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
    document.getElementById("markdownContent").innerHTML = `
            <div style="text-align: center; padding: 40px; background: #fff3f3; border-radius: 8px; border: 1px solid #ffccc7;">
                <p style="color: #cf222e;">❌ Ошибка загрузки заметки</p>
                <p style="color: #57606a; font-size: 14px;">Файл: ${escapeHtml(currentNote.file)}</p>
                <p style="color: #57606a; font-size: 12px;">${error.message}</p>
            </div>
        `;
  }
}

// Построение поискового индекса
async function buildSearchIndex() {
  searchIndex = [];
  for (const note of notesList) {
    try {
      const encodedFileName = encodeURIComponent(note.file);
      const response = await fetch(`${NOTES_DIR}${encodedFileName}`);
      if (response.ok) {
        const content = await response.text();
        const plainText = content.replace(/[#*`_\[\]()]/g, "").slice(0, 300);
        searchIndex.push({
          id: note.id,
          title: note.title,
          content: content,
          excerpt: plainText.trim(),
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
    score += Math.min(occurrences, 10);

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
    });
  });
}

// Настройка обработчиков событий
function setupEventListeners() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");

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
    }
  });

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  document.querySelector(".content").addEventListener("click", () => {
    if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
    }
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
