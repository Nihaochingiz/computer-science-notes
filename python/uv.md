**uv** — это новая, очень быстрая и современная замена классическим `pip` и `venv`. Она написана на Rust и проще в использовании .

# Быстрый старт
```bash
# Установить uv
curl -LsSf https://astral.sh/uv/install.sh | sh
# создать виртуальное окружение
uv venv
# активировать виртуальное окружение
source .venv/bin/activate
# установить пакет, фреймворк
uv pip install <имя_пакета>
# сохранение зависимостей в файл
uv pip freeze > requirements.txt
# установить из файла requirements.txt
uv pip install -r requirements.txt


### Шаг 1: Установка uv

Способ установки зависит от вашей операционной системы.

**macOS / Linux**
Откройте терминал и выполните команду:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```


**Windows**
Откройте **PowerShell** (рекомендуется от имени администратора) и выполните команду:
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```


**Альтернативный способ (через pip)**
Если у вас уже установлен Python, вы можете установить `uv` через `pip` :
```bash
pip install uv
```

**Проверка установки**
После установки закройте и снова откройте терминал (PowerShell), чтобы изменения вступили в силу. Проверьте, всё ли работает:
```bash
uv --version
```
Вы должны увидеть номер версии, например, `uv 0.5.0` .

---

### Шаг 2: Создание виртуального окружения

1.  **Перейдите в папку вашего проекта**:
    ```bash
    cd /путь/к/папке/моего_проекта
    ```

2.  **Создайте окружение**:
    Выполните команду `uv venv`. По умолчанию uv создаст папку с окружением в `.venv` в корне вашего проекта.
    ```bash
    uv venv
    ```
    Это создаст чистое виртуальное окружение с Python, который установлен в системе по умолчанию .

3.  **Указание версии Python** (опционально):
    Если проекту нужна конкретная версия Python, укажите её флагом `--python`. Если этой версии нет на компьютере, `uv` скачает её автоматически .
    ```bash
    # Для Python 3.12
    uv venv --python 3.12

    # Для Python 3.13
    uv venv --python 3.13
    ```
    

---

### Шаг 3: Активация окружения

После создания окружения его необходимо активировать. Обратите внимание, что команды для Windows и macOS/Linux различаются.

**macOS / Linux**
```bash
source .venv/bin/activate
```
После активации в начале строки терминала появится `(.venv)` .

**Windows (PowerShell)**
Для начала разрешите выполнение скриптов (если вы не делали этого раньше):
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Теперь активируйте окружение:
```powershell
.venv\Scripts\activate
```


**Windows (CMD)**
```cmd
.venv\Scripts\activate.bat
```

---

### Шаг 4: Установка зависимостей

Теперь, когда окружение активно и вы находитесь внутри него, можно устанавливать пакеты.

**Установка конкретного пакета**:
```bash
uv pip install requests
```


**Установка пакетов из файла `requirements.txt`**:
```bash
uv pip install -r requirements.txt
```


---

### Основные команды для работы (шпаргалка)

| Действие | Команда |
| :--- | :--- |
| **Установка uv** (Windows) | `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"` |
| **Установка uv** (macOS/Linux) | `curl -LsSf https://astral.sh/uv/install.sh | sh` |
| **Создание окружения** | `uv venv` |
| **Создание окружения (Python 3.12)** | `uv venv --python 3.12` |
| **Активация (macOS/Linux)** | `source .venv/bin/activate` |
| **Активация (Windows)** | `.venv\Scripts\activate` |
| **Установка пакета** | `uv pip install <имя_пакета>` |
| **Установка из requirements.txt** | `uv pip install -r requirements.txt` |
| **Деактивация окружения** | `deactivate` |
| **Сохранение зависимостей в файл** | `uv pip freeze > requirements.txt`  |

Выйти из окружения можно командой `deactivate` в любой ОС .
