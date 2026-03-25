## SQL: Краткий Cheatsheet

**SQL (Structured Query Language)** — язык для общения с реляционными базами данных (таблицы с колонками и строками).

### Основные команды (CRUD)

| Действие | Команда | Пример |
| :--- | :--- | :--- |
| **C**reate (создание) | `INSERT` | `INSERT INTO users (name, age) VALUES ('Анна', 25);` |
| **R**ead (чтение) | `SELECT` | `SELECT name, age FROM users WHERE age > 18;` |
| **U**pdate (обновление) | `UPDATE` | `UPDATE users SET age = 26 WHERE name = 'Анна';` |
| **D**elete (удаление) | `DELETE` | `DELETE FROM users WHERE name = 'Анна';` |

### Самые частые запросы

**Выборка данных (`SELECT`)**
```sql
SELECT * FROM users; -- всё из таблицы
SELECT name, age FROM users; -- только нужные колонки
SELECT DISTINCT city FROM users; -- уникальные значения
```

**Фильтрация (`WHERE`)**
```sql
SELECT * FROM users WHERE age >= 18 AND city = 'Москва';
SELECT * FROM users WHERE name LIKE 'А%'; -- имена на "А"
SELECT * FROM users WHERE id IN (1, 2, 3); -- список значений
```

**Сортировка и лимит**
```sql
SELECT * FROM users ORDER BY age DESC; -- по убыванию
SELECT * FROM users ORDER BY name ASC; -- по возрастанию (по умолч.)
SELECT * FROM users LIMIT 10; -- первые 10 записей
```

**Агрегация (подсчеты)**
```sql
SELECT COUNT(*) FROM users; -- количество строк
SELECT AVG(age) FROM users; -- средний возраст
SELECT city, COUNT(*) FROM users GROUP BY city; -- группировка по городам
```

**Объединение таблиц (`JOIN`)**
```sql
SELECT users.name, orders.total
FROM users
JOIN orders ON users.id = orders.user_id; -- связываем по ID
```

### Типы данных (частые)
- `INT` / `INTEGER` — целое число
- `VARCHAR(255)` — строка (переменной длины)
- `TEXT` — длинный текст
- `DATE` / `DATETIME` — дата и время
- `BOOLEAN` — истина/ложь
- `DECIMAL` — число с плавающей точкой (деньги)

### Создание таблицы
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT, -- уникальный ID
    name VARCHAR(100) NOT NULL,        -- обязательное поле
    age INT DEFAULT 0,                 -- значение по умолчанию
    email VARCHAR(255) UNIQUE           -- уникальное значение
);
```
